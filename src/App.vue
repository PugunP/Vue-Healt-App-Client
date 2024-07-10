<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  components: {},
  mounted() {
    this.$router.push("/home");
  },
};
</script>

<style>
body {
  background-color: #f0ffff;
}
</style>
