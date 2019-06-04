<template>
  <s-page class="issue-container">
    <router-view />
  </s-page>
</template>

<script>
export default {
  name: "Issue",
  beforeDestroy() {
    this.$store.dispatch("issue/setForm", {});
  }
};
</script>

<style lang="scss" scoped>
.issue-container {
  margin: 0 auto;
}
</style>