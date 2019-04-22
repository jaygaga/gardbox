<template>
  <div class="recover-container">
    <el-form
      ref="form"
      label-position="top"
      :model="form"
      :rules="rules"
    >
      <el-form-item prop="name">
        <el-input
          v-model="form.name"
          :placeholder="$t('create.name')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="pass">
        <el-input
          v-model="form.pass"
          type="password"
          :placeholder="$t('create.pass')"
        ></el-input>
      </el-form-item>
    </el-form>

    <el-button
      class="btn"
      @click="onSubmit"
    >{{$t('passport.recover')}}</el-button>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

export default {
  name: "PhraseSubmit",
  data() {
    const requireError = name =>
      new Error(this.$t("global.required", { name }));
    const validateName = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(requireError(this.$t("create.name")));
        return;
      }
      callback();
    };
    const validatePass = (rule, value, callback) => {
      // callback();
      // return;
      if (value === "") {
        callback(requireError(this.$t("create.pass")));
        return;
      }
      callback();
    };
    return {
      form: {
        name: "",
        pass: ""
      },
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState("recover", ["phrase"])
  },
  methods: {
    onSubmit: async function() {
      const { form, $router, $store, phrase } = this;
      this.$refs["form"].validate(async function(valid) {
        if (!valid) return false;
        const params = { ...form, phrase };
        const account = await $store.dispatch("account/importPhrase", params);
        if (account) {
          $router.push("/main?tab=assets");
        }
        // clear phrase after import
        $store.dispatch("recover/clearKey");
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

