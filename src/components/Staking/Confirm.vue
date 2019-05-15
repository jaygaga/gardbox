<template>
  <s-card :title="$t('send.confirm')">
    <s-item
      v-if="!isEmpty(fromValidator)"
      :label="$t('staking.fromValidator')"
    >{{ get(fromValidator, 'description.moniker') }}</s-item>
    <s-item
      v-if="!isEmpty(toValidator)"
      :label="$t('staking.toValidator')"
    >{{ get(toValidator, 'description.moniker') }}</s-item>
    <s-item
      v-if="$route.query.action !== 'unbind'"
      :label="$t('staking.commission')"
    >{{ numeral(get(toValidator, 'commission.rate')).format('(0.[00]%)') }}</s-item>
    <s-item :label="$t('send.amount')">{{form.amount | formatNumber}} GARD</s-item>
    <s-item :label="$t('send.fee')">0 GARD</s-item>

    <el-button
      class="btn-send"
      @click="onSubmit"
    >{{$t('global.confirm')}}</el-button>

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
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import numeral from "numeral";
import { get, isEmpty } from "lodash";

export default {
  name: "StakingConfirm",
  data() {
    return {
      dialogVisible: false,
      loading: false,
      pass: ""
    };
  },
  computed: {
    ...mapState("staking", ["form", "toValidator", "fromValidator"])
  },
  methods: {
    get,
    isEmpty,
    numeral,
    onSubmit: async function() {
      this.dialogVisible = true;
    },
    onSend: async function() {
      if (!this.pass) {
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
        res = await this.$store.dispatch(
          `staking/${this.$route.query.action}`,
          {
            pass: this.pass
          }
        );
      } catch (e) {
        this.$message({
          type: "error",
          message: this.$t(`send.error`),
          center: true
        });
      }
      if (res.txhash) {
        this.dialogVisible = false;
        if (this.$route.query.action === "unbind") {
          this.$router.push(
            `/staking/detail/${this.fromValidator.operator_address}`
          );
        } else {
          this.$router.push(
            `/staking/detail/${this.toValidator.operator_address}`
          );
        }
      } else {
        this.$message({
          type: "error",
          message: this.$t(`send.${res}`),
          center: true
        });
      }
      this.loading = false;
    }
  },
  beforeMount() {
    if (!this.form.amount) {
      this.$router.back();
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
</style>

