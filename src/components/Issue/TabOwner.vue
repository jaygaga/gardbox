<template>
  <div class="tab-owner">
    <p class="sub-info warn">{{ $t('owner.brif') }}</p>

    <el-form
      ref="form"
      label-position="top"
      :model="form"
      :rules="rules"
      @submit="onSubmit"
      class="form"
    >
      <el-form-item :label="$t('owner.from')">
        <p class="addr">{{ currentAddress }}</p>
      </el-form-item>
      <el-form-item
        prop="address"
        :label="$t('mint.address')"
      >
        <el-input
          v-model="form.address"
          :placeholder="$t('mint.address')"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>

    <el-button
      class="btn"
      native-type=“submit”
      @click="onSubmit"
    >{{$t('issue.tab4')}}</el-button>

    <el-dialog
      :title="$t('create.pass')"
      :visible.sync="dialogVisible"
      width="360px"
      :close-on-click-modal="false"
    >
      <el-input
        type="password"
        v-model="pass"
        :placeholder="$t('create.pass')"
        @keyup.enter.native="onSend"
      ></el-input>
      <span slot="footer">
        <el-button @click="onSend">{{$t('global.ok')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import BigNumber from "bignumber.js";
import { get, isEmpty } from "lodash";

import { getViewToken } from "@/utils/helpers";
import webc from "@/utils/webc";
export default {
  name: "TabOwner",
  props: {
    setting: Object
  },
  data() {
    const requireError = name =>
      new Error(this.$t("global.required", { name }));
    const validateAddr = (rule, value, callback) => {
      if (!value || value.trim() === "") {
        callback(requireError(this.$t("send.address")));
        return;
      }
      if (
        !webc.account.isValidAddress(value) ||
        value === this.currentAddress
      ) {
        callback(this.$t("send.addressWarn"));
        return;
      }
      callback();
    };
    return {
      form: {
        address: ""
      },
      rules: {
        address: [{ validator: validateAddr, trigger: "submit" }]
      },

      dialogVisible: false,
      pass: ""
    };
  },
  computed: {
    ...mapGetters("account", ["currentAddress", "mathAccount"])
  },
  methods: {
    get,
    onSubmit(e) {
      e.preventDefault();
      this.$refs["form"].validate(valid => {
        if (!valid) return false;
        // use math wallet
        if (!isEmpty(this.mathAccount)) {
          this.onSend(true);
          return;
        }
        // else use local wallet
        this.pass = "";
        this.dialogVisible = true;
      });
    },
    onSend: async function(useMathWallet) {
      if (!useMathWallet && !this.pass) {
        this.$message({
          type: "error",
          message: $t("global.required", { name: $t("create.pass") }),
          center: true
        });
        return false;
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let res = "";
      try {
        res = await this.$store.dispatch(`issue/owner`, {
          pass: this.pass,
          form: this.form,
          id: this.$route.params.id
        });
      } catch (e) {
        this.$message({
          type: "error",
          message: this.$t(`send.error`),
          center: true
        });
      }
      if (res.txhash) {
        this.dialogVisible = false;
        this.$message({
          type: "success",
          message: this.$t(`issue.closeOk`),
          center: true
        });
        this.$router.push("/issue");
      } else {
        this.$message({
          type: "error",
          message: this.$t(`send.${res}`),
          center: true
        });
      }
      loading.close();
    }
  }
};
</script>

<style lang="scss" scoped>
.form {
  width: $xs;
}
.addr {
  font-size: 16px;
}
.sub-title {
  text-align: center;
  margin-top: $padding-large;
  margin-bottom: 8px;
}
.sub-info {
  font-size: 14px;
  background: $color-background-card;
  border-radius: 4px;
  padding: 16px;

  &.warn {
    background: rgba(255, 219, 126, 1);
    color: #996802;
    margin: 16px 0;
  }
}

.btn {
  width: $xs;
  padding: 16px;
}
.switch {
  margin-bottom: 24px;
}
</style>

