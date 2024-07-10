<template>
  <div class="footer-label bg-gray-800" >
    <div class="wrapper">
      <p>KMITL</p>
      <p class="hide-on-mobile">King mongkut's institute of technology ladkrabang</p>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import "@/style/main.scss";
.footer-label {
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 4px 0;
  z-index: 998;
  .wrapper {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    p {
      padding: 0;
      margin: 0;
      font-family: "SF Pro Display";
      font-size: small;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
      color: #FFFFFF;
      text-align: center;
    }
  }

  @media screen and (max-width: 768px) {
    padding: 4px 0;
    width: 100%;
    .wrapper {
      flex-direction: column;
      align-items: center;

      p {
        font-size: 1.25em !important;
        line-height: unset;
      }
    }
    .hide-on-mobile{
      display: none;
    }
  }
}

.transparent-bg {
  background-color: transparent !important;
  padding: 10px 0 !important;
}
</style>