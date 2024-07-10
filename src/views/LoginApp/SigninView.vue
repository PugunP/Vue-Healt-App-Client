<script>
import axios from "axios";
import { SIGNIN } from "@/APIGate";
export default {
  name: "SinginView",
  data() {
    return {
      formData: {
        email: "",
        password: "",
      },
    };
  },
  created() {
    // this.checkToken();
  },
  methods: {
    async SIGN_IN() {
      try {
        const res = await axios({
          method: "post",
          url: `${SIGNIN}`,
          data: {
            email: this.formData.email,
            password: this.formData.password,
          },
        });
        if (res.status != 200) {
          console.log(res.data);
          console.log(res.status);
        } else {
          console.log(res.data);
          console.log(res.status);
          localStorage.setItem("accessToken", res.data.accessToken);
          this.checkToken();
        }
      } catch (error) {
        console.log(error);
      } 
    },
    checkToken() {
      const existToken = localStorage.getItem("accessToken");
      console.log(existToken);
      if (existToken) {
        this.$router.push("/home");
      } else {
        this.$router.push("/SIGNIN");
      }
    },
  },
};
</script>

<template>
  <section class="page-container">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
      <a
        class="flex m-2 items-center mb-2 text-3xl font-semibold text-gray-900"
      >
        <img class="w-auto h-10 mr-2" src="/KMITL_PCC.png" />
        | 
        Sign in
      </a>
      <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
          >
            Account
          </h1>
          <form class="space-y-4 md:space-y-6" 
          @submit.prevent="SIGN_IN"
          >
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 e"
                >Your email</label
              >
              <input
                v-model="formData.email"
                v-on:keyup.enter="SIGN_IN()"
                type="email"
                name="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="e-mail"
                required=""
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Password</label
              >
              <input
                v-model="formData.password"
                v-on:keyup.enter="SIGN_IN()"
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required=""
              />
            </div>

            <button
              @click="submit"
              class="w-full text-white bg-black hover:bg-indigo-950 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Sign in
            </button>
            <p class="text-sm font-light text-gray-600">
              Don’t have an account yet?
              <router-link to="/signup"
                ><a class="font-medium text-indigo-800 hover:underline"
                  >Sign up</a
                ></router-link
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style>

</style>
