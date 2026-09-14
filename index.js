let arrTodos = [];

const formTodo = document.querySelector("#form-todo");
const inputTodo = document.querySelector("#input-todo");
const todoList = document.querySelector("#todo-list");
const btnForm = document.querySelector("#btn-form");
const cancelP = document.querySelector("#cancel-edit");
const taskNo = document.querySelector("#tasks-number");
const completedTask = document.querySelector("#completed-tasks");

let editTodoId = null;

formTodo.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputValue = inputTodo.value;

    if (inputValue === "") {
        return
    }

    if (editTodoId) {
        arrTodos = arrTodos.map((todo) => {
            if (todo.id === Number(editTodoId)) {
                return {
                    ...todo,
                    content: inputValue
                }
            }
            return todo;
        })
    }
    else {
        let newTodos = {
            id: Date.now(),
            content: inputValue,
            isCompleted: false
        }
        arrTodos.push(newTodos)

    }
    cancelEdit();
    renderTodo();
})

function renderTodo() {
    todoList.innerHTML = "";
    arrTodos.forEach((todo) => {
        const li = document.createElement("li");
        li.dataset.id = todo.id;
        li.className = "flex justify-between py-3 px-5 border border-gray-300 rounded-xl"
        li.innerHTML = `<div class="flex gap-2">
                        <input class="accent-black" data-action="toggle" ${todo.isCompleted ? "checked" : ""} type="checkbox">
                        <p class="${todo.isCompleted ? "text-gray-400 line-through decoration-2" : ""} py-1.5 text-sm font-semibold">${todo.content}</p>
                    </div>
                    <div class="flex text-sm gap-5">
                        <button class="py-1.5 px-3 bg-yellow-500 rounded-lg font-semibold hover:bg-black hover:text-yellow-500 
                        transition-all ease-linear duration-200 cursor-pointer" data-action="edit" data-id="${todo.id}">Edit</button>
                        <button class="py-1.5 px-3 bg-red-700 text-white rounded-lg hover:bg-gray-300
                        hover:text-red-700 transition-all ease-linear duration-200 font-semibold cursor-pointer" data-action="dlt" data-id="${todo.id}">Delete</button>
                    </div>`
        todoList.append(li);
        inputTodo.value = "";
    })
    taskNo.textContent = `Tasks (${arrTodos.length})`;
    completedTask.textContent = `Completed (${arrTodos.filter((todo) => todo.isCompleted).length})`
}
renderTodo();

todoList.addEventListener("click", (e) => {
    e.stopPropagation();
    let li = e.target.closest("li");
    let btn = e.target.closest("button");
    let id = li?.dataset.id;
    let action = e.target.dataset.action;

    if (action === "edit") {
        editStart(id)
    }
    if (action === "dlt") {
        dltTodo(e, id)
    }
    if (action === "toggle") {
        toggleCheck(id);
    }
});

function dltTodo(e, id) {
    e.target.closest('li').remove();
    arrTodos = arrTodos.filter((todo) => {
        if (todo.id !== Number(id)) {
            return todo;
        }
    });
    renderTodo();
};

function toggleCheck(id) {
    arrTodos = arrTodos.map((todo) => {
        if (todo.id === Number(id)) {
            return {
                ...todo,
                isCompleted: !todo.isCompleted
            }
        }
        return todo;
    })
    renderTodo();
};

function editStart(id) {
    editTodoId = id;
    let currentTodo = arrTodos.find((todo) => {
        if (todo.id === Number(id)) {
            return todo
        }
    })
    inputTodo.value = currentTodo.content;
    btnForm.textContent = "Update";
    btnForm.className = "py-2 rounded-lg px-5 bg-gray-300 text-black font-semibold cursor-pointer";
    cancelP.classList.remove("hidden");
}

function cancelEdit() {
    editTodoId = null;
    btnForm.textContent = "Add";
    btnForm.className = "py-2 rounded-lg text-white cursor-pointer px-5 font-semibold bg-black";
    cancelP.classList.add("hidden");
    inputTodo.value = "";
}

cancelP.addEventListener("click", () => cancelEdit());