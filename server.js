
const cors = require("cors");
const express = require("express");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Library API is running ✅");
});

app.get("/books", (req, res) => {
  res.json([
    { id: 1, url: "Book One"},
    { id: 2, url: "Book Two"}
  ]);
});

app.post("/books", (req, res) => {
  const book = req.body;

  res.json({
    message: "Book added",
    data: book
  });
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Listening on", PORT));