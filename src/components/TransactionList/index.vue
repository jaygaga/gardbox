<template>
  <div class="list-container">
    <router-link
      v-for="item in list"
      :key="item.txhash"
      :to="`/tx/${item.txhash}`"
      class="tx-row"
    >
      <img :src="types[get(item, 'tags.0.value')]" />
      <div class="txhash">
        <div class="ellipsis">{{item.txhash}}</div>
        <div>
          {{ get(blocks, [item.height, 'block', 'header', 'time']) | formatTime }}
        </div>
      </div>
      <div :class="`amount ${get(item, 'tags.0.value')}`">
        {{get(item, 'tags.0.value') === 'send' ? '- ':'+ '}}
        {{getGardAmount(item).amount}} GARD
      </div>
    </router-link>
  </div>
</template>

<script>
import { isEmpty, get } from "lodash";
import { mapGetters, mapState } from "vuex";

import iconIn from "@/assets/icon-in.svg";
import iconOut from "@/assets/icon-out.svg";

export default {
  props: {
    list: Array,
    load: { type: Boolean, default: false }
  },
  data() {
    return {
      types: {
        send: iconOut,
        receive: iconIn
      }
    };
  },
  methods: {
    get,
    getGardAmount(item) {
      const coins = get(item, "tx.value.msg.0.value.amount");
      const GARD = { denom: "gard", amount: "0" };
      if (coins) {
        return coins.find(coin => coin.denom === GARD.denom) || GARD;
      }
      return GARD;
    }
  },
  computed: {
    ...mapState("account", ["blocks"])
  },
  watch: {
    list: function() {
      if (isEmpty(this.list)) {
        return false;
      }
      this.list.forEach(item => {
        this.$store.dispatch("transactions/fetchBlock", get(item, "height"));
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.list-container {
  .tx-row {
    color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    padding: 16px;
    margin: 8px 0;
    background: white;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      box-shadow: $shadow;
    }

    .ellipsis {
      color: rgba(0, 0, 0, 0.75);
    }

    img {
      width: 28px;
      margin-right: 16px;
    }
    .txhash {
      flex-grow: 1;
    }
    .amount {
      font-size: 20px;
      text-align: right;

      &.send {
        color: $color-error;
      }
      &.receive {
        color: $color-primary;
      }
    }
  }
  .tx-row:first-child {
    margin-top: 0;
  }
}

@include responsive($sm) {
  .list-container {
    .tx-row {
      .type {
        display: none;
      }
    }
  }
}
</style>
