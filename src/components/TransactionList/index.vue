<template>
  <div class="list-container">

    <div
      v-for="item in list"
      :key="item.txhash"
      class="tx-row"
    >
      <div class="type">{{get(item, 'tags.0.value')}}</div>
      <div class="txhash">

        <s-link
          type="tx"
          :content="item.txhash"
        />
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
  .tx-row {
    display: flex;
    align-items: center;
    border-bottom: $border;
    padding-bottom: 16px;
    margin-bottom: 16px;
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
  .tx-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
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
