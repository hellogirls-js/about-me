async function getWindowPartial(id) {
  const partial = await axios.get(`/partial/mobile/${id}`);
  return partial.data;
}

function createWindow(type) {
  const clone = $($("#app-window-template").html());
  getWindowPartial(type).then((partial) => {
    $(".app-window-title").text(type.replace("_", " "));
    $(".app-window-content").html(partial);
  });

  $("#app-screen").prepend(clone);
  $("#app-grid").hide();
  $("#app-shortcuts-container").hide();

  $(".app-window-back", clone).click(function (e) {
    e.preventDefault();
    $("#app-grid").show();
    $("#app-shortcuts-container").show();
    $(clone).remove();
  });
}

$(".app-icon").click(function (e) {
  e.preventDefault();
  createWindow($(this).attr("id"));
});

$("#homescreen-time").text(dayjs().format("h:mm"));
$("#homescreen-day").text(dayjs().format("dddd"));
$("#homescreen-monthday").text(dayjs().format("MMMM D"));

$("#todo-count").text($("#todo-list").children.length);
