# AI Online Exam Proctoring Extension

AI Online Exam Proctoring Extension is a comprehensive platform designed to facilitate secure and intelligent online examinations. The system combines a modern web dashboard, a browser extension, and advanced AI/ML microservices to monitor candidates in real time, detect suspicious behaviors, and provide actionable insights to administrators. 


This project is ideal for educational institutions, certification providers, or any organization seeking to conduct online assessments with enhanced security and intelligence.

---

## Features

- **Admin registration and login**
- **Candidate dashboard with real-time monitoring**
- **Socket.io integration for live updates**
---

## Project Structure

```
.
├── client/                    # React + Vite frontend
├── server/                    # Node.js/Express backend
├── browser-extension/         # Chrome Extension
```

---

## Getting Started

### Access the Admin Dashboard

- Visit the dashboard at: [https://ai-online-exam-proctoring-extension.onrender.com/admin](https://ai-online-exam-proctoring-extension.onrender.com/admin)

### Add the Browser Extension

To add the browser extension to Chrome (or any Chromium-based browser):

1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top right corner).
3. Click **Load unpacked**.
4. Select the `browser-extension/` folder from this project.
5. The extension should now appear in your extensions list and be ready for use.

> **Note:** If you make changes to the extension code, you may need to click the "Reload" button on the extension card in `chrome://extensions/`.

### Testing the Extension

- For testing purposes, use the extension on: [https://www.example.com/*](https://www.example.com/*)


