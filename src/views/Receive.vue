<template>
  <s-page class="receive-container">
    <s-card :title="$t('main.receive')">
      <div class="card-content">
        <h4>{{$t('main.qrcode')}}</h4>
        <div id="qrcode"></div>
        <h4>{{$t('send.address')}}</h4>
        <s-address :address="keyStore.address || ''" />
      </div>
    </s-card>
  </s-page>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get, isEmpty } from "lodash";
import QRCode from "@/utils/qrcode";

export default {
  name: "Receive",
  computed: {
    ...mapState("account", ["keyStore"])
  },
  mounted() {
    new QRCode(document.getElementById("qrcode"), this.keyStore.address);
  }
};
</script>

<style lang="scss" scoped>
.receive-container {
  margin: 0 auto;
  padding: $padding-large;
  text-align: center;

  .card-content {
    background: white;
    border-radius: 4px;
    padding: $padding-basic 0 $padding-large;
    color: rgba(0, 0, 0, 0.7);
    h4 {
      font-size: 20px;
      font-weight: bold;
      margin: 16px;
    }
    #qrcode {
      width: 256px;
      margin: 16px auto;
    }
  }
}
</style>

