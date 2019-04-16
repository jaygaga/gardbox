<template>

  <s-card :title="$t('create.mnemonic')">

    <div class="create-warn">
      {{$t('create.mnemonicBreif')}}
    </div>

    <el-input
      class="mnemonic"
      type="textarea"
      :autosize="{ minRows: 6, maxRows: 8}"
      :value="account.phrase"
    >
    </el-input>

    <el-button
      class="btn-next"
      @click="onSubmit"
    >{{$t('global.next')}}</el-button>

  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

export default {
  name: "Mnemonic",
  computed: {
    ...mapState("account", ["account"])
  },
  methods: {
    onSubmit() {
      this.$router.push("confirm");
    }
  }
};
</script>

<style lang="scss" scoped>
.create-warn {
  padding: $padding-basic;
  padding-left: $padding-large;
  background: rgba(255, 255, 255, 0.2);
  margin-bottom: $padding-basic;
}
.mnemonic {
  margin-bottom: $padding-basic;
}
.btn-next {
  width: 100%;
  padding: $padding-basic;
}
</style>
