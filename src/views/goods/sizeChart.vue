<template src="./sizeChart.html"></template>
<script>
  import { sizeChartList, sizeChartInfo, sizeChartEdit, sizeChartCopy } from '../../service/index'
  import confirmModal from '../components/confirm.vue'

  export default {
    components: {
      confirmModal
    },
    data () {
      return {
        modalHeight: document.documentElement.clientHeight * 0.7,
        ui: {
          total: 0,
          pageSize: 15,
          isAjax: false,
          infoTitle: '',
          showEditModal: false
        },
        sizeChart: {
          xAxis: 1,
          yAxis: 2
        },
        listForm: {
          name: '',
          pageIndex: 1
        },
        theadData: [
          {
            name: '尺码表名',
            width: ''
          },
          {
            name: '操作',
            width: '340',
            class: 'ta-c'
          }
        ],
        tbodyData: [],
        confirmData: {
          showConfirm: false,
          title: '',
          id: ''
        },
        mainChecked: false,
        assistChecked: false,
        editData: {},
        editShowData: {
          xAxis: '',
          yAxis: '',
          xAxisAssist: '',
          mainSizeTableList: []
        },
        mainSizeChart: [],
        editForm: {
          xAxisAssist: '',
          assistSizeTable: [],
          mainSizeTableList: [],
          xAxis: '',
          yAxis: '',
          name: '',
          sizeTableId: '',
          isDefault: 0,
          productTypeList: []
        }
      }
    },
    mounted () {
      this.$Spin.show()
      this.getData()
    },
    methods: {
      getData () {
        sizeChartList(this.listForm).then((res) => {
          this.tbodyData = res.data.sizeTableList
          this.ui.total = res.data.rows
          this.$Spin.hide()
        })
      },
      searchData () {
        this.$Spin.show()
        this.listForm.pageIndex = 1
        this.getData()
      },
      // 改变页码
      changePage (index) {
        this.$Spin.show()
        this.listForm.pageIndex = index
        this.getData()
      },
      showConfirm (id, title) {
        this.confirmData.showConfirm = true
        this.confirmData.id = id
        this.confirmData.title = title
      },
      confirmCB () {
        this.$Spin.show()
        this.ui.isAjax = true
        sizeChartInfo({gid: this.confirmData.id}, 'DELETE').then((res) => {
          this.$Spin.hide()
          this.ui.isAjax = false
          this.confirmData.showConfirm = false
          this.$Message.success(res.msg)
          this.$Spin.show()
          this.getData()
        })
      },
      unique (array) {
        const res = []
        for (let i = 0, len = array.length; i < len; i += 1) {
          const current = array[i]
          if (res.indexOf(current) === -1) {
            res.push(current)
          }
        }
        return res
      },
      addCol (arr) {
        arr.forEach((item) => {
          item.push('')
        })
      },
      addRow (arr) {
        arr.push(new Array(arr[0].length))
      },
      data2Arrary (oldData) {
        const newData = []
        // let firstItem = `${this.editShowData.xAxis}/${this.editShowData.yAxis}`
        const firstItem = `${oldData.yAxisName}/${oldData.xAxisName}`
        newData.push([])
        newData[0].push(firstItem)
        let xArr = oldData.mainSizeTableList.map(item => item.xAxisValue)
        let yArr = oldData.mainSizeTableList.map(item => item.yAxisValue)
        xArr = this.unique(xArr)
        yArr = this.unique(yArr)
        // newData[0] = [...newData[0], ...xArr.map((item) => {
        //   return {value: item}
        // })]
        xArr.forEach((item) => {
          newData[0].push(item)
        })
        oldData.mainSizeTableList.forEach((item) => {
          let index = -1
          newData.forEach((row, idx) => {
            if (row[0] === item.yAxisValue) {
              index = idx
            }
          })
          let rowObj = []
          if (index === -1) {
            rowObj.push(item.yAxisValue)
            newData.push(rowObj)
          } else {
            rowObj = newData[index]
          }
          rowObj.push(item.value)
        })
        return newData
      },
      dataArraryBack (oldData) {
        const newData = []
        return newData
      },
      editSizeChart (value, title) {
        this.$Spin.show()
        this.ui.showEditModal = true
        this.ui.infoTitle = title
        let reqData
        if (value === '') {
          reqData = {gid: 0}
        } else {
          reqData = {gid: value}
        }
        sizeChartInfo(reqData, 'GET').then((res) => {
          this.editData = res.data
          this.editForm.sizeTableId = value
          this.editForm.name = res.data.name || ''
          this.editForm.xAxis = res.data.mainSizeTable.xAxis || ''
          this.editForm.yAxis = res.data.mainSizeTable.yAxis || ''
          this.editForm.xAxisAssist = res.data.assistSizeTable.xAxisAssist
          this.editShowData.xAxis = res.data.mainSizeTable.xAxisName
          this.editShowData.yAxis = res.data.mainSizeTable.yAxisName
          this.editShowData.xAxisAssist = res.data.assistSizeTable.xAxisName
          this.editForm.isDefault = res.data.isDefault || 0
          this.editForm.productTypeList = res.data.productTypeList || []
          // list
          if (!res.data.assistSizeTable.assistSizeTableList) {
            this.editForm.assistSizeTable = []
          } else {
            this.editForm.assistSizeTable = res.data.assistSizeTable.assistSizeTableList
          }
          if (!res.data.mainSizeTable.mainSizeTableList) {
            this.editShowData.xAxis = ''
            this.editShowData.yAxis = ''
            this.editForm.mainSizeTableList = [['/']]
          } else {
            this.editForm.mainSizeTableList = this.data2Arrary(res.data.mainSizeTable)
          }
          if (!res.data.mainSizeTable.mainSizeTableList) {
            this.mainChecked = false
            this.assistChecked = true
          } else {
            this.mainChecked = true
            this.assistChecked = false
          }
          if (!res.data.assistSizeTable.assistSizeTableList) {
            this.mainChecked = true
            this.assistChecked = false
          } else {
            this.mainChecked = false
            this.assistChecked = true
          }
          this.$Spin.hide()
        })
      },
      copySizeChart (id) {
        this.$Spin.show()
        sizeChartCopy({sizeTableId: id}).then((res) => {
          this.$Spin.hide()
          if (res.code !== 1) {
            return false
          }
          this.$Message.success({
            content: '尺码表复制成功',
            duration: 5,
            closable: true
          })
          this.$Spin.show()
          this.getData()
        })
      },
      saveChecked () {
        if (this.editForm.name === '') {
          this.$Message.error('尺码表名不能为空')
          return false
        } else {
          return true
        }
      },
      saveSizeChart () {
        let oldArray = this.editForm.mainSizeTableList
        let newArray = []
        oldArray.forEach((item, index) => {
          item.forEach((row, ii) => {
            if (index > 0 && ii > 0) {
              newArray.push({
                xAxisValue: oldArray[0][ii],
                yAxisValue: oldArray[index][0],
                value: row
              })
            }
          })
        })
        if (!this.saveChecked()) {
          return false
        }
        this.$Spin.show()
        this.editForm.mainSizeTableList = newArray
        if (!this.mainChecked) {
          this.editForm.xAxis = ''
          this.editForm.yAxis = ''
          this.editForm.mainSizeTableList = []
        }
        if (!this.assistChecked) {
          this.editForm.xAxisAssist = ''
          this.editForm.assistSizeTable = []
        }
        if (!this.editForm.isDefault) {
          this.editForm.productTypeList = []
        }
        sizeChartEdit(this.editForm).then(res => {
          this.$Message.success(res.msg)
          this.ui.showEditModal = false
          this.$Spin.hide()
          this.$Spin.show()
          this.getData()
        })
      },
      changeX (id, value) {
        this.editForm.xAxis = id
        this.editShowData.xAxis = value
        this.editForm.mainSizeTableList[0][0] = this.editShowData.xAxis + '/' + this.editShowData.yAxis
        // this.editForm.mainSizeTableList = [[this.editShowData.xAxis + '/' + this.editShowData.yAxis]]
      },
      changeY (id, value) {
        this.editForm.yAxis = id
        this.editShowData.yAxis = value
        this.editForm.mainSizeTableList[0][0] = this.editShowData.xAxis + '/' + this.editShowData.yAxis
        // this.editForm.mainSizeTableList = [[this.editShowData.xAxis + '/' + this.editShowData.yAxis]]
      },
      changeAssistX (id, value) {
        this.editForm.xAxisAssist = id
        this.editShowData.xAxisAssist = value
      },
      fnMinusAssistChart () {
        this.editForm.assistSizeTable.pop()
      },
      fnPlusAssistChart () {
        this.editForm.assistSizeTable.push({
          param: '',
          value: ''
        })
      },
      fnPlusMainChartCol () {
        this.addCol(this.editForm.mainSizeTableList)
      },
      fnMinusMainChartCol (index) {
        console.log(this.editForm.mainSizeTableList)
        this.editForm.mainSizeTableList.forEach((item) => {
          item.splice(index, 1)
        })
      },
      fnPlusMainChartRow () {
        this.addRow(this.editForm.mainSizeTableList)
      },
      fnMinusMainChartRow (index) {
        this.editForm.mainSizeTableList.splice(index, 1)
      },
      mainChange (value) {
        value ? this.assistChecked = false : this.assistChecked = true
      },
      assistChange (value) {
        value ? this.mainChecked = false : this.mainChecked = true
      }
    }
  }
</script>
