
document.addEventListener('DOMContentLoaded', function () {
    let isEditMode = false;  
    let edittingId; 
    
   
    const tasks = [
        {
            id: 1,
            title: "Complete project report",
            description: "Prepare and submit the project report",
            dueDate: "2024-12-01",
            comments: []
        },
        {
            id: 2,
            title: "Team Meeting",
            description: "Get ready for the season",
            dueDate: "2024-12-01",
            comments: []
        },
        {
            id: 3,
            title: "Code Review",
            description: "Check partners code",
            dueDate: "2024-12-01",
            comments: []
        },
        {
            id: 4,
            title: "Deploy",
            description: "Check deploy steps",
            dueDate: "2024-12-01",
            comments: []
        }
    ];

    function loadTasks() {
        const taskList = document.getElementById('task-list');  
        taskList.innerHTML = '';  

        
        tasks.forEach(function (task) {
            const taskCard = document.createElement('div');  
            taskCard.className = 'col-md-4 mb-3';  
            taskCard.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${task.title}</h5>
                        <p class="card-text">${task.description}</p>
                        <p class="card-text"><small class="text-muted">Due: ${task.dueDate}</small></p>
                        <div id="comments-section-${task.id}">
                            <h6>Comments:</h6>
                            <ul class="list-group mb-2" id="comment-list-${task.id}">
                                ${task.comments.map((comment, index) => `
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        ${comment}
                                        <button class="btn btn-sm btn-danger delete-comment" data-task-id="${task.id}" data-comment-index="${index}">Delete</button>
                                    </li>
                                `).join('')}
                            </ul>
                            <div class="input-group mb-3">
                                <input type="text" class="form-control" placeholder="Add a comment" id="comment-input-${task.id}">
                                <button class="btn btn-outline-primary add-comment" data-task-id="${task.id}">Add</button>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-secondary btn-sm edit-task" data-id="${task.id}">Edit</button>
                        <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Delete</button>
                    </div>
                </div>
            `;
            taskList.appendChild(taskCard);  
        });

        document.querySelectorAll('.edit-task').forEach(function (button) {
            button.addEventListener('click', handleEditTask);
        });

        document.querySelectorAll('.delete-task').forEach(function (button) {
            button.addEventListener('click', handleDeleteTask);
        });
        //Aca esta el boton de añadir comentarios
        document.querySelectorAll('.add-comment').forEach(function (button) {
            button.addEventListener('click', handleAddComment);
        });

        document.querySelectorAll('.delete-comment').forEach(function (button) {
            button.addEventListener('click', handleDeleteComment);
        });
    }

   
    function handleEditTask(event) {
        try {
            const taskId = parseInt(event.target.dataset.id);  
            const task = tasks.find(t => t.id === taskId);  
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-desc').value = task.description;
            document.getElementById('due-date').value = task.dueDate;
            isEditMode = true;  
            edittingId = taskId;  
            const modal = new bootstrap.Modal(document.getElementById("taskModal"));  
            modal.show();  
        } catch (error) {
            alert("Error trying to edit a task");
            console.error(error);
        }
    }

    function handleDeleteTask(event) {
        const id = parseInt(event.target.dataset.id);  
        const index = tasks.findIndex(t => t.id === id);  
        tasks.splice(index, 1); 
        loadTasks();  
    }

    document.getElementById('task-form').addEventListener('submit', function (e) {
        e.preventDefault();  
        
        const title = document.getElementById("task-title").value;  
        const description = document.getElementById("task-desc").value;  
        const dueDate = document.getElementById("due-date").value; 

        if (isEditMode) {  
            const task = tasks.find(t => t.id === edittingId);  
            task.title = title; 
            task.description = description; 
            task.dueDate = dueDate; 
        } else { 
            const newTask = {
                id: tasks.length + 1,
                title: title,
                description: description,
                dueDate: dueDate,
                comments: []
            };
            tasks.push(newTask);  
        }
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));  
        modal.hide();  
        loadTasks();  
    });

    // Acá esta para añadir comentarios 
    function handleAddComment(event) {
        const taskId = parseInt(event.target.dataset.taskId); 
        const task = tasks.find(t => t.id === taskId); 
        const commentInput = document.getElementById(`comment-input-${taskId}`);  
        const commentText = commentInput.value.trim();  

        if (commentText) {  
            task.comments.push(commentText);  // Agrega el comentario al array de comentarios
            commentInput.value = '';  // Limpia el input de comentario
            loadTasks();  
        }
    }

    // Acá para eliminar los comentrios para eliminar
    function handleDeleteComment(event) {
        const taskId = parseInt(event.target.dataset.taskId); 
        const commentIndex = parseInt(event.target.dataset.commentIndex);  
        const task = tasks.find(t => t.id === taskId);  
    //aca verifica que exista la tarea y lo elimina del array 
        if (task && commentIndex >= 0) {  
            task.comments.splice(commentIndex, 1);  
            loadTasks();  
        }
    }

    document.getElementById('taskModal').addEventListener('show.bs.modal', function () {
        if (!isEditMode) {
            document.getElementById('task-form').reset();
        }
    });

   
    document.getElementById("taskModal").addEventListener('hidden.bs.modal', function () {
        edittingId = null;
        isEditMode = false;
    });

    loadTasks();  
});
