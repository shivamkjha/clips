const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const mongoURI = process.env.MONGODB_URI;


const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
    mongoURI
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
