<script>
import { GETALLUSERS,GETALLQUEUES,SEARCHUSERS,ADDQUEUES,UPDATEQUEUES,DELETEQUEUES } from "@/APIGate";
import axios from "axios";
import html2pdf from 'html2pdf.js';
import Swal from "sweetalert2";



export default {
    name: "user-component",

    data() {
        return {
            pdfExported: false,
            reload: {},
            falsequeue: {},
            truequeue: {},
            startIndex: 0,
            endIndex: 9,
            truequeue: {},
            inputData: this.resetInputData(),
            SelectAddQueues: {},
            SelectQueue: {},
            SelectedaddQueue: {},
            SelectedUpdateQueue: {},
            SelecttrueInfo: {},
            SelecttrueQueue: {},
            SelectAddModal: {},
            SelectedItem: {},
            searchQuery: "",
            Queue: [],
            Queueinfo: [],
            AddModel: false,
            infoModel: false,
            infotrueModel: false,
            UpdateModel: false,
            trueQueueModel: false,
        };
    },

    computed: {
        currentPage() {
            return Math.floor(this.startIndex / 10) + 1;
        },
        totalPages() {
            return Math.ceil(this.Queue.length / 10);
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
            return this.Queue.slice().sort((a, b) => {
                if (a.status === b.status) {
                    return new Date(a.datauser) - new Date(b.datauser);
                } else {
                    return a.status ? 1 : -1;
                }
            });
        },
        sortedQueueme() {
            return this.SelectQueue.slice().sort((a, b) => {
                if (a.status === b.status) {
                    return new Date(a.dataQueue) - new Date(b.dataQueue);
                } else {
                    return a.status ? 1 : -1;
                }
            });
        },
        sortedQueuemefalse() {
            return this.SelecttrueQueue.slice().sort((a, b) => {
                if (a.status === b.status) {
                    return new Date(a.dataQueue) - new Date(b.dataQueue);
                } else {
                    return a.status ? 1 : -1;
                }
            });
        },
    },
    created() {
        this.getAllUser();
    },
    mounted() {
        this.reload = this.fetchUsers();
    },
    watch: {
        searchQuery(newVal, oldVal) {
            this.fetchDataFromApi(newVal);
        },
    },
    methods: {
        async fetchUsers() {
            try {
                const accessToken = localStorage.getItem("accessToken");
                const response = await axios.get(` ${GETALLQUEUES}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                return response.data; // สมมติว่า API ของคุณส่งข้อมูลผู้ใช้งานในรูปแบบ JSON
            } catch (error) {
                console.error("Error fetching users:", error);
                return []; // หรือให้ return array เปล่าๆ หรือข้อมูลเดิมในกรณี error
            }
        },
        async fetchDataFromApi(searchQuery) {
            try {
                const res = await axios.get(
                    `${SEARCHUSERS}${searchQuery}`
                 );
                this.Queue = res.data.Search;
                // console.log("ข้อมูลที่ค้นหา",this.QueueSearch);
                this.resetPagination();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },
        async delUser(_id) {
    try {
        // แสดง Alert และรอผู้ใช้ยืนยันก่อนที่จะดำเนินการต่อ
        const confirmResult = await Swal.fire({
            title: 'คุณแน่ใจใช่ไหม?',
            text: 'คุณจะไม่สามารถย้อนกลับได้!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, ลบ!'
        });

        // หากผู้ใช้ยืนยันการลบ
        if (confirmResult.isConfirmed) {
            // ดำเนินการลบผู้ใช้งานโดยใช้ API
            const accessToken = localStorage.getItem('accessToken');
            const res = await axios.delete(`${DELETEQUEUES}${_id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // หลังจากลบสำเร็จ
            this.getAllUser(); // โหลดข้อมูลผู้ใช้งานใหม่
            console.log('ลบผู้ใช้งานเรียบร้อยแล้ว:', res);
            this.infoModel = false;

        }
    } catch (error) {
        // หากมีข้อผิดพลาดในกระบวนการลบ
        console.error('เกิดข้อผิดพลาดในการลบผู้ใช้:', error);
    }
},

        //ทำงานตัวแรก
        async getAllUser() {
            try {
                const res = await axios.get(
                    `${GETALLUSERS}`
                );
                this.Queue = res.data;
                // this.QueueMe = res.data;
                // console.log("ข้อมูลทั้งหมด",this.Queue);
            } catch (error) {
                console.error("Error fetching all users:", error);
            }
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString();
        },
        resetInputData() {
            return {
                topic: "",
                note: "",
                startDate: null,
                locations: false,
                userId: "",
            };
        },
        resetModalData() {
            // ให้ทำการ reset ค่า inputData ให้เป็นค่า default
            this.inputData = this.resetInputData();
        },
        AddModal(user) {
            this.SelectAddModal = user;
            console.log("แอดคิวของ :", user.firstname, this.SelectAddModal);
            this.resetModalData();
            this.AddModel = true;
        },

        async addQueue_Btn(user) {
            try {
                // ตรวจสอบว่าผู้ใช้ได้กรอกข้อมูลครบถ้วนหรือไม่
                if (!this.inputData.startDate) {
                    alert("คุณไม่ได้กำหนดวันนัดหมาย");
                    this.inputData = this.resetInputData();
                    return;
                }

                if (this.inputData.locations === null) {
                    alert("คุณไม่ได้กำหนดประเภทการเข้าตรวจ");
                    this.inputData = this.resetInputData();
                    return;
                }
                // ดึง Access Token จาก Local Storage
                const accessToken = localStorage.getItem("accessToken");
                // ทำการส่งข้อมูลไปยัง API ของเซิร์ฟเวอร์
                const res = await axios.post(
                    `${ADDQUEUES}`, {
                    topic: this.inputData.topic,
                    startDate: this.inputData.startDate,
                    locations: this.inputData.locations,
                    note: this.inputData.note,
                    userId: user._id, // รหัสผู้ใช้ที่เลือก
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
                );
                // กรณีเพิ่มคิวสำเร็จ
                console.log("เพิ่มคิวสำเร็จ:", res);
                this.getAllUser();
                // ปิด Modal เพื่อเตรียมสำหรับการเพิ่มคิวถัดไป
                this.AddModel = false;
            } catch (error) {
                // กรณีเกิดข้อผิดพลาดในการเพิ่มคิว
                console.error("Error adding queue:", error);
            }
        },

        showinfoModal(user) {
            this.SelectQueue = user.queues.filter((queue) => queue.status === true);
            this.SelecttrueQueue = user.queues.filter(
                (queue) => queue.status === false
            );
            console.log("ข้อมูล true", this.SelectQueue);
            console.log("ข้อมูล false", this.SelecttrueQueue);
            this.infoModel = true;
        },
        trueQueueModal(item) {
            this.truequeue = item;
            this.falsequeue = item;
            console.log("ข้อมูล info ตรวจเเล้ว", item);
            this.trueQueueModel = true;
        },
        // ปุ๋มตรวจสอบเเล้ว
        trueInfoModal(user) {
            this.SelecttrueInfo = user.queues;
            this.infotrueModel = true;
            this.infoModel = false;
        }, updateStartDate(event) {
            // ทำการอัปเดตค่าของ SelectedItemSelectedItem.startDate เมื่อผู้ใช้กรอกข้อมูล
            this.SelectedItem.startDate = event.target.value;
        },
        updateEndDate(event) {
            // ทำการอัปเดตค่าของ SelectedItem.endDate เมื่อผู้ใช้กรอกข้อมูล
            this.SelectedItem.endDate = event.target.value;
        },
        UpdateModal(user) {
            this.SelectedItem = user;
            // ตัดเวลาออก (เพื่อให้ input type date ใน HTML รับค่าได้)
            this.SelectedItem.startDate = this.SelectedItem.startDate.split('T')[0];
            if (this.SelectedItem.endDate) {
                this.SelectedItem.endDate = this.SelectedItem.endDate.split('T')[0];
            }
            console.log("ค่า status ที่ได้จาก API response:", this.SelectedItem.status);
            console.log("ข้อมูล info ยังไม่ตรวจ", this.SelectedItem);
            this.UpdateModel = true;
        },
        async UpdateQueue_Btn() {
            try {
                // ดึง Access Token จาก Local Storage
                const accessToken = localStorage.getItem("accessToken");

                // ทำการส่งข้อมูลไปยัง API ของเซิร์ฟเวอร์
                const res = await axios.patch(
                    `${UPDATEQUEUES}/${this.SelectedItem._id}`,
                    {
                        topic: this.SelectedItem.topic,
                        startDate: this.SelectedItem.startDate,
                        endDate: this.SelectedItem.endDate,
                        locations: this.SelectedItem.locations,
                        note: this.SelectedItem.note,
                        status: this.SelectedItem.status
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                // กรณีอัปเดตคิวสำเร็จ
                console.log("อัปเดตคิวสำเร็จ:", res);

                // ปิด Modal เพื่อเตรียมสำหรับการแก้ไขคิวถัดไป
                this.UpdateModel = false;



                // ทำการดึงข้อมูลทั้งหมดใหม่
                this.getAllUser();
            } catch (error) {
                // กรณีเกิดข้อผิดพลาดในการอัปเดตคิว
                console.error("Error updating queue:", error);
            }
        },

        falseInfoModal() {
            this.infotrueModel = false
            this.infoModel = true;
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
        exportPDF() {
            const element = document.getElementById('pdf').cloneNode(true);
            const button = element.querySelector('.export-pdf-button');
            button.parentNode.removeChild(button);
            if (element) {
                html2pdf(element);
            } else {
                console.error('ไม่เจอid"pdf');
            }
        },
    },
};
</script>

<template>
    <section class="p-3 sm:p-5">
        <h3 class="text-2xl text-center font-semibold text-[#140A4B] mb-4">
            ข้อมูลคิวของแต่ละรายบุคคล
        </h3>
        <div class="mx-auto max-w-screen-xl px-4 lg:px-12">
            <!-- Start coding here -->
            <div class="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
                <!-- search -->
                <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-3">
                    <div class="w-full md:w-1/2">
                        <form class="flex items-center">
                            <label for="searchInput" class="sr-only">Search</label>
                            <div class="relative w-full">
                                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg aria-hidden="true" class="w-5 h-5 text-gray-500" fill="currentColor"
                                        viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd"
                                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <input type="text" id="searchInput" v-model="searchQuery"
                                    class="bg-gray-50 border border-gray-300 text-[#303030] text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2"
                                    placeholder="คำค้นหา..." required="" />
                            </div>
                        </form>
                    </div>
                </div>
                <!-- ตารางเเรก -->
                <div class="overflow-x-auto">
                    <table id="dataTable" class="w-full text-sm text-left text-gray-500">
                        <thead class="text-xs text-[#FDFDFD] uppercase bg-[#140A4B]">
                            <tr class="text-center">
                                <th scope="col" class="px-4 py-3">ไอดี</th>
                                <th scope="col" class="px-4 py-3">รหัสบัตรประชาชน</th>
                                <th scope="col" class="px-4 py-3">ชื่อ</th>
                                <th scope="col" class="px-4 py-3">นามสกุล</th>
                                <th scope="col" class="px-4 py-3">จัดการ</th>
                            </tr>
                        </thead>
                        <!-- body -->
                        <tbody v-if="Queue.length > 0">
                            <tr v-for="(item, index) in sorteduser.slice(startIndex, endIndex)" :key="item._id" :class="{
                                'bg-white': index % 2 === 0,
                                'bg-[#F6F6F6]': index % 2 !== 0,
                            }" class="border-b text-center text-[#303030]">
                                <th scope="row" class="px-4 py-3 font-medium whitespace-nowrap">
                                    {{ item._id }}
                                </th>
                                <td class="px-4 py-3">{{ item.idCard }}</td>
                                <td class="px-4 py-3">{{ item.firstname }}</td>
                                <td class="px-4 py-3">{{ item.lastname }}</td>
                                <td class="px-4 py-3 flex text-[#303030] justify-center">
                                    <!-- info_Btn -->
                                    <button @click="showinfoModal(item)"
                                        class="inline-flex items-center p-0.5 text-lg font-bold text-center text-[#303030] hover:text-gray-800 rounded-lg focus:outline-none"
                                        type="button">
                                        <svg class="w-[16px] h-[16px] text-[#303030]" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="1" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                    </button>

                                    <!-- edit_Btn -->
                                    <button @click="AddModal(item)"
                                        class="inline-flex items-center p-0.5 text-lg font-bold text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none"
                                        type="button">
                                        <svg class="w-[16px] h-[16px] text-gray-800" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="1" d="M9 1v16M1 9h16" />
                                        </svg>
                                    </button>
                                    <!-- Main modal Layout Queue info ยังไม่ตรวจ -->
                                    <div id="infoUserModal" tabindex="-1" aria-hidden="true"
                                        :class="{ hidden: !infoModel, flex: infoModel }"
                                        class="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full backdrop-contrast-25 bg-black/5">
                                        <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
                                            <!-- Modal content -->
                                            <div class="p-4 bg-white rounded-lg shadow sm:p-5">
                                                <!-- Modal header -->
                                                <div class="flex rounded-t border-b sm:mb-2">
                                                    <div class="flex gap-4">
                                                        <h3 class="text-lg text-center font-semibold text-[#303030]">
                                                            รายการคิวรายบุคคล
                                                        </h3>
                                                        <button @click="trueInfoModal(item)" type="button"
                                                            class="text-[#198B0A] mb-2 inline-flex items-center hover:text-white border border-[#198B0A] hover:bg-[#198B0A] focus:ring-4 focus:outline-none focus:ring-[#140A4B] font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                                            <svg class="mr-1 -ml-1 w-5 h-5" fill="currentColor"
                                                                viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                <path fill-rule="evenodd"
                                                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                    clip-rule="evenodd"></path>
                                                            </svg>
                                                            ยังไม่ได้รับตรวจ
                                                        </button>
                                                    </div>

                                                    <button @click="infoModel = false" type="button"
                                                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-[#303030] rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                                                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor"
                                                            viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd"
                                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                clip-rule="evenodd"></path>
                                                        </svg>
                                                        <span class="sr-only">Close modal</span>
                                                    </button>
                                                </div>
                                                <!-- หน้ายังไม่ตรวจ -->
                                                <div class="overflow-x-auto rounded-lg border">
                                                    <table class="w-full text-sm text-left text-gray-500">
                                                        <thead class="text-xs text-[#FDFDFD] uppercase bg-[#140A4B]">
                                                            <tr class="text-center">
                                                                <th scope="col" class="px-4 py-3">หัวข้อ</th>
                                                                <th scope="col" class="px-4 py-3">
                                                                    วันนัดหมาย
                                                                </th>
                                                                <th scope="col" class="px-4 py-3">
                                                                    ประเภทการตรวจ
                                                                </th>
                                                                <th scope="col" class="px-4 py-3">สถานะ</th>
                                                                <th scope="col" class="px-4 py-3">จัดการ</th>
                                                            </tr>
                                                        </thead>
                                                        <!-- body -->
                                                        <tbody v-if="SelecttrueQueue.length > 0">
                                                            <tr v-for="(item, index) in sortedQueuemefalse" :key="item._id"
                                                                :class="{
                                                                    'bg-white': index % 2 === 0,
                                                                    'bg-[#F6F6F6]': index % 2 !== 0,
                                                                }" class="border-b text-center text-[#303030]">
                                                                <th scope="row"
                                                                    class="px-4 py-3 font-medium whitespace-nowrap">
                                                                    {{ item.topic }}
                                                                </th>
                                                                <td class="px-4 py-3">
                                                                    {{ formatDate(item.startDate) }}
                                                                </td>
                                                                <td class="px-4 py-3">
                                                                    {{ item.locations ? "ออนไซต์" : "ออนไลน์" }}
                                                                </td>
                                                                <td class="px-4 py-3">
                                                                    {{
                                                                        item.status ? "ตรวจเเล้ว" : "ยังไม่ตรวจ"
                                                                    }}
                                                                </td>
                                                                <td class="px-4 py-3 flex text-[#303030] justify-center">
                                                                    <!--Info_Btn-->
                                                                    <button @click="trueQueueModal(item)"
                                                                        class="inline-flex items-center p-0.5 text-lg font-bold text-center text-[#EB1851] hover:text-gray-800 rounded-lg focus:outline-none"
                                                                        type="button">
                                                                        <svg class="w-[16px] h-[16px] text-[#303030]"
                                                                            aria-hidden="true"
                                                                            xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                            viewBox="0 0 20 20">
                                                                            <path stroke="currentColor"
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round" stroke-width="1"
                                                                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                                                        </svg>
                                                                    </button>
                                                                    <!-- Add_Btn -->
                                                                    <button @click="UpdateModal(item)"
                                                                        class="inline-flex items-center p-0.5 text-lg font-bold text-center text-[#EB1851] hover:text-gray-800 rounded-lg focus:outline-none"
                                                                        type="button">
                                                                        <svg class="w-[16px] h-[16px] text-gray-800 dark:text-white"
                                                                            aria-hidden="true"
                                                                            xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                            viewBox="0 0 21 21">
                                                                            <path stroke="currentColor"
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round" stroke-width="1"
                                                                                d="M7.418 17.861 1 20l2.139-6.418m4.279 4.279 10.7-10.7a3.027 3.027 0 0 0-2.14-5.165c-.802 0-1.571.319-2.139.886l-10.7 10.7m4.279 4.279-4.279-4.279m2.139 2.14 7.844-7.844m-1.426-2.853 4.279 4.279" />
                                                                        </svg>
                                                                    </button>
                                                                    <!-- delete_Btn -->
                                                                    <button @click="delUser(item._id)"
                                                                        class="inline-flex items-center p-0.5 text-lg font-bold text-center text-[#EB1851] hover:text-gray-800 rounded-lg focus:outline-none"
                                                                        type="button">
                                                                        <svg class="w-[16px] h-[16px] text-[#303030]"
                                                                            aria-hidden="true" style="color: #eb1851"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="currentColor" viewBox="0 0 18 20">
                                                                            <path
                                                                                d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z" />
                                                                        </svg>
                                                                    </button>
                                                                    <!-- Main modal Layout แก้ไขคิว -->
                                                                    <div id="UpdateModel" tabindex="-1" aria-hidden="true"
                                                                        :class="{
                                                                            hidden: !UpdateModel,
                                                                            flex: UpdateModel,
                                                                        }"
                                                                        class="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full ">
                                                                        <div
                                                                            class="relative p-4 w-full max-w-2xl h-full md:h-auto">
                                                                            <!-- Modal content -->
                                                                            <div
                                                                                class="relative p-4 bg-white rounded-lg shadow sm:p-5">
                                                                                <!-- Modal header -->
                                                                                <div
                                                                                    class="flex justify-between items-center rounded-t border-b sm:mb-5">
                                                                                    <h3
                                                                                        class="text-lg font-semibold text-[#303030]">
                                                                                        แก้ไขคิว
                                                                                    </h3>
                                                                                    <button @click="UpdateModel = false"
                                                                                        type="button"
                                                                                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-[#303030] rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                                                                                        <svg aria-hidden="true"
                                                                                            class="w-5 h-5"
                                                                                            fill="currentColor"
                                                                                            viewBox="0 0 20 20"
                                                                                            xmlns="http://www.w3.org/2000/svg">
                                                                                            <path fill-rule="evenodd"
                                                                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                                                clip-rule="evenodd"></path>
                                                                                        </svg>
                                                                                        <span class="sr-only">Close
                                                                                            modal</span>
                                                                                    </button>
                                                                                </div>
                                                                                <!-- Modal body -->
                                                                                <form action="#">
                                                                                    <div
                                                                                        class="grid gap-4 mb-4 sm:grid-cols-2">
                                                                                        <!-- topic -->
                                                                                        <div>
                                                                                            <label for="topic"
                                                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">หัวข้อ</label>
                                                                                            <input type="text" name="topic"
                                                                                                id="topic" value=""
                                                                                                class="bg-gray-50 border border-gray-300 text-[#303030] text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                                                                placeholder="หัวข้อ"
                                                                                                v-model="SelectedItem.topic" />
                                                                                        </div>
                                                                                        <br>
                                                                                        <!-- status -->
                                                                                        <div>
                                                                                            <label for="status"
                                                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">สถานะ</label>
                                                                                            <div
                                                                                                class="bg-gray-50 border border-gray-300 text-[#303030] text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 text-start">
                                                                                                <label class="inline-flex">
                                                                                                    <input type="radio"
                                                                                                        class="form-radio"
                                                                                                        name="status"
                                                                                                        value="true"
                                                                                                        v-model="SelectedItem.status" />
                                                                                                    <span
                                                                                                        class="ml-2">ตรวจแล้ว</span>
                                                                                                </label>
                                                                                                <label
                                                                                                    class="inline-flex ml-4">
                                                                                                    <input type="radio"
                                                                                                        class="form-radio"
                                                                                                        name="status"
                                                                                                        value="false"
                                                                                                        v-model="SelectedItem.status" />
                                                                                                    <span
                                                                                                        class="ml-2">ยังไม่ได้ตรวจ</span>
                                                                                                </label>
                                                                                            </div>
                                                                                        </div>
                                                                                        <!-- locations -->
                                                                                        <div>
                                                                                            <label for="locations"
                                                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">ประเภทการตรวจสอบ</label>

                                                                                            <div
                                                                                                class="bg-gray-50 border border-gray-300 text-[#303030] text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 text-start">
                                                                                                <label class="inline-flex">
                                                                                                    <input type="radio"
                                                                                                        class="form-radio"
                                                                                                        name="accountType"
                                                                                                        value="false"
                                                                                                        v-model="SelectedItem.locations" />
                                                                                                    <span
                                                                                                        class="ml-2">ออนไลน์</span>
                                                                                                </label>
                                                                                                <label
                                                                                                    class="inline-flex ml-4">
                                                                                                    <input type="radio"
                                                                                                        class="form-radio"
                                                                                                        name="accountType"
                                                                                                        value="true"
                                                                                                        v-model="SelectedItem.locations" />
                                                                                                    <span
                                                                                                        class="ml-2">ออนไซต์</span>
                                                                                                </label>
                                                                                            </div>

                                                                                        </div>
                                                                                        <!-- startDate -->
                                                                                        <div>
                                                                                            <label for="startDate"
                                                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">วันนัดหมาย</label>
                                                                                            <input type="date"
                                                                                                name="startDate"
                                                                                                id="startDate"
                                                                                                class="bg-gray-50 border border-gray-300 text-[#303030] text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                                                                :value="SelectedItem.startDate"
                                                                                                @input="updateStartDate($event)" />
                                                                                        </div>
                                                                                        <!-- endDate -->
                                                                                        <div>
                                                                                            <label for="updatedAt"
                                                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">วันที่เข้าตรวจ</label>
                                                                                            <input type="date"
                                                                                                name="endDate" id="endDate"
                                                                                                class="bg-gray-50 border border-gray-300 text-[#303030] text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                                                                :value="SelectedItem.endDate"
                                                                                                placeholder="SelectedItem.endDate ? '' : 'ยังไม่ได้รับการเข้าตรวจ'"
                                                                                                @input="updateEndDate($event)" />
                                                                                        </div>
                                                                                        <!--note-->
                                                                                        <div class="sm:col-span-2">
                                                                                            <label for="description"
                                                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">คำแนะนำ</label>
                                                                                            <textarea id="description"
                                                                                                rows="5"
                                                                                                class="block p-2.5 w-full text-sm text-[#303030] bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                                                                                                v-model="SelectedItem.note"></textarea>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        class="flex items-center content-center space-x-4">
                                                                                        <button @click="UpdateQueue_Btn()"
                                                                                            type="button"
                                                                                            class="text-[#140A4B] inline-flex items-center hover:text-white border border-[#140A4B] hover:bg-[#140A4B] focus:ring-4 focus:outline-none focus:ring-[#140A4B] font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                                                                            <svg class="mr-1 -ml-1 w-5 h-5"
                                                                                                fill="currentColor"
                                                                                                viewBox="0 0 20 20"
                                                                                                xmlns="http://www.w3.org/2000/svg">
                                                                                                <path fill-rule="evenodd"
                                                                                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                                                    clip-rule="evenodd">
                                                                                                </path>
                                                                                            </svg>
                                                                                            แก้ไขคิว
                                                                                        </button>
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <!-- Main modal Layout ดูข้อมูลคิว -->
                                                                    <div id="trueQueueModel" tabindex="-1"
                                                                        aria-hidden="true" :class="{
                                                                            hidden: !trueQueueModel,
                                                                            flex: trueQueueModel,
                                                                        }"
                                                                        class="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full backdrop-contrast-25">
                                                                        <div
                                                                            class="relative p-4 w-full max-w-2xl h-full md:h-auto">
                                                                            <!-- Modal content -->
                                                                            <div
                                                                                class="relative p-4 bg-white rounded-lg shadow sm:p-5">
                                                                                <!-- Modal header -->
                                                                                <div
                                                                                    class="flex justify-between items-center rounded-t border-b sm:mb-5">
                                                                                    <h3
                                                                                        class="text-lg font-semibold text-[#303030]">
                                                                                        ข้อมูลการนัดหมาย
                                                                                    </h3>
                                                                                    <button @click="trueQueueModel = false"
                                                                                        type="button"
                                                                                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-[#303030] rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                                                                                        <svg aria-hidden="true"
                                                                                            class="w-5 h-5"
                                                                                            fill="currentColor"
                                                                                            viewBox="0 0 20 20"
                                                                                            xmlns="http://www.w3.org/2000/svg">
                                                                                            <path fill-rule="evenodd"
                                                                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                                                clip-rule="evenodd"></path>
                                                                                        </svg>
                                                                                        <span class="sr-only">Close
                                                                                            modal</span>
                                                                                    </button>
                                                                                </div>
                                                                                <!-- Modal body -->
                                                                                <form action="#">
                                                                                    <div
                                                                                        class="grid gap-4 mb-4 sm:grid-cols-2">
                                                                                        <!-- topic -->
                                                                                        <div>
                                                                                            <label for="topic"
                                                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">หัวข้อ</label>
                                                                                            <p
                                                                                                class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                                                                                {{
                                                                                                    falsequeue.topic
                                                                                                }}
                                                                                            </p>
                                                                                        </div>
                                                                                        <br>
                                                                                        <!-- status -->
                                                                                        <div>
                                                                                            <label for="status"
                                                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">สถานะ</label>
                                                                                            <p
                                                                                                class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                                                                                {{ falsequeue.status ?
                                                                                                    "ตรวจสอบเเล้ว" :
                                                                                                    "ยังไม่ตรวจ"
                                                                                                }}
                                                                                            </p>
                                                                                        </div>
                                                                                        <!-- locations -->
                                                                                        <div>
                                                                                            <label for="status"
                                                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">ประเภทการตรวจ</label>
                                                                                            <p
                                                                                                class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                                                                                {{ falsequeue.locations ?
                                                                                                    "ออนไลน์" : "ออนไซร์" }}
                                                                                            </p>
                                                                                        </div>
                                                                                        <!-- startDate -->
                                                                                        <div>
                                                                                            <label for="dateQueue"
                                                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">วันนัดหมาย</label>
                                                                                            <p
                                                                                                class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                                                                                {{
                                                                                                    formatDate(falsequeue.startDate)
                                                                                                }}
                                                                                            </p>
                                                                                        </div>
                                                                                        <!-- endDate -->
                                                                                        <div>
                                                                                            <label for="updatedAt"
                                                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">วันที่เข้าตรวจ</label>
                                                                                            <p
                                                                                                class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                                                                                {{
                                                                                                    formatDate(falsequeue.endDate)
                                                                                                    ?
                                                                                                    formatDate(falsequeue.endDate)
                                                                                                    : "ยังไม่ได้รับการตรวจ"
                                                                                                }}
                                                                                            </p>
                                                                                        </div>
                                                                                        <!-- note -->
                                                                                        <div class="sm:col-span-2">
                                                                                            <label for="description"
                                                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">คำแนะนำ</label>
                                                                                            <p
                                                                                                class="block p-2.5 w-full text-sm text-[#303030] bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 text-left">
                                                                                                {{ falsequeue.note ?
                                                                                                    falsequeue.note : "ไม่มี" }}
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
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Main modal Layout Queue info ตรวจแล้ว -->
                                    <div id="infoUserModal" tabindex="-1" aria-hidden="true"
                                        :class="{ hidden: !infotrueModel, flex: infotrueModel }"
                                        class="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full backdrop-contrast-25 bg-black/5">
                                        <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
                                            <!-- Modal content -->
                                            <div class="p-4 bg-white rounded-lg shadow sm:p-5">
                                                <!-- Modal header -->
                                                <div class="flex justify-center rounded-t border-b sm:mb-2">
                                                    <div class="flex gap-4">
                                                        <h3 class="text-lg text-center font-semibold text-[#303030]">
                                                            รายการคิวรายบุคคลไม่ตรวจ
                                                        </h3>
                                                        <button @click="falseInfoModal()" type="button"
                                                            class="text-[#EB1851] mb-2 inline-flex items-center hover:text-white border border-[#EB1851] hover:bg-[#EB1851] focus:ring-4 focus:outline-none focus:ring-[#140A4B] font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                                            <svg class="mr-1 -ml-1 w-5 h-5" fill="currentColor"
                                                                viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                <path fill-rule="evenodd"
                                                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                    clip-rule="evenodd"></path>
                                                            </svg>
                                                            ตรวจสอบแล้ว
                                                        </button>
                                                    </div>
                                                    <button @click="infotrueModel = false" type="button"
                                                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-[#303030] rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                                                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor"
                                                            viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd"
                                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                clip-rule="evenodd"></path>
                                                        </svg>
                                                        <span class="sr-only">Close modal</span>
                                                    </button>
                                                </div>
                                                <!-- หน้าตรวจสอบเเล้ว -->
                                                <div class="overflow-x-auto rounded-lg border">
                                                    <table class="w-full text-sm text-left text-gray-500">
                                                        <thead class="text-xs text-[#FDFDFD] uppercase bg-[#140A4B]">
                                                            <tr class="text-center">
                                                                <th scope="col" class="px-4 py-3">หัวข้อ</th>
                                                                <th scope="col" class="px-4 py-3">
                                                                    ประเภทการตรวจ
                                                                </th>
                                                                <th scope="col" class="px-4 py-3">
                                                                    วันที่เข้าตรวจ
                                                                </th>
                                                                <th scope="col" class="px-4 py-3">สถานะ</th>
                                                                <th scope="col" class="px-4 py-3">จัดการ</th>
                                                            </tr>
                                                        </thead>
                                                        <!-- body -->
                                                        <tbody v-if="SelectQueue.length > 0">
                                                            <tr v-for="(item, index) in sortedQueueme.slice(0, 5)"
                                                                :key="item._id" :class="{
                                                                    'bg-white': index % 2 === 0,
                                                                    'bg-[#F6F6F6]': index % 2 !== 0,
                                                                }" class="border-b text-center text-[#303030]">
                                                                <th scope="row"
                                                                    class="px-4 py-3 font-medium whitespace-nowrap">
                                                                    {{ item.topic }}
                                                                </th>
                                                                <td class="px-4 py-3">
                                                                    {{ item.locations ? "ออนไซต์" : "ออนไลน์" }}
                                                                </td>
                                                                <td class="px-4 py-3">
                                                                    {{ formatDate(item.endDate) }}
                                                                </td>
                                                                <td class="px-4 py-3">
                                                                    {{
                                                                        item.status ? "ตรวจเเล้ว" : "ไม่ตรวจเเล้ว"
                                                                    }}
                                                                </td>
                                                                <td class="px-4 py-3 flex text-[#303030] justify-center">
                                                                    <!-- ดูข้อมูลของแต่ละคิว -->
                                                                    <button @click="trueQueueModal(item)"
                                                                        class="inline-flex items-center p-0.5 text-lg font-bold text-center text-[#EB1851] hover:text-gray-800 rounded-lg focus:outline-none"
                                                                        type="button">
                                                                        <svg class="w-[16px] h-[16px] text-[#303030]"
                                                                            aria-hidden="true"
                                                                            xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                            viewBox="0 0 20 20">
                                                                            <path stroke="currentColor"
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round" stroke-width="1"
                                                                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                                                        </svg>
                                                                    </button>
                                                                    <!-- Main modal Layout QueueInfo -->
                                                                    <div id="trueQueueModel" tabindex="-1"
                                                                        aria-hidden="true" :class="{
                                                                            hidden: !trueQueueModel,
                                                                            flex: trueQueueModel,
                                                                        }"
                                                                        class="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full">
                                                                        <div
                                                                            class="relative p-4 w-full max-w-2xl h-full md:h-auto">
                                                                            <!-- Modal content -->
                                                                            <div id="pdf"
                                                                                class="relative p-4 bg-white rounded-lg shadow sm:p-5">
                                                                                <!-- Modal header -->
                                                                                <div
                                                                                    class="flex justify-between items-center rounded-t border-b sm:mb-5">
                                                                                    <h3
                                                                                        class="text-lg font-semibold text-[#303030]">
                                                                                        ข้อมูลการนัดหมาย
                                                                                    </h3>
                                                                                    <button @click="exportPDF" type="button"
                                                                                        class="export-pdf-button text-[#140A4B] mb-2 inline-flex items-center hover:text-white border border-[#303030] hover:bg-[#140A4B] focus:ring-4 focus:outline-none focus:ring-[#140A4B] font-medium rounded-lg text-sm px-5 py-2.5 ml-auto text-center">
                                                                                        <svg class="mr-1 -ml-1 w-5 h-5"
                                                                                            fill="currentColor"
                                                                                            viewBox="0 0 20 20"
                                                                                            xmlns="http://www.w3.org/2000/svg">
                                                                                            <path fill-rule="evenodd"
                                                                                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                                                clip-rule="evenodd"></path>
                                                                                        </svg>
                                                                                        Export pdf
                                                                                    </button>
                                                                                    <button @click="trueQueueModel = false"
                                                                                        type="button"
                                                                                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-[#303030] rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                                                                                        <svg aria-hidden="true"
                                                                                            class="w-5 h-5"
                                                                                            fill="currentColor"
                                                                                            viewBox="0 0 20 20"
                                                                                            xmlns="http://www.w3.org/2000/svg">
                                                                                            <path fill-rule="evenodd"
                                                                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                                                clip-rule="evenodd"></path>
                                                                                        </svg>
                                                                                        <span class="sr-only">Close
                                                                                            modal</span>
                                                                                    </button>
                                                                                </div>
                                                                                <!-- Modal body -->
                                                                                <form action="#" id="pdf">
                                                                                    <div
                                                                                        class="grid gap-4 mb-4 sm:grid-cols-2">
                                                                                        <!-- topic -->
                                                                                        <div>
                                                                                            <label for="topic"
                                                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">หัวข้อ</label>
                                                                                            <p
                                                                                                class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                                                                                {{ truequeue.topic }}
                                                                                            </p>
                                                                                        </div>
                                                                                        <br>
                                                                                        <!-- status -->
                                                                                        <div>
                                                                                            <label for="status"
                                                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">สถานะ</label>
                                                                                            <p
                                                                                                class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                                                                                {{ truequeue.status ?
                                                                                                    "ตรวจสอบเเล้ว" :
                                                                                                    "ยังไม่ตรวจ"
                                                                                                }}
                                                                                            </p>
                                                                                        </div>
                                                                                        <!-- locations -->
                                                                                        <div>
                                                                                            <label for="status"
                                                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">ประเภทการตรวจ</label>
                                                                                            <p
                                                                                                class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                                                                                {{ truequeue.locations ?
                                                                                                    "ออนไลน์" : "ออนไซร์" }}
                                                                                            </p>
                                                                                        </div>
                                                                                        <!-- startDate -->
                                                                                        <div>
                                                                                            <label for="dateQueue"
                                                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">วันนัดหมาย</label>
                                                                                            <p
                                                                                                class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                                                                                {{
                                                                                                    formatDate(truequeue.startDate)
                                                                                                }}
                                                                                            </p>
                                                                                        </div>
                                                                                        <!-- endDate -->
                                                                                        <div>
                                                                                            <label for="updatedAt"
                                                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">วันที่เข้าตรวจ</label>
                                                                                            <p
                                                                                                class="text-left p-2.5 bg-gray-50 border rounded-lg">
                                                                                                {{
                                                                                                    formatDate(truequeue.endDate)
                                                                                                    ?
                                                                                                    formatDate(truequeue.endDate)
                                                                                                    : "ยังไม่ได้รับการตรวจ"
                                                                                                }}
                                                                                            </p>
                                                                                        </div>
                                                                                        <!-- note -->
                                                                                        <div class="sm:col-span-2">
                                                                                            <label for="description"
                                                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">คำแนะนำ</label>
                                                                                            <p
                                                                                                class="block p-2.5 w-full text-sm text-[#303030] bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 text-left">
                                                                                                {{ truequeue.note ?
                                                                                                    truequeue.note : "ไม่มี" }}
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
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Main modal Layout Queue Add -->
                                    <div id="AddModel" tabindex="-1" aria-hidden="true"
                                        :class="{ hidden: !AddModel, flex: AddModel }"
                                        class="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full backdrop-contrast-25 bg-black/5">
                                        <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
                                            <!-- Modal content -->
                                            <div class="relative p-4 bg-white rounded-lg shadow sm:p-5">
                                                <!-- Modal header -->
                                                <div class="flex justify-between items-center rounded-t border-b sm:mb-5">
                                                    <h3 class="text-lg font-semibold text-[#303030]">
                                                        เพิ่มคิว
                                                    </h3>
                                                    <button @click="AddModel = false" type="button"
                                                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-[#303030] rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                                                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor"
                                                            viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd"
                                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                clip-rule="evenodd"></path>
                                                        </svg>
                                                        <span class="sr-only">Close modal</span>
                                                    </button>
                                                </div>
                                                <!-- Modal body -->

                                                <!--
                                                
                                                ค่าที่ถูกแก้ไขใน Modal กลับไปสู่ค่าเดิมที่ถูกเก็บไว้ใน state 
                                                ทำให้เกิดปัญหาค่าที่ค้างอยู่จากการแก้ไขครั้งก่อนหน้า 
                                                การทำให้ inputData เป็น reactive ทำให้มีการทำ snapshot ของค่าที่เก็บไว้ใน data 
                                                ทำให้มีปัญหาเมื่อเปิด Modal ใหม่ ค่าของ inputData จะกลับไปเป็นค่าเดิมที่ถูกเก็บไว้แต่ก่อนเปิด Modal
                                                
                                                แก้ไขปัญหานี้คือให้ใช้ค่า key ใน v-if ของ Modal เพื่อทำให้ Vue.js ทำการ Render Modal ใหม่ทุกครั้งที่มีการเปิด Modal จะสร้าง instance ใหม่ขึ้นมา
                                                ทำให้ Vue.js ทำการ render Modal ใหม่ทุกครั้งที่ SelectAddModal._id เปลี่ยนแปลง
                                                
                                            -->
                                                <form action="#">
                                                    <div v-if="AddModel" :key="SelectAddModal._id"
                                                        class="grid gap-4 mb-4 sm:grid-cols-2">
                                                        <!-- _id -->
                                                        <div>
                                                            <label for="_id"
                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">ไอดี</label>
                                                            <p class="text-left p-2.5  text-base ">
                                                                {{ SelectAddModal._id }}
                                                            </p>
                                                        </div>
                                                        <!-- idCard -->
                                                        <div>
                                                            <label for="idCard"
                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">รหัสบัตรประชาชน</label>
                                                            <p class="text-left p-2.5  text-base">
                                                                {{ SelectAddModal.idCard }}
                                                            </p>
                                                        </div>
                                                        <!-- firstname -->
                                                        <div>
                                                            <label for="firstname"
                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">ชื่อจริง</label>
                                                            <p class="text-left p-2.5  text-base">
                                                                {{ SelectAddModal.firstname }}
                                                            </p>
                                                        </div>
                                                        <!-- lastname -->
                                                        <div>
                                                            <label for="lastname"
                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">นามสกุล</label>
                                                            <p class="text-left p-2.5 text-base">
                                                                {{ SelectAddModal.lastname }}
                                                            </p>
                                                        </div>

                                                        <!-- topic -->
                                                        <div>
                                                            <label for="topic"
                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">หัวข้อ</label>
                                                            <input type="text" name="topic" id="topic" value=""
                                                                v-model="inputData.topic"
                                                                class="bg-gray-50 border border-gray-300 text-[#303030] text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                                placeholder="หัวข้อ" />
                                                        </div>
                                                        <br />
                                                        <!-- dateQueue -->
                                                        <div>
                                                            <label for="dateQueue"
                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">ประเภทการตรวจ</label>
                                                            <div class="ml-4 text-start">
                                                                <label class="">
                                                                    <input type="radio" class="" name="online" value="false"
                                                                        v-model="inputData.locations" />
                                                                    <span class="ml-2">ออนไลน์</span>
                                                                </label>
                                                                <label class="ml-6">
                                                                    <input type="radio" class="" name="onsite" value="true"
                                                                        v-model="inputData.locations" />
                                                                    <span class="ml-2">ออนไซต์</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label for="dateQueue"
                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">วันนัดหมาย</label>
                                                            <input
                                                                class="bg-gray-50 border border-gray-300 text-[#303030] text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                                type="date" v-model="inputData.startDate"
                                                                placeholder="วว/ดด/ปปปป" />
                                                        </div>
                                                        <div class="sm:col-span-2">
                                                            <label for="description"
                                                                class="block mb-2 text-lg font-bold text-[#303030] text-left">คำแนะนำ</label>
                                                            <textarea id="description" rows="5"
                                                                class="block p-2.5 w-full text-sm text-[#303030] bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                                                                placeholder="Write a description..."
                                                                v-model="inputData.note"></textarea>
                                                        </div>
                                                    </div>
                                                    <div class="flex items-center content-center space-x-4">
                                                        <button @click="addQueue_Btn(SelectAddModal)" type="button"
                                                            class="text-[#140A4B] inline-flex items-center hover:text-white border border-[#140A4B] hover:bg-[#140A4B] focus:ring-4 focus:outline-none focus:ring-[#140A4B] font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                                            <svg class="mr-1 -ml-1 w-5 h-5" fill="currentColor"
                                                                viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                <path fill-rule="evenodd"
                                                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                    clip-rule="evenodd"></path>
                                                            </svg>
                                                            เพิ่มคิว
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <nav v-if="!searchQuery"
                        class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
                        aria-label="Table navigation">
                        <span class="text-sm font-normal text-gray-500 ">
                            Showing
                            <span class="font-semibold text-gray-900 ">{{ startIndex + 1 }}-{{ endIndex + 1 }}</span>
                            of
                            <span class="font-semibold text-gray-900 ">{{ Queue.length }}</span>
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
                                <button @click="movePage(1)" :disabled="endIndex >= Queue.length"
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

<style>
@media print {
    .export-pdf-button {
        display: none;
    }
}</style>
