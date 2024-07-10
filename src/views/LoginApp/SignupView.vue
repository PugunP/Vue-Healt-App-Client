<template>
  <div class="page-container flex items-center justify-center min-h-screen">
    <div class="flex flex-col items-center justify-center mx-auto">
      <a
        class="flex m-2 items-center mb-2 text-3xl font-semibold text-gray-900"
      >
        <img class="w-auto h-10 mr-2" src="/KMITL_PCC.png" />
        | Sign Up
      </a>
      <div class="bg-white p-3 shadow-sm hover:shadow rounded-xl">
        <div class="text-gray-700">
          <div class="grid md:grid-cols-2 text-sm">
            <div class="px-4 py-2 font-semibold">
              Email
              <input
                type="email"
                v-model="formData.email"
                name="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Email"
                required=""
              />
            </div>
            <div class="px-4 py-2 font-semibold">
              Password
              <input
                type="password"
                v-model="formData.password"
                name="password"
                id="password"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Password"
                required=""
              />
            </div>
            <div class="px-4 py-2 font-semibold">
              First name
              <input
                type="email"
                v-model="formData.firstname"
                name="firstname"
                id="firstname"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="First name"
                required=""
              />
            </div>
            <div class="px-4 py-2 font-semibold">
              Last name
              <input
                type="lastname"
                v-model="formData.lastname"
                name="lastname"
                id="lastname"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Last name"
                required=""
              />
            </div>
            <div class="px-4 py-2 font-semibold">
              Phone number
              <input
                type="phoneNo"
                v-model="formData.phoneNo"
                name="phoneNo"
                id="phoneNo"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Phone number"
                required=""
              />
            </div>
            <div class="px-4 py-2 font-semibold">
              ID card
              <input
                type="idCard"
                v-model="formData.idCard"
                name="idCard"
                id="idCard"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="ID card"
                required=""
              />
            </div>
            <div class="px-4 py-2 font-semibold">
              Birthdate
              <input
                type="date"
                v-model="formData.birthdate"
                name="birthdate"
                id="birthdate"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Birthdate"
                required=""
              />
            </div>
            <div class="flex px-4 py-2 font-semibold text-center">
              <a class="flex items-center">Gender</a>

              <label class="inline-flex items-center ml-5">
                <input
                  type="radio"
                  class="form-radio"
                  name="accountType"
                  v-model="formData.gender"
                  :value="true"
                />
                <span class="ml-2">Male</span>

                <input
                  type="radio"
                  class="form-radio ml-5"
                  name="accountType"
                  v-model="formData.gender"
                  :value="false"
                />
                <span class="ml-2">Female</span>
              </label>
            </div>
          </div>
          <button
            v-on:click="SIGN_UP()"
            class="w-full text-white bg-black hover:bg-indigo-950 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Sign Up
          </button>
          <p
            class="text-sm font-light text-gray-500 dark:text-gray-400 px-4 py-2"
          >
            Already have an account?
            <router-link to="/signin"
              ><a class="font-medium text-indigo-800 hover:underline"
                >Sign in here</a
              ></router-link
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SIGNUP } from "@/APIGate";
import axios from "axios";
export default {
  name: "SingupView",
  data() {
    return {
      formData: {
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        phoneNo: "",
        gender: null,
        idCard: "",
        birthdate: "",
      },
    };
  },
  

  methods: {
    SIGN_UP() {
      axios({
        method: "post",
        url: `${SIGNUP}`,
        data: {
          email: this.formData.email,
          password: this.formData.password,
          firstname: this.formData.firstname,
          lastname: this.formData.lastname,
          phoneNo: this.formData.phoneNo,
          gender: this.formData.gender,
          idCard: this.formData.idCard,
          birthdate: this.formData.birthdate,
        },
      })
        .then((res) => {
          this.$router.push("/signin");
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
        this.formData.gender = this.formData.gender === 'true';
    },
  },
};
</script>

<style>

</style>
