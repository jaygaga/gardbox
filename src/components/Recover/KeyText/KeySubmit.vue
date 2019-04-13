<template>
  <div class="recover-container">
    <el-form
      ref="form"
      label-position="top"
      :model="form"
      :rules="rules"
    >
      <el-form-item
        prop="name"
        required
      >
        <el-input
          v-model="form.name"
          :placeholder="$t('create.name')"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="pass"
        required
      >
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
  name: "KeySubmit",
  data() {
    const validatePass = (rule, value, callback) => {
      callback();
      return;
      if (value === "") {
        callback(new Error("Please enter password!"));
      } else {
        if (!value.match("^(?=.*[a-zA-Z])(?=.*\\d)[^\\s]{8,18}$")) {
          callback(new Error(this.$t("create.passWarn")));
        }
        if (this.form.checkPass !== "") {
          this.$refs.form.validateField("checkPass");
        }
        callback();
      }
    };
    return {
      form: {
        name: "",
        pass: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState("recover", ["keyText"])
  },
  methods: {
    onSubmit: async function() {
      const { form, $router, $store, keyText } = this;
      this.$refs["form"].validate(async function(valid) {
        if (!valid) return false;
        const params = { ...form, keyStore: keyText };
        const account = await $store.dispatch("account/importKeyStore", params);
        if (account) {
          $router.push("/main");
        }
        // clear Key after import
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

