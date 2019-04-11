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

      <span
        v-if="$route.path === '/home'"
        class="account"
        @click="useAccount"
      >
        <i class="el-icon-account"></i>
        {{$t('home.account')}}
      </span>

      <!-- <el-dropdown
        v-if="userName"
        class="dropdown-menu"
        trigger="click"
        @command="handleCommand"
      >
        <i class="el-icon-more"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="backup">
            {{$t('passport.backup')}}
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            {{$t('passport.logout')}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->

      <el-dialog
        class="backup-dialog"
        :title="$t('passport.backup')"
        :visible.sync="exportDialogVisible"
      >
        <el-input
          class="input"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 8}"
          :value="JSON.stringify(keyStore)"
        >
        </el-input>
        <s-btn-card
          title="KeyStore"
          :breif="$t('main.keyWarn')"
          :src="btnIcon"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import btnIcon from "@/assets/btn-icon-4.svg";

export default {
  data() {
    return {
      btnIcon,
      langs: ["zh", "en"],
      lang: this.$i18n.locale,
      exportDialogVisible: false
    };
  },
  props: {
    netName: String
  },
  computed: {
    ...mapState("account", ["userName", "keyStore"])
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
        this.$router.push("/main");
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
    },
    logout() {
      // this.$store.dispatch("account/logout");
      // this.$router.push("/passport");
    }
  },
  mounted() {
    // if (this.userName) {
    //   this.$router.push("/main");
    // }
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
  .lang-change {
    cursor: pointer;
    .el-icon-sort {
      transform: rotate(90deg);
    }
  }
  .account {
    margin-left: $padding-basic;
    cursor: pointer;
  }
}

.dropdown-menu {
  cursor: pointer;
  font-size: $font-size-title;
  i {
    color: white;
  }
}

.backup-dialog {
  .input {
    margin-bottom: $padding-large;
  }
  .btn-card {
    .card-r {
      p {
        height: auto;
      }
    }
  }
}
</style>
