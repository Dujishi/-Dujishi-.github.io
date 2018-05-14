<template lang="html">
  <Modal class="customModal confirmModal" v-model="cd.showConfirm" width="236" :mask-closable="false">
    <h2 class="modalTitle" slot="header">
      <span>请再次确认</span>
    </h2>
    <div class="modalBox">
      <div class="confirmText mgt20">{{ cd.title }}</div>
    </div>
    <div slot="footer">
      <Button type="primary" :disabled="ui.isAjax" @click="fnConfirm">确认</Button>
      <Button type="text" @click="cd.showConfirm = false">取消</Button>
    </div>
  </Modal>
</template>
<script>
  'use strict'

  export default {
    components: {},
    props: {
      ui: Object,
      cd: Object,
      cb: Function
    },
    data () {
      return {}
    },
    created () {},
    mounted () {},
    methods: {
      fnConfirm () {
        this.cb()
      }
    },
    watch: {}
  }
</script>
<style lang="less">

</style>
