import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Fetch notes when the component loads
    axios
      .get("https://clips-1.onrender.com/api/notes")
      .then((response) => {
        const sortedNotes = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotes(sortedNotes);
      })
      .catch((error) => console.error(error));
  }, []);

  const saveNote = () => {
    axios
      .post("https://clips-1.onrender.com/api/notes", { text: text })
      .then((response) => {
        // Add new note to the beginning of the array
        const updatedNotes = [response.data, ...notes];
        setNotes(updatedNotes);
      })
      .catch((error) => console.error(error));
    setText(""); // Reset after the note is saved
  };

  const deleteNote = (note_id) => {
      axios
        .delete(`https://clips-1.onrender.com/api/deleteNote/${note_id}`) // String concatenation
        .then((response) => {
          console.log("Resource deleted successfully", response.data);
          setNotes(notes.filter((note) => note._id !== note_id));
        })
        .catch((error) => console.error(error));
    };

  const pasteFromClipboardAndSave = async () => {
    try {
      // Fetch clipboard text
      const clipboardText = await navigator.clipboard.readText();
      // Call saveNote immediately after setting text
      await axios
        .post("https://clips-1.onrender.com/api/notes", { text: clipboardText })
        .then((response) => {
          // Add new note to the beginning of the array
          const updatedNotes = [response.data, ...notes];
          setNotes(updatedNotes);
        })
        .catch((error) => console.error("Error saving note:", error));
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  const copyToClipboard = (noteText) => {
    navigator.clipboard.writeText(noteText);
  };

  return (
    <div className="flex flex-wrap bg-neutral-800">
      <div className="w-full h-screen md:w-1/2 flex items-center justify-center flex-col">
        <div className="w-full">
          <div className="text-blue-700 font-bold font1 text-6xl text-center">
            Create Note
          </div>
        </div>
        {/* Text area  */}
        <div className="w-full h-96 border-1 border-white-500 flex flex-col items-center justify-center">
          <textarea
            className="w-3/4 h-1/2 rounded-2xl shadow-2xl bg-slate-300 p-4 border-blue-600 border-2 m-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {/* Button   */}
          <div className="flex flex-col items-center">
            <button
              className="bg-green-600 font1 w-36 border p-2 font-bold text-xl rounded-2xl shadow-2xl m-4"
              onClick={saveNote}
            >
              Save Note
            </button>
            <button
              className="bg-red-700 font1 border w-60 p-2 font-bold text-xl rounded-2xl shadow-2xl"
              onClick={pasteFromClipboardAndSave}
            >
              Paste from Clipboard
            </button>
          </div>
        </div>
      </div>

      {/* Stored Clips  */}
      <div className="w-full md:w-1/2">
        <div className="text-center text-red-700 font-bold text-6xl font1 mt-16">
          Notes
        </div>

        {notes.map((note) => (
          <div
            key={note._id}
            className="flex justify-between border m-2 p-1 rounded-lg text-white text-xl"
          >
            <p>{note.text}</p>
            <div>
              <button
                className="bg-gray-500 font1 border w-16 p-1 mr-2 font-bold text-lg rounded-2xl shadow-2xl"
                onClick={() => copyToClipboard(note.text)}
              >
                Copy
              </button>
              <button
                className="bg-red-700 font1 border w-20 p-1 font-bold text-lg rounded-2xl shadow-2xl"
                onClick={() => deleteNote(note._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
