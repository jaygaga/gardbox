<template>
  <div class="recover-container">
    <el-form
      ref="form"
      label-position="top"
      :model="form"
      :rules="rules"
    >
      <el-form-item
        prop="phrase"
        required
      >
        <el-input
          class="input"
          type="textarea"
          :placeholder="$t('recover.phrase')"
          :autosize="{ minRows: 8, maxRows: 12}"
          v-model="form.phrase"
        >
        </el-input>
      </el-form-item>
    </el-form>

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
    const validatePhrase = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter phrase!"));
      } else {
        if (value.split(" ").length !== 24) {
          callback(new Error("Wrong mnemonic!"));
        }
        callback();
      }
    };
    return {
      form: {
        phrase: ""
      },
      rules: {
        phrase: [{ validator: validatePhrase, trigger: "blur" }]
      }
    };
  },
  methods: {
    onSubmit() {
      const { form, $router, $store } = this;
      this.$refs["form"].validate(async function(valid) {
        if (!valid) return false;
        $store.dispatch("recover/inputPhrase", form);
        $router.push("/recover/phrase/submit");
      });
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

