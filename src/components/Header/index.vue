<template>
  <div class="header-container">
    <div class="header">
      <a
        href="/"
        class="logo"
      >
        <img
          alt="logo"
          src="~@/assets/logo.svg"
        />
      </a>

      <span
        class="lang-change"
        @click="changeLang"
        :value="$i18n.locale"
      >
        <i class="el-icon-sort"></i>
        {{$i18n.locale === 'en' ? '中文':'English'}}
      </span>

      <el-dropdown
        v-if="userName"
        class="dropdown-menu"
        trigger="click"
      >
        <i class="el-icon-more"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click="backup">
            {{$t('passport.backup')}}
          </el-dropdown-item>
          <el-dropdown-item @click="logout">
            {{$t('passport.logout')}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      langs: ["zh", "en"],
      lang: this.$i18n.locale,
      value: ""
    };
  },
  props: {
    netName: String
  },
  computed: {
    ...mapState("account", ["userName"])
  },
  methods: {
    changeLang() {
      let target = "en";
      if (this.$i18n.locale === "en") {
        target = "zh";
      } else {
        target = "en";
      }
      this.$i18n.locale = target;
      localStorage.setItem("lang", target);
    },
    backup() {
      console.log("backup");
      // this.$router.push('/backup');
    },
    logout() {
      console.log("logout");
    }
  },
  mounted() {
    if (this.userName) {
      // this.$router.push("/home");
    }
  }
};
</script>

<style lang="scss" scoped>
.header-container {
  width: 100%;
  background: $color-primary;
  box-shadow: $shadow;
  color: white;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px $padding-large;
  max-width: $max-width;
  margin: 0 auto;

  .logo {
    flex: 1;
    display: inline-block;
    line-height: 1;
    img {
      width: 100px;
    }
  }
  .lang-change {
    margin-right: $padding-basic;
    cursor: pointer;
    .el-icon-sort {
      transform: rotate(90deg);
    }
  }
}

.dropdown-menu {
  cursor: pointer;
  font-size: $font-size-title;
  i {
    color: white;
  }
}
</style>
