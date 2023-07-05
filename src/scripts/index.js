let CURRENT_LAYOUT;

let MUSIC_TRACK_LIST;
let TRACK_LIST_INDEX;

function setMusicTrackList(list) {
  MUSIC_TRACK_LIST = list;
}

function setTrackListIndex(i) {
  TRACK_LIST_INDEX = i;
}

async function getPartial(type) {
  const partial = await axios.get(`/partial/${type}`);
  return partial.data;
}

function getDeviceLayout() {
  const aspectRatio = window.innerWidth / window.innerHeight;
  if (aspectRatio >= 1) {
    if (CURRENT_LAYOUT !== "desktop") {
      CURRENT_LAYOUT = "desktop";
      getPartial(CURRENT_LAYOUT)
        .then(function (partial) {
          $("#container").html(partial);
        })
        .catch((error) => console.error(error));
    }
  } else {
    if (CURRENT_LAYOUT !== "mobile") {
      CURRENT_LAYOUT = "mobile";
      getPartial(CURRENT_LAYOUT)
        .then(function (partial) {
          $("#container").html(partial);
        })
        .catch((error) => console.error(error));
    }
  }
}

$(document).ready(function () {
  getDeviceLayout();
  axios.get("/music/retrieve").then(function (res) {
    MUSIC_TRACK_LIST = res.data;
  });
});

$("#music-player-audio").on("ended", function () {
  if (TRACK_LIST_INDEX < MUSIC_TRACK_LIST.length - 1) TRACK_LIST_INDEX++;
  else TRACK_LIST_INDEX = 0;
  $("#music-player-audio").attr(
    "src",
    `/static/music/${MUSIC_TRACK_LIST[TRACK_LIST_INDEX]}`
  );
  $("#music-player-audio")[0].currentTime = 0;
  $(".track-list-container")
    .find("div")
    .eq(TRACK_LIST_INDEX)
    .addClass("active");
  $("#music-player-audio")[0].play();
});

$(window).resize(function () {
  getDeviceLayout();
});
