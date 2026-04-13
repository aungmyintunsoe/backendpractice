# Project 1: Task Tracker CLI

This is your first dive into backend development with Node.js. In this project, you will build a command-line interface (CLI) to manage your tasks without using any external libraries.

## 🛠️ Requirements & Goals
- [ ] Parse command-line arguments using `process.argv`.
- [ ] Use the `fs` module to read/write from a `tasks.json` file.
- [ ] Implement `add`, `update`, `delete`, `list`, and `mark` functions.
- [ ] Handle errors gracefully (e.g., trying to mark a non-existent task).

## 🪜 Step-by-Step Guide

### Step 1: Handling Commands (Boilerplate)
I've provided a basic structure in `index.js`. Your first job is to understand how `process.argv` works. It captures everything you type in the terminal.

### Step 2: Implement `addTask(description)`
- You need a way to read the existing tasks from `tasks.json`.
- If the file doesn't exist, start with an empty array `[]`.
- Create a new task object with: `id`, `description`, `status` ("todo"), `createdAt`, and `updatedAt`.
- Save the updated array back to `tasks.json`.

### Step 3: Implement `listTasks(statusFilter)`
- Read the file.
- Filter the array if a status (like "done") is provided.
- Log them to the console.

### Step 4: Finishing Up
- Implement Delete, Update, and status marking.

---

## 🚀 Commands to Run
```bash
# Add a task
node index.js add "My first task"

# List all tasks
node index.js list

# Mark as done
node index.js mark-done 1
```
