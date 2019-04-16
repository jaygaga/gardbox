<template>
  <div class="recover-container">

    <s-phrase-input :onChange="handleChange" />

    <el-button
      class="btn"
      @click="onSubmit"
    >{{$t('global.next')}}</el-button>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

export default {
  name: "PhraseInput",
  data() {
    return {
      phrase: {}
    };
  },
  methods: {
    handleChange(v) {
      console.log(v);
      this.phrase = v;
    },
    onSubmit() {
      const validatePhrase = value => {
        if (value === "") {
          return this.$t("global.required", {
            name: this.$t("recover.phrase")
          });
        } else {
          if (value.split(" ").length !== 24) {
            return this.$t("create.mnemonicWarn");
          }
          return false;
        }
      };
      const errorMsg = validatePhrase(this.phrase);
      if (errorMsg) {
        console.log(errorMsg);
        return;
      }
      this.$store.dispatch("recover/inputPhrase", { phrase: this.phrase });
      this.$router.push("/recover/phrase/submit");
    }
  }
};
</script>

<style lang="scss" scoped>
.recover-container {
  margin: 16px auto;

  .btn {
    width: 100%;
    padding: $padding-basic;
    margin-top: 16px;
  }
}
</style>

