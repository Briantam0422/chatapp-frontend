<script>
import { useErrorsStore } from "../stores/errors";
import { useUserStore } from "../stores/user";
import { useRoomStore } from "../stores/room";
import { ref } from "vue";
import api_request from "../utils/api_request";

export default {
  setup() {
    const errorsStore = useErrorsStore();
    const userStore = useUserStore();
    const roomStore = useRoomStore();
    let connection = null;
    let message = ref("");
    let isConnected = ref(false);
    return {
      errorsStore,
      userStore,
      roomStore,
      connection,
      message,
      isConnected,
    };
  },
  methods: {
    createRoom: async function () {
      await this.roomStore.create();
      let message = this.errorsStore.createErr(
        "System Message",
        "You have created a room. You can share the room id with your friends.",
        "bg-info"
      );
      this.errorsStore.addErr(message);
      this.connect();
    },
    connect: function () {
      if (
        this.roomStore.room.room_id === "" ||
        this.roomStore.room.room_id === null ||
        this.roomStore.room.room_id === undefined
      ) {
        let err = this.errorsStore.createErr(
          "System Message",
          "Please create a room or enter a Room ID first.",
          "bg-info"
        );
        this.errorsStore.addErr(err);
        return;
      }
      let errorsStore = this.errorsStore;
      let roomStore = this.roomStore;
      let container = this.$refs.chat;
      try {
        const url = api_request.getWebSocketUrl("start?id=");
        this.connection = new WebSocket(
          "ws://" +
            url +
            this.userStore.user.id +
            "&room_id=" +
            this.roomStore.room.room_id +
            "&username=" +
            this.userStore.user.username
        );
        this.connection.onmessage = function (event) {
          roomStore.addMessage(JSON.parse(event.data));
          container.scrollTop = container.scrollHeight - container.clientHeight;
        };
        this.connection.onerror = function () {
          let err = errorsStore.createErr(
            "Error Message",
            "Connection failed. Please try again",
            "bg-warning"
          );
          errorsStore.addErr(err);
        };
        this.connection.onclose = function () {
          roomStore.clearRoom;
        };
        let message = this.errorsStore.createErr(
          "System Message",
          "You have connected to a room. Enjoy!",
          "bg-success text-white"
        );
        this.errorsStore.addErr(message);
        this.isConnected = true;
      } catch (e) {
        let err = this.errorsStore.createErr(
          "Error Message",
          "Create room failed",
          "bg-warning"
        );
        this.errorsStore.addErr(err);
      }
    },
    disconnect: function () {
      try {
        this.connection.close();
        let err = this.errorsStore.createErr(
          "System Message",
          "You leave the room.",
          "bg-success text-white"
        );
        this.errorsStore.addErr(err);
        this.isConnected = false;
      } catch (e) {
        this.errorsStore.addServerErr();
      }
    },
    sendMessage: function () {
      if (this.isConnected) {
        if ( this.message === '' ) return
        try {
          this.connection.send(this.message);
          this.message = "";
        } catch (e) {
          this.errorsStore.addServerErr();
        }
      } else {
        let err = this.errorsStore.createErr(
          "System Message",
          "Please connect a room first",
          "bg-info"
        );
        this.errorsStore.addErr(err);
      }
    },
    logout: function () {
      this.userStore.logout();
      this.$router.push("/login");
    },
    chatAreaScrollToBottom: function () {
      var container = this.$el.querySelector("#chat-area");
      container.scrollTop = container.scrollHeight;
    },
  },
};
</script>

<template>
  <div class="card shadow mb-4">
    <div class="card-body">
      <div class="row justify-content-between align-items-end">
        <div class="col-sm-12 col-md-6">
          <p class="tx-12">ROOM ID :</p>
          <input v-model="roomStore.room.room_id" class="form-control" />
        </div>
        <div class="col-sm-12 col-md-6 mt-2">
          <div class="d-flex flex-wrap align-items-center">
            <div v-if="!isConnected">
              <button class="btn btn-outline-info m-r-10" @click="createRoom()">
                Create Room
              </button>
              <button class="btn btn-outline-primary m-r-10" @click="connect()">
                Connect
              </button>
            </div>
            <div v-if="isConnected">
              <button
                @click="disconnect()"
                class="btn btn-outline-primary m-r-10"
              >
                Disconnect
              </button>
            </div>
            <button class="btn btn-outline-secondary" @click="logout()">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="card w-100 shadow">
    <div class="card-body pd-10">
      <div class="row">
        <div class="col-12 col-lg-12">
          <div ref="chat" id="chat-area" class="chat-area">
            <div v-if="roomStore.room.messages.length > 0">
              <div
                  v-for="(message, index) in roomStore.room.messages"
                  :key="index"
              >
                <div
                    v-if="
                      message.client_id.toString() ===
                      userStore.user.id.toString()
                    "
                >
                  <div
                      class="chat-user d-flex justify-content-end align-items-center"
                  >
                    <div>
                      <div class="d-flex justify-content-end">
                        <p class="chat-user-message">
                          {{ message.message }}
                        </p>
                      </div>
                      <p class="tx-12 text-black-50 text-end">
                        {{ message.time }}
                      </p>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div
                      class="chat-user d-flex justify-content-start align-items-center m-t-10"
                  >
                    <div>
                      <p class="tx-12">{{ message.username }}</p>
                      <div class="d-flex justify-content-start">
                        <p class="chat-other-user-message">
                          {{ message.message }}
                        </p>
                      </div>
                      <p class="tx-12 text-black-50 text-start">
                        {{ message.time }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="mt-4">
              <p class="text-bold text-center text-secondary font-bold">
                Room Creation Instruction
              </p>
              <p class="text-center text-secondary">
                1. Click "Create Room" button to create a new room.
              </p>
              <p class="text-center text-secondary">
                2. Invite your friends by giving them the room ID.
              </p>
              <p class="text-center text-secondary">
                3. Wait your friends to connect.
              </p>
              <hr />
              <p class="text-bold text-center text-secondary font-bold">
                Room Connection Instruction
              </p>
              <p class="text-center text-secondary">
                1. Get a room ID from your friends.
              </p>
              <p class="text-center text-secondary">
                2. Enter a room ID and click "Connect" Button.
              </p>
              <p class="text-center text-secondary">3. Start conversation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="fixed-bottom mb-5 mx-5">
    <div class="d-flex justify-content-between align-items-center">
      <input
          v-model="message"
          v-on:keyup.enter="sendMessage()"
          class="message-input w-100 form-control"
      />
      <button @click="sendMessage()" class="btn btn-primary">Send</button>
    </div>
  </div>

</template>

<style>
p {
  margin-bottom: 5px !important;
}
.container {
  max-height: 100vh;
}
.card {
  max-width: unset;
  border-radius: 10px;
  border-color: transparent;
  border: 0px;
  overflow: auto;
  margin-bottom: 50px;
}

.chat-area {
  min-height: 65vh;
  height: 100%;
  max-height: 65vh;
  overflow: auto;
}
.chat-other-user-message {
  /*max-width: 550px;*/
  padding: 5px 10px 5px 10px;
  border-radius: 5px;
  background-color: rgba(104, 172, 239, 0.25);
}
.chat-user-message {
  /*max-width: 500px;*/
  padding: 5px 10px 5px 10px;
  border-radius: 5px;
  background-color: #ccffcb;
}
.message-input {
  margin-right: 10px;
}
</style>
