<template>
  <s-card
    :title="$t(`freeze.${$route.query.action}`) + ' ' + detail.symbol + ' (' + detail.name + ') ' + $t('send.form')"
    class="issue-freeze-card"
  >
    <el-form
      ref="form"
      label-position="top"
      :model="form"
      :rules="rules"
      @submit="onSubmit"
    >
      <el-form-item
        prop="address"
        :label="$t('mint.address')"
      >
        <el-input
          v-if="$route.query.action === 'freeze'"
          v-model="form.address"
          :placeholder="$t('mint.address')"
          clearable
        ></el-input>

        <el-select
          v-else
          style="width: 100%"
          v-model="form.address"
          :placeholder="$t('mint.address')"
        >
          <el-option
            v-for="i in freezeList"
            :key="i.denom"
            :label="i.address"
            :value="i.address"
          ></el-option>
          <el-option
            v-if="!freezeList.length"
            :label="$t('freeze.none')"
            value=""
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="!isEmpty(selectedAddr)"
        :label="$t('freeze.status')"
      >
        <s-item
          :label="$t('freeze.in')"
          class="status"
        >{{ selectedAddr.in_end_time | formatTime }}</s-item>
        <s-item
          :label="$t('freeze.out')"
          class="status"
        >{{ selectedAddr.out_end_time | formatTime }}</s-item>
      </el-form-item>
      <el-form-item
        prop="type"
        :label="$t('freeze.type')"
      >
        <el-radio-group v-model="form.type">
          <!-- TODO: 根据所选的地址冻结状态禁用解冻类型 -->
          <el-radio
            label="in"
            :disabled="selectedAddr.in_end_time === '0'"
          >{{ $t('freeze.in') }}</el-radio>
          <el-radio
            label="out"
            :disabled="selectedAddr.out_end_time === '0'"
          >{{ $t('freeze.out') }}</el-radio>
          <el-radio label="in-out">{{ $t('freeze.all') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="$route.query.action === 'freeze'"
        prop="end"
        :label="$t('freeze.end')"
      >
        <el-date-picker
          v-model="form.end"
          type="datetime"
          :placeholder="$t('freeze.end')"
          default-time="24:00:00"
          style="width: 100%"
        >
        </el-date-picker>
      </el-form-item>

      <div class="fee"><span>{{$t('send.fee')}}</span>0 GARD</div>
      <el-button
        class="btn-send"
        native-type=“submit”
        @click="onSubmit"
      >{{$t(`freeze.${$route.query.action}`)}}</el-button>
    </el-form>

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
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import BigNumber from "bignumber.js";
import { get, isEmpty } from "lodash";

import { getViewToken } from "@/utils/helpers";
import webc from "@/utils/webc";

export default {
  name: "IssueMint",
  data() {
    const requireError = name =>
      new Error(this.$t("global.required", { name }));
    const validateAddr = (rule, value, callback) => {
      if (!value || value.trim() === "") {
        callback(requireError(this.$t("send.address")));
        return;
      }
      if (!webc.account.isValidAddress(value)) {
        callback(this.$t("send.addressWarn"));
        return;
      }
      callback();
    };
    const validateTime = (rule, value, callback) => {
      if (this.$route.query.action === "freeze" && !value) {
        callback(requireError(this.$t("freeze.end")));
        return;
      }
      callback();
    };
    return {
      form: {
        address: "",
        type: "out",
        end: ""
      },
      rules: {
        address: [{ validator: validateAddr, trigger: "blur" }],
        end: [{ validator: validateTime, trigger: "blur" }]
      },
      dialogVisible: false,
      pass: ""
    };
  },
  computed: {
    ...mapState("account", ["mathAccount"]),
    ...mapState("issue", ["tokenMap", "freezeList"]),
    detail() {
      return this.tokenMap[this.$route.params.id] || {};
    },
    selectedAddr() {
      return this.freezeList.find(i => i.address === this.form.address) || {};
    }
  },
  methods: {
    get,
    isEmpty,
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
        res = await this.$store.dispatch(`issue/freeze`, {
          pass: this.pass,
          form: this.form,
          id: this.$route.params.id,
          action: this.$route.query.action
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
          message: this.$t("global.success", {
            name: this.$t(`freeze.${this.$route.query.action}`)
          }),
          center: true
        });
        this.$router.back();
      } else {
        this.$message({
          type: "error",
          message: this.$t(`send.${res}`),
          center: true
        });
      }
      loading.close();
    }
  },
  mounted: async function() {
    this.$store.dispatch("issue/fetchToken", this.$route.params.id);
    if (this.$route.query.action !== "freeze") {
      const ls = await this.$store.dispatch(
        "issue/fetchFreezed",
        this.$route.params.id
      );
      if (ls.length) {
        this.form.address = ls[0].address;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-send {
  margin-top: $padding-basic;
  width: 100%;
  padding: $padding-basic;
}
.sub-title {
  text-align: center;
  margin-top: 24px;
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
    margin-bottom: 16px;
  }
}
.issue-freeze-card {
  .status {
    margin: 8px 0 0;
  }
}
.fee {
  span {
    margin-right: 16px;
  }
}
</style>

