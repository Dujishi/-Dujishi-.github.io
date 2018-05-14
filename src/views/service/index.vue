<template src="./index.html"></template>

<script>
  import { serviceHolidayInfo, serviceHolidaySave } from '../../service/index'

  export default {
    data () {
      return {
        isAjax: false,
        infoForm: {
          type: '1'
        },
        workDaysList: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        holidaysList: [],
        defaultHolidaysList: [],
        theadData: [
          {
            name: '节假日名称',
            width: '170px'
          },
          {
            name: '时效',
            width: ''
          },
          {
            name: '受假期影响的调休',
            width: '280px'
          }
        ],
        saveForm: {
          workDaysList: [],
          shopHolId: '',
          startTime: '',
          endTime: '',
          shopHolidaysList: [],
          defaultHolidaysList: []
        }
      }
    },
    mounted () {
      this.$Spin.show()
      this.getData()
    },
    methods: {
      changeType (value) {
        // 初始化
        this.defaultHolidaysList = []
        this.saveForm = {
          workDaysList: [],
          shopHolId: '',
          startTime: '',
          endTime: '',
          shopHolidaysList: []
        }
        this.holidaysList = []
        this.$Spin.show()
        this.getData()
      },
      getData () {
        serviceHolidayInfo(this.infoForm).then((res) => {
          this.$Spin.hide()
          if (res.code !== 1) {
            return false
          }
          // 选中节假日
          this.defaultHolidaysList = res.data.defaultHolidaysList || []
          this.saveForm = {
            workDaysList: res.data.workDaysList || [],
            shopHolId: res.data.shopHolId || '',
            startTime: res.data.startTime || '',
            endTime: res.data.endTime || '',
            shopHolidaysList: res.data.shopHolidaysList || []
          }
          // 选中节假日
          this.defaultHolidaysList = res.data.defaultHolidaysList || []
          this.defaultHolidaysList.forEach((item) => {
            if (item.checked) {
              this.holidaysList.push(item.name)
            }
          })
        })
      },
      removeResetDays (index, x) {
        this.saveForm.shopHolidaysList[index].daysOffList.splice(x, 1)
      },
      changeHoliday (value) {
        this.saveForm.shopHolidaysList = []
        this.defaultHolidaysList.forEach((x) => {
          this.holidaysList.forEach((item, index) => {
            if (x.name === value[index]) {
              this.saveForm.shopHolidaysList.push({
                daysOffList: x.daysOffList,
                endTime: x.endTime,
                name: x.name,
                sourceId: x.holId,
                startTime: x.startTime
              })
            }
          })
        })
      },
      saveSetting () {
        this.isAjax = true
        this.$Spin.show()
        this.saveForm.type = this.infoForm.type
        serviceHolidaySave(this.saveForm).then((res) => {
          this.isAjax = false
          this.$Spin.hide()
          if (res.code !== 1) {
            return false
          }
          this.$Spin.show()
          this.getData()
        })
      }
    }
  }
</script>
<style scoped>
  .pd15 { padding: 15px;}
</style>
