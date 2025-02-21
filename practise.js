let btnEl = document.getElementById("btn");
let appEl = document.getElementById("app");
let darkModeToggle = document.getElementById("darkModeToggle");
let searchInput = document.getElementById("search");
let registerSection = document.getElementById("registerSection");
let loginSection = document.getElementById("loginSection");
let noteAppSection = document.getElementById("noteAppSection");
let registerBtn = document.getElementById("registerBtn");
let loginBtn = document.getElementById("loginBtn");
let registerError = document.getElementById("registerError");
let registerSuccess = document.getElementById("registerSuccess");
let loginError = document.getElementById("loginError");
let showRegister = document.getElementById("showRegister");
let showLogin = document.getElementById("showLogin");



const passwordInput = document.getElementById("password");
const eyeIcon = document.getElementById("eyeIcon");

eyeIcon.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    
    // Optionally change the icon
    eyeIcon.src = type === "password" ? "images/eye close.png" : "images/eye open.png"; // Change to an 'eye-off' icon
});



// Show Register Form
showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginSection.style.display = "none";  // Hide login form
    registerSection.style.display = "flex";  // Show registration form
});

// Show Login Form
showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerSection.style.display = "none";  // Hide registration form
    loginSection.style.display = "flex";  // Show login form
});

// Handle Registration
registerBtn.addEventListener("click", () => {
    let username = document.getElementById("registerUsername").value;
    let password = document.getElementById("registerPassword").value;
    registerError.textContent = "";
    registerSuccess.textContent = "";
    if (username && password) {
        if (localStorage.getItem(username)) {
            registerError.textContent = "Username already exists!";
            registerSuccess.textContent = "";
        } else {
            localStorage.setItem(username, JSON.stringify({ password }));
            registerSuccess.textContent = "Registration successful! Please login.";
            registerError.textContent = "";
            
        }
    } else {
        registerError.textContent = "Please fill out both fields!";
        registerSuccess.textContent = "";
    }
});

// Handle Login
loginBtn.addEventListener("click", () => {
    let enteredUsername = document.getElementById("username").value;
    let enteredPassword = document.getElementById("password").value;
    loginError.textContent = "";
    let storedUser = localStorage.getItem(enteredUsername);
    if (storedUser) {
        let userData = JSON.parse(storedUser);
        if (enteredPassword === userData.password) {
            loginSection.style.display = "none";  // Hide login form
            noteAppSection.style.display = "block";  // Show notes app
            initializeNotes();  // Initialize notes after login
        } else {
            loginError.textContent = "Incorrect password!";
        }
    } else {
        loginError.textContent = "User does not exist. Please register.";
    }   
});

// Initialize notes after login
function initializeNotes() {
    getNotes().forEach((note) => {
        let noteEl = createNoteEl(note.id, note.content, note.timestamp);
        appEl.insertBefore(noteEl, btnEl);
    });

    btnEl.addEventListener("click", addNote);

    // Dark mode toggle
    darkModeToggle.addEventListener("change", (e) => {
        document.body.classList.toggle("dark-mode", e.target.checked);
    });

    // Search functionality
    searchInput.addEventListener("input", (e) => {
        let query = e.target.value.toLowerCase();
        let notes = document.querySelectorAll(".note");
        notes.forEach(note => {
            let content = note.value.toLowerCase();
            note.parentElement.style.display = content.includes(query) ? "block" : "none";
        });
    });
}

// Rest of the Note app functions (unchanged)
function createNoteEl(id, content, timestamp = new Date().toLocaleString()) {
    let element = document.createElement("div");
    element.classList.add("note-container");
    
    let textarea = document.createElement("textarea");
    textarea.classList.add("note");
    textarea.placeholder = "Empty Notes";
    textarea.value = content;

    let time = document.createElement("div");
    time.classList.add("timestamp");
    time.textContent = "Last edited: " + timestamp;

    textarea.addEventListener("dblclick", () => {
        let warning = confirm("Do you want to delete this note?");
        if (warning) {
            deleteNote(id, element);
        }
    });

    textarea.addEventListener("input", () => {
        let updatedTimestamp = new Date().toLocaleString();
        updateNote(id, textarea.value, updatedTimestamp);
        time.textContent = "Last edited: " + updatedTimestamp;
    });

    element.appendChild(textarea);
    element.appendChild(time);

    return element;
}

function updateNote(id, content, timestamp) {
    let notes = getNotes();
    let target = notes.filter((note) => note.id == id)[0];
    target.content = content;
    target.timestamp = timestamp;
    saveNotes(notes);
}

function deleteNote(id, element) {
    let notes = getNotes().filter((note) => note.id != id);
    saveNotes(notes);
    appEl.removeChild(element);
}

function addNote() {
    let notes = getNotes();
    let noteObj = {
        id: Math.floor(Math.random() * 100000),
        content: "",
        timestamp: new Date().toLocaleString(),
    };
    let noteEl = createNoteEl(noteObj.id, noteObj.content, noteObj.timestamp);
    appEl.insertBefore(noteEl, btnEl);
    notes.push(noteObj);
    saveNotes(notes);
}

function saveNotes(notes) {
    localStorage.setItem("note-app", JSON.stringify(notes));
}

function getNotes() {
    return JSON.parse(localStorage.getItem("note-app") || "[]");
}
