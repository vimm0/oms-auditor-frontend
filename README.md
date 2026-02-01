# OMS Auditor Frontend

React + TypeScript + Vite frontend for OMS Auditor. Can run in the browser or as a **Tauri desktop app**.

## Prerequisites

- Node.js 18+
- For **desktop app**: [Rust](https://rustup.rs/) and [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for your OS

## Backend

Start the OMS Auditor backend (e.g. `uvicorn` on `http://127.0.0.1:8000`) so the frontend can reach the API. Set `VITE_API_URL` if your API runs elsewhere.

## Web (browser)

```bash
# Install dependencies
npm install
# or: yarn

# Dev server (http://localhost:1420)
npm run dev

# Production build
npm run build
npm run preview
```

## Desktop app (Tauri)

Runs the same UI in a native window. The app uses the system computer name for login when running as desktop.

```bash
# Install dependencies (same as above)
npm install

# Run desktop app in development (starts Vite + Tauri window)
npm run tauri:dev

# Build installers / binaries (output in src-tauri/target/release/)
npm run tauri:build
```

After `tauri:build`, installers are under `src-tauri/target/release/bundle/` (e.g. `.dmg` on macOS, `.msi` / `.exe` on Windows, `.deb` on Linux).

## Recommended IDE

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer) for desktop development
