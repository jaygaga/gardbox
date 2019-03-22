<template>
  <div class="create-container">

    <el-steps
      :active="step"
      v-if="step < 3"
      simple
    >
      <el-step title="Create"></el-step>
      <el-step title="Mnemonic"></el-step>
      <el-step title="Confirm"></el-step>
    </el-steps>

    <s-card>
      <Password
        v-if="step === 0"
        :onStepChange="onStepChange"
      />
      <Mnemonic
        v-if="step === 1"
        :onStepChange="onStepChange"
      />
      <Confirm
        v-if="step === 2"
        :onStepChange="onStepChange"
      />
    </s-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

import Password from "./password";
import Mnemonic from "./mnemonic";
import Confirm from "./confirm";

export default {
  name: "Create",
  components: { Password, Mnemonic, Confirm },
  data() {
    return {
      step: 0
    };
  },
  methods: {
    onStepChange(i) {
      this.step = i;
      // if (this.step < 2) {
      //   this.step++;
      // } else {
      //   this.$router.push("/home");
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
.create-container {
  color: white(0.85);
  padding: 16px 0;
  width: $sm;

  .el-steps--simple {
    background: $color-background-card;
  }
}
</style>

