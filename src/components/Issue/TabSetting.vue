<template>
  <div class="tab-setting">
    <p class="sub-info warn">{{ $t('issue.settingBrif') }}</p>
    <div class="switch">
      <el-switch
        :value="setting.mint"
        active-color="#13ce66"
        :active-text="$t('issue.mint')"
        :disabled="!setting.mint"
        @change="v => onClose(v, 'minting')"
      ></el-switch>
    </div>
    <div class="switch">
      <el-switch
        :value="setting.freeze"
        active-color="#13ce66"
        :active-text="$t('issue.freeze')"
        :disabled="!setting.freeze"
        @change="v => onClose(v, 'freeze')"
      ></el-switch>
    </div>
    <div class="switch">
      <el-switch
        :value="setting.burn"
        active-color="#13ce66"
        :active-text="$t('issue.burn')"
        :disabled="!setting.burn"
        @change="v => onClose(v, 'burn-owner')"
      ></el-switch>
    </div>
    <div class="switch">
      <el-switch
        :value="setting.burnAny"
        active-color="#13ce66"
        :active-text="$t('issue.burnAny')"
        :disabled="!setting.burnAny"
        @change="v => onClose(v, 'burn-from')"
      ></el-switch>
    </div>
    <div class="switch">
      <el-switch
        :value="setting.burnHolder"
        active-color="#13ce66"
        :active-text="$t('issue.burnHolder')"
        :disabled="!setting.burnHolder"
        @change="v => onClose(v, 'burn-holder')"
      ></el-switch>
    </div>
    <el-button
      class="btn"
      @click="() => this.$router.push(`/issue/modify/${$route.params.id}`)"
    >{{$t('issue.modify')}}</el-button>

    <el-dialog
      :title="$t('create.pass')"
      :visible.sync="dialogVisible"
      width="360px"
      v-loading="loading"
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
import BigNumber from "bignumber.js";
import { get, isEmpty } from "lodash";

import { getViewToken } from "@/utils/helpers";
import webc from "@/utils/webc";
import PassDialog from "@/components/TxPassDialog";
export default {
  name: "IssueCreate",
  components: { PassDialog },
  props: {
    setting: Object
  },
  data() {
    return {
      switch: "",

      dialogVisible: false,
      loading: false,
      pass: ""
    };
  },
  computed: {},
  methods: {
    get,
    onClose(v, name) {
      this.$confirm(this.$t("issue.switchWarn"), this.$t("global.confirm"), {
        confirmButtonText: this.$t("global.ok"),
        cancelButtonText: this.$t("global.cancel"),
        type: "warning"
      })
        .then(() => {
          this.switch = name;
          this.onSubmit();
        })
        .catch(() => {});
    },
    onSubmit() {
      // use math wallet
      if (!isEmpty(this.mathAccount)) {
        this.onSend(true);
        return;
      }
      // else use local wallet
      this.pass = "";
      this.dialogVisible = true;
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
      this.loading = true;
      let res = "";
      try {
        res = await this.$store.dispatch(`issue/setting`, {
          pass: this.pass,
          setting: this.switch,
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
        this.$emit("refresh");
        this.$message({
          type: "success",
          message: this.$t(`issue.closeOk`),
          center: true
        });
      } else {
        this.$message({
          type: "error",
          message: this.$t(`send.${res}`),
          center: true
        });
      }
      this.loading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
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
  padding: 16px;
}
.switch {
  margin-bottom: 24px;
}
</style>

