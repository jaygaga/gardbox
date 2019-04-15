<template>
  <div class="data-item">{{label}}
    <span>
      <slot />
    </span>
  </div>
</template>

<script>
import { gardplorerDomain } from "@/constants";

export default {
  props: {
    label: String,
    data: String
  }
};
</script>

<style lang="scss" scoped>
.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: $padding-large 0;
  span {
    max-width: 70%;
    word-break: break-all;
    text-align: right;
  }
}
</style>
