
fetch("https://library-api-7br2.onrender.com/books")
  .then(res => res.json())
  .then(data => console.log(data));

app.get("/", (req, res) => {
    res.send("Library API running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
