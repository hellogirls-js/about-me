let PLAYER_STATE = "pause";
const PLAY_BUTTON_CLASS = "ti-player-play-filled";
const PAUSE_BUTTON_CLASS = "ti-player-pause-filled";

function togglePlayButton() {
  if (PLAYER_STATE === "pause") {
    $("#play-pause-button-icon")
      .removeClass(PLAY_BUTTON_CLASS)
      .addClass(PAUSE_BUTTON_CLASS);
    PLAYER_STATE = "play";
    $("#music-player-audio")[0].play();
  } else {
    $("#play-pause-button-icon")
      .removeClass(PAUSE_BUTTON_CLASS)
      .addClass(PLAY_BUTTON_CLASS);
    PLAYER_STATE = "pause";
    $("#music-player-audio")[0].pause();
  }
}

function createMusicTrack(file) {
  const clone = $($("#music-track-template").html());
  $(clone).text(file);
  $(".track-list").append(clone);
  $(clone).click(function (e) {
    $("#music-player-audio")[0].pause();
    $("#music-player-audio")[0].currentTime = 0;
    $("#music-player-audio").attr("src", `/static/music/${file}`);
    togglePlayButton();
  });
}

$("#play-pause-button-icon").addClass(
  PLAYER_STATE === "pause" ? PLAY_BUTTON_CLASS : PAUSE_BUTTON_CLASS
);

$(".music-player-play").click(function (e) {
  togglePlayButton();
});

$(document).ready(function () {
  axios.get("/music/retrieve").then(function (res) {
    res.data.forEach((file) => createMusicTrack(file));
  });
});
