<template>
  <s-page class="import-container">
    <s-card
      class="recover-card"
      :title="$t('passport.recover')"
    >
      <div class="tabs">
        <router-link :to="routes[0]">
          <el-button
            :class="$route.path === routes[0] && 'active'"
            plain
            round
          >{{$t('recover.key')}}</el-button>
        </router-link>
        <router-link :to="routes[1]">
          <el-button
            :class="$route.path === routes[1] && 'active'"
            plain
            round
          >{{$t('recover.keyFile')}}</el-button>
        </router-link>
        <router-link :to="routes[2]">
          <el-button
            :class="$route.path === routes[2] && 'active'"
            plain
            round
          >{{$t('recover.phrase')}}</el-button>
        </router-link>
      </div>

      <RouterView />
    </s-card>
  </s-page>
</template>

<script>
const routes = [
  "/recover/key/text",
  "/recover/key/file",
  "/recover/phrase/input"
];

export default {
  data() {
    return {
      routes
    };
  }
};
</script>

<style lang="scss" scoped>
.import-container {
  margin: 0 auto;
  .recover-card {
    max-width: 460px;

    .tabs {
      display: flex;
      justify-content: space-between;

      button {
        background: rgba(255, 255, 255, 0.15);
        color: rgba(255, 255, 255, 0.65);
        border-color: transparent;
        transition: background-color $trans;
        &.active,
        &:hover {
          color: white;
          background: rgba(255, 255, 255, 0.4);
        }
      }
    }
  }
}
</style>

