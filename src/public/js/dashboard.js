let tasksData = {}
function toggleAddTask() {
    const addTaskForm = document.getElementById('add-task-form');
    if (addTaskForm.style.display === 'none') {
        addTaskForm.style.display = 'block';
    } else {
        addTaskForm.style.display = 'none';
    }
}
function openPanel(taskId, event) {
    const taskData = tasksData[taskId];
    const panel = document.getElementById('taskDetailsPanel');


    document.getElementById('taskName').value = taskData.taskName;
    document.getElementById('dueDate').value = taskData.taskDate;
    document.getElementById('addedOn').value = new Date().toISOString().slice(0, 10);
    loadCategories(taskData.categories);


    panel.style.top = `${event.clientY + window.scrollY + 10}px`;
    panel.style.left = `${event.clientX + 10}px`;
    panel.style.display = 'block';
}


function loadCategories(categories) {
    const categoriesContainer = document.getElementById('selectedCategories');
    categoriesContainer.innerHTML = ''; // Clear previous categories
    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.textContent = category;
        categoryElement.className = 'category-bubble';
        categoriesContainer.appendChild(categoryElement);
    });
}
function closePanel() {
    document.getElementById('taskDetailsPanel').style.display = 'none';
}



function addTask(event) {
    event.preventDefault();

    // Get values from form fields
    const taskName = document.getElementById('task-name').value;
    const taskDate = document.getElementById('task-due-date').value;
    const taskDescription = document.getElementById('task-desc').value;

    // Clear the form
    document.getElementById('add-task-form').reset();
    const taskID = Date.now();

    // Create the task element
    const taskElement = document.createElement('button'); // Change from div to button
    taskElement.className = 'task-info';
    taskElement.innerHTML = `
        <span class="task-marker"></span>
        <span>${taskName}</span> - <span>${taskDescription}</span>
    `;

    taskElement.onclick = (event) => openPanel(taskID, event);
    tasksData[taskID] = {
        taskName,
        taskDate,
        taskDescription,
        categories: [] // Initialize with empty categories array
    };


    // Assuming the date is in the format "YYYY-MM-DD"
    const dateParts = taskDate.split('-');
    const dueDay = parseInt(dateParts[2], 10);

    // Find the calendar day to add the task to and append the task
    const calendarDays = document.querySelectorAll('.calendar-day');
    calendarDays.forEach(day => {
        if (parseInt(day.textContent, 10) === dueDay) {
            //taskElement.addEventListener('click',function(){
            //window.location.href = "/Task Detail/taskDetails.html";
            //});
            day.appendChild(taskElement);
        }
    });
}

let currentDate = new Date();

document.addEventListener('DOMContentLoaded', function () {
    renderCalendar(currentDate);
});

function renderCalendar(date) {
    const daysContainer = document.getElementById('calendar-days');
    daysContainer.innerHTML = '';

    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(year, month);

    // Display the current month and year
    document.getElementById('calendar-month-year').textContent = getMonthYearString(date);

    // Create empty slots for the days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        daysContainer.appendChild(createEmptyDayCell());
    }

    // Fill in the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        daysContainer.appendChild(createDayCell(day, month, year));
    }

    // Fill in the remaining slots after the last day of the month
    const totalSlots = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
    const remainingSlots = totalSlots - (firstDayOfMonth + daysInMonth);
    for (let i = 0; i < remainingSlots; i++) {
        daysContainer.appendChild(createEmptyDayCell());
    }
}

function createDayCell(day, month, year) {
    const dayCell = document.createElement('div');
    dayCell.className = 'calendar-day';
    dayCell.textContent = day;
    if (isToday(year, month, day)) {
        dayCell.classList.add('today');
    }
    return dayCell;
}

function createEmptyDayCell() {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day empty-day';
    return emptyCell;
}

function getMonthYearString(date) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function isToday(year, month, day) {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar(currentDate);
}

function jumpToToday() {
    currentDate = new Date();
    renderCalendar(currentDate);
}

document.getElementById('changeMonth-1').addEventListener('click',function(){
    changeMonth(-1);
});
document.getElementById('changeMonth+1').addEventListener('click',function(){
    changeMonth(1);
});
document.getElementById('jumpToToday').addEventListener('click',function(){
    jumpToToday();
});
document.getElementById('toggleAddTask').addEventListener('click',function(){
    toggleAddTask();
});
document.getElementById('add-task-form').addEventListener('submit',function(event){
    addTask(event);
});