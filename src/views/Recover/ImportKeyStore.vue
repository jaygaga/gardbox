<template>
  <div class="recover-container">
    <s-card :title="$t('recover.key')">
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        :rules="rules"
      >
        <el-form-item
          :label="$t('recover.key')"
          prop="keyStore"
          required
        >
          <el-input
            class="input"
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 12}"
            v-model="form.keyStore"
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
  name: "ImportKeyStore",
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
    const validateKeyStore = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter keyStore!"));
      } else {
        try {
          const key = JSON.parse(value);
          if (!key.address || !key.address.match(/^gard/)) {
            callback(new Error("Wrong keyStore!"));
          }
          callback();
        } catch (e) {
          callback(new Error("Wrong keyStore!"));
        }
      }
    };
    return {
      form: {
        name: "",
        pass: "",
        keyStore: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        keyStore: [{ validator: validateKeyStore, trigger: "blur" }]
      }
    };
  },
  methods: {
    onSubmit() {
      const { form, $router, $store } = this;
      this.$refs["form"].validate(async function(valid) {
        if (!valid) return false;
        const account = await $store.dispatch("account/importKeyStore", form);
        if (account) {
          $router.push("/home");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.recover-container {
  // max-width: $xs;
  padding: $padding-large;
  margin: $padding-large auto;

  .user-select {
    width: 100%;
  }

  .form-footer {
    margin-top: $padding-basic * 2;
    .btn {
      float: right;
    }
  }
}
</style>

