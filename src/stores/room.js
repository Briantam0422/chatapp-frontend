import { defineStore } from "pinia/dist/pinia.mjs";
import { useErrorsStore } from "./errors";
import api_request from "../utils/api_request";
import RequestMethodEnum from "../Enums/RequestMethodEnum";

export const roomObject = {
  room_id: null,
  room_name: "",
  messages: [],
  connection: null,
};

export const useRoomStore = defineStore("room", {
  state: () => {
    return {
      room: roomObject,
    };
  },
  getters: {},
  actions: {
    clearRoom: function () {
      this.room.room_id = null;
      this.room.room_name = "";
      this.room.messages = [];
      this.room.connection = null;
    },
    create: async function () {
      let errorsStore = useErrorsStore();
      let currentTime = Date.now();
      let params = { room_name: "Room-" + currentTime };
      params = api_request.setParams(params);
      const data = await api_request.request({
        url: "new?room_name",
        method: RequestMethodEnum.GET,
        params,
      });
      if (data) {
        this.room.room_id = data.room_id;
        this.room.room_name = data.room_name;
        let err = errorsStore.createErr(
          "System Message",
          "Successfully create a room",
          "bg-success text-white"
        );
        errorsStore.addErr(err);
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
