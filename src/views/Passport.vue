<template>
  <s-page class="passport-container">

    <el-radio-group
      class="user-select"
      v-model="user"
      @change="changeAccount"
    >
      <el-radio
        class="user-item"
        v-for="user in nameList"
        :key="user"
        :label="user"
      >
        <RadioContent
          :userMap="userMap"
          :user="user"
          :handleCommand="handleCommand"
        />
      </el-radio>
    </el-radio-group>

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
        link="recover"
      />

    </s-card>
  </s-page>
</template>

<script>
import { mapState } from "vuex";

import RadioContent from "@/components/AccountSelect";

import btnIcon1 from "@/assets/btn-icon-1.svg";
import btnIcon2 from "@/assets/btn-icon-2.svg";
import btnIcon3 from "@/assets/btn-icon-3.svg";

export default {
  components: { RadioContent },
  data() {
    return {
      user: "",
      nameList: [],
      btnIcon1,
      btnIcon2,
      btnIcon3
    };
  },
  computed: {
    ...mapState("account", ["userMap", "userName"])
  },
  methods: {
    changeAccount(name) {
      this.$store.dispatch("account/change", name);
    },
    handleCommand(user, v) {
      console.log(user);
      console.log(v);
    }
  },
  mounted() {
    this.user = this.userName;
    this.nameList = Object.keys(this.userMap).sort((a, b) =>
      a === this.userName ? -1 : 1
    );
  }
};
</script>

<style lang="scss" scoped>
.passport-container {
  margin: 0 auto;
  padding: $padding-large;

  .user-select {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    max-width: 560px;
    .user-item {
      margin: 0 0 $padding-basic;
      padding: $padding-basic;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      // justify-content: space-between;
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

