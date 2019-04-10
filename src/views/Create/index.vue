<template>
  <s-page class="create-container">

    <s-card :title="$t('passport.create')">
      <div class="warn">
        <ul>
          <li>{{$t('create.warn1')}}</li>
          <li>{{$t('create.warn2')}}</li>
        </ul>
      </div>
      <Password
        class="create-form"
        v-show="step === 0"
        :onStepChange="onStepChange"
      />
      <Mnemonic
        class="create-form"
        v-if="step === 1"
        :onStepChange="onStepChange"
      />
      <Confirm
        class="create-form"
        v-if="step === 2"
        :onStepChange="onStepChange"
      />
    </s-card>
  </s-page>
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
      //   this.$router.push("/main");
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
.create-container {
  padding: $padding-large;
  width: 100%;

  .warn {
    padding: $padding-basic;
    padding-left: $padding-large;
    background: rgba(255, 255, 255, 0.25);
    li {
      list-style: inherit;
    }
  }
}
@include responsive($sm) {
  .create-container {
    padding: $padding-large / 2;
  }
}
</style>

