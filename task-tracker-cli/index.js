const fs = require('fs');
const path = require('path');

const command = process.argv[2];
const args = process.argv.slice(3);


/**
 * Your tasks will be stored in this file.
 */
const TASKS_FILE = path.join(__dirname, 'tasks.json');

/**
 * Helper function to read tasks from the JSON file.
 * Returns an empty array if the file doesn't exist.
 */
function readTasks() {
    if (!fs.existsSync(TASKS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(TASKS_FILE, 'utf8');
    return JSON.parse(data);
}

/**
 * Helper function to save tasks to the JSON file.
 */
function saveTasks(tasks) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

/**
 * TODO: Implement the "add" command
 * - Create a new task object with a unique ID.
 * - Set the current date for createdAt and updatedAt.
 * - Default status: "todo".
 */
function addTask(description) {
    if (!description) {
        console.error('Error: Please provide a task description.');
        return;
    }
    const tasks = readTasks();
    const newTask = {
        id: tasks.length + 1,
        description: description,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
    console.log("Created a new task object", newTask);
    tasks.push(newTask);
    saveTasks(tasks);
    console.log("Task added successfully!");
}

/**
 * TODO: Implement the "list" command
 */
function listTasks(statusFilter) {
    const tasks = readTasks();
    if (tasks.length === 0) {
        console.log("No tasks found.");
        return;
    }

    console.log("---Tasks---")
    tasks.forEach(task => {
        console.log(`[${task.id}] ${task.description} - Status: ${task.status}`)
    })
}

function updateTask(id, newDescription) {
    const tasks = readTasks();
    const task = tasks.find(t => t.id == parseInt(id));

    if (!task) {
        console.log(`Task with ID ${id} not found.`)
        return;
    }

    task.description = newDescription;
    task.updatedAt = new Date().toISOString();
    saveTasks(tasks);
    console.log(`Task ${id} updated successfully!`);
}

function deleteTask(id) {
    const tasks = readTasks();

    const newTaskList = tasks.filter(t => t.id !== parseInt(id));
    if (tasks.length === newTaskList.length) {
        console.log(`Task with ID ${id} not found.`)
        return;
    }

    saveTasks(newTaskList);
    console.log(`Task ${id} deleted successfully`)
}

function markInProgress(id) {
    const tasks = readTasks();
    const task = tasks.find(t => t.id == parseInt(id));

    if (!task) {
        console.log(`Task with ID ${id} not found.`)
        return;
    }

    task.status = newStatus;
    task.updatedAt = new Date().toISOString();
    saveTasks(tasks);
    console.log(`Task ${id} marked as in-progress successfully!`);
}

function markDone(id) {
    const tasks = readTasks();
    const task = tasks.find(t => t.id == parseInt(id));

    if (!task) {
        console.log(`Task with ID ${id} not found.`)
        return;
    }
    task.status = newStatus;
    task.updatedAt = new Date().toISOString();
    saveTasks(tasks);
    console.log(`Task ${id} marked as done successfully!`);
}
// MAIN COMMAND HANDLER
switch (command) {
    case 'add':
        addTask(args[0]);
        break;
    case 'list':
        listTasks(args[0]);
        break;
    case 'update':
        updateTask(args[0], args[1]);
        break;
    case 'delete':
        deleteTask(args[0]);
        break;
        break;
    case 'mark-in-progress':
        markInProgress(args[0], 'in-progress');
        break;
    case 'mark-done':
        markDone(args[0], 'done');
        break;
    case 'help':
    default:
        console.log(`
        Usage: node index.js [command] [arguments]

        Commands:
        add "description"          Add a new task
        list [status]             List tasks (optional: todo, in-progress, done)
        update <id> "description"  Update task description
        delete <id>                Delete a task
        mark-in-progress <id>      Mark task as in-progress
        mark-done <id>             Mark task as done
    `);
}
