import model from "./model.js";

class DOM {
  constructor() {
    this.model = new model();
    this.chat_form = document.querySelector(".chat-form");
    this.channel_list = document.querySelector(".category-list");
    this.chat_content = document.querySelector(".chat-content");
    this.register_form = document.querySelector(".register-form");
    this.username = document.querySelector(".username");
  }

  async listenChatForm() {
    this.chat_form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (this.chat_form.chat_text.value.length > 0) {
        if (localStorage.username && localStorage.channel) {
          const channel = localStorage.channel;
          const data = {
            username: localStorage.username,
            chat_text: this.chat_form.chat_text.value.trim(),
          };

          model.addData(channel, data);
          this.chat_form.chat_text.value = "";
        } else if (!localStorage.username) {
          alert("sorry, let us know your name first");
        } else {
          alert("please choose a group to start chat");
        }
      }
    });
  }

  listenUserRegister() {
    const register_wrapper = document.querySelector(".register-wrapper");

    if (localStorage.username) {
      register_wrapper.classList.add("d-none");
      this.username.innerHTML = localStorage.username;
    } else {
      this.register_form.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = this.register_form.username.value.trim();
        if (username) {
          localStorage.setItem("username", username);

          register_wrapper.classList.add("d-none");
          this.username.innerHTML = localStorage.username;
        }
      });
    }
  }

  listenChannelChange() {
    this.channel_list.addEventListener("click", (e) => {
      const active_channel = document.querySelector(".active");
      if (e.target.tagName === "LI") {
        if (active_channel) active_channel.classList.remove("active");
        const channel = e.target.textContent;
        localStorage.setItem("channel", channel);
        e.target.classList.add("active");
        // listen to the channel
        // this.#listenChatContent(channel); // deprecated, can only run once
        this.chat_content.innerHTML = "";
        this.model.subscribe(channel);
      }
    });
  }

  async #listenChatContent(channel) {
    if (localStorage.channel) {
      this.chat_content.innerHTML = "";
      const snapshots = await this.model.subscribe(channel);
      snapshots.forEach((snapshot) => {
        const data = snapshot.doc.data();
        const time = data.created_at.toDate().toString().substr(4, 20);
        const _class = data.username == localStorage.username ? "chat-right" : "";
        const html = `<li class="chat-item ${_class}"><span class="chat-text"><strong>${data.username}:</strong> ${data.chat_text}</span> <span class="chat-time">${time}</span></li>`;
        this.chat_content.innerHTML += html;
      });
    }
  }
}

export default DOM;
