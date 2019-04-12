<template>
  <s-page class="passport-container">

    <div class="user-select">
      <div
        v-for="(user, i) in nameList"
        :key="user"
        @click="e => changeAccount(e, user)"
        :class="`user-item ${!i&&'is-checked'}`"
      >
        <RadioContent
          :userMap="userMap"
          :user="user"
          :handleCommand="handleCommand"
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
        link="recover"
      />

    </s-card>
  </s-page>
</template>

<script>
import { mapState } from "vuex";
import { get, set, isEmpty } from "lodash";

import RadioContent from "@/components/AccountSelect";

import btnIcon1 from "@/assets/btn-icon-1.svg";
import btnIcon2 from "@/assets/btn-icon-2.svg";
import btnIcon3 from "@/assets/btn-icon-3.svg";

export default {
  components: { RadioContent },
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
    },
    handleCommand(user, cmd) {
      const cmds = {
        edit: this.edit,
        backup: this.backup,
        delete: this.delete
      };
      cmds[cmd](user);
    },
    edit(user) {
      const inputValidator = v => {
        const name = v.trim();
        if (name.length === 0) {
          return this.$t("global.required", { name: this.$t("create.name") });
        }
        if (name !== user && !isEmpty(this.userMap[name])) {
          return this.$t("create.exist");
        }
        return true;
      };
      this.$prompt("", this.$t("passport.edit"), {
        confirmButtonText: this.$t("global.ok"),
        cancelButtonText: this.$t("global.cancel"),
        inputValue: user,
        inputValidator
      })
        .then(({ value }) => {
          this.$store.dispatch("account/editName", { user, name: value });
          this.$message({
            type: "success",
            message: this.$t("global.success", {
              name: this.$t("passport.edit")
            })
          });
          if (user === this.user) {
            this.user = value;
          }
        })
        .catch(() => {});
    },
    delete(user) {
      this.$prompt(this.$t("create.pass"), this.$t("passport.delete"), {
        confirmButtonText: this.$t("global.ok"),
        cancelButtonText: this.$t("global.cancel"),
        inputValidator: v =>
          v.trim().length > 0
            ? true
            : this.$t("global.required", { name: this.$t("create.pass") }),
        beforeClose: (action, ins, done) => {
          if (action !== "confirm") {
            return done();
          }
          this.$store
            .dispatch("account/delete", {
              user,
              pass: ins.inputValue
            })
            .then(res => {
              console.log(res);
              done();
            })
            .catch(e => {
              console.log(e);
              this.$message.error(
                `${this.$t("create.pass")} ${this.$t("global.error")}`
              );
            });
        }
      })
        .then(({ value }) => {
          // this.$message({
          //   type: "success",
          //   message: this.$t("global.success", {
          //     name: this.$t("passport.edit")
          //   })
          // });
        })
        .catch(() => {});
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

