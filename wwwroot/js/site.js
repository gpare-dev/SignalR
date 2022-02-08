$(document).ready(function () {

    jQuery.fx.off = true;
    var connection = new signalR.HubConnectionBuilder().withUrl("/dashboardHub").build();
    connection.start();

    connection.on("AddTask", function (text, categoryCard, taskNumber) {
        var newTask = $("<div class='card task-card open-edit-task drag'><button type='button' class='btn-close close-task'></button><div class='card-body' id='" + taskNumber + "'>" + text + "</div></div>");
        newTask.draggable({ cursor: "move", containment: ".container", revert: true });
        newTask.insertBefore(categoryCard);
        $("#task-description").val("");
    });

    connection.on("EditTask", function (taskID, text) {
        $("#" + taskID)[0].innerText = text;
    });

    connection.on("MoveTask", function (taskID, categoryCard) {
        $("#" + taskID).parent().detach().insertBefore("#" + categoryCard);
    });

    connection.on("DeleteTask", function (taskID) {
        $("#" + taskID).parent().remove();
    });

    $(".open-add-task").click(function () {
        $(".add-task-form .modal-title").text("New task [" + $(this).data('bs-category-name') + "]");
        $("#category-card").val($(this).data("bs-category-card"));
    });

    $(".add-task-form").on("submit", function (e) {
        let taskDescription = $("#task-description").val();
        if (taskDescription === "")
        {
            alert("Error! Task description cannot be empty.");
            e.preventDefault();
            return;
        }

        var randomNumber = Math.floor(Math.random() * 100000000); // Workaround because we don't want to save the task in the database
        connection.invoke("AddTask", taskDescription, $("#category-card").val(), randomNumber).catch(function (err) {
            return console.error(err.toString());
        });
        $("#task-description").val("");
        e.preventDefault();
    });

    $(document).on("dblclick", ".open-edit-task", function () {
        $('#edit-task').modal('toggle');
        $("#task-id").val(this.lastChild.id);
        $("#task-new-description").val(this.innerText);
    });

    $(".edit-task-form").on("submit", function (e) {
        let taskNewDescription = $("#task-new-description").val();
        if (taskNewDescription === "") {
            alert("Error! Task description cannot be empty.");
            e.preventDefault();
            return;
        }

        connection.invoke("EditTask", parseInt($("#task-id").val()), $("#task-new-description").val()).catch(function (err) {
            return console.error(err.toString());
        });
        $("#task-new-description").val("");
        e.preventDefault();
    });

    $(".drop").droppable({
        accept: ".drag",
        drop: function (e) {
            connection.invoke("MoveTask", parseInt(e.originalEvent.target.parentNode.lastChild.id), e.target.lastChild.parentElement.lastChild.previousElementSibling.id).catch(function (err) {
                return console.error(err.toString());
            });
        }
    });

    $(document).on("click", ".close-task", function (e) {
        connection.invoke("DeleteTask", parseInt(e.target.parentElement.lastChild.id)).catch(function (err) {
            return console.error(err.toString());
        });
    });
});