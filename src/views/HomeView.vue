<template>
  <div class="page-container">
    <LandingPage />
  </div>
</template>

<script>
import Swal from "sweetalert2";
import { GETME } from '@/APIGate';
import axios from "axios";


// import Map from "@/components/Map.vue"
import LandingPage from "@/components/LandingPage.vue";
// import axios from "axios";

export default {
  name: "homePage",
  components: {LandingPage},
  data() {
    return {
      profileData: {},
      formData: {},
    };
  },
  created(){
    this.check();
  },
  methods: {
    check() {
  axios({
    method: "get",
    url: `${GETME}`,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  })
  .then(async (res) => {
    this.formData.district = res.data.user.address.district;
    this.formData.houseNo = res.data.user.address.houseNo;
    this.formData.postalCode = res.data.user.address.postalCode;
    this.formData.moo = res.data.user.address.moo;
    this.formData.province = res.data.user.address.province;
    this.formData.road = res.data.user.address.road;
    this.formData.soi = res.data.user.address.soi;
    this.formData.subDistrict = res.data.user.address.subDistrict;

    if (
      !this.formData.district ||
      !this.formData.houseNo ||
      !this.formData.postalCode ||
      !this.formData.moo ||
      !this.formData.province ||
      !this.formData.road ||
      !this.formData.soi ||
      !this.formData.subDistrict
    ) {
      this.showDiv = true;
      await Swal.fire({
        icon: "warning",
        title: "ขออภัย...",
        text: "กรุณากรอกข้อมูลประวัติส่วนตัวให้ครบ",
      });
      this.$router.push("/account-info");
    } else {
      this.showDiv = false;
    }
  })
  .catch((error) => {
    console.error(error);
  });
},

  },
};
</script>

<style >
@import "@/style/main.scss";
.page-container {
  width: 1440px;
  position: relative;
  margin: 0 auto;
  transition: all 0.3s;

  @media screen and (max-width: 1920px) {
    width: 1280px;
  }

  @media screen and (max-width: 1600px) {
    width: 1280px;
  }

  @media screen and (max-width: 1440px) {
    width: 1280px;
  }

  @media screen and (max-width: 1280px) {
    width: 1024px;
  }

  @media screen and (max-width: 1024px) {
    width: 768px;
  }

  @media screen and (max-width: 960px) {
    width: 768px;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
  }
}
</style>
