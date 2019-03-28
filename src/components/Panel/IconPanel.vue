<template>

  <el-row class="btn-card">
    <el-col
      :span="10"
      class="card-l"
    >
      <img
        :alt="title"
        :src="src"
      />
    </el-col>
    <el-col
      :span="14"
      class="card-r"
    >
      <h4>{{title}}</h4>
      <p>{{breif}}</p>
      <slot />
    </el-col>
  </el-row>

</template>

<script>
export default {
  name: "IconPanel",
  props: {
    src: { type: String, required: true },
    title: { type: String, required: true },
    breif: { type: String, required: true }
  }
};
</script>

<style lang="scss" scoped>
.btn-card {
  padding: $padding-basic;
  background: white;
  border-radius: 16px;
  box-shadow: $shadow;

  .card-l {
    max-width: 160px;
  }
  .card-r {
    padding: 0 16px 0 $padding-large;

    h4 {
      font-size: 20px;
      font-weight: bold;
    }
    p {
      height: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

@include responsive($sm) {
  .btn-card {
    margin-top: $padding-large;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>

