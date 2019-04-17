<template>
  <div class="header-container">
    <div class="header">
      <div class="logo">
        <a href="/">
          <img
            alt="logo"
            src="~@/assets/logo.svg"
          />
        </a>
      </div>

      <el-dropdown
        v-if="$route.path === '/home'"
        class="network"
        trigger="click"
      >
        <span>
          <i class="el-icon-arrow-down"></i> {{nodeInfo.network}}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>{{nodeInfo.network}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <span
        class="lang-change"
        @click="changeLang"
        :value="$i18n.locale"
      >
        <i class="el-icon-sort"></i>
        {{$i18n.locale === 'en' ? '中文':'English'}}
      </span>

      <span
        v-if="$route.path === '/home'"
        class="account"
        @click="useAccount"
      >
        <i class="el-icon-account"></i>
        {{$t('home.account')}}
      </span>
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
      exportDialogVisible: false
    };
  },
  props: {
    netName: String
  },
  computed: {
    ...mapState("account", ["userName"]),
    ...mapState("transactions", ["nodeInfo"])
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
    useAccount() {
      const agree = localStorage.getItem("gard_wallet_agree");
      if (!agree) {
        this.$router.push("/agree");
        return;
      }
      if (this.userName) {
        this.$router.push("/main?tab=assets");
        return;
      }
      this.$router.push("/passport");
    },
    handleCommand(type) {
      const commands = { backup: this.backup, logout: this.logout };
      commands[type]();
    },
    backup() {
      this.exportDialogVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.header-container {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 11;
  padding: 0;
  color: white;
  background: $color-primary;
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
      height: 52px;
    }
  }
  .network {
    font-size: 16px;
    span {
      color: white;
      cursor: pointer;
    }
  }
  .lang-change {
    cursor: pointer;
    margin-left: $padding-basic;
    .el-icon-sort {
      transform: rotate(90deg);
    }
  }
  .account {
    margin-left: $padding-basic;
    cursor: pointer;
  }
}

@include responsive($sm) {
  .header {
    padding: 16px;

    .lang-change {
      margin-left: 12px;
    }
    .account {
      margin-left: 12px;
    }
  }
}
</style>
