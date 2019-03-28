<template>
  <div class="passport-container">
    <el-row class="banner">
      <el-col
        :sm="11"
        :xs="20"
        class="banner-l"
      >
        <img src="~@/assets/logo-b.svg" />
        <h1>
          {{$t('passport.title')}}
        </h1>
        <h4>
          {{$t('passport.banner')}}
        </h4>
      </el-col>
      <el-col
        :sm="13"
        :xs="18"
        class="banner-r"
      >
        <img src="~@/assets/banner-img.png" />
      </el-col>
    </el-row>

    <s-btn-card
      class="btn-card btn-card-r"
      :title="$t('passport.create')"
      :src="btnIcon1"
      :breif="$t('passport.create')"
    >
      <router-link to="create">
        <el-button
          type="primary"
          class="btn"
        >{{$t('passport.create')}}</el-button>
      </router-link>
    </s-btn-card>
    <s-btn-card
      class="btn-card"
      :title="$t('passport.login')"
      :src="btnIcon2"
      :breif="$t('passport.login')"
    >
      <router-link to="login">
        <el-button
          type="primary"
          class="btn"
        >{{$t('passport.login')}}</el-button>
      </router-link>
    </s-btn-card>
    <s-btn-card
      class="btn-card btn-card-r"
      :title="$t('passport.recover')"
      :src="btnIcon3"
      :breif="$t('passport.recover')"
    >
      <router-link to="recover">
        <el-button
          type="primary"
          class="btn"
        >{{$t('passport.recover')}}</el-button>
      </router-link>
    </s-btn-card>

    <p class="sub-title">{{$t('passport.title')}}</p>
  </div>
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
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: $padding-large;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  text-align: center;
  background: url("~@/assets/home-bg.svg") no-repeat;
  background-size: cover;
  text-align: left;

  .btn-card {
    margin: $padding-large * 2 auto;
    margin-left: 15%;
    max-width: 400px;
  }
  .btn-card-r {
    margin-left: auto;
    margin-right: 15%;
  }
  .btn {
    width: 100%;
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

