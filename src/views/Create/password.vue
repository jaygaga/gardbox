<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    label-position="top"
  >
    <el-form-item
      :label="$t('passport.name')"
      prop="name"
    >
      <el-input v-model="form.name"></el-input>
    </el-form-item>

    <el-form-item
      :label="$t('passport.pass')"
      prop="pass"
    >
      <el-input
        :placeholder="$t('passport.pass')"
        v-model="form.pass"
        type="password"
      ></el-input>
    </el-form-item>

    <el-form-item
      :label="$t('passport.name')"
      prop="checkPass"
    >
      <el-input
        :placeholder="$t('passport.passCheck')"
        v-model="form.checkPass"
        type="password"
      ></el-input>
    </el-form-item>

    <el-button
      type="primary"
      class="btn"
      @click="onSubmit"
    >Next</el-button>
  </el-form>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

export default {
  name: "Password",
  props: {
    onNext: { type: Function, required: true }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter password!"));
      } else {
        // if (!value.match("^(?=.*[a-zA-Z])(?=.*\\d)[^\\s]{8,18}$")) {
        //   callback(
        //     new Error(
        //       "Password must contain numbers and letters and at least 8 characters!"
        //     )
        //   );
        // }
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
      }
    };
  },
  methods: {
    onSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // create account
          this.$store.dispatch("account/create", this.form);

          // this.onNext();
          console.log("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.btn {
  width: 100%;
}
</style>

