<template src="./goods.html"></template>

<script>
  import { productList, productInfo, productEdit, productAttrs, productSyn, sizeChartList } from '../../service/index'
  import confirmModal from '../components/confirm.vue'
  import Cookies from 'js-cookie'
  import productName from './template/productName.vue'

  const shopIds = Cookies.get('shopId')
  const sizeChartLists = JSON.parse(localStorage.getItem('sizeChart' + shopIds)) || []
  export default {
    components: {
      confirmModal,
      productName
    },
    data () {
      return {
        filterSizeChart: [],
        modalHeight: document.documentElement.clientHeight * 0.7,
        ui: {
          showInfo: false,
          showAttrs: false,
          showBatchModal: false,
          isAjax: false,
          total: 0,
          pageSize: 15
        },
        list: {
          name: '',
          pageIndex: 1,
          extId: '',
          attrKeys: [],
          sortAttr: '',
          sortOrder: ''
        },
        attrsForm: ['selection', 'extId', 'name', 'sizeTableName', 'opera'], // 'selection',
        attrsData: [],
        theadData: [
          {
            type: 'selection',
            fixed: 'left',
            width: 60,
            align: 'center'
          },
          {
            title: '商品ID',
            key: 'extId',
            width: 140
          },
          {
            title: '商品名称',
            // key: 'name',
            width: 450,
            render: (h, params) => {
              return h(productName, {
                props: {
                  row: params.row
                }
              })
            }
          },
          {
            width: 200,
            key: 'sizeTableName',
            sortable: 'custom',
            filters: sizeChartLists,
            filterMultiple: false,
            filterRemote (value, row) {
              let filterIndex = this.list.attrKeys.findIndex((item) => {
                return item.name === row
              })
              if (filterIndex === -1) {
                this.list.attrKeys.push({
                  name: row,
                  value: value.toString()
                })
              } else {
                this.list.attrKeys[filterIndex].value = value.toString()
              }
              this.list.pageIndex = 1
              this.getData()
            },
            align: 'center',
            renderHeader: (h, params) => {
              return h('span', [
                h('span', {}, '尺码表'),
                h('i', {
                  class: [
                    'iconfont', 'icon-edit'
                  ],
                  style: {
                    fontSize: '12px',
                    marginLeft: '5px'
                  },
                  on: {
                    click: () => {
                      this.batchOpera('', '尺码表', 'select')
                    }
                  }
                })
              ])
            }
          },
          {
            title: '操作',
            fixed: 'right',
            width: 100,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('i', {
                  class: [
                    'iconfont', 'icon-edit'
                  ],
                  style: {
                    fontSize: '16px'
                  },
                  on: {
                    click: () => {
                      this.getInfo(params.row.id)
                    }
                  }
                })
              ])
            }
          }
        ],
        tbodyData: [],
        confirmData: {
          showConfirm: false,
          title: ''
        },
        infoData: {},
        infoEditData: [],
        infoEneditData: [],
        editForm: {
          ids: [],
          sizeTableId: ''
        },
        batchForm: {
          attrKeys: '',
          attrValues: [],
          ids: [],
          sizeTableId: '',
          selectedAll: 0
        },
        dateValue: [],
        radioValue: '',
        textValue: '',
        batchModal: {
          title: '',
          type: '',
          options: []
        },
        sizeChartList: []
      }
    },
    methods: {
      getSizeChartList () {
        this.filterSizeChart = []
        sizeChartList().then((res) => {
          if (res.code === 1) {
            res.data.sizeTableList.forEach((item) => {
              this.filterSizeChart.push({
                label: item.name,
                value: item.name
              })
            })
            this.filterSizeChart.unshift({
              label: '未关联尺码表',
              value: '未关联尺码表'
            })
            console.log(this.filterSizeChart)
            localStorage.setItem('sizeChart' + shopIds, JSON.stringify(this.filterSizeChart))
          }
        })
      },
      init () {
        productAttrs({gid: ''}).then((res) => {
          if (res.code === 1) {
            this.attrsData = res.data.attrs
            let localAttrsForm = JSON.parse(localStorage.getItem(shopIds))
            let localAttrKeys = JSON.parse(localStorage.getItem('attrsKeys' + shopIds))
            if (localAttrsForm) {
              this.attrsForm = localAttrsForm
              this.theadData = this.fnTheadData()
            }
            localAttrKeys ? this.list.attrKeys = localAttrKeys : this.list.attrKeys = []
            this.getData()
            if (sizeChartLists.length === 0) {
              location.reload()
            }
          }
        })
      },
      searchData () {
        this.list.pageIndex = 1
        this.getData()
      },
      getData () {
        this.$Spin.show()
        productList(this.list).then((res) => {
          this.$Spin.hide()
          if (res.code !== 1) {
            return false
          }
          this.tbodyData = res.data.list
          this.ui.total = res.data.total
          let lists = res.data.list
          this.batchForm.ids = []
          for (let x in lists) {
            lists[x].attrs.forEach(item => { this.tbodyData[x][item.attrKey] = item.attrValue })
            delete this.tbodyData[x].attrs
          }
          setTimeout(() => {
            this.changeSelectAll(this.batchForm.selectedAll)
          })
        })
      },
      getInfo (id) {
        this.editForm.ids = [id]
        this.$Spin.show()
        this.infoEditData = []
        this.infoEneditData = []
        productInfo({id: id}).then((res) => {
          this.infoData = res.data
          this.editForm.sizeTableId = res.data.sizeTableId
          res.data.attrs.forEach(item => {
            if (item.modify === 1) {
              let showValue
              if (item.type === 'date') {
                showValue = item.attrValue.split('~')
              } else if (item.type === 'radio' || item.type === 'text') {
                showValue = item.attrValue
              }
              this.infoEditData.push({
                attrName: item.attrName,
                attrKey: item.attrKey,
                attrValue: showValue,
                options: item.options || [],
                type: item.type
              })
            } else {
              this.infoEneditData.push({
                attrName: item.attrName,
                attrKey: item.attrKey,
                attrValue: item.attrValue
              })
            }
          })
          this.ui.showInfo = true
          this.$Spin.hide()
        })
      },
      saveEdit () {
        let keysArr = []
        let valueArr = []
        this.infoEditData.forEach(item => {
          let newArr = []
          keysArr.push(item.attrKey)
          if (item.type === 'date') {
            item.attrValue.forEach(x => {
              if (x !== '') {
                newArr.push(this.$moment(x).format('YYYY-MM-DD'))
              }
            })
            let newDate = newArr.join('~')
            valueArr.push(newDate)
          } else {
            valueArr.push(item.attrValue)
          }
        })
        this.editForm.attrKeys = keysArr
        this.editForm.attrValues = valueArr
        if (this.editForm.sizeTableId === '') {
          this.$Message.error('尺码表不能为空')
        }
        this.ui.isAjax = true
        this.$Spin.show()
        productEdit(this.editForm).then((res) => {
          this.ui.isAjax = false
          this.$Spin.hide()
          this.$Message.success(res.msg)
          this.ui.showInfo = false
          this.getData()
        })
      },
      attrsChange () {
        localStorage.setItem(shopIds, JSON.stringify(this.attrsForm))
        this.ui.showAttrs = false
        this.theadData = this.fnTheadData()
        location.reload()
      },
      fnTheadData () {
        let newTheadData = []
        this.attrsData.forEach((item) => {
          let filtersList = []
          const values = item.values || []
          values.forEach((x) => {
            filtersList.push({
              label: x,
              value: x
            })
          })
          if (item.modify === 1) {
            newTheadData.push({
              name: item.attrKey,
              title: item.attrName,
              width: 220,
              align: 'center',
              sortable: 'custom',
              key: item.attrKey,
              filters: filtersList,
              filterMultiple: false,
              filterRemote (value, row) {
                let filterIndex = this.list.attrKeys.findIndex((item) => {
                  return item.name === row
                })
                this.list.attrKeys[filterIndex].value = value.toString()
                this.list.pageIndex = 1
                this.getData()
              },
              renderHeader: (h, params) => {
                return h('span', [
                  h('span', {}, item.attrName),
                  h('i', {
                    class: [
                      'iconfont', 'icon-edit'
                    ],
                    style: {
                      fontSize: '12px',
                      marginLeft: '5px'
                    },
                    on: {
                      click: () => {
                        this.batchOpera(item.attrKey, item.attrName, item.type, item.options)
                      }
                    }
                  })
                ])
              }
            })
          } else {
            newTheadData.push({
              name: item.attrKey,
              title: item.attrName,
              width: 150,
              align: 'center',
              sortable: 'custom',
              key: item.attrKey,
              filters: filtersList,
              filterMultiple: false,
              filterRemote (value, row) {
                let filterIndex = this.list.attrKeys.findIndex((item) => {
                  return item.name === row
                })
                this.list.attrKeys[filterIndex].value = value.toString()
                this.list.pageIndex = 1
                this.getData()
              }
            })
          }
        })
        let data = []
        let letAttrsKeys = []
        this.attrsForm.forEach(item =>
          newTheadData.forEach((x) => {
            if (x.name === item) {
              data.push(x)
              letAttrsKeys.push({
                name: x.name,
                value: ''
              })
            }
          })
        )
        this.list.attrKeys = this.unique(letAttrsKeys)
        localStorage.setItem('attrsKeys' + shopIds, JSON.stringify(this.list.attrKeys))
        return this.theadData.concat(data)
      },
      changeSelectAll (value) {
        let isSelect
        value === 1 ? isSelect = true : isSelect = false
        this.$refs.selection.selectAll(isSelect)
      },
      selectionChange (selection) {
        let ids = []
        selection.forEach((item) => {
          ids.push(item.id)
        })
        this.batchForm.ids = this.unique(ids)
      },
      productSort (column) { // 排序
        this.list.sortAttr = column.key
        column.order === 'asc' ? this.list.sortOrder = 1 : this.list.sortOrder = 2
        this.getData()
      },
      batchOpera (value, name, type, options) {
        this.batchForm.attrKeys = [value]
        this.batchModal.title = name
        this.batchModal.type = type
        this.batchModal.options = options
        this.ui.showBatchModal = true
        if (type === 'select') {
          sizeChartList().then((res) => {
            this.sizeChartList = res.data.sizeTableList
          })
        } else if (type === 'radio') {
          this.radioValue = ''
        } else if (type === 'checkbox') {
          this.batchForm.attrValues = []
        } else if (type === 'text') {
          this.textValue = ''
        } else if (type === 'date') {
          // this.batchForm.attrKeys.forEach((item) => {
          // })
          this.dateValue = []
        }
      },
      batchSave () {
        if (!this.batchForm.ids.length) {
          this.$Message.info('商品选择不能为空')
          return false
        }
        this.$Spin.show()
        this.ui.isAjax = true
        if (this.batchModal.type === 'select') {
          this.batchForm.attrKeys = []
          this.batchForm.attrValues = []
        } else {
          this.batchForm.sizeTableId = ''
        }
        if (this.batchModal.type === 'date') {
          this.batchForm.attrValues = [this.dateValue.join('~')]
        }
        if (this.batchModal.type === 'checkbox' && this.batchForm.attrValues.length === 0) {
          this.batchForm.attrValues = ['']
        }
        if (this.batchModal.type === 'radio') {
          this.batchForm.attrValues = [this.radioValue]
        }
        if (this.batchModal.type === 'text') {
          this.batchForm.attrValues = [this.textValue]
        }
        this.batchForm.name = this.list.name
        productEdit(this.batchForm).then((res) => {
          this.ui.isAjax = false
          this.$Spin.hide()
          if (res.code === 1) {
            this.batchForm.selectedAll = 0
            this.$Message.success(res.msg)
            this.ui.showBatchModal = false
            this.getData()
          }
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
      showConfirm (title) {
        this.confirmData.showConfirm = true
        this.confirmData.title = title
      },
      confirmCB () {
        this.$Spin.show()
        this.ui.isAjax = true
        productSyn({gid: shopIds}).then((res) => {
          this.ui.isAjax = false
          this.$Spin.hide()
          this.confirmData.showConfirm = false
          this.$Message.success(res.msg)
          this.getData()
        })
      },
      // 改变页码
      changePage (index) {
        this.$Spin.show()
        this.list.pageIndex = index
        this.getData()
      }
    },
    mounted () {
      this.getSizeChartList()
      this.init()
    }
  }
</script>
<style scoped>
  .iconfont { cursor: pointer; background: #f00; }
</style>
