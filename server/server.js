import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());

// Serve the root of the repo (.. from /server) so index.html and assets work
app.use(express.static(path.join(__dirname, "..")));

// Example dynamic endpoint
app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from the server" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});