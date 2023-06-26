console.log("if you're reading this. hi");

const WINDOW_POSITION = {x: 300, y: 30};
let WINDOW_ID = 0;
const WINDOW_OFFSET = 10;
let Z_INDEX = 3;

function getIdClass(el) {
  return $( el ).attr("class").split(' ').find((c) => { return c.includes("id-")})
}

function toggleStartMenu() {
  $("#dashboard-start-menu").toggle();
  $(this).toggleClass("active");
}

async function getWindowPartial(id) {
  const partial = await axios.get(`/partial/${id}`);
  return partial.data;
}

// create elements

function createWindow(type, position) {
  const clone = $($("#window-template").html());
  getWindowPartial(type).then(partial => {
    $(".window-content", clone).html(partial);
    $(".window-title", clone).text(type.replace('_', ' '));
    switch(type) {
      case "about":
        $(".window-icon", clone).html('<i class="ti ti-user-heart"></i>');
        break;
      case "chat_box":
        $(".window-icon", clone).html('<i class="ti ti-message-2"></i>');
        break;
    }
    $(clone).css({ "top": position.y, "left": position.x, "z-index": Z_INDEX + WINDOW_ID, "position": "absolute" });
    if (type === "chat_box") {
      $(clone).css({ "width": 300, "height": 500});
    } else {
      $(clone).css({ "width": 700, "height": 450});
    }
    $(clone).addClass(`id-${WINDOW_ID}`);
    $(clone).draggable({
      handle: ".app-header",
      containment: "parent"
    });
    $("#desktop").append(clone);
    createDashboardItem(type.replace('_', ' '));

    $(".window-minimize", clone).click(function() {
      const idClass = getIdClass(clone);
      $(`.dashboard-item-container.${idClass}`).removeClass("active");
      $( clone ).hide();
    });

    $(".window-close", clone).click(function() {
      const idClass = getIdClass(clone);
      $(`.dashboard-item-container.${idClass}`).remove();
      $( clone ).remove();
    });
    WINDOW_ID++;
  }).catch(error => console.error(error));
}

function createStickyNote(title, content, position) {
  const clone = $($("#sticky-template").html());
  $(".sticky-title", clone).val(title);
  $(".sticky-content", clone).val(content);
  $(clone).css({ "top": position.y, "left": position.x, "z-index": Z_INDEX + WINDOW_ID, "position": "absolute" });
  $(clone).addClass(`id-${WINDOW_ID}`);
  $(clone).draggable({
    handle: ".app-header, .sticky-title",
    containment: "parent"
  });
  $("#desktop").append(clone);
  createDashboardItem("sticky note");

  $(".sticky-minimize", clone).click(function() {
    const idClass = getIdClass(clone);
    $(`.dashboard-item-container.${idClass}`).removeClass("active");
    $( clone ).hide();
  });
  $(".sticky-close", clone).click(function() {
    const idClass = getIdClass(clone);
    $(`.dashboard-item-container.${idClass}`).remove();
    $( clone ).remove();
  });
  WINDOW_ID++;
}

function createDashboardItem(text) {
  const clone = $($("#dashboard-item-template").html());
  $(".dashboard-item-text", clone).text(text);
  $(clone).addClass("active");
  $(clone).addClass(`id-${WINDOW_ID}`);
  $("#dashboard-items").append(clone);
  $( clone ).click(function() {
    $(this).toggleClass("active");
    const idClass = getIdClass(clone);
    $(`.app-container.${idClass}`).toggle();
  })
}

$("#dashboard-start-menu").hide();
$("#dashboard-start-button").click(function() {
  toggleStartMenu();
});

$("#desktop").click(function() {
  $("#dashboard-start-menu").hide();
});

$("#dashboard-time").text(dayjs().format("hh:mmA"));
$("#dashboard-date").text(dayjs().format("MM/DD/YYYY"));

$(".dashboard-start-tooltip-container").mouseenter(function() {
  $(this).children(".dashboard-start-tooltip").show();
})

$(".dashboard-start-tooltip-container").mouseleave(function() {
  $(this).children(".dashboard-start-tooltip").hide();
})

$(".dashboard-start-item").click(function() {
  const id = $(this).attr("id").split('-')[1];
  if (id === "sticky_note") {
      createStickyNote("new sticky", "", {
        x: WINDOW_POSITION.x + (WINDOW_OFFSET * WINDOW_ID),
        y: WINDOW_POSITION.y + (WINDOW_OFFSET * WINDOW_ID)
      });
  } else {
    createWindow(id, {
      x: WINDOW_POSITION.x + (WINDOW_OFFSET * WINDOW_ID),
      y: WINDOW_POSITION.y + (WINDOW_OFFSET * WINDOW_ID)
    });
  }
  toggleStartMenu();
});

$( document ).ready(function() {
  createStickyNote(
    "welcome!!!", 
    "hi! welcome to my about page. to navigate this site, click on the start menu. have a nice day!", 
    { 
      x: WINDOW_POSITION.x + (WINDOW_OFFSET * WINDOW_ID), 
      y: WINDOW_POSITION.y + (WINDOW_OFFSET * WINDOW_ID) 
    }
  );

  createWindow("chat_box", 
  { 
    x: 850, 
    y: 60
  });
});

