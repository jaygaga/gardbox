<template>
  <div class="login-container">
    <s-card :title="$t('passport.login')">
      <el-form
        ref="form"
        label-position="top"
        :model="form"
      >
        <el-form-item :label="$t('create.name')">
          <el-select
            class="user-select"
            v-model="form.name"
          >
            <el-option
              v-for="user in Object.keys(userMap)"
              :key="user"
              :value="user"
            >{{user}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('create.pass')">
          <el-input
            type="password"
            v-model="form.pass"
            :placeholder="$t('create.pass')"
          ></el-input>
        </el-form-item>
      </el-form>

      <div class="form-footer">
        <el-button @click="$router.back()">{{$t('global.back')}}</el-button>
        <el-button
          type="primary"
          class="btn-login"
          @click="onSubmit"
        >{{$t('passport.login')}}</el-button>
      </div>
    </s-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

export default {
  name: "Login",
  data() {
    return {
      form: {
        name: "",
        pass: ""
      }
    };
  },
  computed: {
    ...mapState("account", ["userMap"])
  },
  methods: {
    onSubmit: async function() {
      const account = await this.$store.dispatch("account/login", this.form);
      if (account) {
        this.$router.push("/main");
      } else {
        this.$message({
          type: "error",
          message: "Wrong password!",
          center: true
        });
      }
    }
  },
  mounted() {
    this.form.name = Object.keys(this.userMap)[0];
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  max-width: $xs;
  margin: 0 auto;
  padding: $padding-large;

  .user-select {
    width: 100%;
  }

  .btn {
    width: 100%;
    margin: 24px 0;
  }
}
.form-footer {
  margin-top: $padding-basic * 2;
}
.btn-login {
  float: right;
}
</style>

