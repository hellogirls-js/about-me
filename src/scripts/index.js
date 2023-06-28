async function getPartial(type) {
    const partial = await axios.get(`/partial/${type}`);
    return partial.data;
}

function getDeviceLayout() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    if (aspectRatio >= 1) {
        getPartial("desktop").then(function(partial) {
            $("#container").html(partial);
        }).error(error => console.error(error));
    } else {
        getPartial("mobile").then(function(partial) {
            $("#container").html(partial);
        }).error(error => console.error(error));
    }
}

$(document).ready(function() {
    getDeviceLayout();
});

$(window).resize(function() {
    getDeviceLayout();
});