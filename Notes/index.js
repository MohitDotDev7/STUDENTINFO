const express = require("express");
const app = express();
const PORT = 8000;
const fs = require("fs");
const path = require("path");


app.use(express.static(path.join(__dirname, "Frontend")));

app.use(express.json());


app.get("/notes", (req, res) => {
  try {
    const data = fs.readFileSync("notes.json", "utf-8");
    const notes = JSON.parse(data);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "No notes are available" });
  }
});


app.post("/notes", (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const data = fs.readFileSync("notes.json", "utf-8");
  const notes = JSON.parse(data);

  const newNote = {
    id: notes.length > 0 ? notes[notes.length - 1].id + 1 : 1,
    title,
    content,
  };

  notes.push(newNote);
  fs.writeFileSync("notes.json", JSON.stringify(notes, null, 2));

  res.status(201).json(newNote);
});


app.get("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const data = fs.readFileSync("notes.json", "utf-8");
  const notes = JSON.parse(data);
  const noteFound = notes.find(note => note.id === id);

  if (!noteFound) return res.status(404).json({ message: "Note not found" });
  res.json(noteFound);
});


app.put("/notes/:id", (req, res) => {
  const noteId = parseInt(req.params.id);
  const { title, content } = req.body;

  const data = fs.readFileSync("notes.json", "utf-8");
  const notes = JSON.parse(data);

  const note = notes.find(n => n.id === noteId);
  if (!note) return res.status(404).json({ message: "Note not found" });

  if (title) note.title = title;
  if (content) note.content = content;

  fs.writeFileSync("notes.json", JSON.stringify(notes, null, 2));
  res.json(note);
});


app.delete("/notes/:id", (req, res) => {
  const noteId = parseInt(req.params.id);

  const data = fs.readFileSync("notes.json", "utf-8");
  let notes = JSON.parse(data);

  const noteExists = notes.some(note => note.id === noteId);
  if (!noteExists) return res.status(404).json({ message: "Note not found" });

  notes = notes.filter(note => note.id !== noteId);
  fs.writeFileSync("notes.json", JSON.stringify(notes, null, 2));

  res.json({ message: "Note deleted successfully" });
});


app.listen(PORT, () => console.log("Server Chalu hua"));