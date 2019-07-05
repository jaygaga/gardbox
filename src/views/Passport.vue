<template>
  <s-page class="passport-container">
    <div class="user-select">
      <div
        v-if="mathPlugin && !isEmpty(mathAccount)"
        @click="loginMath"
        class="user-item math math1 is-checked"
      >
        <div class="math-container">
          <div class="math-top">
            <div class="math-logo">
              <img
                v-if="$i18n.locale === 'zh'"
                :src="`https://medishares-cn.oss-cn-hangzhou.aliyuncs.com/mathwallet/images/mathlabs/wallet_cn_logo_white.png`"
                style="height: 28px;"
              >
              <img
                v-else
                :src="`https://medishares-cn.oss-cn-hangzhou.aliyuncs.com/mathwallet/images/mathlabs/wallet_en_logo_white.png`"
                style="height: 28px;"
              >
            </div>
            <span>{{ $t('passport.math') }}</span>
          </div>
          <p>{{ mathAccount.account | gardAddr }}</p>
        </div>
        <div class="dropdown-div">
          <el-dropdown @command="clickMathAction">
            <span class="el-dropdown-link">
              <i
                class="el-icon-more"
                style="font-size:24px;"
              ></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="switchWallet">{{$t('passport.switchWallet')}}</el-dropdown-item>
              <el-dropdown-item
                command="logout"
                style="color: red;"
              >{{$t('passport.logout')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div
        v-for="user in nameList"
        :key="user"
        @click="e => changeAccount(e, user)"
        :class="`user-item ${user === userName &&'is-checked'}`"
      >
        <AccountSelect
          :userMap="userMap"
          :user="user"
          :showDelete="user !== userName"
        />
      </div>
      <div
        v-if="mathPlugin && isEmpty(mathAccount)"
        @click="loginMath"
        class="user-item math"
      >
        <div class="math-top">
          <div class="math-logo">
            <img
              v-if="$i18n.locale === 'zh'"
              :src="`https://medishares-cn.oss-cn-hangzhou.aliyuncs.com/mathwallet/images/mathlabs/wallet_cn_logo_white.png`"
              style="height: 28px;"
            >
            <img
              v-else
              :src="`https://medishares-cn.oss-cn-hangzhou.aliyuncs.com/mathwallet/images/mathlabs/wallet_en_logo_white.png`"
              style="height: 28px;"
            >
          </div>
          <span>{{ $t('passport.math') }}</span>
        </div>
        <p>{{$t('passport.useMath')}}</p>
      </div>
    </div>

    <s-card
      class="passport-card"
      :title="userName || mathPlugin ? '' : $t('passport.title')"
    >
      <s-btn-card
        :title="$t('passport.create')"
        :src="icon1"
        :breif="$t('passport.createBreif')"
        link="create/pass"
      />
      <s-btn-card
        :title="$t('passport.recover')"
        :src="icon2"
        :breif="$t('passport.recoverBreif')"
        link="recover/key/text"
      />
    </s-card>
  </s-page>
</template>

<script>
import { mapState } from "vuex";
import { get, set, isEmpty } from "lodash";

import AccountSelect from "@/components/AccountSelect";

import icon1 from "@/assets/icon-create.svg";
import icon2 from "@/assets/icon-import.svg";

export default {
  components: { AccountSelect },
  data() {
    return {
      icon1,
      icon2
    };
  },
  computed: {
    ...mapState("account", ["userMap", "userName", "mathAccount"]),
    nameList() {
      return Object.keys(this.userMap).sort((a, b) =>
        a === this.userName ? -1 : 1
      );
    },
    mathPlugin() {
      return !isEmpty(window.mathExtension);
    }
  },
  methods: {
    isEmpty,
    changeAccount: async function(e, name) {
      await this.$store.dispatch("account/change", name);
      // logout mathwallet
      if (!isEmpty(this.mathAccount)) {
        await this.$store.dispatch("account/resetMathIdentity");
      }
      this.$router.push("main?tab=assets");
    },
    loginMath: async function() {
      const res = await this.$store.dispatch("account/getMathIdentity");
      if (!isEmpty(res)) {
        this.$router.push("main?tab=assets");
      }
    },
    clickMathAction(val) {
      switch (val) {
        case "logout":
          this.logout();
          break;
        case "switchWallet":
          this.switchWallet();
          break;
      }
    },
    logout() {
      this.$store.dispatch("account/change", this.nameList[0]);
      this.$store.dispatch("account/resetMathIdentity");
    },
    switchWallet: async function() {
      const res = await this.$store.dispatch("account/resetMathIdentity");
      if (res) {
        const response = await this.$store.dispatch("account/getMathIdentity");
        if (!isEmpty(response)) {
          this.$router.push("main?tab=assets");
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.passport-container {
  margin: 0 auto;

  .user-select {
    margin: 0 auto;
    max-width: 560px;
    .user-item {
      margin: 0 0 $padding-basic;
      padding: $padding-basic;
      background: rgba(250, 250, 255, 0.15);
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: background-color $trans;

      &.is-checked,
      &:hover {
        background: rgba(250, 250, 255, 0.4);
      }
      &.math {
        display: block;
        .math-top {
          display: flex;
          align-items: center;
          font-size: 20px;
          span {
            margin-bottom: 4px;
          }
        }
        .math-logo {
          width: 36px;
          overflow: hidden;
        }
        p {
          margin-top: 2px;
        }
      }
      &.math1 {
        display: flex;
        justify-content: space-between;
      }
    }
  }

  .passport-card {
    max-width: 560px;
  }
}
</style>

