<template>
  <el-form label-position="top">

    <el-form-item :label="$t('create.mnemonic')">
      <el-input
        type="textarea"
        :autosize="{ minRows: 6, maxRows: 8}"
        :value="account.phrase"
      >
      </el-input>
    </el-form-item>

    <s-btn-card
      class="warn"
      :title="$t('create.safety')"
      :src="btnIcon"
      :breif="$t('create.mnemonicBreif')"
    >
    </s-btn-card>

    <div class="form-footer">
      <el-button @click="onStepChange(0)">{{$t('global.back')}}</el-button>
      <el-button
        type="primary"
        class="btn-next"
        @click="onSubmit"
      >{{$t('global.next')}}</el-button>
    </div>

  </el-form>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";
import btnIcon from "@/assets/btn-icon-4.svg";

export default {
  name: "Mnemonic",
  props: {
    onStepChange: { type: Function, required: true }
  },
  data() {
    return {
      btnIcon
    };
  },
  computed: {
    ...mapState("account", ["account"])
  },
  methods: {
    onSubmit() {
      this.onStepChange(2);
    }
  }
};
</script>

<style lang="scss" scoped>
// .warn {
//   &.btn-card {
//     box-shadow: none;
//   }
// }
.form-footer {
  margin-top: $padding-basic * 2;
}
.btn-next {
  float: right;
}
</style>
