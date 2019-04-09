<template>
  <div class="recover-container">
    <s-card>
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        :rules="rules"
      >
        <el-form-item
          :label="$t('create.mnemonic')"
          prop="phrase"
          required
        >
          <el-input
            class="input"
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 12}"
            v-model="form.phrase"
          >
          </el-input>
        </el-form-item>

        <el-form-item
          :label="$t('create.name')"
          prop="name"
          required
        >
          <el-input
            v-model="form.name"
            :placeholder="$t('create.name')"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('create.pass')"
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

      <div class="form-footer">
        <el-button @click="$router.back()">{{$t('global.back')}}</el-button>
        <el-button
          type="primary"
          class="btn"
          @click="onSubmit"
        >{{$t('passport.recover')}}</el-button>
      </div>
    </s-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

export default {
  name: "ImportPhrase",
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
        name: "",
        phrase: "",
        pass: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        phrase: [{ validator: validatePhrase, trigger: "blur" }]
      }
    };
  },
  methods: {
    onSubmit() {
      const { form, $router, $store } = this;
      this.$refs["form"].validate(async function(valid) {
        if (!valid) return false;
        const account = await $store.dispatch("account/importPhrase", form);
        if (account) {
          $router.push("/main");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.recover-container {
  padding: $padding-large;
  margin: $padding-large auto;

  .form-footer {
    margin-top: $padding-basic * 2;
    .btn {
      float: right;
    }
  }
}
</style>

