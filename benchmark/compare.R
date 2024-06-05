#!/usr/bin/env Rscript

# Required libraries
library(ggplot2)
library(plyr)

# Parse command line arguments
args <- commandArgs(trailingOnly = FALSE)
script_path <- dirname(sub("--file=", "", args[grep("--file", args)]))
source(file.path(script_path, '_cli.R'), chdir = TRUE)

# Display help message or save plot as specified
if (!is.null(args.options$help) || (!is.null(args.options$plot) && args.options$plot == TRUE)) {
  stop("Usage: cat file.csv | Rscript compare.R
  --help           Show this message
  --plot filename  Save plot to filename")
}

# Read data from stdin
data <- read.csv(file('stdin'), colClasses = c('character', 'character', 'character', 'numeric', 'numeric'))

# Prepare data for plotting
data$nameTwoLines <- paste0(data$filename, '\n', data$configuration)
data$name <- paste0(data$filename, ' ', data$configuration)

# Create a box plot if plot filename is provided
plot_filename <- args.options$plot
if (!is.null(plot_filename)) {
  plot <- ggplot(data = data) +
    geom_boxplot(aes(x = nameTwoLines, y = rate, fill = binary)) +
    ylab("Rate of Operations (Higher is Better)") +
    xlab("Benchmark") +
    theme(axis.text.x = element_text(angle = 90, hjust = 1, vjust = 0.5))
  ggsave(plot_filename, plot)
}

# Function to compute shared standard error
compute_shared_sd <- function(old_rate, new_rate) {
  old_se_squared <- var(old_rate) / length(old_rate)
  new_se_squared <- var(new_rate) / length(new_rate)
  sqrt(old_se_squared + new_se_squared)
}

# Function to calculate improvement confidence interval
calculate_confidence_interval <- function(shared_se, old_mean, t_test, risk_level) {
  interval <- qt(1 - (risk_level / 2), t_test$parameter) * shared_se
  sprintf("%.2f%%", ((old_mean - interval) / old_mean) * 100)
}

# Calculate statistics table
statistics <- ddply(data, "name", function(sub_data) {
  old_rate <- subset(sub_data, binary == "old")$rate
  new_rate <- subset(sub_data, binary == "new")$rate

  old_mean <- mean(old_rate)
  new_mean <- mean(new_rate)
  improvement <- sprintf("%+.2f%%", ((new_mean - old_mean) / old_mean) * 100)

  result <- list(
    confidence = "NA",
    improvement = improvement,
    "accuracy (*)" = "NA",
    "(**)" = "NA",
    "(***)" = "NA"
  )

  if (length(old_rate) > 1 && length(new_rate) > 1) {
    t_test <- t.test(rate ~ binary, data = sub_data)
    shared_se <- compute_shared_sd(old_rate, new_rate)

    confidence <- ""
    if (t_test$p.value < 0.001) {
      confidence <- "***"
    } else if (t_test$p.value < 0.01) {
      confidence <- "**"
    } else if (t_test$p.value < 0.05) {
      confidence <- "*"
    }

    result <- list(
      confidence = confidence,
      improvement = improvement,
      "accuracy (*)" = calculate_confidence_interval(shared_se, old_mean, t_test, 0.05),
      "(**)" = calculate_confidence_interval(shared_se, old_mean, t_test, 0.01),
      "(***)" = calculate_confidence_interval(shared_se, old_mean, t_test, 0.001)
    )
  }

  data.frame(result, check.names = FALSE)
})

# Set benchmark names as row names
row.names(statistics) <- statistics$name
statistics$name <- NULL

# Print statistics table
options(width = 200)
print(statistics)

# Display false-positive risk message
cat("\n")
cat(sprintf(
  "Be aware that when doing many comparisons the risk of a false-positive
result increases. In this case, there are %d comparisons, you can thus
expect the following amount of false-positive results:
  %.2f false positives, when considering a   5%% risk acceptance (*, **, ***),
  %.2f false positives, when considering a   1%% risk acceptance (**, ***),
  %.2f false positives, when considering a 0.1%% risk acceptance (***)
",
  nrow(statistics),
  nrow(statistics) * 0.05,
  nrow(statistics) * 0.01,
  nrow(statistics) * 0.001))
