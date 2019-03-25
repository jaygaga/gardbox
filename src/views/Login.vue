<template>
  <div class="login-container">
    <s-card>
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
            v-model="form.pass"
            :placeholder="$t('create.pass')"
          ></el-input>
        </el-form-item>
      </el-form>

      <el-button
        type="primary"
        class="btn"
        @click="onSubmit"
      >{{$t('passport.login')}}</el-button>
    </s-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

export default {
  name: "Mnemonic",
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
        this.$router.push("/home");
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
  width: $xs;
  margin: 0 auto;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  .user-select {
    width: 100%;
  }

  .btn {
    width: 100%;
    margin: 24px 0;
  }
}
</style>

