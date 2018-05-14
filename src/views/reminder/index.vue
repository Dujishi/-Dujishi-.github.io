<template src="./index.html"></template>

<script>
  import { reminderInfo, reminderSave } from '../../service/index'
  import Cookies from 'js-cookie'
  import UMeditor from '../components/um.vue'

  export default {
    components: {
      UMeditor
    },
    data () {
      return {
        reminder: {
          order: [],
          pay: [],
          positive: [],
          end: ''
        },
        orderTime: [
          {
            start: 5,
            end: 10
          },
          {
            start: 5,
            end: 10
          },
          {
            start: 10,
            end: 15
          }
        ],
        payTime: [
          {
            start: 3,
            end: 5
          },
          {
            start: 3,
            end: 5
          },
          {
            start: 5,
            end: 10
          }
        ],
        positiveTime: [
          {
            start: 5,
            end: 10
          },
          {
            start: 5,
            end: 10
          },
          {
            start: 10,
            end: 15
          }
        ],
        um: {
          orderContent: '催下单话术',
          payContent: '催付款话术',
          positiveContent: '催好评话术',
          source: '',
          config: {
            zIndex: 90,
            maximumWords: 200,
            initialFrameHeight: 150,
            autoHeightEnabled: false
          },
          toolbar: []
        }
      }
    },
    mounted () {
      this.$Spin.show()
      this.getData()
    },
    methods: {
      getData () {
        reminderInfo({gid: Cookies.get('shopId')}).then((res) => {
          this.$Spin.hide()
          if (res.code !== 1) {
            return false
          }
          this.reminder = res.data
        })
      },
      plusReminder (arr, type) {
        if (type === 1) {
          arr.push({
            content: arr[arr.length - 1].content,
            end: this.orderTime[arr.length].end,
            start: this.orderTime[arr.length].start
          })
        } else if (type === 2) {
          arr.push({
            content: arr[arr.length - 1].content,
            end: this.payTime[arr.length].end,
            start: this.payTime[arr.length].start
          })
        } else if (type === 3) {
          arr.push({
            content: arr[arr.length - 1].content,
            end: this.positiveTime[arr.length].end,
            start: this.positiveTime[arr.length].start
          })
        }
      },
      minusReminder (arr, index) {
        arr.splice(index, 1)
      },
      numKeyup (value, arr, index, name) {
        arr[index][name] = value.replace(/[^\d.]/g, '')
      },
      saveReminder () {
        this.$Spin.show()
        reminderSave(this.reminder).then((res) => {
          this.$Spin.hide()
          if (res.code !== 1) {
            return false
          }
          this.$Message.success(res.msg)
        })
      }
    }
  }
</script>
<style scoped>
  .reminderBox { width: 700px; padding: 20px; }
</style>
