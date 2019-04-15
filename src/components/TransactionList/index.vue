<template>
  <div class="list-container">

    <div
      v-for="item in list"
      :key="item.txhash"
      class="tx-row"
    >
      <div class="type">{{get(item, 'tags.0.value')}}</div>
      <div class="txhash">

        <!-- <s-link
          type="tx"
          :content="item.txhash"
        /> -->
        <div class="ellipsis">{{item.txhash}}</div>
        <div>
          {{ get(blocks, [item.height, 'block', 'header', 'time']) | formatTime }}
        </div>
      </div>
      <div :class="`amount ${get(item, 'tags.0.value')}`">
        {{get(item, 'tags.0.value') === 'send' ? '- ':'+ '}}
        {{get(item, 'tx.value.msg.0.value.amount.0.amount')}} GARD
      </div>
    </div>
  </div>

</template>

<script>
import { isEmpty, get } from "lodash";
import { mapGetters, mapState } from "vuex";

export default {
  props: {
    list: Array,
    fields: Array,
    load: { type: Boolean, default: false }
  },
  methods: { get },
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
  color: rgba(0, 0, 0, 0.85);
  .tx-row {
    display: flex;
    align-items: center;
    padding: 16px;
    margin: 8px;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    transition: margin $trans;
    transition: padding $trans;
    box-shadow: $shadow;

    &:hover {
      margin: 4px;
      padding: 20px 16px;
    }

    .type {
      flex-basis: 160px;
      font-size: 20px;
    }
    .txhash {
      flex-grow: 1;
    }
    .amount {
      font-size: 20px;

      &.send {
        color: $color-warning;
      }
      &.receive {
        color: $color-success;
      }
    }
  }
  .tx-row:first-child {
    margin-top: 4px;
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
