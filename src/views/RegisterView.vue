<script>
import { useCookies } from "vue3-cookies";
import { ref } from "vue";
import { useUserStore } from "../stores/user";
import { useErrorsStore } from "../stores/errors";
import ServerErrorToast from "../components/toast/ServerErrorToast.vue";

export default {
  components: { ServerErrorToast },
  setup() {
    const { cookies } = useCookies();
    const errorsStore = useErrorsStore();
    const userStore = useUserStore();
    let errs = errorsStore.errs;
    let username = ref();
    let password = ref();

    return {
      errs,
      cookies,
      userStore,
      errorsStore,
      username,
      password,
    };
  },
  methods: {
    Register() {

    },
  },
};
</script>

<template>
  <div v-if="errs.length > 0">
    <div v-for="(err, index) in errs" :key="index">
      <ServerErrorToast :err="err"></ServerErrorToast>
    </div>
  </div>
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
                <h5 class="text-primary text-bold">Registration</h5>
              </div>
              <div class="form mb-5 mt-4">
                <div class="mb-3">
                  <label class="form-label" for="username"> Username </label>
                  <input
                    id="username"
                    name="username"
                    class="form-control"
                    v-model="username"
                  />
                </div>
                <div>
                  <label class="form-label" for="password"> Password </label>
                  <input
                    id="password"
                    name="password"
                    class="form-control"
                    v-model="password"
                  />
                </div>
              </div>
              <button
                @click="register()"
                id="login"
                class="w-100 btn btn-primary mb-2"
              >
                Register
              </button>
              <RouterLink class="w-100 text-center btn btn-link" to="login">
                Already have an account? Sign in
              </RouterLink>
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

<style></style>
