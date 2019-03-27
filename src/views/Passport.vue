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

    <el-row class="btn-card btn-card-r">
      <el-col
        :span="10"
        class="card-l"
      >
        <img
          :alt="$t('passport.create')"
          src="~@/assets/btn-icon-1.svg"
        />
      </el-col>
      <el-col
        :span="14"
        class="card-r"
      >
        <h4>{{$t('passport.create')}}</h4>
        <p>{{$t('passport.create')}}</p>
        <router-link to="create">
          <el-button
            type="primary"
            class="btn"
          >{{$t('passport.create')}}</el-button>
        </router-link>
      </el-col>
    </el-row>
    <el-row class="btn-card">
      <el-col
        :span="10"
        class="card-l"
      >
        <img
          :alt="$t('passport.login')"
          src="~@/assets/btn-icon-2.svg"
        />
      </el-col>
      <el-col
        :span="14"
        class="card-r"
      >
        <h4>{{$t('passport.login')}}</h4>
        <p>{{$t('passport.login')}}</p>
        <router-link to="login">
          <el-button
            type="primary"
            class="btn"
          >{{$t('passport.login')}}</el-button>
        </router-link>
      </el-col>
    </el-row>
    <el-row class="btn-card btn-card-r">
      <el-col
        :span="10"
        class="card-l"
      >
        <img
          :alt="$t('passport.recover')"
          src="~@/assets/btn-icon-3.svg"
        />
      </el-col>
      <el-col
        :span="14"
        class="card-r"
      >
        <h4>{{$t('passport.recover')}}</h4>
        <p>{{$t('passport.recover')}}</p>
        <router-link to="recover">
          <el-button
            type="primary"
            class="btn"
          >{{$t('passport.recover')}}</el-button>
        </router-link>
      </el-col>
    </el-row>

    <p class="sub-title">{{$t('passport.title')}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {};
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

.btn-card {
  margin: $padding-large * 2 auto;
  margin-left: 15%;
  padding: $padding-basic;
  background: white;
  max-width: 400px;
  border-radius: 16px;
  box-shadow: $shadow;

  .card-r {
    padding: 0 16px 0 $padding-large;

    h4 {
      height: 70px;
      overflow: ellipsis;
    }
    .btn {
      width: 100%;
    }
  }
}
.btn-card-r {
  margin-left: auto;
  margin-right: 15%;
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
  .btn-card {
    margin-top: $padding-large;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>

