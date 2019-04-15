<template>
  <s-page class="import-container">
    <s-card
      class="recover-card"
      :title="$t('passport.recover')"
    >
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
        type="card"
      >
        <el-tab-pane
          :label="$t('recover.key')"
          name="0"
        >
          <RouterView />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('recover.keyFile')"
          name="1"
        >
          <RouterView />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('recover.phrase')"
          name="2"
        >
          <RouterView />
        </el-tab-pane>
      </el-tabs>
    </s-card>
  </s-page>
</template>

<script>
import btnIcon1 from "@/assets/btn-icon-4.svg";
import btnIcon2 from "@/assets/btn-icon-3.svg";

const routes = [
  "/recover/key/text",
  "/recover/key/file",
  "/recover/phrase/text"
];

export default {
  data() {
    return {
      activeName: "0",
      btnIcon1,
      btnIcon2
    };
  },
  methods: {
    handleClick(tab) {
      this.$router.push(routes[this.activeName - 0]);
    }
  },
  mounted() {
    this.activeName = routes.findIndex(i => i === this.$route.path) + "";
  }
};
</script>

<style lang="scss" scoped>
.import-container {
  margin: 0 auto;
  padding: $padding-large;
}
</style>

