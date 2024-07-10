<template>
  <div class="">
    <div class="container mx-auto my-5 p-5">
      <div class="md:flex no-wrap md:-mx-2">
        <!-- Left Side -->
        <div class="w-full md:w-3/12 md:mx-2 mb-4 md:mb-0">
          <!-- Profile Card -->
          <div class="bg-white p-3 hover:shadow mb-4 rounded-xl">
            <h1 class="text-gray-900 font-bold text-xl leading-8 my-1">
              ID : {{ profileData._id }}
            </h1>
          </div>
          <!-- End of profile card -->
          <div class="my-4"></div>
          <!-- Friends card -->

          <div class="flex justify-center mt-4">
            <router-link :to="{
              name: 'account-edit',
              query: { profileData: JSON.stringify(profileData) },
            }">
              <button type="button"
                class="mt-4 focus:outline-none text-white bg-[#140A4B] hover:bg-[#140a4bc5] focus:ring-4 focus:ring-[#140a4bc5] font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-orange-700 dark:hover:bg-[#140a4bc5] dark:focus:ring-[#140a4bc5]">
                แก้ไขโปรไฟล์
              </button>
            </router-link>
          </div>
          <!-- End of friends card -->
        </div>
        <!-- Right Side -->
        <div class="w-full md:w-9/12 mx-2 h-64">
          <!-- Profile tab -->
          <!-- About Section -->
          <div class="bg-white p-3 shadow-sm rounded-xl hover:shadow mb-4">
            <div class="flex items-center space-x-2 font-semibold text-[#303030] leading-8">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <span class="tracking-wide text-xl">ข้อมูลส่วนตัว</span>
            </div>
            <div class="text-[#303030]">
              <div class="grid md:grid-cols-2 text-lg">
                <div class="grid grid-cols-2">
                  <div class="px-2 py-2 font-semibold ">ชื่อจริง :</div>
                  <div class="px-2 py-2 ">{{ profileData.firstname }}</div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-2 py-2 font-semibold">นามสกุล :</div>
                  <div class="px-2 py-2 ">{{ profileData.lastname }}</div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-2 py-2 font-semibold">รหัสบัตรประชาชน :</div>
                  <div class="px-2 py-2 ">{{ profileData.idCard }}</div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-2 py-2 font-semibold">เพศ :</div>
                  <div class="px-2 py-2 ">
                    {{
                      profileData.gender == null
                      ? ""
                      : profileData.gender
                        ? "ชาย"
                        : "หญิง"
                    }}
                  </div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-2 py-2 font-semibold">เบอร์โทรติดต่อ :</div>
                  <div class="px-2 py-2 ">{{ profileData.phoneNo }}</div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-2 py-2 font-semibold">อีเมล์ :</div>
                  <div class="px-2 py-2 ">
                    <a>{{ profileData.email }}</a>
                  </div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-2 py-2 font-semibold">วันเกิด :</div>
                  <div class="px-2 py-2 ">{{ birthDate }}</div>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path
                    d="M12 3c2.131 0 4 1.73 4 3.702 0 2.05-1.714 4.941-4 8.561-2.286-3.62-4-6.511-4-8.561 0-1.972 1.869-3.702 4-3.702zm0-2c-3.148 0-6 2.553-6 5.702 0 3.148 2.602 6.907 6 12.298 3.398-5.391 6-9.15 6-12.298 0-3.149-2.851-5.702-6-5.702zm0 8c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm8 6h-3.135c-.385.641-.798 1.309-1.232 2h3.131l.5 1h-4.264l-.344.544-.289.456h.558l.858 2h-7.488l.858-2h.479l-.289-.456-.343-.544h-2.042l-1.011-1h2.42c-.435-.691-.848-1.359-1.232-2h-3.135l-4 8h24l-4-8zm-12.794 6h-3.97l1.764-3.528 1.516 1.528h1.549l-.859 2zm8.808-2h3.75l1 2h-3.892l-.858-2z" />
                </svg>
              </span>
              <span class="tracking-wide text-xl">ที่อยู่ส่วนบุคคล </span>
            </div>
            <div class="text-[#303030]">
              <div class="grid md:grid-cols-2 text-lg">
                <div class="grid grid-cols-2">
                  <div class="px-2 py-2 font-semibold">บ้านเลขที่ :</div>
                  <div class="px-2 py-2 ">{{ profileAddress.houseNo || 'กรุณากรอกบ้านเลขที่' }}</div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-2 py-2 font-semibold">หมู่ :</div>
                  <div class="px-2 py-2 ">{{ profileAddress.moo || 'กรุณากรอกหมู่' }}</div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-2 py-2 font-semibold">ซอย :</div>
                  <div class="px-2 py-2 ">{{ profileAddress.soi || 'กรุณากรอกซอย' }}</div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-2 py-2 font-semibold">ถนน :</div> 
                  <div class="px-2 py-2 ">{{ profileAddress.road || 'กรุณากรอกถนน' }}</div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-2 py-2 font-semibold">ตำบล :</div>
                  <div class="px-2 py-2 ">
                    {{ profileAddress.subDistrict || 'กรุณากรอกตำบล' }}
                  </div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-2 py-2 font-semibold">อำเภอ :</div>
                  <div class="px-2 py-2 ">
                    {{ profileAddress.district || 'กรุณากรอกอำเภอ' }}
                  </div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-2 py-2 font-semibold">จังหวัด :</div>
                  <div class="px-2 py-2 ">
                    {{ profileAddress.province || 'กรุณากรอกจังหวัด' }}
                  </div>
                </div>
                <div class="grid grid-cols-2">
                  <div class="px-2 py-2 font-semibold">รหัสไปรษณีย์ :</div>
                  <div class="px-2 py-2 ">
                    {{ profileAddress.postalCode || 'กรุณากรอกรหัสไปรษณีย์' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End of about section -->

          <div class="my-4"></div>

          <!-- Experience and education -->
          <div class="bg-white p-3 shadow-sm rounded-xl hover:shadow">
            <div class="grid grid-cols-1">
              <div>
                <div class="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                  <span clas="text-green-500">
                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd"
                      clip-rule="evenodd">
                      <path
                        d="M15.131 5s1.692 2.025 2.268 2.711c1.213 1.461 1.573 2.31 1.601 4.161v10.128c-.015 1.094-.859 1.961-1.925 1.999-3.368.043-6.736.043-10.104 0-1.073-.038-1.964-.917-1.971-1.999v-10.134c.009-2.04.587-2.921 1.948-4.508.591-.689 1.941-2.358 1.941-2.358h6.242zm1.869 15h-10v2h10v-2zm-4-7h-2v2h-2v2h2v2h2v-2h2.023l-.023-2h-2v-2zm1.245-6h-4.457c-.634.787-1.224 1.522-1.489 1.857-1.026 1.3-1.293 1.807-1.299 3.143h10c-.013-1.346-.184-1.757-1.137-3.008-.268-.353-.929-1.157-1.618-1.992zm1.755-3h-8v-3c0-.552.448-1 1-1h6c.552 0 1 .448 1 1v3z" />
                    </svg>
                  </span>
                  <span class="tracking-wide text-[#303030] text-xl">โรคประจำตัว</span>
                </div>

                <div class="text-lg text-[#303030] rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5">
                  {{ profileData.noteDisease || 'ไม่มีโรคประจำตัว' }}
                </div>
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

<script>
import { GETME } from "@/APIGate";
import axios from "axios";
import dayjs from "dayjs";
export default {
  name: "Account-Info",
  data() {
    return {
      profileData: {},
      profileAddress: {},
      birthDate: "",
    };
  },
  created() {
    this.showInfo();
  },
  methods: {
    showInfo() {
      axios({
        method: "get",
        url: `${GETME}`,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
        .then((res) => {
          this.profileData = res.data.user;
          this.profileAddress = res.data.user.address;
          this.birthDate = dayjs(this.profileData.birthdate).format(
            "DD-MM-YYYY"
          );
          // console.log(this.profileData);
          // console.log(this.profileData.address);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style lang="scss">

</style>
