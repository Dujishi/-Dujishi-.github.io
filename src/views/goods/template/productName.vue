<template>
  <div>
    <a target="_blank" :href="row.url">
      <span v-if="row.newPro === '是'"><i class="iconfont icon-new" style="color: #f56c6c; font-size: 18px;"></i></span>
      {{ row.name }}
    </a>
  </div>
</template>

<script>
  export default {
    props: {
      row: Object
    }
  }
</script>
