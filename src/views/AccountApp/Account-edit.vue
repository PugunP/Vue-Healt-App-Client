<script>
import { UPDATEME } from "@/APIGate";
import axios from "axios";
import dayjs from "dayjs";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  name: "account-Edit",
  components: { VueDatePicker },
  props: {},
  data() {
    return {
      formData: JSON.parse(this.$route.query.profileData),
      birthdateUpgrade: "",
    };
  },
  created() {
    this.editAccount;
    console.log(this.formData);
  },
  mounted() {
    this.birthdateUpgrade = dayjs(this.formData.birtdate).format("YYYY-MM-DD");
  },
  methods: {
    editAccount() {
      console.log(this.formData);
      if (this.formData.idCard != "" && this.formData.idCard != null) {
        console.log("ใส่รหัสประจำตัวสำเร็จ");
        if (this.formData.firstname != "" && this.formData.firstname != null) {
          console.log("ใส่ชื่อจริงสำเร็จแล้ว");
          if (this.formData.lastname != "" && this.formData.lastname != null) {
            console.log("ใส่นามสกุลสำเร็จแล้ว");
            // เงื่อนไขเพศถูกลบออก
            {
              console.log("ใส่ประวัติแพ้ยาสำเร็จแล้ว");
              if (
                this.birthdateUpgrade != "" &&
                this.birthdateUpgrade != "Invalid Date"
              ) {
                this.formData.birthdate = this.birthdateUpgrade;
                console.log(this.formData);
                axios({
                  method: "patch",
                  url: `${UPDATEME}`,
                  headers: {
                    Authorization:
                      "Bearer " + localStorage.getItem("accessToken"),
                  },
                  data: this.formData,
                })
                  .then((res) => {
                    this.$router.push("/account-info");
                    this.profileData = res.data.user;
                    this.birthDate = dayjs(this.profileData.birthdate).format(
                      "YYYY-MM-DD"
                    );
                    console.log(res.data);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                // console.log(this.formData);
              } else {
                alert("กรุณาใส่วันเดือนปีเกิดของท่าน");
              }
            }
          } else {
            alert("กรุณาใส่นามสกุลของท่าน");
          }
        } else {
          alert("กรุณาใส่ชื่อจริงของท่าน");
        }
      } else {
        alert("กรุณาใส่เลขประจำตัวประชาชนของท่าน");
      }
    },
  },
};
</script>

<template>
  <div class="min-h-screen">
    <div class="container mx-auto my-5 p-5">
      <div class="md:flex no-wrap md:-mx-2">
        <!-- Left Side -->
        <div class="w-full md:w-3/12 md:mx-2">
          <!-- Profile Card -->
          <div class="bg-white p-3 hover:shadow mb-4 rounded-xl">
            <h1 class="text-gray-900 font-bold text-xl leading-8 my-1">
              ID : {{ formData._id }}
            </h1>
          </div>
          <!-- End of profile card -->
          <div class="my-4"></div>
          <!-- Friends card -->
          <div class="flex justify-center p-2">
            <button
              type="button"
              id="saveAccount"
              v-on:click="editAccount()"
              class="mt-4 focus:outline-none text-white bg-[#140A4B] hover:bg-[#140a4bc5] focus:ring-4 focus:ring-[#140a4bc5] font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-orange-700 dark:hover:bg-[#140a4bc5] dark:focus:ring-[#140a4bc5]"
            >
              บันทึก
            </button>
            <router-link to="/account-info">
              <button
                type="button"
                class="mt-4 focus:outline-none text-white bg-[#EB1851] hover:bg-[#eb1850c2] focus:ring-4 focus:ring-[#140a4bc5] font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-orange-700 dark:hover:bg-[#140a4bc5] dark:focus:ring-[#140a4bc5]"
              >
                ยกเลิก
              </button>
            </router-link>
          </div>
          <!-- End of friends card -->
        </div>
        <!-- Right Side -->
        <div class="w-full md:w-9/12 mx-2 h-64">
          <!-- Profile tab -->
          <!-- About Section -->
          <div class="bg-white p-4 shadow-sm hover:shadow rounded-xl">
            <div
              class="flex items-center space-x-2 font-semibold text-gray-900 leading-8"
            >
              <span clas="text-green-500">
                <svg
                  class="h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <span class="tracking-wide">About</span>
            </div>
            <div class="text-gray-700">
              <div class="grid md:grid-cols-2 text-lg">
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">
                    ชื่อจริง :
                    <i class="las la-asterisk" style="color: red"></i>
                  </div>
                  <div class="px-4 py-2">
                    <input
                      type="text"
                      name="firstname"
                      id="firstname"
                      class="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 px-4 py-2.5"
                      placeholder="ชื่อจริง"
                      required=""
                      v-model="formData.firstname"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">
                    นามสกุล :<i class="las la-asterisk" style="color: red"></i>
                  </div>
                  <div class="px-4 py-2">
                    <input
                      type="text"
                      name="lastname"
                      id="lastname"
                      class="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 px-4 py-2.5"
                      placeholder="นามสกุล"
                      required=""
                      v-model="formData.lastname"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">
                    รหัสบัตรประชาชน :<i
                      class="las la-asterisk"
                      style="color: red"
                    ></i>
                  </div>
                  <div class="px-4 py-2">
                    <input
                      type="email"
                      name="idCard"
                      id="idCard"
                      class="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 px-4 py-2.5"
                      placeholder=" รหัสบัตรประชาชน "
                      required=""
                      v-model="formData.idCard"
                    />
                  </div>
                </div>
                <div class="flex flex-cols-2">
                  <div class="px-4 py-2 font-semibold">
                    เพศ :<i class="las la-asterisk" style="color: red"></i>
                  </div>
                  <div class="flex justify-center mb-4 ml-auto mr-12">
                    <label class="inline-flex items-center">
                      <input
                        type="radio"
                        class="form-radio"
                        name="accountType"
                        value="true"
                        v-model="formData.gender"
                      />
                      <span class="ml-2">ชาย</span>
                    </label>
                    <label class="inline-flex items-center ml-6">
                      <input
                        type="radio"
                        class="form-radio"
                        name="accountType"
                        value="false"
                        v-model="formData.gender"
                      />
                      <span class="ml-2">หญิง</span>
                    </label>
                  </div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">
                    เบอร์โทรติดต่อ :
                    <i class="las la-asterisk" style="color: red"></i>
                  </div>
                  <div class="px-4 py-2">
                    <input
                      type="text"
                      name="Phone"
                      id="Phone"
                      class="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 px-4 py-2.5"
                      placeholder="เบอร์โทรติดต่อ"
                      required=""
                      v-model="formData.phoneNo"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">
                    อีเมล์ : <i class="las la-asterisk" style="color: red"></i>
                  </div>
                  <div class="px-4 py-2">
                    <a
                      ><input
                        type="email"
                        name="email"
                        id="email"
                        class="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 px-4 py-2.5"
                        placeholder=" อีเมล์ "
                        required=""
                        v-model="formData.email"
                    /></a>
                  </div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">
                    <div>
                      วันเกิด :
                      <i class="las la-asterisk" style="color: red"></i>
                    </div>
                  </div>
                  <div class="px-4 py-2">
                    <VueDatePicker
                      class="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 "
                      v-model="birthdateUpgrade"
                    ></VueDatePicker>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="flex items-center space-x-2 font-semibold text-gray-900 leading-8"
            >
              <span clas="text-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 3c2.131 0 4 1.73 4 3.702 0 2.05-1.714 4.941-4 8.561-2.286-3.62-4-6.511-4-8.561 0-1.972 1.869-3.702 4-3.702zm0-2c-3.148 0-6 2.553-6 5.702 0 3.148 2.602 6.907 6 12.298 3.398-5.391 6-9.15 6-12.298 0-3.149-2.851-5.702-6-5.702zm0 8c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm8 6h-3.135c-.385.641-.798 1.309-1.232 2h3.131l.5 1h-4.264l-.344.544-.289.456h.558l.858 2h-7.488l.858-2h.479l-.289-.456-.343-.544h-2.042l-1.011-1h2.42c-.435-.691-.848-1.359-1.232-2h-3.135l-4 8h24l-4-8zm-12.794 6h-3.97l1.764-3.528 1.516 1.528h1.549l-.859 2zm8.808-2h3.75l1 2h-3.892l-.858-2z"
                  />
                </svg>
              </span>
              <span class="tracking-wide">ที่อยู่ส่วนบุคคล</span>
            </div>
            <div class="text-gray-700">
              <div class="grid md:grid-cols-2 text-lg">
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">บ้านเลขที่ :</div>
                  <div class="px-4 py-2">
                    <input
                      type="text"
                      name="บ้านเลขที่"
                      id="บ้านเลขที่"
                      class="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 px-4 py-2.5"
                      placeholder="บ้านเลขที่"
                      required=""
                      v-model="formData.address.houseNo"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">หมู่ :</div>
                  <div class="px-4 py-2">
                    <input
                      type="text"
                      name="mooo"
                      id="moo"
                      class="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 px-4 py-2.5"
                      placeholder="หมู่ : "
                      required=""
                      v-model="formData.address.moo"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">ซอย :</div>
                  <div class="px-4 py-2">
                    <input
                      type="text"
                      name="soi"
                      id="soi"
                      class="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 px-4 py-2.5"
                      placeholder="ซอย"
                      required=""
                      v-model="formData.address.soi"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">ถนน :</div>
                  <div class="px-4 py-2">
                    <input
                      type="text"
                      name="road"
                      id="road"
                      class="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 px-4 py-2.5"
                      placeholder="ถนน "
                      required=""
                      v-model="formData.address.road"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">ตำบล :</div>
                  <div class="px-4 py-2">
                    <input
                      type="text"
                      name="Tambon"
                      id="Tambon"
                      class="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 px-4 py-2.5"
                      placeholder="ตำบล  "
                      required=""
                      v-model="formData.address.subDistrict"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">อำเภอ :</div>
                  <div class="px-4 py-2">
                    <input
                      type="text"
                      name="district"
                      id="dixtrict"
                      class="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 px-4 py-2.5"
                      placeholder="อำเภอ"
                      required=""
                      v-model="formData.address.district"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">จังหวัด :</div>
                  <div class="px-4 py-2">
                    <input
                      type="text"
                      name="Province"
                      id="Province"
                      class="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 px-4 py-2.5"
                      placeholder="จังหวัด"
                      required=""
                      v-model="formData.address.province"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-4 py-2 font-semibold">รหัสไปรษณีย์ :</div>
                  <div class="px-4 py-2">
                    <input
                      type="text"
                      name="Postal code"
                      id="Postal code"
                      class="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 px-4 py-2.5"
                      placeholder="รหัสไปรษณีย์"
                      required=""
                      v-model="formData.address.postalCode"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End of about section -->

          <!-- Experience and education -->
          <div class="bg-white p-3 shadow-sm rounded-xl hover:shadow mt-4">
            <div class="m-1">
              <div
                class="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3"
              >
                <span class="tracking-wide">โรคประจำตัว</span>
              </div>
              <div class="list-inside space-y-2">
                <textarea
                  name=""
                  v-model="formData.noteDisease"
                  id=""
                  cols="30"
                  rows="10"
                  placeholder="โรคประจำตัว"
                  class="bg-gray-100 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 block h-40 w-full"
                ></textarea>
              </div>
            </div>

            <!-- End of Experience and education grid -->
          </div>

          <!-- End of profile tab -->
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.las.la-asterisk {
  font-size: 0.8em;
  /* หรือขนาดที่คุณต้องการ */
  vertical-align: middle;
  /* ถ้าคุณต้องการให้ตำแหน่งสูงเท่ากันกับข้อความ */
}

.account {
  display: grid;
  max-width: 960px;
  margin: 0 auto;
  border-radius: 24px;
  background-color: #64ccc5;
  height: 50vh;
  width: 100vh;

  .account-text {
    margin-top: 15px;
    margin-left: 15px;
    background: black;
    height: 50px;
    width: 200px;
    border-radius: 16px;

    // text-align: center;
    .account-edit {
      margin-top: 25px;
    }

    h1 {
      color: white;
    }
  }
}
</style>
