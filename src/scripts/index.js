let CURRENT_LAYOUT;

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
});

$(window).resize(function () {
  getDeviceLayout();
});
