
const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Library API is running ✅");
});

app.get("/books", (req, res) => {
  res.json([
    { id: 1, title: "Book One", author: "Author A" },
    { id: 2, title: "Book Two", author: "Author B" }
  ]);
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Listening on", PORT));