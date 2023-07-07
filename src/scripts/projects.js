axios.get("/data/projects.json").then((res) => {
  const PROJECTS = res.data.sort((a, b) => a.title.localeCompare(b.title));

  PROJECTS.forEach((proj) => {
    const clone = $($("#project-template").html());
    $(".project-label", clone).text(proj.title);
    $(".projects-container").append(clone);

    $(clone).on("dblclick", function () {
      window.open(proj.url);
    });
  });
});
