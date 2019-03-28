<template>
  <div class="address">{{address | gardAddr}}
    <img
      class="copy-icon"
      src="~@/assets/icon-copy.svg"
      v-clipboard:copy="address"
      v-clipboard:success="onCopy"
    />
  </div>
</template>

<script>
export default {
  props: {
    address: { type: String, default: true }
  },
  methods: {
    onCopy() {
      this.$message({
        type: "success",
        message: this.$t("home.copy")
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.copy-icon {
  width: 20px;
  position: relative;
  top: 4px;
  left: 8px;
}
</style>
