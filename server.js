
const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Library API is running ✅");
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Listening on", PORT));