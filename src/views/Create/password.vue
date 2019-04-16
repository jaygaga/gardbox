<template>
  <s-card :title="$t('passport.create')">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      v-loading="loading"
      label-position="top"
    >
      <div class="create-warn">
        <ul>
          <li>{{$t('create.warn1')}}</li>
          <li>{{$t('create.warn2')}}</li>
        </ul>
      </div>

      <el-form-item
        prop="name"
        required
      >
        <el-input
          :placeholder="$t('create.name')"
          v-model="form.name"
        ></el-input>
      </el-form-item>

      <el-form-item
        prop="pass"
        required
      >
        <el-input
          :placeholder="$t('create.pass')"
          v-model="form.pass"
          type="password"
        ></el-input>
      </el-form-item>

      <el-form-item
        prop="checkPass"
        required
      >
        <el-input
          :placeholder="$t('create.passCheck')"
          v-model="form.checkPass"
          type="password"
        ></el-input>
      </el-form-item>

      <el-button
        class="btn-next"
        @click="onSubmit"
      >{{$t('global.next')}}</el-button>
    </el-form>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

export default {
  name: "Password",
  data() {
    const validatePass = (rule, value, callback) => {
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
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter password again!"));
      } else if (value !== this.form.pass) {
        callback(new Error("Inconsistent password!"));
      } else {
        callback();
      }
    };
    return {
      form: {
        name: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      },
      loading: false
    };
  },
  methods: {
    onSubmit() {
      const {
        form,
        $store: { dispatch },
        $router,
        $message
      } = this;
      let loading = this.loading;
      this.$refs["form"].validate(async function(valid) {
        if (!valid) return false;

        // create account
        loading = true;
        const created = await dispatch("account/create", form);
        loading = false;
        if (!created) {
          $message({
            type: "error",
            message: this.$t("create.exist"),
            center: true
          });
          return false;
        }

        // next step
        $router.push("mnemonic");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.create-warn {
  padding: $padding-basic;
  padding-left: $padding-large;
  background: rgba(255, 255, 255, 0.2);
  margin-bottom: $padding-basic;

  ul,
  li {
    list-style: inherit;
  }
}
.btn-next {
  width: 100%;
  padding: $padding-basic;
}
</style>

