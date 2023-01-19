import { defineStore } from "pinia/dist/pinia.mjs";
import { useErrorsStore } from "./errors";

export const useRoomStore = defineStore("room", {
  state: () => {
    return {
      room: {
        room_id: null,
        room_name: "",
        messages: [],
        connection: null,
      },
    };
  },
  getters: {},
  actions: {
    create: async function () {
      let errorsStore = useErrorsStore();
      let currentTime = Date.now();
      try {
        let res = await fetch(
          "http://localhost:8080/new?room_name=Room-" + currentTime,
          {
            method: "GET",
            credentials: "include",
          }
        );
        let data = await res.json();
        if (!res.ok && data.status !== "ok") {
          let err = errorsStore.createErr(
            "Unauthorized",
            data.message,
            "bg-warning"
          );
          errorsStore.addErr(err);
        } else {
          this.room.room_id = data.room_id;
          this.room.room_name = data.room_name;
          console.log("ok");
        }
      } catch (e) {
        console.log(e);
        errorsStore.addServerErr();
      }
    },
    waitForConnection: function (callback, interval) {
      if (this.connection.readyState === 1) {
        callback();
      } else {
        var that = this;
        // optional: implement backoff for interval here
        setTimeout(function () {
          that.waitForConnection(callback, interval);
        }, interval);
      }
    },
    addMessage: function (message) {
      this.room.messages.push(message);
    },
  },
});
