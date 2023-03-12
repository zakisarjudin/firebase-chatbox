import model from "./model.js";
import { createCompletion } from "./openai.js";

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
    let loading = false;

    this.chat_form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!loading && this.chat_form.chat_text.value.length > 0) {
        loading = true;
        if (localStorage.username && localStorage.channel) {
          const channel = localStorage.channel;
          const data = {
            username: localStorage.username,
            chat_text: this.chat_form.chat_text.value.trim(),
          };

          model.addData(channel, data).then(() => {
            if (channel === "chatgpt") {
              const html = `<li class="chat-item "><span class="chat-text typing"><strong>AI:</strong> typing...</span> </li>`;
              setTimeout(() => {
                this.chat_content.innerHTML += html;
              }, 250);
              // const _typingId = model.addData(channel, {username: "AI", chat_text: "typing..."});

              createCompletion(this.chat_form.chat_text.value.trim())
                .then((response) => {
                  const choices = response.choices;
                  choices.forEach((choice) => {
                    const resp = {
                      username: "AI",
                      chat_text: choice.text.trim(),
                    };
                    document.querySelector(".typing").closest("li").remove();
                    model.updateData(channel, resp);
                    // model.updateData(channel, _typingId, resp);
                  });
                })
                .catch((err) => {
                  alert(err);
                  document.querySelector(".typing").closest("li").remove();
                });
            }

            this.chat_form.chat_text.value = "";
            loading = false;
          });
        } else if (!localStorage.username) {
          alert("sorry, let us know your name first");
          loading = false;
        } else {
          alert("please choose a group to start chat");
          loading = false;
        }
      } else if (loading) {
        alert("please wait...");
      } else {
        alert("you have left a blank form");
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

        const username = this.register_form.username.value.trim().toLowerCase();

        if (username && username != "ai") {
          localStorage.setItem("username", username);

          register_wrapper.classList.add("d-none");
          this.username.innerHTML = localStorage.username;
        } else {
          alert("please choose another username");
        }
      });
    }
  }

  listenChannelChange() {
    // if channel exist or selected
    if (localStorage.channel) {
      const channels = document.querySelectorAll(".channel");

      channels.forEach((channel) => {
        if (channel.getAttribute("data-id") == localStorage.channel) {
          channel.classList.add("active");
          this.chat_content.innerHTML = "";
          this.model.subscribe(localStorage.channel);
        }
      });
    }

    // start listening if channel changed
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
