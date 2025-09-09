const notesList = document.getElementById("notesList");
const addNoteBtn = document.getElementById("addNote");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");

const API_URL = "http://localhost:8000/notes";


function fetchNotes() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      notesList.innerHTML = "";
      data.forEach(note => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${note.id}: <strong>${note.title}</strong> - ${note.content}</span>
          <button onclick="deleteNote(${note.id})">Delete</button>
        `;
        notesList.appendChild(li);
      });
    })
    .catch(err => console.error(err));
}


addNoteBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    alert("Both title and content are required!");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content })
  })
    .then(res => res.json())
    .then(() => {
      titleInput.value = "";
      contentInput.value = "";
      fetchNotes();
    })
    .catch(err => console.error(err));
});


function deleteNote(id) {
  fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(() => fetchNotes())
    .catch(err => console.error(err));
}


fetchNotes();
