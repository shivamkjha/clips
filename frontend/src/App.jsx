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
    <div className="flex flex-wrap">
      <div className="w-full h-96 md:h-screen mt-20 md:mt-8 md:w-1/2 flex items-center justify-center flex-col">
        <div className="w-full">
          <div className="text-blue-700 font-bold font1 text-5xl md:text-6xl text-center mb-2">
            Create Note
          </div>
        </div>
        {/* Text area  */}
        <div className="w-full border-1 border-white-500 flex flex-col items-center justify-center">
          <textarea
            className=" w-80 md:w-4/5 h-36 md:h-52 rounded-2xl shadow-2xl bg-slate-300 p-4 border-blue-600 border-2 m-2"
            value={text}
            placeholder="Write or Paste your note here!"
            onChange={(e) => setText(e.target.value)}
          />
          {/* Button   */}
          <div className="flex flex-col items-center">
            <button
              className="bg-blue-700 text-gray-200 font1 w-36 p-2 font-bold text-xl rounded-3xl shadow-2xl m-4 hover:text-black transition duration-300"
              onClick={saveNote}
            >
              Save Note
            </button>
            <button
              className="bg-red-700 text-gray-300 font1 w-56 p-2 font-extrabold text-xl rounded-3xl shadow-2xl hover:text-black transition duration-300"
              onClick={pasteFromClipboardAndSave}
            >
              Paste from Clipboard
            </button>
          </div>
        </div>
      </div>

      {/* Stored Clips  */}
      <div className="w-full md:w-1/2">
        <div className="text-center text-red-700 font-bold text-5xl md:text-6xl font1 mt-16">
          Saved Notes
        </div>

        {notes.map((note) => (
          <div
            key={note._id}
            className="border border-blue-700 m-2 p-2 rounded-3xl text-white text-lg"
          >
            <div className="w-full flex justify-center p-2">
              <button
                className="bg-red-700 w-20 font1 p-1 mr-4 font-bold text-lg rounded-3xl shadow-2xl hover:text-black transition duration-300"
                onClick={() => deleteNote(note._id)}
              >
                Delete
              </button>

              <button
                className="bg-blue-700 w-20 font1 p-1  font-bold text-lg rounded-3xl shadow-2xl hover:text-black transition duration-300"
                onClick={() => copyToClipboard(note.text)}
              >
                Copy
              </button>
            </div>
            <div className="text-wrap break-words">
              <p>{note.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
