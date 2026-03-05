
const cors = require("cors");
const express = require("express");
const { PutObjectCommand, GetObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Library API is running ✅");
});

let books = [
  {  url: "Book One", id:1}
];


app.get("/books", (req, res) => {
  res.json(books);
});



app.post("/books", (req, res) => {
  const newBook = req.body;

  newBook.id = books.length + 1;

  books.push(newBook);

  res.json({
    message: "Book added",
    book: newBook
  });
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const multer = require("multer");
const r2 = require("./r2Client");

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded (expected field name: pdf)" });
    }

    const file = req.file;

    const key = `${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype || "application/pdf",
    });

    await r2.send(command);

    res.json({ message: "PDF uploaded", key, originalName: file.originalname });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed", details: String(err) });
  }
  

});

app.get("/files", async (req, res) => {
  try {
    const result = await r2.send(
      new ListObjectsV2Command({ Bucket: process.env.R2_BUCKET_NAME })
    );

    const files = (result.Contents || []).map((obj) => {
      const key = obj.Key;

      return {
        key,
        // URL points to YOUR backend (avoids R2 CORS)
        url: `${req.protocol}://${req.get("host")}/file/${encodeURIComponent(key)}`
      };
    });

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

app.get("/file/*", async (req, res) => {
  try {
    // Everything after /file/ (supports keys with slashes too)
    const key = decodeURIComponent(req.params[0]);

    const obj = await r2.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
      })
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${key}"`);

    // Stream R2 -> browser
    obj.Body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(404).send("File not found");
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Listening on", PORT));