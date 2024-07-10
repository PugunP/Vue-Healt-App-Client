<script>
import {SEARCHUSERS,DELETEUSERS, GETALLUSERS } from '@/APIGate';
import axios from 'axios';
import Swal from "sweetalert2";


export default {
  name: 'user-component',
  data() {
    return {
      users: [],
      isModalVisible: false,
      infoModel: false,
      AddressModel: false,
      HealthModel: false,
      selectedUser: {},
      selectedAddress: {},
      selectedHealth: {},
      searchQuery: "",
      startIndex: 0,  // ช่วงของข้อมูลที่จะแสดง
      endIndex: 9,
    };
  },
  computed: {
    currentPage() {
      return Math.floor(this.startIndex / 10) + 1;
    },
    totalPages() {
      return Math.ceil(this.users.length / 10);
    },
    displayedPages() {
      const maxPages = 5; // Adjust as needed
      const currentPage = this.currentPage;
      const totalPages = this.totalPages;

      let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
      let endPage = Math.min(totalPages, startPage + maxPages - 1);

      if (endPage - startPage < maxPages - 1) {
        startPage = Math.max(1, endPage - maxPages + 1);
      }

      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    },
    sorteduser() {
      return this.users.slice().sort((a, b) => {
        if (a.status === b.status) {
          return new Date(a.datauser) - new Date(b.datauser);
        } else {
          return a.status ? 1 : -1;
        }
      });
    },
  },
  created() {
    this.getAllUser();
  },
  watch: {
    searchQuery(newVal, oldVal) {
      this.fetchDataFromApi(newVal);
    },
  },
  methods: {
    async fetchDataFromApi(searchQuery) {
      try {
        const res = await axios.get(`${SEARCHUSERS}${searchQuery}`);
        this.users = res.data.Search;

    // รีเซ็ตค่าดั้งเดิมของ pagination เมื่อมีการค้นหา
    this.resetPagination();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async delUser(_id) {
  try {
    const alertResult = await Swal.fire({
      title: 'คุณแน่ใจใช่ไหม?',
      text: 'คุณจะไม่สามารถย้อนกลับได้!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบ!',
    });

    if (alertResult.isConfirmed) {
      const confirmResult = await Swal.fire({
        title: 'ยืนยันการลบ',
        text: 'คุณแน่ใจหรือไม่ที่ต้องการลบผู้ใช้งาน?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ลบ!',
      });

      if (confirmResult.isConfirmed) {
        const accessToken = localStorage.getItem('accessToken');
        const res = await axios.delete(`${DELETEUSERS}/${_id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        this.getAllUser();
        console.log('ลบผู้ใช้งานเรียบร้อยแล้ว:', res);
        await Swal.fire({
          title: 'ลบแล้ว!',
          text: 'ไฟล์ของคุณถูกลบแล้ว',
          icon: 'success',
        });
      }
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบผู้ใช้:', error);
    await Swal.fire({
      title: 'เกิดข้อผิดพลาด!',
      text: 'เกิดข้อผิดพลาดในการลบผู้ใช้',
      icon: 'error',
    });
  }
},

    async getAllUser() {
      try {
        const res = await axios.get(`${GETALLUSERS}`);
        this.users = res.data;
        console.log(this.users);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    showModal() {
      this.isModalVisible = true;
    },
    showinfoModal(user) {
      this.selectedUser = user;
      this.infoModel = true;
    },
    AddressModal(user) {
      this.selectedAddress = user.address;
      this.AddressModel = true;
    },
    HealthModal(user) {
      this.selectedUser = user;
      this.selectedHealth = user.health;
      this.HealthModel = true;
    },
    movePage(offset) {
      this.startIndex += offset * 10;
      this.endIndex += offset * 10;
    },
    goToPage(page) {
      this.startIndex = (page - 1) * 10;
      this.endIndex = page * 10 - 1;
    },
    resetPagination() {
    this.startIndex = 0;
    this.endIndex = 9;
  },
  },
};
</script>


<template>
  
  <section class="p-3 sm:p-5">
    <div class="mx-auto max-w-screen-xl px-4 lg:px-12">
      <h3 class="text-2xl text-center font-semibold text-[#140A4B] mb-4">
        ข้อมูลผู้ใช้งานทั้งหมด
      </h3>
      <!-- Start coding here -->
      <div class="bg-white  relative shadow-md sm:rounded-lg overflow-hidden">
        <!-- search -->
        <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-3 ">
          <div class="w-full md:w-1/2">
            <form class="flex items-center">
              <label for="simple-search" class="sr-only">Search</label>
              <div class="relative w-full">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg aria-hidden="true" class="w-5 h-5 text-gray-500 " fill="currentColor" viewbox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <input type="text" id="simple-search" v-model="searchQuery"
                  class="bg-gray-50 border border-gray-300 text-[#303030] text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 "
                  placeholder="คำค้นหา" required="" />
              </div>
            </form>
          </div>
        </div>
        <div class="overflow-x-auto">

          <table class="w-full text-sm text-left text-gray-500 ">
            <thead class="text-xs text-[#FDFDFD] uppercase bg-[#140A4B] ">
              <tr class="text-center">
                <th scope="col" class="px-4 py-3">ID</th>
                <th scope="col" class="px-4 py-3">รหัสบัตรประชาชน</th>
                <th scope="col" class="px-4 py-3">ชื่อ</th>
                <th scope="col" class="px-4 py-3">นามสกุล</th>
                <th scope="col" class="px-4 py-3">เพศ</th>
                <th scope="col" class="px-4 py-3">เบอร์โทรศัพท์</th>
                <th scope="col" class="px-4 py-3">จัดการ</th>
              </tr>
            </thead>
            <!-- body -->
            <tbody v-if="users.length > 0">
              <tr v-for="(item, index) in sorteduser.slice(startIndex, endIndex)" :key="item._id" :class="{
                'bg-white': index % 2 === 0,
                'bg-[#F6F6F6]': index % 2 !== 0
              }" class="border-b text-center  text-[#303030]">
                <th scope="row" class="px-4 py-3 font-medium  whitespace-nowrap ">
                  {{ item._id }}
                </th>
                <td class="px-4 py-3">{{ item.idCard }}</td>
                <td class="px-4 py-3">{{ item.firstname }}</td>
                <td class="px-4 py-3">{{ item.lastname }}</td>
                <td class="px-4 py-3">{{ item.gender ? 'ชาย' : 'หญิง' }}</td>
                <td class="px-4 py-3">{{ item.phoneNo }}</td>
                <td class="px-4 py-3 flex  text-[#303030] justify-center ">
                  <!-- info_Btn -->
                  <button @click="showinfoModal(item)"
                    class="inline-flex items-center p-0.5 text-lg font-bold text-center text-[#303030] hover:text-gray-800 rounded-lg focus:outline-none "
                    type="button">
                    <svg class="w-[16px] h-[16px] text-[#303030] " aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                  </button>
                  <!-- infoAddressUser -->
                  <button @click="AddressModal(item)"
                    class="inline-flex items-center p-0.5 text-lg font-bold text-center text-[#303030] hover:text-gray-800 rounded-lg focus:outline-none "
                    type="button">
                    <svg class="w-[16px] h-[16px] text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 17 21">
                      <g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1">
                        <path d="M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                        <path
                          d="M13.8 12.938h-.01a7 7 0 1 0-11.465.144h-.016l.141.17c.1.128.2.252.3.372L8 20l5.13-6.248c.193-.209.373-.429.54-.66l.13-.154Z" />
                      </g>
                    </svg>
                  </button>
                  <!-- HealthInfo -->
                  <button @click="HealthModal(item)"
                    class="inline-flex items-center p-0.5 text-lg font-bold text-center text-[#303030] hover:text-gray-800 rounded-lg focus:outline-none "
                    type="button">
                    <svg class="w-[16px] h-[16px] text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 21 19">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                        d="M11 4C5.5-1.5-1.5 5.5 4 11l7 7 7-7c5.458-5.458-1.542-12.458-7-7Z" />
                    </svg>
                  </button>
                  <!-- delete_Btn -->
                  <button @click="delUser(item._id)"
                    class="inline-flex items-center p-0.5 text-lg font-bold text-center text-[#EB1851] hover:text-gray-800 rounded-lg focus:outline-none "
                    type="button">
                    <svg class="w-[16px] h-[16px] text-[#303030]" aria-hidden="true" style="color: #EB1851;"
                      xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                      <path
                        d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z" />
                    </svg>
                  </button>
                  <!-- Main modal Layout info User -->
                  <div id="UserModal" tabindex="-1" aria-hidden="true"
                    :class="{ hidden: !infoModel, flex: infoModel }"
                    class="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full backdrop-contrast-25 bg-black/5  ">
                    <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
                      <!-- Modal content -->
                      <div class="relative p-4 bg-white rounded-lg shadow  sm:p-5">
                        <!-- Modal header -->
                        <div class="flex justify-between items-center  rounded-t border-b sm:mb-5 ">
                          <h3 class="text-lg font-semibold text-[#303030] ">
                            ข้อมูลทั่วไป
                          </h3>
                          <button @click="infoModel = false" type="button"
                            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-[#303030] rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"></path>
                            </svg>
                            <span class="sr-only">Close modal</span>
                          </button>
                        </div>
                        <!-- user info -->
                        <form action="#">
                          <div class="grid gap-4 mb-4 sm:grid-cols-2 ">
                            <!-- _id -->
                            <div>
                              <label for="_id" class="block mb-2 text-lg font-bold text-[#303030] text-left">ID</label>
                              <p class="text-left p-2.5 bg-gray-50 border rounded-lg">{{ selectedUser._id }}</p>
                            </div>
                            <!-- idCard -->
                            <div>
                              <label for="idCard"
                                class="block mb-2 text-lg font-bold text-[#303030] text-left">รหัสบัตรประชาชน</label>
                              <p class="text-left p-2.5 bg-gray-50 border rounded-lg">{{ selectedUser.idCard }}</p>
                            </div>
                            <!-- email -->
                            <div>
                              <label for="email"
                                class="block mb-2 text-lg font-bold text-[#303030] text-left">อีเมล</label>
                              <p class="text-left p-2.5 bg-gray-50 border rounded-lg">{{ selectedUser.email }}</p>
                            </div>
                            <!-- firstname -->
                            <div>
                              <label for="firstname"
                                class="block mb-2 text-lg font-bold text-[#303030] text-left">ชื่อจริง</label>
                              <p class="text-left p-2.5 bg-gray-50 border rounded-lg">{{ selectedUser.firstname }}</p>
                            </div>
                            <!-- lastname -->
                            <div>
                              <label for="lastname"
                                class="block mb-2 text-lg font-bold text-[#303030] text-left">นามสกุล</label>
                              <p class="text-left p-2.5 bg-gray-50 border rounded-lg">{{ selectedUser.lastname }}</p>
                            </div>
                            <!-- phoneNO -->
                            <div>
                              <label for="phoneNO"
                                class="block mb-2 text-lg font-bold text-[#303030] text-left">เบอร์โทรศัพท์</label>
                              <p class="text-left p-2.5 bg-gray-50 border rounded-lg">{{ selectedUser.phoneNo }}</p>
                            </div>
                            <!-- gender -->
                            <div>
                              <label for="gender"
                                class="block mb-2 text-lg font-bold text-[#303030] text-left">เพศ</label>
                              <p class="text-left p-2.5 bg-gray-50 border rounded-lg">{{ selectedUser.gender ? 'ชาย' :
                                'หญิง' }}</p>
                            </div>
                            <!-- birthdate -->
                            <div>
                              <label for="birthdate"
                                class="block mb-2 text-lg font-bold text-[#303030] text-left">วัน/เดือน/ปี เกิด</label>
                              <p class="text-left p-2.5 bg-gray-50 border rounded-lg">{{
                                formatDate(selectedUser.birthdate) }}</p>
                            </div>
                          </div>
                          <!-- description -->
                          <div class="sm:col-span-2">
                            <label for="description"
                              class="block mb-2 text-lg font-bold text-[#303030] text-left">โรคประจำตัว</label>
                            <p class="text-left text-[#303030] rounded-lg bg-gray-50 border block w-full p-2.5">
                              {{ selectedUser.noteDisease ?? "ไม่มีการบันทึกจากผู้ใช้งาน" }}</p>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <!-- Main modal Layout info Address -->
                  <div id="AddressModal" tabindex="-1" aria-hidden="true"
                    :class="{ hidden: !AddressModel, flex: AddressModel }"
                    class="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full backdrop-contrast-25 bg-black/5 ">
                    <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
                      <!-- Modal content -->
                      <div class="relative p-4 bg-white rounded-lg shadow  sm:p-5">
                        <!-- Modal header -->
                        <div class="flex justify-between items-center  rounded-t border-b sm:mb-5 ">
                          <h3 class="text-lg font-semibold text-[#303030] ">
                            ที่อยู่
                          </h3>
                          <button @click="AddressModel = false" type="button"
                            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-[#303030] rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"></path>
                            </svg>
                            <span class="sr-only">Close modal</span>
                          </button>
                        </div>
                        <!-- Modal body -->
                        <form action="#">
                          <div class="grid gap-4 mb-4 sm:grid-cols-2 ">
                            <!-- houseNo -->
                            <div>
                              <label for="houseNo"
                                class="block mb-2 text-lg font-bold text-[#303030] text-left">บ้านเลขที่</label>
                              <p class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                <!-- {{ selectedAddress.houseNo ?? "ไม่มีการบันทึกจากผู้ใช้งาน" }}  -->
                                {{ selectedAddress.houseNo == undefined ? "ผู้ใช้งานไม่ได้บันทึกที่อยู่" :
                                  selectedAddress.houseNo }}
                              </p>
                            </div>
                            <!-- soi -->
                            <div>
                              <label for="soi" class="block mb-2 text-lg font-bold text-[#303030] text-left">ซอย</label>
                              <p class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                {{ selectedAddress.soi == undefined ? "ผู้ใช้งานไม่ได้บันทึกที่อยู่" : selectedAddress.soi
                                }}
                              </p>
                            </div>
                            <!-- road -->
                            <div>
                              <label for="road" class="block mb-2 text-lg font-bold text-[#303030] text-left">ถนน</label>
                              <p class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                {{ selectedAddress.road == undefined ? "ผู้ใช้งานไม่ได้บันทึกที่อยู่" :
                                  selectedAddress.road }}
                              </p>
                            </div>
                            <!-- moo -->
                            <div>
                              <label for="moo" class="block mb-2 text-lg font-bold text-[#303030] text-left">หมู่</label>
                              <p class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                {{ selectedAddress.moo == undefined ? "ผู้ใช้งานไม่ได้บันทึกที่อยู่" : selectedAddress.moo
                                }}
                              </p>
                            </div>
                            <!-- subDistrict -->
                            <div>
                              <label for="subDistrict"
                                class="block mb-2 text-lg font-bold text-[#303030] text-left">ตำบล</label>
                              <p class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                {{ selectedAddress.subDistrict == undefined ? "ผู้ใช้งานไม่ได้บันทึกที่อยู่" :
                                  selectedAddress.subDistrict }}
                              </p>
                            </div>
                            <!-- district -->
                            <div>
                              <label for="district"
                                class="block mb-2 text-lg font-bold text-[#303030] text-left">อำเภอ</label>
                              <p class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                {{ selectedAddress.district == undefined ? "ผู้ใช้งานไม่ได้บันทึกที่อยู่" :
                                  selectedAddress.district }}
                              </p>
                            </div>
                            <!-- province -->
                            <div>
                              <label for="province"
                                class="block mb-2 text-lg font-bold text-[#303030] text-left">จังหวัด</label>
                              <p class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                {{ selectedAddress.province == undefined ? "ผู้ใช้งานไม่ได้บันทึกที่อยู่" :
                                  selectedAddress.province }}

                              </p>
                            </div>
                            <!-- postalCode -->
                            <div>
                              <label for="postalCode"
                                class="block mb-2 text-lg font-bold text-[#303030] text-left">รหัสไปรษณีย์</label>
                              <p class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                {{ selectedAddress.postalCode == undefined ? "ผู้ใช้งานไม่ได้บันทึกที่อยู่" :
                                  selectedAddress.postalCode }}
                              </p>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <!-- Main modal Layout Health -->
                  <div id="HealthModal" tabindex="-1" aria-hidden="true"
                    :class="{ hidden: !HealthModel, flex: HealthModel }"
                    class="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full backdrop-contrast-25 bg-black/5 ">
                    <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
                      <!-- Modal content -->
                      <div class="relative p-4 bg-white rounded-lg shadow  sm:p-5">
                        <!-- Modal header -->
                        <div class="flex justify-between items-center  rounded-t border-b sm:mb-5 ">
                          <h3 class="text-lg font-semibold text-[#303030] ">

                            <!-- เช็คว่า selectedHealth ไม่เป็น null และ selectedHealth.createdAt มีค่า -->
                            {{ selectedHealth && selectedHealth.createdAt ?

                              // ถ้าเงื่อนไขเป็นจริง ให้แสดงข้อมูลสุขภาพ -->
                              `สุขภาพ ${formatDate(selectedHealth.createdAt)} ของคุณ ${selectedUser.firstname}`

                              // ถ้าเงื่อนไขเป็นเท็จ ให้แสดงข้อความ 'ไม่มีการเพิ่มข้อมูลสุขภาพ' -->
                              : 'ไม่มีการเพิ่มข้อมูลสุขภาพ' }}

                          </h3>
                          <button @click="HealthModel = false" type="button"
                            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-[#303030] rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"></path>
                            </svg>
                            <span class="sr-only">Close modal</span>
                          </button>
                        </div>
                        <!-- Modal body -->
                        <form action="#">
                          <div class="grid gap-4 mb-4 sm:grid-cols-2 ">
                            <!-- houseNo -->
                            <div>
                              <label for="houseNo"
                                class="block mb-2 text-lg font-bold text-[#303030] text-left">ความดันโลหิต</label>
                              <p class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                {{ selectedHealth == null ? "ยังไม่มีการจัดเก็บค่าสุขภาพจากผู้ใช้งาน" :
                                  selectedHealth.bloodPressure }}
                              </p>
                            </div>
                            <!-- soi -->
                            <div>
                              <label for="soi"
                                class="block mb-2 text-lg font-bold text-[#303030] text-left">อัตราการเต้นของหัวใจ</label>
                              <p class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                {{ selectedHealth == undefined ? "ยังไม่มีการจัดเก็บค่าสุขภาพจากผู้ใช้งาน" :
                                  selectedHealth.heartRate }}
                              </p>
                            </div>
                            <!-- road -->
                            <div>
                              <label for="road"
                                class="block mb-2 text-lg font-bold text-[#303030] text-left">ออกซิเจนในเลือด</label>
                              <p class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                {{ selectedHealth == undefined ? "ยังไม่มีการจัดเก็บค่าสุขภาพจากผู้ใช้งาน" :
                                  selectedHealth.oxygen }}
                              </p>
                            </div>
                            <!-- moo -->
                            <div>
                              <label for="moo"
                                class="block mb-2 text-lg font-bold text-[#303030] text-left">อุณหภูมิร่างกาย</label>
                              <p class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                {{ selectedHealth == undefined ? "ยังไม่มีการจัดเก็บค่าสุขภาพจากผู้ใช้งาน" :
                                  selectedHealth.temperature }}
                              </p>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!--Navunder Table-->
          <nav v-if="!searchQuery"
            class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
            aria-label="Table navigation">
            <span class="text-sm font-normal text-gray-500 ">
              Showing
              <span class="font-semibold text-gray-900 ">{{ startIndex + 1 }}-{{ endIndex + 1 }}</span>
              of
              <span class="font-semibold text-gray-900 ">{{ users.length }}</span>
            </span>
            <ul class="inline-flex items-stretch -space-x-px">
              <li>
                <button @click="movePage(-1)" :disabled="startIndex <= 0"
                  class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ">
                  <span class="sr-only">Previous</span>
                  <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
              </li>
              <li v-for="page in displayedPages" :key="page">
                <a @click="goToPage(page)" :class="{ 'aria-current': page === currentPage }"
                  class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ">{{
                    page }}</a>
              </li>
              <li>
                <button @click="movePage(1)" :disabled="endIndex >= users.length"
                  class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ">
                  <span class="sr-only">Next</span>
                  <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </section>


</template>
