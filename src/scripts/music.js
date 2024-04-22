PLAYER_STATE = document.getElementById("music-player-audio").paused
  ? "pause"
  : "play";
PLAY_BUTTON_CLASS = "ti-player-play-filled";
PAUSE_BUTTON_CLASS = "ti-player-pause-filled";

// visualizer code
ctx = document.getElementsByClassName("visualizer-canvas")[0].getContext("2d");
CANVAS_WIDTH = $(".visualizer-canvas").width();
CANVAS_HEIGHT = $(".visualizer-canvas").height();
ctx.canvas.width = CANVAS_WIDTH;
ctx.canvas.height = CANVAS_HEIGHT;
audioCtx = new (window.AudioContext || window.webkitAudioContext)();
audioSrc = audioCtx.createMediaElementSource(
  document.getElementById("music-player-audio")
);
analyzer = audioCtx.createAnalyser();
audioSrc.connect(analyzer);
analyzer.connect(audioCtx.destination);

analyzer.fftSize = 32;
bufferLength = analyzer.frequencyBinCount;
dataArr = new Uint8Array(bufferLength);
barWidth = CANVAS_WIDTH / bufferLength;
squareSize = CANVAS_HEIGHT / 7;
x = 0;
BAR_GAP = 5;
BAR_SUBTRACT = 0.9;

function animate() {
  let x1 = CANVAS_WIDTH / 2;
  let x2 = CANVAS_WIDTH / 2;
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  analyzer.getByteFrequencyData(dataArr);
  for (let i = 0; i < bufferLength; i += 2) {
    barHeight = dataArr[i];
    ctx.fillStyle = "#ff9fbf";
    // ctx.fillRect(
    //   x1,
    //   CANVAS_HEIGHT - barHeight * BAR_SUBTRACT,
    //   barWidth - BAR_GAP,
    //   barHeight * BAR_SUBTRACT
    // );
    for (let y = 0; y < (barHeight * BAR_SUBTRACT) / squareSize; y++) {
      ctx.fillRect(
        x1,
        CANVAS_HEIGHT - y * squareSize,
        barWidth - BAR_GAP,
        squareSize - BAR_GAP
      );
    }
    x1 -= barWidth;
  }
  for (let i = 0; i < bufferLength; i += 2) {
    barHeight = dataArr[i];
    ctx.fillStyle = "#ff9fbf";
    // ctx.fillRect(
    //   x2,
    //   CANVAS_HEIGHT - barHeight * BAR_SUBTRACT,
    //   barWidth - BAR_GAP,
    //   barHeight * BAR_SUBTRACT
    // );
    for (let y = 0; y < (barHeight * BAR_SUBTRACT) / squareSize; y++) {
      ctx.fillRect(
        x2,
        CANVAS_HEIGHT - y * squareSize,
        barWidth - BAR_GAP,
        squareSize - BAR_GAP
      );
    }
    x2 += barWidth;
  }
  requestAnimationFrame(animate);
}

animate();

function calcTime(sec) {
  const min = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  const remainingSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${min}:${remainingSeconds}`;
}

function togglePlayButton() {
  if (PLAYER_STATE === "pause" && $("#music-player-audio").attr("src") === "") {
    // if there is no music playing, play the first track automatically
    setTrackListIndex(0);
    $("#music-player-audio").attr(
      "src",
      `/static/music/${MUSIC_TRACK_LIST[TRACK_LIST_INDEX]}`
    );
    $(".track-list-container")
      .find("div")
      .eq(TRACK_LIST_INDEX)
      .addClass("active");
    $("#play-pause-button-icon")
      .removeClass(PLAY_BUTTON_CLASS)
      .addClass(PAUSE_BUTTON_CLASS);
    PLAYER_STATE = "play";
    $("#music-player-audio")[0].play();
    $(".music-player-seeker-range").attr("disabled", false);
  } else if (
    PLAYER_STATE === "pause" &&
    $("music-player-audio").attr("src") !== ""
  ) {
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
  $(".track-list-container").append(clone);

  $(clone).click(function (e) {
    $(".track-list-container")
      .find("div")
      .eq(TRACK_LIST_INDEX)
      .removeClass("active");
    $("#music-player-audio")[0].currentTime = 0;
    $("#music-player-audio").attr("src", `/static/music/${file}`);
    $(".music-player-seeker-range").prop("disabled", false);
    if (PLAYER_STATE === "pause") {
      $("#play-pause-button-icon")
        .removeClass(PLAY_BUTTON_CLASS)
        .addClass(PAUSE_BUTTON_CLASS);
      PLAYER_STATE = "play";
    }
    setTrackListIndex(MUSIC_TRACK_LIST.findIndex((track) => track === file));
    $(".track-list-container")
      .find("div")
      .eq(TRACK_LIST_INDEX)
      .addClass("active");
    $("#music-player-audio")[0].play();
  });
}

$("#play-pause-button-icon").addClass(
  PLAYER_STATE === "pause" ? PLAY_BUTTON_CLASS : PAUSE_BUTTON_CLASS
);

MUSIC_TRACK_LIST.forEach((file) => createMusicTrack(file));

$(".music-player-play").click(function (e) {
  togglePlayButton();
});

$(".music-player-rewind").click(function (e) {
  let currIndex = TRACK_LIST_INDEX;
  if (!currIndex) {
    TRACK_LIST_INDEX = MUSIC_TRACK_LIST.length - 1;
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
  } else {
    $(".track-list-container")
      .find("div")
      .eq(TRACK_LIST_INDEX)
      .removeClass("active");
    if (TRACK_LIST_INDEX > 0) setTrackListIndex(currIndex - 1);
    else TRACK_LIST_INDEX = MUSIC_TRACK_LIST.length - 1;
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
  }
});

$(".music-player-forward").click(function (e) {
  let currIndex = TRACK_LIST_INDEX;
  if (!currIndex) {
    TRACK_LIST_INDEX = 1;
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
  } else {
    $(".track-list-container")
      .find("div")
      .eq(TRACK_LIST_INDEX)
      .removeClass("active");
    if (TRACK_LIST_INDEX < MUSIC_TRACK_LIST.length - 1)
      setTrackListIndex(currIndex + 1);
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
  }
});

$(".music-player-seeker-range").on("input", function (e) {
  e.preventDefault();
  $(".music-player-seeker-current-time").text(calcTime(e.target.value));
  $("#music-player-audio")[0].currentTime = e.target.value;
});

$("#music-player-audio").on("timeupdate", function (e) {
  e.preventDefault();
  $(".music-player-seeker-range").attr(
    "value",
    Math.floor($(this).prop("currentTime"))
  );
  if (document.getElementsByClassName("music-player-seeker-range")[0]) {
    document.getElementsByClassName("music-player-seeker-range")[0].value =
      Math.floor($(this).prop("currentTime"));
  }
  $(".music-player-seeker-current-time").text(
    calcTime($(".music-player-seeker-range").attr("value"))
  );
});

$("#music-player-audio").on("ended", function () {
  $(".track-list-container")
    .find("div")
    .eq(TRACK_LIST_INDEX)
    .removeClass("active");
  if (TRACK_LIST_INDEX < MUSIC_TRACK_LIST.length - 1)
    setTrackListIndex(currIndex + 1);
  else setTrackListIndex(0);
  $(".track-list-container")
    .find("div")
    .eq(TRACK_LIST_INDEX)
    .addClass("active");
});

$(document).ready(function () {
  setTrackListIndex(
    MUSIC_TRACK_LIST.findIndex((track) => {
      return $("#music-player-audio").attr("src").includes(track);
    })
  );
  if (TRACK_LIST_INDEX >= 0)
    $(".track-list-container")
      .find("div")
      .eq(TRACK_LIST_INDEX)
      .addClass("active");

  if ($("#music-player-audio").attr("src") === "") {
    $(".music-player-seeker-range").prop("disabled", true);
  } else {
    $(".music-player-seeker-range").prop("disabled", false);
  }
});

if ($("#music-player-audio").prop("readyState") > 0) {
  $(".music-player-seeker-duration").text(
    calcTime($("#music-player-audio").prop("duration"))
  );
  $(".music-player-seeker-range").attr(
    "max",
    $("#music-player-audio").prop("duration")
  );
} else {
  $("#music-player-audio").on("loadedmetadata", function () {
    $(".music-player-seeker-duration").text(
      calcTime($("#music-player-audio").prop("duration"))
    );
    $(".music-player-seeker-range").attr(
      "max",
      $("#music-player-audio").prop("duration")
    );
  });
}
