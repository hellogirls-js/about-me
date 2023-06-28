document.onload = function() {
    async function getPartial(type) {
        const partial = await axios.get(`/partial/${id}`);
        return partial.data;
    }

    const aspectRatio = window.innerWidth / window.innerHeight;
    if (aspectRatio >= 1) {
        getPartial("desktop").then(function(partial) {
            $("#container").html(partial);
        }).error(error => console.error(error));
    } else {
        $("#container").html("mobile");
    }
};