<template>
  <Navbar />
  <router-view></router-view>
</template>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  name: "RouterTemplate",

  components: {
    Navbar,
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>
