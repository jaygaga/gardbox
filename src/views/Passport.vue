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
      this.$router.push("main?tab=assets");
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
    }
  }

  .passport-card {
    max-width: 560px;
  }
}
</style>

