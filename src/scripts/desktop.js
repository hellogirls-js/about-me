console.log("if you're reading this. hi");

const WINDOW_POSITION = { x: 10, y: 3 };
let WINDOW_ID = 0;
const WINDOW_OFFSET = 2;
let Z_INDEX = 3;

function getIdClass(el) {
  return $(el)
    .attr("class")
    .split(" ")
    .find((c) => {
      return c.includes("id-");
    });
}

function toggleStartMenu() {
  $("#dashboard-start-menu").toggle();
  $(this).toggleClass("active");
}

async function getWindowPartial(id) {
  const partial = await axios.get(`/partial/desktop/${id}`);
  return partial.data;
}

function moveToTop(window) {
  let zIndice = [];
  $("#desktop")
    .children()
    .each(function (i, val) {
      if (!isNaN(parseInt($(this).css("z-index")))) {
        zIndice.push(parseInt($(this).css("z-index")));
      }
    });
  const maxZ = Math.max(...zIndice);

  $("#desktop")
    .children()
    .each(function (i, val) {
      if ($(this).css("z-index") == maxZ) {
        const z = $(this).css("z-index");
        $(this).css("z-index", z - 1);
      }
    });
  $(window).css("z-index", maxZ);
}

// create elements

function createWindow(type, position) {
  const clone = $($("#window-template").html());
  getWindowPartial(type)
    .then((partial) => {
      $(".window-content", clone).html(partial);
      $(".window-title", clone).text(type.replace("_", " "));
      switch (type) {
        case "about":
          $(".window-icon", clone).html('<i class="ti ti-user-heart"></i>');
          break;
        case "chat_box":
          $(".window-icon", clone).html('<i class="ti ti-message-2"></i>');
          break;
      }
      $(clone).css({
        top: position.y,
        left: position.x,
        "z-index": Z_INDEX + WINDOW_ID,
        position: "absolute",
      });
      if (type === "chat_box") {
        $(clone).css({ width: 300, height: 500 });
      } else {
        $(clone).css({ width: 700, height: 450 });
      }
      $(clone).addClass(`id-${WINDOW_ID}`);
      $(clone).draggable({
        handle: ".app-header",
        containment: "parent",
      });
      $("#desktop").append(clone);
      createDashboardItem(type.replace("_", " "));

      $(clone).click(function (e) {
        moveToTop(this);
      });

      $(".window-minimize", clone).click(function () {
        const idClass = getIdClass(clone);
        $(`.dashboard-item-container.${idClass}`).removeClass("active");
        $(clone).hide();
      });

      // $(".window-maximize", clone).click(function () {
      //   moveToTop(clone);
      //   clone.css({ left: 0, top: 0, width: "100%", height: "100%" });
      // });

      $(".window-close", clone).click(function () {
        const idClass = getIdClass(clone);
        $(`.dashboard-item-container.${idClass}`).remove();
        $(clone).remove();
      });
      WINDOW_ID++;
    })
    .catch((error) => console.error(error));
}

function createStickyNote(title, content, position) {
  const clone = $($("#sticky-template").html());
  $(".sticky-title", clone).val(title);
  $(".sticky-content", clone).val(content);
  $(clone).css({
    top: position.y,
    left: position.x,
    "z-index": Z_INDEX + WINDOW_ID,
    position: "absolute",
  });
  $(clone).addClass(`id-${WINDOW_ID}`);
  $(clone).draggable({
    handle: ".app-header, .sticky-title",
    containment: "parent",
  });
  $("#desktop").append(clone);
  createDashboardItem("sticky note");

  $(clone).click(function (e) {
    moveToTop(this);
  });

  $(".sticky-minimize", clone).click(function () {
    const idClass = getIdClass(clone);
    $(`.dashboard-item-container.${idClass}`).removeClass("active");
    $(clone).hide();
  });
  $(".sticky-close", clone).click(function () {
    const idClass = getIdClass(clone);
    $(`.dashboard-item-container.${idClass}`).remove();
    $(clone).remove();
  });
  WINDOW_ID++;
}

function createDashboardItem(text) {
  const clone = $($("#dashboard-item-template").html());
  $(".dashboard-item-text", clone).text(text);
  $(clone).addClass("active");
  $(clone).addClass(`id-${WINDOW_ID}`);
  $("#dashboard-items").append(clone);
  $(clone).click(function () {
    $(this).toggleClass("active");
    const idClass = getIdClass(clone);
    $(`.app-container.${idClass}`).toggle();
  });
}

function setTime() {
  $("#dashboard-time").text(dayjs().format("hh:mmA"));
  $("#dashboard-date").text(dayjs().format("MM/DD/YYYY"));
}

$("#dashboard-start-menu").hide();
$("#dashboard-start-button").click(function () {
  toggleStartMenu();
});

$("#desktop").click(function () {
  $("#dashboard-start-menu").hide();
});

$(".desktop-icon").on("dblclick", function (e) {
  switch ($(this).attr("id")) {
    case "twitter":
      window.open("https://twitter.com/hellogirls_DEV");
      break;
    case "tumblr":
      window.open("https://hellogirls-dev.tumblr.com");
      break;
    case "retrospring":
      window.open("https://retrospring.net/@hellogirls");
      break;
    case "coffee":
      window.open("https://buymeacoffee.com/hellogirls");
      break;
    default:
      console.log("no url");
      break;
  }
});

setTime();
setInterval(() => {
  setTime();
}, 500);

$(".dashboard-start-tooltip-container").mouseenter(function () {
  $(this).children(".dashboard-start-tooltip").show();
});

$(".dashboard-start-tooltip-container").mouseleave(function () {
  $(this).children(".dashboard-start-tooltip").hide();
});

$(".dashboard-start-item").click(function () {
  const id = $(this).attr("id").split("-")[1];
  if (id === "sticky_note") {
    createStickyNote("new sticky", "", {
      x: `${WINDOW_POSITION.x + WINDOW_OFFSET * WINDOW_ID}%`,
      y: `${WINDOW_POSITION.y + WINDOW_OFFSET * WINDOW_ID}%`,
    });
  } else {
    createWindow(id, {
      x: `${WINDOW_POSITION.x + WINDOW_OFFSET * WINDOW_ID}%`,
      y: `${WINDOW_POSITION.y + WINDOW_OFFSET * WINDOW_ID}%`,
    });
  }
  toggleStartMenu();
});

$("#desktop").ready(function () {
  createStickyNote(
    "welcome!!!",
    "hi! welcome to my about page. to navigate this site, click on the start menu. have a nice day!",
    {
      x: `${WINDOW_POSITION.x + WINDOW_OFFSET * WINDOW_ID}%`,
      y: `${WINDOW_POSITION.y + WINDOW_OFFSET * WINDOW_ID}%`,
    }
  );

  createWindow("chat_box", {
    x: "67%",
    y: "8%",
  });
});
