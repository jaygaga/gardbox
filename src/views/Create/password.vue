<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    v-loading="loading"
    label-position="top"
  >
    <el-form-item
      :label="$t('create.name')"
      prop="name"
      required
    >
      <el-input v-model="form.name"></el-input>
    </el-form-item>

    <el-form-item
      :label="$t('create.pass')"
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
      :label="$t('create.passCheck')"
      prop="checkPass"
      required
    >
      <el-input
        :placeholder="$t('create.passCheck')"
        v-model="form.checkPass"
        type="password"
      ></el-input>
    </el-form-item>

    <div class="form-footer">
      <el-button @click="$router.back()">{{$t('global.back')}}</el-button>
      <el-button
        type="primary"
        class="btn-next"
        @click="onSubmit"
      >{{$t('global.next')}}</el-button>
    </div>
  </el-form>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

export default {
  name: "Password",
  props: {
    onStepChange: { type: Function, required: true }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter password!"));
      } else {
        if (!value.match("^(?=.*[a-zA-Z])(?=.*\\d)[^\\s]{8,18}$")) {
          callback(
            new Error(
              "Password must contain numbers and letters and at least 8 characters!"
            )
          );
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
        $message,
        onStepChange
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
            message: "Account Name Exist!",
            center: true
          });
          return false;
        }

        // next step
        onStepChange(1);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.form-footer {
  margin-top: $padding-basic * 2;
}
.btn-next {
  float: right;
}
</style>

