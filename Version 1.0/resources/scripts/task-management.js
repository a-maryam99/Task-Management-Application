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
                _this.displyData();
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
            displyData: function () {
                var _this = this;
                var tasks_body = document.getElementsByClassName("tasks-body")[0];
                tasks_body.innerHTML = "";
                var taskList = this.getTasks();

                for (var i = 0; i < taskList.length; i++) {
                    var task = taskList[i];

                    var tr = document.createElement("tr");
                    tasks_body.appendChild(tr);

                    var id_td = document.createElement("td");
                    id_td.innerHTML = task.id;


                    var description_td = document.createElement("td");
                    description_td.classList.add("description-td");
                    var description_span = document.createElement("span");
                    description_span.classList.add(task.status);
                    description_span.innerHTML = task.description;
                    description_td.appendChild(description_span);

                    var status_td = document.createElement("td");
                    status_td.classList.add("status-td");
                    var status_span = document.createElement("span");
                    status_span.classList.add(task.status);
                    status_span.innerHTML = task.status;
                    status_td.appendChild(status_span);


                    var actions_td = document.createElement("td");
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
                            _this.displyData();

                        });

                        var btnDelete = document.createElement("i");
                        btnDelete.title = "Delete";
                        btnDelete.classList.add("action-button");
                        btnDelete.classList.add("icon-bin");
                        btnDelete.classList.add("text-red");
                        btnDelete.targetId = task.id;

                        btnDelete.addEventListener("click", (event) => {
                            if (confirm("Are you sure?") == true) {
                                var foundIndex = taskList.findIndex(o => o.id == event.target.targetId);
                                taskList.splice(foundIndex, 1);
                                _this.setTasks(taskList);
                                _this.displyData();
                            }
                        });

                        var actions_container = document.createElement("div");
                        actions_container.appendChild(btnDone);
                        actions_container.appendChild(btnDelete);
                        actions_td.appendChild(actions_container);
                    }

                    tr.appendChild(id_td);
                    tr.appendChild(description_td);
                    tr.appendChild(status_td);
                    tr.appendChild(actions_td);
                }


            },
            add: function (event) {
                event.preventDefault();

                var taskList = this.getTasks();
                var last_id = taskList.length > 0 ? Math.max(...taskList.map(o => o.id)) : 0;
                var txtDescription = document.getElementById("txtDescription");

                if (txtDescription.value == "") {
                    alert("Please enter description");
                    return;
                }
                var newTask = {
                    id: last_id + 1,
                    description: txtDescription.value,
                    status: "ToDo"
                };

                var updatedList = taskList.concat(newTask);

                this.setTasks(updatedList);

                txtDescription.value = '';
                this.hidePopup();
                this.displyData();
            },
        };