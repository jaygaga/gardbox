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
          {{ get(item, 'timestamp') | formatTime }}
        </div>
      </div>
      <div :class="`amount ${get(item, 'tags.0.value')}`">
        {{get(item, 'tags.0.value') === 'send' ? '- ':'+ '}}
        {{getViewTokens(get(item, 'tx.value.msg.0.value.amount'))}}
      </div>
    </router-link>
  </div>
</template>

<script>
import { isEmpty, get, cloneDeep } from "lodash";
import { mapGetters, mapState } from "vuex";
import { getViewToken } from "@/utils/helpers";

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
    getViewTokens(coins) {
      const tokens = cloneDeep(coins);
      if (tokens.length > 1) {
        tokens.sort(i => (i.denom === "gard" ? -1 : 1));
        const token = getViewToken(tokens[0], this.tokenMap);
        return `${token.amount} ${token.denom} ···`;
      }
      const token = getViewToken(tokens[0], this.tokenMap);
      return `${token.amount} ${token.denom}`;
    }
  },
  computed: {
    ...mapState("account", ["tokenMap"])
  },
  watch: {
    list: function() {
      if (isEmpty(this.list)) {
        return false;
      }
      this.list.forEach(item => {
        // fetch token detail
        const coins = get(item, "tx.value.msg.0.value.amount");
        coins.forEach(i => {
          if (i.denom.match(/^coin.{10}$/)) {
            this.$store.dispatch("account/fetchTokenDetail", i.denom);
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.list-container {
  .tx-row {
    color: rgba(255, 255, 255, 0.6);
    display: flex;
    align-items: center;
    padding: 16px;
    margin: 8px 0;
    background: $color-primary-light;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      box-shadow: $shadow;
    }

    .ellipsis {
      color: rgb(255, 255, 255);
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
        color: #fff;
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
