$("#homescreen-time").text(dayjs().format("h:mm"));
$("#homescreen-day").text(dayjs().format("dddd"));
$("#homescreen-monthday").text(dayjs().format("MMMM D"));

$("#todo-count").text($("#todo-list").children.length);
