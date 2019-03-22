<template>
  <el-form label-position="top">
    <el-form-item :label="$t('passport.create.mnemonic')">
      <el-input
        type="textarea"
        :autosize="{ minRows: 8, maxRows: 12}"
        :value="account.phrase"
      >
      </el-input>
    </el-form-item>

    <el-button
      type="primary"
      class="btn"
      @click="onSubmit"
    >{{$t('global.next')}}</el-button>
  </el-form>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

export default {
  name: "Mnemonic",
  props: {
    onStepChange: { type: Function, required: true }
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
.btn {
  width: 100%;
}
</style>
