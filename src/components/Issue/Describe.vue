<template>
  <s-card
    :title="$t('issue.modify')"
    class="issue-modify-card"
  >
    <el-form
      ref="form"
      label-position="top"
      :model="describe"
      @submit="onSubmit"
    >
      <el-form-item
        prop="organization"
        :label="$t('issue.organization')"
      >
        <el-input
          v-model="describe.organization"
          :placeholder="$t('issue.organizationEg')"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="website"
        :label="$t('issue.website')"
      >
        <el-input
          v-model="describe.website"
          :placeholder="$t('issue.websiteEg')"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="logo"
        :label="$t('issue.logo')"
      >
        <el-input
          v-model="describe.logo"
          :placeholder="$t('issue.logoEg')"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="description"
        :label="$t('issue.description')"
      >
        <el-input
          v-model="describe.description"
          :placeholder="$t('issue.description')"
          clearable
        ></el-input>
      </el-form-item>

      <div class="fee"><span>{{$t('send.fee')}}</span>0 GARD</div>
      <el-button
        class="btn-send"
        native-type=“submit”
        @click="onSubmit"
      >{{$t('issue.modify')}}</el-button>
    </el-form>

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
import { get, isEmpty } from "lodash";

import { getViewToken } from "@/utils/helpers";
import webc from "@/utils/webc";

export default {
  name: "IssueModify",
  data() {
    return {
      describe: {
        organization: "",
        website: "",
        logo: "",
        description: ""
      },
      dialogVisible: false,
      loading: false,
      pass: ""
    };
  },
  computed: {
    ...mapState("issue", ["tokenMap"]),
    detail() {
      return this.tokenMap[this.$route.params.id];
    }
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
      this.loading = true;
      let res = "";
      try {
        res = await this.$store.dispatch(`issue/modify`, {
          pass: this.pass,
          describe: this.describe,
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
        this.$router.back();
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
  mounted: async function() {
    await this.$store.dispatch("issue/fetchToken", this.$route.params.id);
    if (this.detail.description) {
      this.describe = { ...JSON.parse(this.detail.description) };
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

.fee {
  span {
    margin-right: 16px;
  }
}
</style>

