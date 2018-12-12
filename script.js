//// list of tasks ////
var tasks = []

// task object
function Task(name, time) {
    this.name = name;
    this.time = time;

    // doing this this only to please the prof
    localStorage.setItem(name, time);

    this.done = this.done || false;

    this.render = () => {
        var name = this.name;
        var time = localStorage.getItem(name);
        var done = this.done;

        var list = "<li>" + name + " on " + time + " : " + done + "</li>";
        $("#task-list").append(list)
    }
}


// function to check and alert
function check() {

    // function for checking individual task
    var needToAlert = (task) => {
        // no need to check if already done
        if (task.done) {
            return false;
        }

        // get current time
        var d = new Date();

        var h = d.getHours();
        var m = d.getMinutes();

        // get task time
        var name = task.name;
        var time = localStorage.getItem(name);
        var th = time.split(':')[0];
        var tm = time.split(':')[1];

        // perform check
        var result = false;
        if (th < h) {
            result = true;
        } else if (th > h) {
            result = false;
        } else {
            result = tm <= m;
        }
        return result;
    }

    // walk through all tasks and filter those that are due
    var filtered = tasks.filter(needToAlert);

    // alert on the filtered results
    if (filtered.length > 0) {
        alert(filtered.map((x) => x.name).toString());
    }

    // set tasks to true after they have been alerted
    tasks = tasks.filter(x => filtered.map(y => y.name).indexOf(x.name) == -1);
    console.log("filtered: " + filtered);
    console.log("tasks: " + tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    render();

}

// update list
function render() {
    $("#task-list").empty();

    // for each task, put it into the list (call its render function)
    tasks.forEach((x) => x.render());
}


//// handlers ////
$(document).ready(() => {
    // restore from local storage
    var json = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = json.map(x => new Task(x.name, x.time, x.done));
    render();


    $("#task-submit").on("click", () => {
        var name = $("#task-name");
        var time = $("#task-time");
        var task = new Task(name.val(), time.val());

        // render the list
        tasks.push(task)
        localStorage.setItem("tasks", JSON.stringify(tasks));
        render();

        // clear input
        name.val('');
        time.val('');
    });

    setInterval(check,  5000);

});
