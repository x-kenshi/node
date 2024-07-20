#!/usr/bin/env python3

import glob
import io
import re
import sys
from itertools import chain

def do_exist(file_name, lines, imported):
    pattern = re.compile(fr'\b{imported}\b')
    if not any(pattern.search(line) and not re.match(fr'using \w+::{imported};', line) for line in lines):
        print(f'File "{file_name}" does not use "{imported}"')
        return False
    return True

def is_valid(file_name):
    with io.open(file_name, encoding='utf-8') as source_file:
        lines = [line.strip() for line in source_file]

    usings = []
    importeds = []
    line_numbers = []

    for idx, line in enumerate(lines, 1):
        match = re.match(r'^using (\w+::(\w+));$', line)
        if match:
            line_numbers.append(idx)
            usings.append(match.group(1))
            importeds.append(match.group(2))

    valid = all(do_exist(file_name, lines, imported) for imported in importeds)

    sorted_usings = sorted(usings, key=str.lower)
    if sorted_usings != usings:
        print(f"Using statements aren't sorted in '{file_name}'.")
        for num, actual, expected in zip(line_numbers, usings, sorted_usings):
            if actual != expected:
                print(f'\tLine {num}: Actual: {actual}, Expected: {expected}')
        return False
    return valid

def main():
    patterns = sys.argv[1:] if len(sys.argv) > 1 else ['src/*.cc']
    files = list(chain.from_iterable(glob.iglob(pattern) for pattern in patterns))

    exit_code = 0 if all(is_valid(file) for file in files) else 1
    sys.exit(exit_code)

if __name__ == '__main__':
    main()
