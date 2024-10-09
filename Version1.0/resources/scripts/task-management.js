        var TaskManagement = {
            modalContainer: null,
            init: function () {
                var _this = this;

                var btnNew = document.getElementById("btnNew");
                var btnAdd = document.getElementById("btnAdd");
                var btnClose = document.getElementById("btnClose");
                _this.modalContainer = document.getElementsByClassName("modal-container")[0];

                btnNew.onclick = function () {
                    _this.showPopup();
                }

                btnClose.onclick = function () {
                    _this.hidePopup();
                }

                btnAdd.onclick = function (e) {
                    _this.add(e);
                }

                window.onclick = function (event) {
                    if (event.target == _this.modalContainer) _this.hidePopup();
                }
                _this.displayData();
            },
            showPopup: function () {
                this.modalContainer.style.display = "block";
            },
            hidePopup: function () {
                this.modalContainer.style.display = "none";
            },
            sort: function (tasks) {
                return tasks.sort((a, b) => {
                    const statusOrder = {
                        "ToDo": 1,
                        "Done": 2,
                    };
                    return statusOrder[a.status] - statusOrder[b.status] || b.id - a.id;
                });
            },
            getTasks: function () {
                var tasks = JSON.parse(localStorage.getItem("tasks")) || new Array();
                return this.sort(tasks);
            },
            setTasks: function (tasks) {
                localStorage.setItem("tasks", JSON.stringify(tasks));
            },
            displayData: function () {
                var _this = this;
                var tasksTBody = document.getElementsByClassName("tasks-body")[0];
                tasksTBody.innerHTML = "";
                var taskList = this.getTasks();

                for (var i = 0; i < taskList.length; i++) {
                    var task = taskList[i];

                    var taskTr = document.createElement("tr");
                    tasksTBody.appendChild(taskTr);

                    var idTd = document.createElement("td");
                    idTd.innerHTML = task.id;


                    var descriptionTd = document.createElement("td");
                    descriptionTd.classList.add("description-td");
                    var descriptionSpan = document.createElement("span");
                    descriptionSpan.classList.add(task.status);
                    descriptionSpan.innerHTML = task.description;
                    descriptionTd.appendChild(descriptionSpan);

                    var statusTd = document.createElement("td");
                    statusTd.classList.add("status-td");
                    var statusSpan = document.createElement("span");
                    statusSpan.classList.add(task.status);
                    statusSpan.innerHTML = task.status;
                    statusTd.appendChild(statusSpan);


                    var actionsTd = document.createElement("td");
                    var actionsDiv = document.createElement("div");

                    if (task.status == "ToDo") {
                        var btnDone = document.createElement("i");
                        btnDone.title = "Done";
                        btnDone.classList.add("action-button");
                        btnDone.classList.add("icon-checkmark");
                        btnDone.classList.add("text-green");
                        btnDone.targetId = task.id;

                        btnDone.addEventListener("click", (event) => {
                            var foundTask = taskList[taskList.findIndex(o => o.id == event.target
                                .targetId)];
                            foundTask.status = "Done";
                            _this.setTasks(taskList);
                            _this.displayData();

                        });      

                        actionsDiv.appendChild(btnDone);           
                    }

                    if (task.status == "Done") {
                        var btnRevert= document.createElement("i");
                        btnRevert.title = "Revert";
                        btnRevert.classList.add("action-button");
                        btnRevert.classList.add("icon-undo");
                        btnRevert.classList.add("text-orange");
                        btnRevert.targetId = task.id;

                        btnRevert.addEventListener("click", (event) => {
                            if (confirm("Are you sure to revert?") == true) {
                            var foundTask = taskList[taskList.findIndex(o => o.id == event.target
                                .targetId)];
                            foundTask.status = "ToDo";
                            _this.setTasks(taskList);
                            _this.displayData();
                            }
                        });      

                        actionsDiv.appendChild(btnRevert);           
                    }

                    var btnDelete = document.createElement("i");
                    btnDelete.title = "Delete";
                    btnDelete.classList.add("action-button");
                    btnDelete.classList.add("icon-bin");
                    btnDelete.classList.add("text-red");
                    btnDelete.targetId = task.id;

                    btnDelete.addEventListener("click", (event) => {
                        if (confirm("Are you sure to delete?") == true) {
                            var foundIndex = taskList.findIndex(o => o.id == event.target.targetId);
                            taskList.splice(foundIndex, 1);
                            _this.setTasks(taskList);
                            _this.displayData();
                        }
                    });
                    actionsDiv.appendChild(btnDelete);
                    actionsTd.appendChild(actionsDiv);

                    taskTr.appendChild(idTd);
                    taskTr.appendChild(descriptionTd);
                    taskTr.appendChild(statusTd);
                    taskTr.appendChild(actionsTd);
                }
            },
            add: function (event) {
                event.preventDefault();

                var taskList = this.getTasks();
                var lastId = taskList.length > 0 ? Math.max(...taskList.map(o => o.id)) : 0;
                var txtDescription = document.getElementById("txtDescription");

                if (txtDescription.value == "") {
                    alert("Please enter description");
                    return;
                }
                var newTask = {
                    id: lastId + 1,
                    description: txtDescription.value,
                    status: "ToDo"
                };

                var updatedList = taskList.concat(newTask);

                this.setTasks(updatedList);

                txtDescription.value = '';
                this.hidePopup();
                this.displayData();
            },
        };