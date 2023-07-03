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

function updateVh() {
  let vh = window.innerHeight * 0.01;
  $(document.documentElement).css("--vh", `${vh}px`);
}

$(window).resize(_.debounce(updateVh, 100));

$(".app-icon").click(function (e) {
  e.preventDefault();
  createWindow($(this).attr("id"));
});

updateVh();

$("#homescreen-time").text(dayjs().format("h:mm"));
$("#homescreen-day").text(dayjs().format("dddd"));
$("#homescreen-monthday").text(dayjs().format("MMMM D"));

$("#todo-count").text($("#todo-list").children.length);
