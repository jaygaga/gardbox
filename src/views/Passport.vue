<template>

  <s-page class="passport-container">
    <!-- <s-btn-card
        class="btn-card"
        :title="$t('passport.login')"
        :src="btnIcon2"
        :breif="$t('passport.loginBreif')"
      >
        <router-link to="login">
          <el-button
            type="primary"
            class="btn"
          >{{$t('passport.login')}}</el-button>
        </router-link>
      </s-btn-card> -->

    <s-card
      class="passport-card"
      :title="$t('passport.title')"
    >

      <s-btn-card
        :title="$t('passport.create')"
        :src="btnIcon1"
        :breif="$t('passport.createBreif')"
        link="create"
      />

      <s-btn-card
        :title="$t('passport.recover')"
        :src="btnIcon3"
        :breif="$t('passport.recoverBreif')"
        link="recover"
      />

    </s-card>
  </s-page>
</template>

<script>
import btnIcon1 from "@/assets/btn-icon-1.svg";
import btnIcon2 from "@/assets/btn-icon-2.svg";
import btnIcon3 from "@/assets/btn-icon-3.svg";

export default {
  data() {
    return {
      btnIcon1,
      btnIcon2,
      btnIcon3
    };
  }
};
</script>

<style lang="scss" scoped>
.passport-container {
  margin: 0 auto;
  padding: $padding-large;

  .passport-card {
    max-width: 600px;
  }
}

.banner {
  width: 100%;
  padding: $padding-large;
  background: url("~@/assets/banner-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border-radius: 24px;
  margin-bottom: $padding-large * 3;

  .banner-l {
    h1 {
      margin-top: $padding-large;
      font-size: 32px;
    }
    h4 {
      font-size: 20px;
    }
    img {
      width: 100px;
    }
  }
  .banner-r {
    img {
      margin-top: 24%;
      width: 100%;
    }
  }
}

.sub-title {
  text-align: center;
}

@include responsive($sm) {
  .passport-container {
    .btn-card {
      margin-left: auto;
      margin-right: auto;
    }
  }
  .banner {
    .banner-l {
      h1 {
        font-size: 24px;
      }
      h4 {
        font-size: 16px;
      }
    }
    .banner-r {
      img {
        margin-top: 36px;
        margin-left: 24%;
      }
    }
  }
}
</style>

