const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://shivamkjha:YUDs5lrcyV4iLFjk@cluster0.z5hsflh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Note = mongoose.model("Note", noteSchema);

app.post("/api/notes", async (req, res) => {
  const text = req.body.text;
  const newNote = new Note({ text: text });
  await newNote.save();
  res.json(newNote);
});

app.get("/api/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
