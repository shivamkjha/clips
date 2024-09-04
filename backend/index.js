const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const mongoURI = process.env.MONGODB_URI;

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(mongoURI);

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Note model
const Note = mongoose.model("Note", noteSchema);

// Save notes
app.post("/api/notes", async (req, res) => {
  const text = req.body.text;
  const newNote = new Note({ text: text });
  await newNote.save();
  res.json(newNote);
});

// Get Notes
app.get("/api/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// Delete Note by id
app.delete("/api/deleteNote/:id", async (req, res) => {
  try {
    // Extract the ID from the request parameters
    const id = req.params.id;
    console.log(id);

    // Find and delete the document by ID
    const deletedDocument = await Note.findByIdAndDelete(id);

    if (!deletedDocument) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully", deletedNoteId: id }); // Include deleted ID for confirmation
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
