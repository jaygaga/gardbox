<template>
  <s-page class="passport-container">
    <div class="user-select">
      <div
        v-for="(user, i) in nameList"
        :key="user"
        @click="e => changeAccount(e, user)"
        :class="`user-item ${!i&&'is-checked'}`"
      >
        <AccountSelect
          :userMap="userMap"
          :user="user"
          :showDelete="user !== userName"
        />
      </div>
    </div>

    <s-card
      class="passport-card"
      :title="userName ? '' : $t('passport.title')"
    >

      <s-btn-card
        :title="$t('passport.create')"
        :src="btnIcon1"
        :breif="$t('passport.createBreif')"
        link="create/pass"
      />

      <s-btn-card
        :title="$t('passport.recover')"
        :src="btnIcon3"
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

import btnIcon1 from "@/assets/btn-icon-1.svg";
import btnIcon2 from "@/assets/btn-icon-2.svg";
import btnIcon3 from "@/assets/btn-icon-3.svg";

export default {
  components: { AccountSelect },
  data() {
    return {
      btnIcon1,
      btnIcon2,
      btnIcon3
    };
  },
  computed: {
    ...mapState("account", ["userMap", "userName"]),
    nameList() {
      return Object.keys(this.userMap).sort((a, b) =>
        a === this.userName ? -1 : 1
      );
    }
  },
  methods: {
    changeAccount: async function(e, name) {
      await this.$store.dispatch("account/change", name);
      this.$router.push("main");
    }
  }
};
</script>

<style lang="scss" scoped>
.passport-container {
  margin: 0 auto;
  padding: $padding-large;

  .user-select {
    margin: 0 auto;
    max-width: 560px;
    .user-item {
      margin: 0 0 $padding-basic;
      padding: $padding-basic;
      background: rgba(250, 250, 255, 0.2);
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: background $trans;

      &.is-checked,
      &:hover {
        background: $color-primary-light;
      }
    }
  }

  .passport-card {
    max-width: 560px;
  }
}
</style>

