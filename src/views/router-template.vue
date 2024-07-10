<template>
  <Navbar />
  <router-view></router-view>
  <Bottombar />
</template>

<script>
import Bottombar from "@/components/Bottombar.vue";
import Navbar from "@/components/Navbar.vue";

export default {
  name: "RouterTemplate",

  components: {
    Navbar,
    Bottombar
},
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>
