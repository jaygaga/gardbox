<template>
  <s-page class="send-container">
    <router-view />
  </s-page>
</template>

<script>
export default {
  name: "Send",
  beforeDestroy() {
    this.$store.dispatch("transactions/input", { denom: "gard", fee: 0 });
  }
};
</script>

<style lang="scss" scoped>
.send-container {
  margin: 0 auto;
}
</style>

