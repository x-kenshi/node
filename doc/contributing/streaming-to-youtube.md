# Streaming meetings to YouTube

This guide covers how to live stream meetings to YouTube using Zoom, manage access, and perform related tasks.

## Access requirements

### Credentials

- **Zoom Access**: Obtain the Foundation’s Zoom credentials via 1Password.
- **YouTube Access**: Your YouTube account must be a manager of the [Node.js YouTube account](https://www.youtube.com/channel/UCQPYJluYC_sn_Qz_XE-YbTQ).

To request access, open an issue in the Node.js [admin repository](https://github.com/nodejs/admin) titled `Zoom and YouTube access for [GitHub ID]` and include the YouTube ID of the person needing access and a brief reason for the request. Approval is assumed after 48 hours unless objections are raised.

## Managing access

### YouTube

To add or verify managers:

1. Visit [YouTube](https://youtube.com).
2. Click the Node.js icon in the top right.
3. Go to **Settings** > **Add or remove managers** > **Manage permissions**.
4. Use the `+people` icon to add new managers. Current managers are listed here.

### Zoom

To share the Zoom credentials:

1. Log into 1Password.
2. Select the settings gear for the `zoom-creds` vault.
3. Use `Share Vault` to share it with the new user.
4. Set permissions to `View Items` and `View and Copy passwords`.

New users should also create a pull request to add themselves to the `zoom-nodejs` group in the [iojs.org/aliases.json](https://github.com/nodejs/email/blob/main/iojs.org/aliases.json) file.

## Live streaming a meeting

### Starting and stopping the stream

1. Log into [Zoom](https://zoom.us) using the Foundation credentials.
2. Go to [Zoom Webinars](https://zoom.us/webinar/list) and find the meeting.
3. Press "Start" to launch the meeting in Zoom.
4. In the "Participants" panel, promote attendees to panelists as needed.
5. Select "... More" in the toolbar and choose "Live on YouTube".
6. Log into [YouTube](https://youtube.com) with the Node.js account and accept the Zoom usage agreement (if prompted).
7. Edit the webinar title on the streaming page to include the meeting date, then click the red "Go Live!" button.

> **Troubleshooting**: If "Go Live!" errors with a "Please grant necessary privilege for live streaming" message, copying the link to a different browser might resolve the issue.

Every participant can choose to join with or without video. YouTube will automatically record the live stream and save it on the [Node.js YouTube channel](https://www.youtube.com/channel/UCQPYJluYC_sn_Qz_XE-YbTQ/videos).

The stream title is usually set to `YYYY-MM-DD - Meeting Name`, e.g., `2022-11-02 - Technical Steering Committee Meeting`. Include a link to the meeting issue in the description. Titles and descriptions can be edited later on YouTube if necessary.

![YouTube Stream Title Example](./doc_img/youtube-stream-title-description.png)

### Sharing the live meeting

Once live, share the meeting link `http://www.youtube.com/c/nodejs-foundation/live`. For example, send a tweet like:

```text
🚀 The @nodejs Technical Steering Committee meeting is happening live! Tune in now: https://www.youtube.com/c/nodejs-foundation/live
```

Adjust the "Technical Steering Committee" part as needed. Remove `@nodejs` if tweeting from the official account.

![YouTube Share Input Box](./doc_img/youtube-stream-share.png)

## Monitoring the stream

### Stream status

During streaming, the status should be online and typically green. Yellow warnings in the "stream health" section about low video bitrate can usually be ignored if streaming with static images.

![YouTube Stream Status](./doc_img/youtube-stream-status.png)

### Viewer analytics

Monitor the number of viewers and other analytics.

![YouTube Analytics Graph](./doc_img/youtube-stream-analytics.png)

## Chat moderation and questions

Follow the [Moderation Policy](https://github.com/nodejs/admin/blob/main/Moderation-Policy.md) for chat moderation. Right-click messages to remove or take necessary actions. If you chat as Node.js, append your initials to messages for clarity.
