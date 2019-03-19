<template>
  <div class="footer-container">
    <div class="logo">
      <img src="~@/assets/logo.svg" />
      <span>SHIELD</span>
    </div>
    <p>POWERED BY SHIELD.IO</p>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.footer-container {
  text-align: center;
  background: $color-background-card;
  margin-top: $basic-margin;
  padding: $basic-padding;
  color: $color-grey-1;

  .logo {
    img {
      width: 32px;
      margin-right: 8px;
    }
    span {
      position: relative;
      top: -8px;
    }
  }
}
</style>

