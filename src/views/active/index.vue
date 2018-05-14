<template src="./index.html"></template>
<script>
  import { activeList, activeInfo, activeSave, activeDel, relatedProductList } from '../../service/index'
  import confirmModal from '../components/confirm.vue'

  export default {
    components: {
      confirmModal
    },
    data () {
      return {
        modalHeight: document.documentElement.clientHeight * 0.6,
        loading: true,
        ui: {
          total: 0,
          pageSize: 15,
          isAjax: false,
          showEditModal: false,
          infoTitle: '',
          proTotal: 0,
          proPageSize: 15
        },
        listForm: {
          name: '',
          pageIndex: 1
        },
        theadData: [
          {
            name: '活动名称'
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
        editModal: {
          id: '',
          title: ''
        },
        products: [],
        productsdata: [],
        productForm: {
          subjectId: '',
          type: 2,
          name: '',
          pageIndex: 1
        },
        ruleValidate: {
          // type: [
          //   {required: true, message: '请输入活动类型', trigger: 'blur'}
          // ],
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'}
          ],
          keyword: [
            {required: true, message: '请输入活动关键词', trigger: 'blur'}
          ],
          activeDate: [],
          // intro: [
          //   {required: true, message: '请输入活动简介', trigger: 'blur'}
          // ],
          details: [
            {required: true, message: '请输入活动详情', trigger: 'blur'}
          ]
        },
        editForm: {
          actId: '',
          customSpeechList: [],
          preheatStartTime: '',
          name: '',
          keyword: '',
          // type: '',
          startTime: '',
          endTime: '',
          relatedPro: 0,
          isPreheat: 0,
          productList: [],
          // intro: '',
          details: '',
          actUrl: '',
          defaultPreheating: '',
          defaultActivitySpeech: '',
          couponLinks: ''
        },
        activeDate: [],
        customList: []
      }
    },
    mounted () {
      this.$Spin.show()
      this.getData()
    },
    methods: {
      searchData () {
        this.listForm.pageIndex = 1
        this.$Spin.show()
        this.getData()
      },
      getData () {
        activeList(this.listForm).then((res) => {
          this.$Spin.hide()
          if (res.code === 1) {
            this.tbodyData = res.data.list
            this.ui.total = res.data.rows
          } else {
            this.$Message.info(res.msg)
          }
        })
      },
      showEditModal (id, title) {
        this.editModal.id = id
        this.editModal.title = title
        if (id !== '') {
          this.$Spin.show()
          this.getInfo()
        } else {
          this.editForm = {
            actId: '',
            customSpeechList: [],
            preheatStartTime: '',
            name: '',
            keyword: '',
            // type: '',
            startTime: '',
            endTime: '',
            relatedPro: 0,
            isPreheat: 0,
            productList: [],
            intro: '',
            details: '',
            actUrl: '',
            defaultPreheating: '',
            defaultActivitySpeech: '',
            couponLinks: ''
          }
          this.activeDate = []
          this.customList = []
          this.ui.showEditModal = true
        }
      },
      getInfo () {
        activeInfo({gid: this.editModal.id}).then((res) => {
          this.$Spin.hide()
          if (res.code === 1) {
            this.editForm = res.data
            if (this.editForm.relatedPro === 1) {
              this.getProductData()
            }
            this.editForm.productList = res.data.productList
            this.activeDate = [this.formatTime(parseInt(res.data.startTime)), this.formatTime(parseInt(res.data.endTime))]
            this.editForm.customSpeechList = res.data.customSpeechList || []
            // this.editForm.isPreheat = res.data.isPreheat || 0
            this.customList = []
            this.editForm.customSpeechList.forEach((item) => {
              this.customList.push({
                speech: item.speech,
                times: [this.formatTime(parseInt(item.startDate)), this.formatTime(parseInt(item.endDate))]
              })
            })
            this.ui.showEditModal = true
          }
        })
      },
      changeRelatedPro (value) {
        if (value === 1) {
          this.loading = true
          this.getProductData()
        }
      },
      getProductData (search) {
        if (search === '1') {
          this.productForm.pageIndex = 1
        }
        this.productForm.subjectId = this.editModal.id
        relatedProductList(this.productForm).then((res) => {
          this.loading = false
          if (res.code === 1 && res.data) {
            let productData = [
              {
                type: 'selection',
                width: 60,
                fixed: 'left'
              },
              {
                title: '商品ID',
                width: 100,
                key: 'extId'
              },
              {
                title: '商品名',
                width: 150,
                key: 'name'
              }
            ]
            const productHeader = res.data.cols
            let proHeader = []
            productHeader.forEach((item) => {
              proHeader.push({
                title: item.clmName,
                width: 120,
                key: item.clmValue
              })
            })
            this.products = this.unique(productData.concat(proHeader))
            // 表格数据内容拼装
            this.productsdata = res.data.data
            res.data.data.forEach((item, index) => {
              this.editForm.productList.forEach((x) => {
                if (x === item.id) {
                  this.productsdata[index]._checked = true
                }
              })
            })
            const otherProData = res.data.data
            for (let x in otherProData) {
              otherProData[x].attrs.forEach((item) => {
                this.productsdata[x][item.attrKey] = item.attrValue
                delete this.productsdata[x].attrs
              })
            }
            // console.log(this.editForm.productList)
            // if (this.editForm.productList.length > 0) {
            //   this.selectProducts(this.editForm.productList)
            // } else {
            //   this.selectProducts('')
            // }
            this.ui.proTotal = res.data.rows
          }
        })
      },
      selectProducts (value) {
        console.log(value)
        let productList = []
        value.forEach(item => {
          productList.push(item.id)
        })
        console.log(productList)
        productList.length > 0 ? this.editForm.productList = productList : this.editForm.productList = value
        console.log(this.editForm.productList)
      },
      plusList () {
        this.customList.push({
          speech: '',
          times: []
        })
      },
      minusList (index) {
        this.customList.splice(index, 1)
      },
      formatTime (value) {
        return this.$moment(value).format('YYYY-MM-DD HH:mm:ss')
      },
      editSave (name) {
        this.$Spin.show()
        delete this.editForm.editFormpreheatEndTime
        this.editForm.startTime = this.formatTime(this.activeDate[0])
        this.editForm.endTime = this.formatTime(this.activeDate[1])
        if (this.editForm.isPreheat === 1 && this.editForm.preheatStartTime !== '') {
          this.editForm.preheatStartTime = this.formatTime(this.editForm.preheatStartTime)
        } else {
          this.editForm.preheatStartTime = ''
        }
        let newArr = []
        this.customList.forEach((item) => {
          newArr.push({
            speech: item.speech,
            startDate: this.formatTime(item.times[0]),
            endDate: this.formatTime(item.times[1])
          })
        })
        this.editForm.customSpeechList = newArr
        if (this.editForm.relatedPro === 0) {
          this.editForm.productList = []
        }
        activeSave(this.editForm).then((res) => {
          this.$Spin.hide()
          this.$Message.info(res.msg)
          if (res.code === 1) {
            this.ui.showEditModal = false
            this.getData()
          }
        })
        // this.$refs[name].validate((valid) => {
        //   if (valid) {
        //
        //   }
        // })
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
      showConfirm (id, title) {
        this.confirmData.showConfirm = true
        this.confirmData.id = id
        this.confirmData.title = title
      },
      confirmCB () {
        this.$Spin.show()
        this.ui.isAjax = true
        activeDel({gid: this.confirmData.id}).then((res) => {
          this.ui.isAjax = false
          this.confirmData.showConfirm = false
          this.$Message.success(res.msg)
          this.$Spin.hide()
          this.getData()
        })
      },
      // 改变页码
      changePage (index) {
        this.listForm.pageIndex = index
        this.getData()
      },
      changeProPage (index) {
        this.loading = true
        this.productForm.pageIndex = index
        this.getProductData()
      }
    }
  }
</script>
<style scoped>
  .customModal .modalMain .ivu-form-item { margin-bottom: 24px;}
</style>
