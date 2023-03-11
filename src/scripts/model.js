import { firestore } from "./firebase.js";
import db from "./firebase.js";

class Model {
  constructor() {
    this.subscribed = [];
  }

  static async getAllData(collection) {
    const q = firestore.query(firestore.collection(db, collection), firestore.orderBy("created_at"));
    const querySnapshot = await firestore.getDocs(q);

    return querySnapshot.docs;
  }

  static async getData(collection, id) {
    const docRef = firestore.doc(db, collection, id);
    const docSnap = await firestore.getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return undefined;
    }
  }

  static async addData(collection, data = {}) {
    data.created_at = firestore.serverTimestamp();
    const docRef = await firestore.addDoc(firestore.collection(db, collection), data);
    console.log("Document written with ID: ", docRef.id);
  }

  static async updateData(collection, id, data = {}) {
    const docRef = firestore.doc(db, collection, id);
    data.updated_at = firestore.serverTimestamp();

    await updateDoc(docRef, data);
    console.log("Document updated with ID:", id);
  }

  static async deleteData(collection, id) {
    await firestore.deleteDoc(firestore.doc(db, collection, id));
    console.log("Document deleted with ID:", id);
  }

  async subscribe(collection) {
    if (this.subscribed.length > 0) this.subscribed.forEach((unsub) => unsub());

    const q = firestore.query(firestore.collection(db, collection), firestore.orderBy("created_at"));
    const unsub = firestore.onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        if (data.created_at) {
          const time = data.created_at ? data.created_at.toDate().toString().substr(4, 20) : "unset";
          const _class = data.username == localStorage.username ? "chat-right" : "";
          const html = `<li class="chat-item ${_class}"><span class="chat-text"><strong>${data.username}:</strong> ${data.chat_text}</span> <span class="chat-time">${time}</span></li>`;
          document.querySelector(".chat-content").innerHTML += html;
          // set auto scroll
          const element = document.querySelector(".chat-container");
          element.scroll({
            top: element.scrollHeight,
            behavior: "smooth",
          });
        }
      });
    });

    this.subscribed.push(unsub);
  }
}

export default Model;
