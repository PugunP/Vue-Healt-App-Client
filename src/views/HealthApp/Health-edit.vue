<script>
import { ADDMEHEALTH } from "@/APIGate";
import axios from "axios";
import mqtt from "mqtt";
import { MQTT_URL, MQTT_OPTIONS } from "@/MQTTGate";

export default {
  name: "HealthEdit",
  data() {
    return {
      health: {},
    };
  },

  methods: {
    editHealth() {
      if (
        !this.health.bloodPressure ||
        !this.health.oxygen ||
        !this.health.temperature ||
        !this.health.heartRate
      ) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return Promise.reject("กรุณากรอกข้อมูลให้ครบถ้วน");
      }

      return axios({
        method: "post",
        url: `${ADDMEHEALTH}`,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        data: this.health,
      });
    },
  },
  mounted() {
    // const client = mqtt.connect("wss://b5acc8ef6a294158bc159f1c7534c9be.s1.eu.hivemq.cloud:8884/mqtt", { username: "pakinjinjai", password: "0652358039+-Kk"});
    const client = mqtt.connect(MQTT_URL, MQTT_OPTIONS);

    client.on("connect", (topic, message) => {
      client.subscribe("pulseSensor_Pathio_ioT");
      console.log("MQTT Connected");
    });

    client.on("message", (topic, message) => {
      this.health.heartRate = message.toString();
      console.log(message.toString());
    });
  },
};
</script>

<template>
  <div class="container flex flex-col items-center gap-16 mx-auto mt-8">
    <div class="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2">
      <div
        class="flex flex-col items-center gap-3 px-8 py-10 bg-[#ffffff] mt-4 rounded-3xl hover:shadow shadow-main border-2 border-[#D9D9D9]">
        <p class="flex text-xl text-[#303030]">
          ความดันโลหิต
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            class="tem"
            id="wave">
            <path
              d="M25.031 1008.362c-1.693 0-2.976.841-3.875 2-.899 1.16-1.502 2.649-2.062 4.094-.56 1.446-1.068 2.84-1.719 3.844s-1.333 1.594-2.406 1.594H2.563a.5.5 0 1 0 0 1h12.406c1.452 0 2.502-.878 3.25-2.032.748-1.154 1.257-2.63 1.812-4.062.556-1.433 1.163-2.813 1.938-3.813.775-1 1.681-1.625 3.062-1.625.613 0 1.16.274 1.75.844.59.57 1.194 1.449 1.75 2.5 1.114 2.103 2.107 4.966 3.157 7.844 1.05 2.878 2.145 5.753 3.437 7.969.646 1.107 1.354 2.066 2.156 2.75.802.683 1.73 1.093 2.75 1.093 1.635 0 2.953-.826 4-1.969 1.047-1.142 1.853-2.609 2.563-4.062.71-1.453 1.317-2.87 1.906-3.906.294-.518.579-.96.844-1.219.265-.26.492-.344.687-.344 4.948 0 3.015.031 11.407.031a.5.5 0 1 0 0-1c-8.39 0-6.458-.03-11.407-.03-.527 0-.997.286-1.375.655-.377.37-.712.846-1.031 1.407-.637 1.12-1.244 2.547-1.938 3.968-.693 1.422-1.477 2.83-2.406 3.844-.928 1.014-1.94 1.625-3.25 1.625-.749 0-1.452-.3-2.125-.875-.673-.574-1.295-1.42-1.906-2.469-1.223-2.096-2.327-4.94-3.375-7.812s-2.049-5.759-3.219-7.969c-.585-1.105-1.195-2.062-1.906-2.75-.711-.687-1.544-1.125-2.469-1.125z"
              color="#000"
              font-family="Sans"
              font-weight="400"
              overflow="visible"
              transform="translate(0 -988.362)"
              style="
                text-indent: 0;
                text-align: start;
                line-height: normal;
                text-transform: none;
                block-progression: tb;
                marker: none;
                -inkscape-font-specification: Sans;
              "></path>
          </svg>
        </p>
        <span
          ><p class="text-base leading-7 text-[#303030] flex items-center">
            <input
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2 hover:shadow ml-12 mr-2"
              placeholder=""
              required=""
              id="bloodPressure"
              v-model="health.bloodPressure" />
            mmHg
          </p>
        </span>
      </div>
      <div
        class="flex flex-col items-center gap-3 px-8 py-10 bg-[#ffffff] mt-4 rounded-3xl hover:shadow shadow-main border-2 border-[#D9D9D9]">
        <p class="flex text-xl text-[#303030]">
          ปริมาณออกซิเจนในเลือด
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            class="svg"
            id="heal">
            <path
              fill="#000"
              fill-rule="evenodd"
              d="M6.55814 9.79992C6.55814 8.9899 7.18286 8.33325 7.95349 8.33325H10C10.7706 8.33325 11.3953 8.9899 11.3953 9.79992V12.6355C11.3953 12.9055 11.6036 13.1244 11.8605 13.1244H14.5581C15.3288 13.1244 15.9535 13.781 15.9535 14.591V16.7421C15.9535 17.5522 15.3288 18.2088 14.5581 18.2088H11.8605C11.6036 18.2088 11.3953 18.4277 11.3953 18.6977V21.5333C11.3953 22.3433 10.7706 22.9999 10 22.9999H7.95349C7.18286 22.9999 6.55814 22.3433 6.55814 21.5333V18.6977C6.55814 18.4277 6.3499 18.2088 6.09302 18.2088H3.39535C2.62472 18.2088 2 17.5522 2 16.7421V14.591C2 13.781 2.62472 13.1244 3.39535 13.1244H6.09302C6.3499 13.1244 6.55814 12.9055 6.55814 12.6355V9.79992zM7.95349 9.31103C7.69661 9.31103 7.48837 9.52991 7.48837 9.79992V12.6355C7.48837 13.4455 6.86365 14.1021 6.09302 14.1021H3.39535C3.13847 14.1021 2.93023 14.321 2.93023 14.591V16.7421C2.93023 17.0121 3.13847 17.231 3.39535 17.231H6.09302C6.86365 17.231 7.48837 17.8877 7.48837 18.6977V21.5333C7.48837 21.8033 7.69661 22.0221 7.95349 22.0221H10C10.2569 22.0221 10.4651 21.8033 10.4651 21.5333V18.6977C10.4651 17.8877 11.0898 17.231 11.8605 17.231H14.5581C14.815 17.231 15.0233 17.0121 15.0233 16.7421V14.591C15.0233 14.321 14.815 14.1021 14.5581 14.1021H11.8605C11.0898 14.1021 10.4651 13.4455 10.4651 12.6355V9.79992C10.4651 9.52991 10.2569 9.31103 10 9.31103H7.95349zM17.4419 6.37768C17.4419 5.83767 17.8584 5.3999 18.3721 5.3999H19.1163C19.6301 5.3999 20.0465 5.83767 20.0465 6.37768V7.45324H21.0697C21.5834 7.45324 21.9999 7.89101 21.9999 8.43102V9.21324C21.9999 9.75326 21.5834 10.191 21.0697 10.191H20.0465V11.2666C20.0465 11.8066 19.6301 12.2443 19.1163 12.2443H18.3721C17.8584 12.2443 17.4419 11.8066 17.4419 11.2666V10.191H16.4185C15.9048 10.191 15.4883 9.75326 15.4883 9.21324V8.43102C15.4883 7.89101 15.9048 7.45324 16.4185 7.45324H17.4419V6.37768zM19.1163 6.37768H18.3721V7.45324C18.3721 7.99326 17.9556 8.43102 17.4419 8.43102L16.4185 8.43102V9.21324H17.4419C17.9556 9.21324 18.3721 9.65101 18.3721 10.191V11.2666H19.1163V10.191C19.1163 9.65101 19.5328 9.21324 20.0465 9.21324L21.0697 9.21324V8.43102H20.0465C19.5328 8.43102 19.1163 7.99326 19.1163 7.45324L19.1163 6.37768zM11.3955 1.97778C11.3955 1.43777 11.812 1 12.3257 1H13.0699C13.5837 1 14.0002 1.43777 14.0002 1.97778V3.05334H15.0233C15.537 3.05334 15.9535 3.49111 15.9535 4.03112V4.81334C15.9535 5.35335 15.537 5.79112 15.0233 5.79112H14.0002V6.86667C14.0002 7.40668 13.5837 7.84444 13.0699 7.84444H12.3257C11.812 7.84444 11.3955 7.40668 11.3955 6.86667V5.79112H10.3721C9.85837 5.79112 9.44189 5.35335 9.44189 4.81334V4.03112C9.44189 3.49111 9.85837 3.05334 10.3721 3.05334H11.3955V1.97778zM13.0699 1.97778H12.3257V3.05334C12.3257 3.59335 11.9093 4.03112 11.3955 4.03112L10.3721 4.03112V4.81334H11.3955C11.9093 4.81334 12.3257 5.25111 12.3257 5.79112V6.86667H13.0699V5.79112C13.0699 5.25111 13.4864 4.81334 14.0002 4.81334L15.0233 4.81334V4.03112H14.0002C13.4864 4.03112 13.0699 3.59335 13.0699 3.05334L13.0699 1.97778z"
              clip-rule="evenodd"></path>
          </svg>
        </p>
        <span>
          <p class="text-base leading-7 text-[#303030] flex items-center">
            <input
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2 hover:shadow ml-12 mr-2"
              placeholder=""
              required=""
              id="oxygen"
              v-model="health.oxygen" />
            %
          </p>
        </span>
      </div>
      <div
        class="flex flex-col items-center gap-3 px-8 py-10 bg-[#ffffff] mt-4 rounded-3xl hover:shadow shadow-main border-2 border-[#D9D9D9]">
        <p class="flex text-xl text-[#303030]">
          ค่าอุณภูมิร่างกาย
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            class="svg"
            id="tem">
            <path d="M57.5 45H65v5h-7.5z"></path>
            <path
              d="M50 5c-8.284 0-15 6.716-15 15v41.802c-3.103 3.524-5 8.134-5 13.198 0 11.046 8.954 20 20 20 .36 0 .723-.01 1.087-.029 10.33-.547 18.674-9.169 18.908-19.511.119-5.245-1.798-10.028-4.995-13.658V55h-7.5v9.633l1.871 2.125a12.456 12.456 0 0 1 3.125 8.532c-.144 6.385-5.441 11.854-11.806 12.191-.23.013-.461.019-.69.019-6.893 0-12.5-5.607-12.5-12.5a12.47 12.47 0 0 1 3.129-8.242l1.871-2.125V20c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5H65c0-8.284-6.716-15-15-15z"></path>
            <path
              d="M57.5 35H65v5h-7.5zM57.5 25H65v5h-7.5zM47.5 35v32.938c-2.908 1.033-5 3.804-5 7.063 0 4.136 3.364 7.5 7.5 7.5s7.5-3.364 7.5-7.5c0-3.258-2.092-6.03-5-7.063V35h-5z"></path>
          </svg>
        </p>
        <span
          ><p class="text-base leading-7 text-[#303030] flex items-center">
            <input
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2 hover:shadow ml-7 mr-2"
              placeholder=""
              required=""
              id="temperature"
              v-model="health.temperature" />
            °C
          </p>
        </span>
      </div>
      <div
        class="flex flex-col items-center gap-3 px-8 py-10 bg-[#ffffff] mt-4 rounded-3xl hover:shadow shadow-main border-2 border-[#D9D9D9]">
        <p class="flex text-xl text-[#303030]">
          อัตราการเต้นของหัวใจ
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            class="svg"
            id="heart">
            <g data-name="Layer 26">
              <path
                d="M24 27a1 1 0 0 1-.92-.68L19.7 16.26l-2.87 4.29A1 1 0 0 1 16 21H3a1 1 0 0 1 0-2h12.46l3.71-5.55a1 1 0 0 1 1-.44 1 1 0 0 1 .82.67l3.14 9.41 3-7.46A1 1 0 0 1 28 15a1 1 0 0 1 .93.65l1.87 5 .22-.88A1 1 0 0 1 32 19h13a1 1 0 0 1 0 2H32.78L32 24.24a1 1 0 0 1-1.91.11L28 18.77l-3 7.6a1 1 0 0 1-1 .63Z"></path>
              <path
                d="M4.9 17a1 1 0 0 0 .92-.83 10.18 10.18 0 0 1 2.9-5.8 10.59 10.59 0 0 1 12.8-1.57 7.89 7.89 0 0 1 1.76 1.56 1 1 0 0 0 1.44 0 7.89 7.89 0 0 1 1.76-1.56 10.59 10.59 0 0 1 12.8 1.57 10.18 10.18 0 0 1 2.9 5.8 1 1 0 0 0 .92.83h.15a.93.93 0 0 0 .92-1.07A12.3 12.3 0 0 0 24 8.3a12.3 12.3 0 0 0-20.17 7.63.93.93 0 0 0 .92 1.07zm36.44 6a1 1 0 0 0-.83.45C41 23.45 24.35 39.8 24 40.23c-.39-.47-17-16.74-16.51-16.78a1 1 0 0 0-.83-.45 1 1 0 0 0-.83 1.58c-.65-.09 17 17.28 17.46 17.77a1 1 0 0 0 1.42 0c.46-.54 18-17.8 17.46-17.77a1 1 0 0 0-.83-1.58z"></path>
            </g>
          </svg>
        </p>
        <span
          ><p class="text-base leading-7 text-[#303030] flex items-center">
            <input
              class="bg-gray-50 border border-gray-300 text-[#303030] sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2 hover:shadow ml-7 mr-2"
              placeholder=""
              required=""
              id="heartRate"
              v-model="health.heartRate" />
            bpm
          </p>
        </span>
      </div>
    </div>
  </div>
</template>

<style>
.svg {
  width: 64px;
  height: 45px;
}
</style>
