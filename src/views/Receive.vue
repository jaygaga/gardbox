<template>
  <s-page class="receive-container">
    <s-card :title="$t('main.receive')">
      <div class="card-content">
        <h4>{{$t('main.qrcode')}}</h4>
        <div id="qrcode"></div>
        <h4>{{$t('send.address')}}</h4>
        <s-address
          class="addr"
          :address="address || ''"
          :brightBackground="true"
        />
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
  data() {
    return {
      address: ""
    }
  },
  computed: {
    ...mapState("account", ["keyStore", "mathAccount"])
  },
  mounted() {
    if (isEmpty(this.keyStore)) {
      new QRCode(document.getElementById("qrcode"), this.mathAccount.account);
      this.address = this.mathAccount.account
    } else {
      new QRCode(document.getElementById("qrcode"), this.keyStore.address);
      this.address = this.keyStore.address
    }
  }
};
</script>

<style lang="scss" scoped>
.receive-container {
  margin: 0 auto;
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
    .addr {
      justify-content: center;
      padding: 0 $padding-basic;
      word-break: break-all;
    }
  }
}
</style>

