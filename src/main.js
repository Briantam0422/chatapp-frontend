import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import "./assets/main.css";

import "./router/permission.js";

const app = createApp(App);
app.use(router);
app.use(createPinia());

app.mount("#app");
