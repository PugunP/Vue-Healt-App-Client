<template>
  <h1 class="flex justify-center font-bold text-lg text-[#140A4B] mt-4">
    คิวส่วนตัว
  </h1>
  <div class="flex items-start">
    <!-- เพิ่ม Toggle Switch -->
    <label class="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        v-model="toggleStatus"
        @change="showInfo"
        class="sr-only peer"
      />
      <div
        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
      ></div>
    </label>

    <!-- ข้อความต่อมา -->
    <p class="ms-3 text-ls font-medium text-[#303030]">
      {{ toggleStatus ? "คิว : ได้รับการตรวจ" : "คิว : กำลังรอตรวจ" }}
    </p>
  </div>

  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-lg text-left text-gray-500">
      <thead class="text-xl text-[#FDFDFD] uppercase bg-[#140A4B]">
        <tr>
          <th scope="col" class="px-6 py-3 text-center">หัวข้อ</th>
          <th scope="col" class="px-6 py-3 text-center">วันที่นัดหมาย</th>
          <th scope="col" class="px-6 py-3 text-center">สถานะการตรวจ</th>
          <th scope="col" class="px-6 py-3 text-center">วันที่เข้าตรวจ</th>
          <th scope="col" class="px-6 py-3 text-center">ประเภทการตรวจ</th>
          <th scope="col" class="px-6 py-3 text-center">คำแนะนำ</th>
        </tr>
      </thead>
      <tbody v-if="Queue.length > 0">
        <tr
          v-for="(item, index) in sortedQueue.slice(0, 5)"
          :key="item._id"
          :class="{
            'bg-white': index % 2 === 0,
            'bg-[#F6F6F6]': index % 2 !== 0,
          }"
          class="border-b"
        >
          <th
            scope="row"
            class="px-6 py-4 font-medium text-[#303030] whitespace-nowrap text-center"
          >
            {{ item.topic }}
          </th>
          <td class="px-6 py-4 text-center">
            {{ formatDate(item.startDate) }}
          </td>
          <td
            class="px-6 py-4 text-center"
            :class="{
              'text-red-500': item.status === false,
              'text-green-500': item.status === true,
            }"
          >
            {{ item.status === false ? "กำลังรอการตรวจ" : "ได้รับการตรวจ" }}
          </td>
          <td class="px-6 text-center">
            {{
              item.endDate == null
                ? "ยังไม่ได้เข้าตรวจ"
                : formatDate(item.endDate)
            }}
          </td>
          <td
            class="px-6 text-center"
            :class="{
              'text-red-500': item.locations === false,
              'text-green-500': item.locations === true,
            }"
          >
            {{ item.locations === false ? "ออนไลน์" : "ออนไซต์" }}
          </td>
          <td class="px-6 py-4 text-center">
            <!-- QueueInfo -->
            <button
              @click="QueueModal(item)"
              class="inline-flex items-center p-0.5 text-lg font-bold text-center text-[#303030] hover:text-gray-800 rounded-lg focus:outline-none"
              type="button"
            >
              <svg
                class="w-[16px] h-[16px] text-[#303030]"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </button>
            <!-- Main modal Layout info Queue -->
            <div
              id="infoQueueModal"
              tabindex="-1"
              aria-hidden="true"
              :class="{ hidden: !QueueModel, flex: QueueModel }"
              class="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full backdrop-contrast-25 bg-black/5"
            >
              <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
                <!-- Modal content -->
                <div class="relative p-4 bg-white rounded-lg shadow sm:p-5">
                  <!-- Modal header -->
                  <div
                    class="flex justify-between items-center rounded-t border-b sm:mb-5"
                  >
                    <h3 class="text-lg font-semibold text-[#303030]">
                      {{ infoqueues.topic }}
                    </h3>
                    <button
                      @click="QueueModel = false"
                      type="button"
                      class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-[#303030] rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    >
                      <svg
                        aria-hidden="true"
                        class="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <span class="sr-only">Close modal</span>
                    </button>
                  </div>
                  <!-- Modal body -->
                  <form action="#">
                    <div class="grid gap-4 mb-4 sm:grid-cols-2">
                      <!-- dateQueue -->
                      <div>
                        <label
                          for="dateQueue"
                          class="block mb-2 text-lg font-bold text-[#303030] text-left"
                          >วันนัดหมาย</label
                        >
                        <p class="text-left p-2.5 bg-gray-50 border rounded-lg">
                          {{ formatDate(infoqueues.startDate) }}
                        </p>
                      </div>
                      <!-- endDate -->
                      <div>
                        <label
                          for="endDate"
                          class="block mb-2 text-lg font-bold text-[#303030] text-left"
                          >วันที่เข้าตรวจ</label
                        >
                        <p class="text-left p-2.5 bg-gray-50 border rounded-lg">
                          {{
                            infoqueues.endDate == null
                              ? "รอการเข้าตรวจ"
                              : formatDate(infoqueues.endDate)
                          }}
                        </p>
                      </div>
                    </div>
                    <!-- note -->
                    <div>
                      <label
                        for="note"
                        class="block mb-2 text-lg font-bold text-[#303030] text-left"
                        >คำแนะนำจากคุณหมอ</label
                      >
                      <p class="text-left p-2.5 bg-gray-50 border rounded-lg">
                        {{
                          infoqueues.note && infoqueues.note.trim() !== ""
                            ? infoqueues.note
                            : "ขณะนี้ยังไม่ได้รับการตรวจสอบ"
                        }}
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr
          class="bg-white border-b justify-center items-center text-center text-[#303030]"
        >
          <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
            ยังไม่เคยได้รับการเข้าตรวจ
          </th>
          <td scope="row" class="px-6 py-4 font-medium whitespace-nowrap"></td>
          <td scope="row" class="px-6 py-4 font-medium whitespace-nowrap"></td>
          <td scope="row" class="px-6 py-4 font-medium whitespace-nowrap"></td>
          <td scope="row" class="px-6 py-4 font-medium whitespace-nowrap"></td>
          <td scope="row" class="px-6 py-4 font-medium whitespace-nowrap"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { GETMEQUEUES } from "@/APIGate";
import axios from "axios";
export default {
  data() {
    return {
      Queue: [], // เตรียมใช้งานคิวเป็นอาร์เรย์ว่าง
      showMessage: false, // เริ่มต้น showMessage เป็นเท็จ
      activeItem: null, // เตรียมใช้งาน activeItem เป็น null
      QueueModel: false,
      infoqueues: {},
      toggleStatus: false,
    };
  },
  computed: {
    sortedQueue() {
  // เรียงลำดับคิวตามวันที่เริ่มต้น (startDate)
  const sortedByStartDate = this.Queue.slice().sort((a, b) => {
    return new Date(b.startDate) - new Date(a.startDate);
  });

  // แบ่งข้อมูลเป็นสองกลุ่ม: กลุ่มที่มี status === false และกลุ่มที่มี status === true
  const groupFalse = sortedByStartDate.filter(item => item.status === false);
  const groupTrue = this.Queue.filter(item => item.status === true);

  // รวมกลุ่มทั้งสองโดยให้กลุ่มที่มี status === false มีการเรียงลำดับตามวันที่เริ่มต้น (startDate)
  // และกลุ่มที่มี status === true มีการเรียงลำดับตามวันที่สิ้นสุด (endDate)
  const mergedGroups = [
    ...groupFalse,
    ...groupTrue.sort((a, b) => {
      return new Date(b.endDate) - new Date(a.endDate);
    }),
  ];

  return mergedGroups;
},

  },
  created() {
    this.showInfo();
  },
  methods: {
    showInfo() {
      try {
        axios({
          method: "get",
          url: `${GETMEQUEUES}`,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        })
          .then((res) => {
            // กรองข้อมูลตามสถานะที่ต้องการ
            this.Queue = res.data.filter(
              (item) => item.status === this.toggleStatus
            );
            console.log(this.Queue);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {}
    },
    formatDate(date) {
      // ฟังก์ชั่นจัดรูปแบบวันที่ (ปรับแต่งได้ตามต้องการ)
      return new Date(date).toLocaleDateString();
    },
    QueueModal(queues) {
      this.infoqueues = queues;
      console.log(queues);
      this.QueueModel = true;
    },
  },
};
</script>

<style>
.note-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: #3498db;
  color: #fff;
  border: none;
  cursor: pointer;
}

.note-btnSVG {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  /* เพิ่ม margin ถ้าต้องการช่องว่างระหว่าง SVG กับข้อความ */
}
</style>
