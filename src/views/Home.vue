<template>
  <div class="home-container">
    this is home page
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

export default {
  name: "Home",
  interval: null,
  computed: {
    ...mapGetters("blocks", { blocksLastList: "lastList" }),
    ...mapState("transactions", { transactionsLastList: "lastList" })
  },
  methods: {
    fetchData: function() {
      this.$store.dispatch("blocks/fetchList");
      this.$store.dispatch("transactions/fetchLastList");
    }
  }
};
</script>

<style lang="scss" scoped>
.home-container .item {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 14px;
}
</style>

