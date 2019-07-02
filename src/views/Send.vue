<template>
  <s-page
    class="send-container"
    :link="link"
  >
    <router-view />
  </s-page>
</template>

<script>
export default {
  name: "Send",
  computed: {
    link() {
      return this.$route.path.match("/send/finish") ? "/main?tab=txs" : null;
    }
  },
  beforeDestroy() {
    this.$store.dispatch("transactions/input", { denom: "agard", fee: 0 });
  }
};
</script>

<style lang="scss" scoped>
.send-container {
  margin: 0 auto;
}
</style>

