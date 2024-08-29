const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

document.addEventListener("DOMContentLoaded", getLocalTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("change", filterTodo);

// Add event listener for Enter key press
todoInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        e.preventDefault(); // Prevent the default action of Enter key (e.g., form submission)
        addTodo(); // Call the addTodo function to add a new todo
    }
});

function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText === "") return;

    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");

    const todoSpan = document.createElement("span");
    todoSpan.innerText = todoText;

    const tickButton = document.createElement("button");
    tickButton.innerText = "✔️";
    tickButton.classList.add("tick-btn");

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "X";
    deleteButton.classList.add("delete-btn");

    const editButton = document.createElement("button");
    editButton.innerText = "✏️";  // Pencil emoji for the edit button
    editButton.classList.add("edit-btn");

    todoItem.appendChild(todoSpan);
    todoItem.appendChild(tickButton);
    todoItem.appendChild(editButton);
    todoItem.appendChild(deleteButton);

    todoList.appendChild(todoItem);
    todoInput.value = "";

    saveLocalTodos(todoText);
}

function deleteCheck(e) {
    if (e.target.classList.contains("delete-btn")) {
        const todo = e.target.parentElement;
        todo.remove();
        removeLocalTodos(todo);
    } else if (e.target.classList.contains("tick-btn")) {
        const todo = e.target.parentElement;
        todo.children[0].classList.toggle("completed");
        updateLocalTodos(); // Update local storage after toggling
    } else if (e.target.classList.contains("edit-btn")) {
        const todoSpan = e.target.parentElement.querySelector("span");
        const originalText = todoSpan.innerText;

        // Create an input field and set its value to the current todo text
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.value = originalText;
        inputField.classList.add("edit-input");

        // Replace the span with the input field
        todoSpan.replaceWith(inputField);
        inputField.focus();

        // Handle input field blur event to save changes
        inputField.addEventListener("blur", () => {
            const newText = inputField.value.trim();
            if (newText !== "") {
                todoSpan.innerText = newText;
                todoSpan.classList.remove("edit-input");
                inputField.replaceWith(todoSpan);
                updateLocalTodos(); // Update local storage after editing
            } else {
                // If no text, replace input with original span
                inputField.replaceWith(todoSpan);
            }
        });

        // Handle Enter key to save changes
        inputField.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                inputField.blur();
            }
        });
    }
}

function filterTodo() {
    const todos = todoList.childNodes;
    todos.forEach(todo => {
        if (todo.nodeType === Node.ELEMENT_NODE) {
            switch (filterOption.value) {
                case "completed":
                    if (todo.children[0].classList.contains("completed")) {
                        todo.style.display = "flex";
                    } else {
                        todo.style.display = "none";
                    }
                    break;
                case "incomplete":
                    if (todo.children[0].classList.contains("completed")) {
                        todo.style.display = "none";
                    } else {
                        todo.style.display = "flex";
                    }
                    break;
                default:
                    todo.style.display = "flex";
                    break;
            }
        }
    });
}

function saveLocalTodos(todo) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push({ text: todo, completed: false });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodos() {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach(todo => {
        const todoItem = document.createElement("li");
        todoItem.classList.add("todo-item");

        const todoSpan = document.createElement("span");
        todoSpan.innerText = todo.text;
        if (todo.completed) {
            todoSpan.classList.add("completed");
        }

        const tickButton = document.createElement("button");
        tickButton.innerText = "✔️";
        tickButton.classList.add("tick-btn");

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "X";
        deleteButton.classList.add("delete-btn");

        const editButton = document.createElement("button");
        editButton.innerText = "✏️";  // Pencil emoji for the edit button
        editButton.classList.add("edit-btn");

        todoItem.appendChild(todoSpan);
        todoItem.appendChild(tickButton);
        todoItem.appendChild(editButton);
        todoItem.appendChild(deleteButton);

        todoList.appendChild(todoItem);
    });
}

function removeLocalTodos(todo) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    const todoText = todo.children[0].innerText;
    todos = todos.filter(t => t.text !== todoText);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function updateLocalTodos() {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    todos.forEach(todo => {
        const todoItem = [...todoList.children].find(item => item.children[0].innerText === todo.text);
        if (todoItem) {
            todo.completed = todoItem.children[0].classList.contains("completed");
        }
    });

    localStorage.setItem("todos", JSON.stringify(todos));
}
