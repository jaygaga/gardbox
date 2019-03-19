<template>
  <div class="passport-container">
    <img src="~@/assets/logo.svg" />
    <card>
      <router-link to="create">
        <el-button
          type="primary"
          class="btn"
        >Create Wallet</el-button>
      </router-link>
      <router-link to="login">
        <el-button
          type="primary"
          class="btn"
        >LogIn</el-button>
      </router-link>
      <router-link to="recover">
        <el-button
          type="primary"
          class="btn"
        >Recover Wallet</el-button>
      </router-link>
    </card>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.passport-container {
  width: 400px;
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

