<script>
import { useUserStore } from "../stores/user";
import { useRoomStore } from "../stores/room";
import {ref} from "vue";

export default {
  setup() {
    const userStore = useUserStore();
    const roomStore = useRoomStore();
    // Auth
    // userStore.isAuth();
    // create room
    let connection = null;
    // roomStore.create();

    let message = ref("");
    let isConnected = ref(false);
    return {
      userStore,
      roomStore,
      connection,
      message,
      isConnected,
    };
  },
  methods: {
    createRoom: function () {
      this.roomStore.create();
    },
    connect: function () {
      let roomStore = this.roomStore;
      console.log("Starting connection to WebSocket Server");
      this.connection = new WebSocket(
        "ws://localhost:8080/start?id=1&room_id=" + this.roomStore.room.room_id
      );
      this.connection.onmessage = function (event) {
        console.log(event.data);
        console.log(event);
        console.log(roomStore);
        roomStore.addMessage(event.data);
      };
      this.isConnected = true;
    },
    sendMessage: function () {
      console.log(this.roomStore.room.connection);
      this.connection.send(this.message);
      this.message = "";
    },
  },
};
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-center align-items-center">
          <div class="card w-100 shadow">
            <div class="card-body">
              <div class="container">
                <div class="row">
                  <!--                  <div class="col-12 col-lg-3">s</div>-->
                  <div class="col-12 col-lg-12">
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="d-flex justify-content-between align-items-center">
                        <p class="tx-12">ROOM ID :</p>
                        <input
                          v-model="roomStore.room.room_id"
                          class="form-control"
                        />
                      </div>
                      <div class="d-flex align-items-center">
                        <div v-if="!isConnected">
                          <button class="btn btn-outline-info" @click="createRoom()">
                            Create
                          </button>
                          <button class="btn btn-outline-primary" @click="connect()">Connect</button>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div class="chat-area">
                      <div
                        class="chat-user d-flex justify-content-start align-items-center"
                      >
                        <div>
                          <p class="tx-12">Petter</p>
                          <div class="d-flex justify-content-start">
                            <p class="chat-other-user-message">
                              Hi I am Petter, Nice to meet you.
                            </p>
                          </div>
                          <p class="tx-12 text-black-50 text-start">
                            16:00 pm Jan 13, 2023
                          </p>
                        </div>
                      </div>
                      <div
                        class="chat-user d-flex justify-content-end align-items-center"
                      >
                        <div>
                          <div class="d-flex justify-content-end">
                            <p class="chat-user-message">Hi I am Brian</p>
                          </div>
                          <p class="tx-12 text-black-50 text-end">
                            16:00 pm Jan 13, 2023
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      class="d-flex justify-content-between align-items-center mt-4"
                    >
                      <input v-model="message" class="message-input w-100 form-control" />
                      <button @click="sendMessage()" class="btn btn-primary">
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

p {
  margin-bottom: 5px !important;
}
.container .card {
  max-width: unset;
  border-radius: 10px;
  border-color: transparent;
}

.chat-area {
  min-height: 500px;
}
.chat-other-user-message {
  max-width: 550px;
  padding: 5px 10px 5px 10px;
  border-radius: 5px;
  background-color: rgba(104, 172, 239, 0.25);
}
.chat-user-message {
  max-width: 500px;
  padding: 5px 10px 5px 10px;
  border-radius: 5px;
  background-color: #ccffcb;
}
.message-input {
  margin-right: 10px;
}
</style>
