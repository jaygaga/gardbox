<template>
  <div :class="`header-container ${bgColor}`">
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

      <el-dropdown
        class="dropdown-menu"
        trigger="click"
        @command="getStarted"
      >
        <div class="dropdown-menu-btn">
          <div class="avatar">
            <img
              v-if="isEmpty(mathAccount)"
              :src="walletIcon"
            />
            <img
              v-else
              src="https://medishares-cn.oss-cn-hangzhou.aliyuncs.com/mathwallet/images/mathlabs/wallet_cn_logo_white.png"
            />
          </div>
          <span>{{ userName }}</span>
          <i class="el-icon-arrow-down"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="account">
            {{$t('home.account')}}
          </el-dropdown-item>
          <el-dropdown-item command="staking">
            {{$t('home.staking')}}
          </el-dropdown-item>
          <el-dropdown-item command="issue">
            {{$t('home.issue')}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { isEmpty } from "lodash";

import walletIcon from "@/assets/icon-wallet.svg";

export default {
  data() {
    return {
      langs: ["zh", "en"],
      lang: this.$i18n.locale,
      bgColor: "",
      walletIcon
    };
  },
  props: {
    netName: String
  },
  computed: {
    ...mapState("account", ["userName", "mathAccount"]),
    ...mapState("transactions", ["nodeInfo"])
  },
  methods: {
    isEmpty,
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
    getStarted(page) {
      const uris = {
        account: "/main?tab=assets",
        staking: "/staking?tab=delegations",
        issue: "/issue"
      };
      const agree = localStorage.getItem("gard_wallet_agree");
      if (!agree) {
        this.$router.push("/agree");
        return;
      }
      if (this.userName || !isEmpty(this.mathAccount)) {
        this.$router.push(uris[page]);
        return;
      }
      this.$router.push("/passport");
    },
    handleScroll(e) {
      if (window.scrollY > 20) {
        this.bgColor = "primary";
      } else {
        this.bgColor = "";
      }
    }
  },
  mounted() {
    window.onscroll = this.handleScroll;
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
  background: transparent;
  transition: background-color 0.6s ease 0s;

  &.primary {
    background: $color-primary;
    box-shadow: $shadow;
  }
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
  .dropdown-menu {
    margin-left: $padding-basic;
    cursor: pointer;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.8);
    .dropdown-menu-btn {
      display: flex;
      align-items: center;
      i {
        margin-left: 4px;
        margin-top: 2px;
      }
    }
    .avatar {
      height: 28px;
      width: 28px;
      background: rgba(255, 255, 255, 0.2);
      overflow: hidden;
      border-radius: 14px;
      padding: 3px;
      margin-right: 6px;
      img {
        height: 18px;
        margin: 2px;
      }
    }
    &:hover {
      color: white;
      .avatar {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
}

@include responsive($sm) {
  .header {
    padding: 16px;

    .lang-change {
      margin-left: 12px;
    }
    .dropdown-menu {
      margin-left: 12px;
    }
  }
}
</style>
