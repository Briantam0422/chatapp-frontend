<script>
import { useCookies } from "vue3-cookies";
export default {
  setup() {
    const { cookies } = useCookies();
    return {
      cookies,
    };
  },
  methods: {
    async login() {
      try {
        let input = {
          username: "brian",
          password: "12345",
        };
        let res = await fetch("http://localhost:8080/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify(input),
        });
        var data = await res.json();
        if (res.ok && data.status === "ok") {
          // console.log(data);
          if (data.token !== "") {
            this.cookies.set("token", data.token);
          }
          this.$router.push("/about");
        }
      } catch (e) {
        console.log("error login: ", e);
      }
    },
  },
};
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-center align-items-center">
          <div class="card shadow">
            <div class="card-body">
              <div class="text-center">
                <img
                  class="app-logo"
                  src="../assets/logo/chatapp_logo.png"
                  alt="chatapp_logo"
                />
                <p class="text-black-50">A Fast and Real Time Chat App</p>
              </div>
              <div class="form mb-5 mt-5">
                <div class="mb-3">
                  <label class="form-label" for="username"> Username </label>
                  <input id="username" name="username" class="form-control" />
                </div>
                <div>
                  <label class="form-label" for="password"> Password </label>
                  <input id="password" name="password" class="form-control" />
                </div>
              </div>
              <button
                @click="login()"
                id="login"
                class="w-100 btn btn-primary mb-2"
              >
                Login
              </button>
              <button class="w-100 text-center btn btn-link">
                Don't have an Account? Create One Now
              </button>
              <button
                class="w-100 btn btn-link text-black-50 text-center tx-12"
              >
                Terms and Privacy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.container .card {
  max-width: 500px;
}

.container .card .card-body {
  padding: 50px;
}

.app-logo {
  width: 100%;
  max-width: 150px;
}

@media (max-width: 500px) {
  .container .card .card-body{
    padding: 25px;
  }
}
</style>