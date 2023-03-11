import DOM from "./scripts/dom.js";
import "./css/style.css";

const dom = new DOM();
dom.listenUserRegister();
dom.listenChannelChange();
dom.listenChatForm();

setInterval(() => {
  const element = document.querySelector(".chat-container");
  element.scroll({
    top: element.scrollHeight,
    behavior: "smooth",
  });
}, 100);
