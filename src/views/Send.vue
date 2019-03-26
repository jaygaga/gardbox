<template>
  <div class="send-container">
    <s-card>
      <el-form
        ref="form"
        label-position="top"
        :model="form"
      >
        <el-form-item
          :label="`${$t('send.amount')} (Balance: ${balance})`"
          prop="amount"
          required
        >
          <el-input
            v-model="form.amount"
            :placeholder="$t('send.amount')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('send.address')"
          prop="address"
          required
        >
          <el-input
            v-model="form.address"
            :placeholder="$t('send.address')"
            clearable
          ></el-input>
        </el-form-item>
        <div class="fee"><span>{{$t('send.fee')}}</span>0 GARD</div>
      </el-form>

      <el-button
        type="primary"
        class="btn"
        @click="onSubmit"
      >{{$t('home.send')}}</el-button>

      <el-dialog
        :title="$t('create.pass')"
        :visible.sync="dialogVisible"
        width="360px"
        v-loading="loading"
      >
        <el-input
          type="password"
          v-model="form.pass"
          :placeholder="$t('create.pass')"
        ></el-input>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogVisible = false">{{$t('global.cancel')}}</el-button>
          <el-button
            type="primary"
            @click="onSend"
          >{{$t('global.ok')}}</el-button>
        </span>
      </el-dialog>
    </s-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";
import { gardplorerDomain } from "@/constants";

export default {
  name: "Send",
  data() {
    return {
      dialogVisible: false,
      loading: false,
      form: {
        amount: "",
        address: "",
        pass: ""
      }
    };
  },
  computed: {
    ...mapState("account", ["userMap", "balance"])
  },
  methods: {
    onSubmit: async function() {
      this.$refs["form"].validate(valid => {
        if (!valid) return false;
        this.dialogVisible = true;
      });
    },
    onSend: async function() {
      if (!this.form.pass) {
        this.$message({
          type: "error",
          message: "Please password!",
          center: true
        });
        return false;
      }
      this.loading = true;
      const res = await this.$store.dispatch("account/send", this.form);
      if (res) {
        this.dialogVisible = false;
        this.showSuccess(res.data.txhash);
      } else {
        this.$message({
          type: "error",
          message: "Wrong parameter!",
          center: true
        });
      }
      this.loading = false;
    },
    showSuccess(txhash) {
      const h = this.$createElement;
      this.$alert(
        h("p", null, [
          h("span", null, "txhash: "),
          h(
            "a",
            {
              attrs: {
                class: "ellipsis",
                href: `${gardplorerDomain}tx/${txhash}`,
                target: "_blank"
              }
            },
            txhash
          )
        ]),
        "Success",
        {
          confirmButtonText: this.$t("global.ok"),
          callback: action => {}
        }
      );
    }
  },
  mounted() {
    this.$store.dispatch("account/fetchBalance");
  }
};
</script>

<style lang="scss" scoped>
.send-container {
  width: $xs;
  margin: 0 auto;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  .fee {
    span {
      margin-right: 16px;
    }
  }

  .btn {
    width: 100%;
    margin: 24px 0;
  }

  .ellipsis {
    display: inline-block;
    max-width: 200px;
    vertical-align: top;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>

