<template src="./index.html"></template>
<script>
  import { commonConfList, saveCommonConf } from '../../service/index'
  import Cookies from 'js-cookie'

  export default {
    components: {},
    data () {
      return {
        loading: false,
        dataList: []
      }
    },
    mounted () {
      this.$Spin.show()
      this.getData()
    },
    methods: {
      getData () {
        commonConfList({gid: Cookies.get('shopId')}).then((res) => {
          this.$Spin.hide()
          if (res.code === 1) {
            this.dataList = res.data.lists
          }
        })
      },
      changeLabelValue (value, indexs, index) {
        this.dataList[indexs].items[index].tagValue = value.replace(/[^\d.]/g, '')
      },
      changeValue (value, indexs, index, x) {
        this.dataList[indexs].items[index].nexts[x].nextValue = value.replace(/[^\d.]/g, '')
        // console.log(this.dataList[indexs].items[index].nexts[x].nextValue)
      },
      saveConf () {
        if (this.loading) {
          return false
        }
        this.loading = true
        let batchObj = {}
        let listArr = []
        this.$Spin.show()
        this.dataList.forEach((item) => {
          item.items.forEach((x) => {
            listArr.push({
              nexts: x.nexts,
              // nextId: x.nextId,
              // nextValue: x.nextValue,
              sccId: x.sccId,
              sccdId: x.sccdId,
              tagType: x.tagType,
              tagValue: x.tagValue,
              tagValues: x.tagValues
            })
          })
        })
        batchObj = {
          list: listArr,
          shopId: Cookies.get('shopId')
        }
        saveCommonConf(batchObj).then((res) => {
          this.$Spin.hide()
          this.loading = false
          if (res.code === 1) {
            this.$Message.success(res.msg)
          }
        })
      }
    }
  }
</script>
<style scoped>
  .customModal .modalMain .ivu-form-item { margin-bottom: 24px;}
</style>
