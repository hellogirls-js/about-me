function createMessage(data) {
  const clone = $($("#chatbox-msg-template").html());
  $(".chatbox-msg-name", clone).text(data.name);
  $(".chatbox-msg-content", clone).text(data.message);
  $(".chatbox-msg-timestamp", clone).text(
    dayjs(data.created).format("MMM D, YYYY")
  );
  $(".chatbox-msg-container").prepend(clone);
}

function getMessages(data) {
  if (data) {
    if (Array.isArray(data)) {
      for (const msg of data) {
        createMessage(msg);
      }
    } else {
      createMessage(data);
    }
  }
}

$("#msg-form").on("submit", function (e) {
  e.stopPropagation();
  e.preventDefault();
  let form = e.currentTarget;
  const ENDPOINT = form.action;
  const is_bot = $("#chatbox-is-bot");
  const user_name = $("#chatbox-user-name")
    .val()
    .replace(/(<([^>]+)>)/gi, "")
    .replace("'", "''");
  const user_msg = $("#chatbox-user-msg")
    .val()
    .replace(/(<([^>]+)>)/gi, "")
    .replace("'", "''");

  if (!is_bot.is(":checked") && user_name?.length && user_msg?.length) {
    const data = {
      bot: is_bot.prop("checked"),
      name: user_name,
      msg: user_msg,
    };
    axios
      .post(ENDPOINT, data)
      .then(() => {
        $("#chatbox-user-name").val("");
        $("#chatbox-user-msg").val("");
        axios
          .get("/chat/retrieve")
          .then(function (res) {
            getMessages(res.data[res.data.length - 1]);
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  } else {
    console.error("must be a human to submit a form");
  }
});

$(document).ready(function () {
  axios.get("/chat/retrieve").then(function (res) {
    getMessages(res.data);
  });
});
