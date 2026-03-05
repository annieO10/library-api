
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

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Listening on", PORT));