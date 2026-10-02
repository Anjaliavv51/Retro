# Retro Web Server

Lightweight Express static web server that serves the Retro website and dynamic API endpoints.

---

### Prerequisites
- Node.js (v16+)
- Dependencies are already pre-installed in `server/node_modules`.

---

### How to Run

#### From the `server/` folder:
```bash
cd server
npm start
```

#### From the project root:
```bash
npm start
```
*(Root `package.json` is configured to run `node server/server.js`)*

The server will be running at: **http://localhost:3000**

---

### Endpoints
- `GET /`: Serves `index.html` and all static assets (`html/`, `css/`, `js/`, `image/`)
- `GET /api/message`: Returns JSON `{ message: "Hello from the server" }`
