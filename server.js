import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors({ origin: "*" }));

const PORT = process.env.PORT || 3000;
const upload = multer({ dest: "uploads/" });

app.get("/health", (req, res) => res.send("ok"));

app.post("/api/books", upload.single("pdf"), (req, res) => {
  res.json({ id: req.file.filename, originalName: req.file.originalname });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/api/books/:id/file", (req, res) => {
  res.sendFile(req.params.id, { root: path.join(__dirname, "uploads") });
});

app.listen(PORT, () => console.log("Listening on", PORT));
