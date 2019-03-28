<template>
  <s-card
    class="recover-card"
    :title="$t('passport.recover')"
  >
    <div class="recover-container">

      <s-btn-card
        class="btn-card"
        :title="$t('recover.key')"
        :src="btnIcon1"
        :breif="$t('recover.key')"
      >
        <router-link to="/recover/key">
          <el-button
            type="primary"
            class="btn"
          >{{$t('recover.key')}}</el-button>
        </router-link>
      </s-btn-card>

      <s-btn-card
        class="btn-card"
        :title="$t('recover.phrase')"
        :src="btnIcon2"
        :breif="$t('recover.phrase')"
      >
        <router-link to="/recover/phrase">
          <el-button
            type="primary"
            class="btn"
          >{{$t('recover.phrase')}}</el-button>
        </router-link>
      </s-btn-card>
    </div>

    <div class="form-footer">
      <el-button @click="$router.back()">{{$t('global.back')}}</el-button>
    </div>
  </s-card>

</template>

<script>
import btnIcon1 from "@/assets/btn-icon-4.svg";
import btnIcon2 from "@/assets/btn-icon-3.svg";
export default {
  data() {
    return {
      btnIcon1,
      btnIcon2
    };
  }
};
</script>

<style lang="scss" scoped>
.recover-card {
  &.card-container {
    margin: $padding-large;
    .form-footer {
      margin-top: $padding-basic * 2;
    }
  }
}
.recover-container {
  max-width: $xs;
  margin: 0 auto;

  .btn-card {
    margin-top: $padding-large;
  }
  .btn {
    width: 100%;
  }
}
</style>

