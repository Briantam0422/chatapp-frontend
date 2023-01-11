<script setup></script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-center align-items-center">
          <div class="card shadow">
            <div class="card-body">
              <h1>Login</h1>
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
              <button id="login" class="w-100 btn btn-primary">Login</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.container .card {
  min-width: 500px;
  max-width: 500px;
}

.container .card .card-body {
  padding: 50px;
}
</style>