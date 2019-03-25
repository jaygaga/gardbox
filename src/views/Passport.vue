<template>
  <div class="passport-container">
    <img src="~@/assets/logo.svg" />
    <s-card>
      <router-link to="create">
        <el-button
          type="primary"
          class="btn"
        >{{$t('passport.create')}}</el-button>
      </router-link>
      <router-link to="login">
        <el-button
          type="primary"
          class="btn"
        >{{$t('passport.login')}}</el-button>
      </router-link>
      <router-link to="recover">
        <el-button
          type="primary"
          class="btn"
        >{{$t('passport.recover')}}</el-button>
      </router-link>
    </s-card>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.passport-container {
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

