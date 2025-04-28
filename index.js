let todos = [];
// pull request 
async function fetchTodos() {
  const localData = localStorage.getItem('todos');
  if (localData) {
    todos = JSON.parse(localData); 
    // console.log('Loaded from localStorage:', todos);
  } 
  else {
    const res = await fetch('https://dummyjson.com/todos');
    const data = await res.json();
    todos = data.todos.slice(0, 5);
    saveTodos();  
  }
  renderTasks();
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function addTask() {
  const input = document.getElementById('newTask');
  const text = input.value.trim(); 
  if (!text) return;
  const newTodo = {
    id: todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1,
    todo: text,
    userId: Math.floor(Math.random() * 100),
    completed: false
  };
  todos.push(newTodo);
  saveTodos();
  input.value = '';
  renderTasks();
}

function deleteTask(id) {
  if (!confirm('Are you sure you want to delete this task?')) return;
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTasks();
}

function markDone(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) todo.completed = true;
  saveTodos();
  renderTasks();
}

function renderTasks() {
  const search = document.getElementById('search').value.toLowerCase();
  const filtered = todos.filter(t => t.todo.toLowerCase().includes(search));
//   console.log('Filtered tasks:', filtered);
  const tbody = document.getElementById('todoBody');
  tbody.innerHTML = '';
  filtered.forEach(t => {
    const row = `<tr>
      <td>${t.id}</td>
      <td class="${t.completed ? 'completed' : ''}">${t.todo}</td>
      <td>${t.userId}</td>
      <td>${t.completed ? 'Completed' : 'Pending'}</td>
      <td>
        <button class="btn btn-delete" onclick="deleteTask(${t.id})">Delete</button>
        <button class="btn btn-done" onclick="markDone(${t.id})" ${t.completed ? 'disabled' : ''}>Done</button>
      </td>
    </tr>`;
    tbody.innerHTML += row;
  });
  document.getElementById('totalCount').innerText = `Total tasks: ${filtered.length}`;
}

fetchTodos();