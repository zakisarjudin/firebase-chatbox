import DOM from "./scripts/dom.js";
import "./css/style.css";

const dom = new DOM();
dom.listenUserRegister();
dom.listenChannelChange();
dom.listenChatForm();
