<template>
  <div class="recover-container">
    <img src="~@/assets/logo.svg" />
    <s-card>
      <router-link to="/recover/key">
        <el-button
          type="primary"
          class="btn"
        >{{$t('recover.key')}}</el-button>
      </router-link>
      <router-link to="/recover/phrase">
        <el-button
          type="primary"
          class="btn"
        >{{$t('recover.phrase')}}</el-button>
      </router-link>
    </s-card>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.recover-container {
  width: $xs;
  margin: 0 auto;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  text-align: center;

  img {
    width: 160px;
  }

  .btn {
    width: 100%;
    margin: 24px 0;
  }
}
</style>

