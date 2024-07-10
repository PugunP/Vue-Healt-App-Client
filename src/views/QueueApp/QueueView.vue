<template>
  <div class="page-container">
    <div class="mt-4">
      <Queue />
    </div>
    <div class="">
      <h1 class="mt-6">ช่องทางการติดต่อ <a href="https://lin.ee/THyM1sN" target="_blank" rel="noopener noreferrer" class="text-[#EB1851]"> "คลิ๊ก"</a></h1>
      
    </div>
  </div>
</template>

<script>
import Queue from "@/components/Queue.vue";
export default {
  name: "ServicePage",
  components: { Queue },
  data() {
    return {
      profileData: {},
    };
  },
  methods: {},
};
</script>

<style>
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
