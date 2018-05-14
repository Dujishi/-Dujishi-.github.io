<template src="./template/keywords.html"></template>

<script>
  import { knowledgeList, keywordsInfo, addKnowledge, deleteQuestion, initEditAnswer, editAnswer, saveEditAnswer, delAnswer, officalEnable, deleteKnowledge, relatedProductList, getErrorCode, getRegular, labelList } from '../../service/index'
  import confirmModal from '../components/confirm.vue'
  import UMeditor from '../components/um.vue'
  import Cookies from 'js-cookie'

  export default {
    components: {
      confirmModal,
      UMeditor
    },
    data () {
      return {
        modalHeight: document.documentElement.clientHeight * 0.7,
        developing: true, // 开发中模块
        ui: {
          total: 0,
          pageSize: 15,
          isAjax: false,
          keywordsTitle: '',
          showEditKeywords: false,
          showEditAnswer: false,
          showEditQuestion: false,
          proPageSize: 15,
          proTotal: 0
        },
        um: {
          content: '请输入答案内容',
          source: '',
          config: { // 配置项，详见umeditor.config.js
            imageUrl: '/api/uploadImg',
            imagePath: '',
            imageFieldName: '',
            zIndex: 900, // 非模态框，默认值
            maximumWords: 200,
            initialFrameHeight: 150
          },
          toolbar: [] // 工具栏设置，非空则完全覆盖默认工具栏，详见umeditor.config.js
        },
        theadData: [
          {
            name: '序号',
            width: '70'
          },
          {
            name: '关键词组合',
            width: '35%'
          },
          {
            name: '客服答案'
          },
          {
            name: '状态',
            width: '100'
          },
          {
            name: '操作',
            width: '260'
          }
        ],
        tbodyData: [],
        listForm: {
          description: '',
          pageIndex: 1,
          type: 2 // 0.官方 1.自定义 2.关键词
        },
        keywordsForm: {},
        keywordsData: {},
        answerForm: {
          ansId: '',
          buyerIdentity: '',
          content: '',
          paramExtract: '',
          kdgBaseId: '',
          variables: [],
          needHuman: 0,
          orderStatus: '',
          periodTimeId: '',
          productList: '',
          productStocks: '',
          // questionList: [],
          relatedPro: 0,
          relatedTimes: [],
          relatedTimesChecked: [],
          otherCondition: false,
          aiLabelId: '',
          orderGuide: '',
          productRec: '',
          persona: [],
          productAttr: [],
          redirectLabelId: '',
          keyword: '',
          missParam: '',
          errorCodes: ''
        },
        answerNewData: {
          orderGuide: {
            checked: false,
            value: ''
          },
          productRec: {
            checked: false,
            value: ''
          },
          paramExtract: {
            checked: false
          },
          redirectLabelId: {
            checked: false
          }
        },
        errorCode: {},
        errorCodes: [],
        products: [],
        productsdata: [],
        productForm: {
          subjectId: '',
          type: 1,
          name: '',
          pageIndex: 1
        },
        form: {
          periodTimeId: '',
          name: '',
          type: '0',
          startTime: '',
          endTime: ''
        },
        otherConditionData: [],
        relatedTimes: [],
        confirmData: {
          showConfirm: false,
          title: '',
          id: '',
          type: null,
          tagType: null
        },
        delForm: {
          periodTimeId: '',
          name: ''
        },
        isDefault: false,
        editData: {}
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
        knowledgeList(this.listForm).then((res) => {
          this.$Spin.hide()
          this.ui.loading = false
          if (res.code === 1) {
            this.tbodyData = res.data.data
            this.ui.total = res.data.rows
          }
        })
      },
      showKeywordsModal (id, title) {
        this.keywordsForm.id = id
        this.ui.keywordsTitle = title
        this.ui.showEditKeywords = true
        this.editKeywords()
        //  1
      },
      editKeywords () {
        // keywordsData
        if (this.keywordsForm.id !== '') {
          this.$Spin.show()
          keywordsInfo({gid: this.keywordsForm.id}).then((res) => {
            this.$Spin.hide()
            if (res.code !== 1) {
              return false
            }
            this.keywordsData = this.newArry(res.data.questions)
          })
        } else {
          this.keywordsData = [{
            quesId: '',
            content: ['']
          }]
        }
      },
      newArry (oldArr) {
        let newArr = []
        oldArr.forEach((item) => {
          newArr.push({
            content: item.content.split(','),
            quesId: item.quesId
          })
        })
        return newArr
      },
      plusWordsGroup () {
        this.keywordsData.push({
          id: '',
          content: ['']
        })
      },
      minusWordsGroup () {
        this.keywordsData.pop()
        console.log(this.keywordsData.length)
      },
      plusWords (index) {
        this.keywordsData[index].content.push('')
      },
      minusWords (index) {
        this.keywordsData[index].content.pop()
      },
      saveKeywords () {
        let saveForm = {
          type: 2,
          kdgBaseId: this.keywordsForm.id,
          questions: []
        }
        this.keywordsData.forEach(item => {
          saveForm.questions.push({
            content: item.content.join(','),
            quesId: item.quesId
          })
        })
        this.$Spin.show()
        this.ui.isAjax = true
        addKnowledge(saveForm).then((res) => {
          this.ui.isAjax = false
          this.ui.showEditKeywords = false
          this.$Spin.hide()
          if (res.code !== 1) {
            return false
          }
          this.$Message.success(res.msg)
          setTimeout(() => this.getData(), 300)
        })
      },
      // 新建/编辑/删除答案
      showEditAnswerModal (ansId, kdgBaseId, isDefault) {
        this.$Spin.show()
        this.isDefault = isDefault
        this.ui.isAjax = false
        let getAnswerApi
        if (ansId !== '') {
          getAnswerApi = editAnswer({gid: ansId})
        } else {
          getAnswerApi = initEditAnswer({gid: kdgBaseId})
        }
        getAnswerApi.then((res) => {
          this.$Spin.hide()
          if (res.code !== 1) {
            return false
          }
          this.ui.showEditAnswer = true
          this.editData = res.data
          let arr = []
          let cName = {}
          this.editData.otherConditions.forEach(item => {
            if (ansId !== '') {
              cName[item.name] = {
                checked: item.checked,
                checkedItem: item.checkedItem,
                items: item.items,
                multiSelect: item.multiSelect,
                title: item.title
              }
            } else {
              cName[item.name] = {
                checked: false,
                checkedItem: [],
                items: item.items,
                multiSelect: item.multiSelect,
                title: item.title
              }
            }
            arr.push(cName)
          })
          this.otherConditionData = arr[0]
          this.answerForm.ansId = this.editData.ansId
          this.answerForm.description = this.editData.description
          if (this.otherConditionData.buyerIdentity && this.otherConditionData.buyerIdentity.checkedItem) {
            this.answerForm.buyerIdentity = this.otherConditionData.buyerIdentity.checkedItem
          }
          this.answerForm.kdgBaseId = kdgBaseId
          this.answerForm.needHuman = this.editData.needHuman
          if (this.otherConditionData.orderStatus && this.otherConditionData.orderStatus.checkedItem) {
            this.answerForm.orderStatus = this.otherConditionData.orderStatus.checkedItem
          }
          this.answerForm.productList = this.editData.productsChecked
          if (this.otherConditionData.productStocks && this.otherConditionData.productStocks.checkedItem) {
            this.answerForm.productStocks = this.otherConditionData.productStocks.checkedItem
          }
          this.answerForm.relatedPro = this.editData.relatedPro
          this.answerForm.otherCondition = false
          this.answerForm.variables = this.editData.variables
          if (ansId !== '') {
            this.answerForm.periodTimeId = this.editData.periodTimeId
            // this.answerForm.questionList = this.editData.questionsChecked
            this.answerNewData.redirectLabelId.checked = this.editData.redirectLabelId.checked
            this.answerForm.redirectLabelId = this.editData.redirectLabelId.value
            this.answerForm.relatedTimes = this.editData.relatedTimesChecked
            this.relatedTimes = this.editData.timesRel.relatedTimes
            // this.answerCheckedData.questionPre = this.editData.questionPre.checked
            // this.answerCheckedData.timesRel = this.editData.timesRel.checked
            this.$refs.umeditor.setContent(this.editData.content.replace(/\n/g, '<br />'))
            this.answerNewData.paramExtract.checked = this.editData.paramExtract.checked
            this.answerForm.paramExtract = this.editData.paramExtract.value
            this.answerNewData.orderGuide = res.data.orderGuide
            this.answerNewData.productRec = res.data.productRec
            this.answerNewData.paramExtract = res.data.paramExtract
            this.answerForm.aiLabelId = this.editData.questionPre.value
            this.answerForm.orderGuide = this.answerNewData.orderGuide.value
            this.answerForm.productRec = this.answerNewData.productRec.value
            this.answerForm.persona = this.editData.persona.attrConditions
            this.answerForm.productAttr = this.editData.productAttr.attrConditions
            this.answerForm.keyword = this.editData.keyword.value
            this.answerForm.missParam = this.editData.missParam
          } else {
            this.answerForm.redirectLabelId = ''
            this.relatedTimes = []
            // this.answerForm.questionList = []
            this.$refs.umeditor.setContent('')
            this.answerForm.paramExtract = ''
            this.answerForm.aiLabelId = ''
            this.answerForm.persona = []
            this.answerForm.productAttr = []
            this.answerForm.keyword = ''
            this.answerForm.missParam = ''
          }
          this.umStatus()
          if (this.answerNewData.redirectLabelId.checked || this.editData.questionPre.checked) {
            this.getAiLablel()
          }
          if (this.answerNewData.paramExtract.checked && this.answerForm.paramExtract !== '') {
            this.getErrorCode()
          }
        })
      },
      searchLabel (content) {
        this.listForm.description = content
        this.searchData()
      },
      umStatus () {
        if (this.answerNewData.redirectLabelId.checked) {
          this.$refs.umeditor.setDisabled()
          if (!this.ailabelList.length) {
            this.getAiLablel()
          }
        } else {
          this.$refs.umeditor.setEnabled()
        }
      },
      chooseQuestionPre (value) {
        if (value && !this.ailabelList.length) {
          this.getAiLablel()
        }
      },
      getAiLablel () {
        labelList({gid: Cookies.get('shopId')}).then((res) => {
          if (res.code !== 1) {
            return false
          }
          this.ailabelList = res.data.aiLabels
        })
      },
      selectParamExtract (value) {
        if (value && this.answerForm.paramExtract !== '') {
          this.getErrorCode()
        }
      },
      changeParamExtract () {
        if (this.answerNewData.paramExtract.checked && this.answerForm.paramExtract !== '') {
          this.getErrorCode()
        }
      },
      fnShowRegular (id) {
        getRegular({gid: id}).then((res) => {
          if (res.code === 1) {
            this.regularList = res.data.list
          }
        })
      },
      otherConditions () {
        this.answerForm.otherCondition = !this.answerForm.otherCondition
      },
      selectedVariables (value) {
        this.$refs.umeditor.insertHtml('${' + value + '}</span>')
        // this.$refs.umeditor.insertHtml('<span>${' + value + '}</span>')
      },
      plusRelateTimes () {
        if (this.relatedTimes.length < 1) {
          this.relatedTimes.push({
            content: '第' + (this.relatedTimes.length + 1) + '次及更多',
            value: (this.relatedTimes.length + 1) + '+'
          })
        } else {
          if (this.answerForm.relatedTimes.length > 0) {
            this.answerForm.relatedTimes.splice(this.answerForm.relatedTimes.findIndex((item) => item.id === this.relatedTimes[this.relatedTimes.length - 1].value), 1)
          }
          this.relatedTimes.splice(this.relatedTimes.length - 1, 1)
          this.relatedTimes.push({
            content: '第' + (this.relatedTimes.length + 1) + '次',
            value: this.relatedTimes.length + 1
          }, {
            content: '第' + (this.relatedTimes.length + 2) + '次及更多',
            value: (this.relatedTimes.length + 2) + '+'
          })
        }
        console.log(JSON.stringify(this.relatedTimes))
      },
      minusRelateTimes () {
        if (this.answerForm.relatedTimes.length > 0) {
          this.answerForm.relatedTimes.splice(this.answerForm.relatedTimes.findIndex((item) => item.id === this.relatedTimes[this.relatedTimes.length - 1].value), 1)
        }
        this.relatedTimes.splice(this.relatedTimes.length - 1, 1)
      },
      changeRelatedTimes (value) {
        console.log(value)
      },
      changeRelatedPro (value) {
        if (value === 1) {
          this.getProductData()
        }
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
      getProductData (search) {
        this.$Spin.show()
        if (search === 1) {
          this.productForm.pageIndex = 1
        }
        this.productForm.subjectId = this.answerForm.ansId
        relatedProductList(this.productForm).then((res) => {
          this.$Spin.hide()
          if (res.code !== 1) {
            return false
          }
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
          console.log('header:' + JSON.stringify(productHeader))
          // 表格数据内容拼装
          this.productsdata = res.data.data
          console.log('before:' + JSON.stringify(this.productsdata))
          const otherProData = res.data.data
          for (let x in otherProData) {
            otherProData[x].attrs.forEach((item) => {
              this.productsdata[x][item.attrKey] = item.attrValue
              delete this.productsdata[x].attrs
            })
          }
          console.log('end:' + JSON.stringify(this.productsdata))
          this.ui.proTotal = res.data.rows
        })
      },
      selectProducts (value) {
        let productList = []
        value.forEach(item => {
          productList.push(item.id)
        })
        this.answerForm.productList = productList
      },
      plusOtherAttribute (arry, defaultName, defaultValue) {
        arry.push({
          conditionName: defaultName,
          relationValue: defaultValue,
          conditionValue: ''
        })
      },
      minusOtherAttribute (arry, index) {
        arry.splice(index, 1)
      },
      checkEdit () {
        if (this.answerForm.description === '') {
          this.$Message.info('问题描述不能为空')
          return false
        } else if (this.answerForm.content === '') {
          this.$Message.info('答案内容不能为空')
          return false
        } else {
          return true
        }
      },
      saveEditAnswer () {
        if (this.otherConditionData.buyerIdentity) {
          if (!this.otherConditionData.buyerIdentity.checked) {
            this.answerForm.buyerIdentity = ''
          } else {
            this.answerForm.buyerIdentity = this.otherConditionData.buyerIdentity.checkedItem.toString()
          }
        }
        if (this.otherConditionData.orderStatus) {
          if (!this.otherConditionData.orderStatus.checked) {
            this.answerForm.orderStatus = ''
          } else {
            this.answerForm.orderStatus = this.otherConditionData.orderStatus.checkedItem.toString()
          }
        }
        if (this.otherConditionData.productStocks) {
          if (!this.otherConditionData.productStocks.checked) {
            this.answerForm.productStocks = ''
          } else {
            this.answerForm.productStocks = this.otherConditionData.productStocks.checkedItem.toString()
          }
        }
        if (this.answerForm.relatedTimes.length > 0) {
          this.answerForm.relatedTimes = this.answerForm.relatedTimes.toString()
        } else if (this.answerForm.relatedTimes.length === 0 || this.answerForm.relatedTimes.length === undefined) {
          this.answerForm.relatedTimes = ''
        }
        delete this.answerForm.relatedTimesChecked
        delete this.answerForm.variables
        // 编辑器内容变量替换
        let contentShow = this.$refs.umeditor.getPlainTxt().split(/\$\{([^}]+)\}/)
        console.log(contentShow)
        contentShow.forEach((item, index) => {
          this.editData.variables.forEach((x) => {
            if (item === x.paramValue) {
              contentShow.splice(index, 1, '${' + x.paramId + '}')
            }
          })
        })
        this.answerForm.content = contentShow.join('')
        // // 编辑器2.1
        this.editData.orderGuide && this.editData.orderGuide.checked ? this.answerForm.orderGuide = this.editData.orderGuide.value : this.answerForm.orderGuide = ''
        this.editData.productRec && this.editData.productRec.checked ? this.answerForm.productRec = this.editData.productRec.value : this.answerForm.productRec = ''
        if (!this.editData.paramExtract.checked) {
          this.answerForm.paramExtract = ''
          this.answerForm.errorCodes = ''
        } else {
          if (this.answerForm.paramExtract === '') {
            this.answerForm.errorCodes = ''
          } else {
            this.answerForm.errorCodes = this.errorCodes.toString()
          }
        }
        if (!this.editData.questionPre.checked) {
          this.answerForm.aiLabelId = ''
        }
        if (!this.editData.timesRel.checked) {
          this.answerForm.relatedTimes = ''
        }
        if (!this.editData.persona.checked) {
          this.answerForm.persona = []
        }
        if (!this.editData.productAttr.checked) {
          this.answerForm.productAttr = []
        }
        if (!this.editData.keyword.checked) {
          this.answerForm.keyword = ''
        }
        if (!this.checkEdit()) {
          return false
        }
        this.ui.isAjax = true
        saveEditAnswer(this.answerForm).then((res) => {
          this.ui.isAjax = false
          if (res.code !== 1) {
            return false
          }
          this.ui.showEditAnswer = false
          this.$Message.success(res.msg)
          this.getData()
          this.answerForm.relatedTimes = []
        })
      },
      changeEnable (id, value) {
        this.$Spin.show()
        this.ui.isAjax = true
        officalEnable({
          kdgBaseId: [id],
          status: value
        }).then((res) => {
          this.ui.isAjax = false
          this.$Spin.hide()
          if (res.code !== 1) {
            return false
          }
          this.$Message.success(res.msg)
        })
      },
      showConfirm (id, title, type, tagType) {
        this.confirmData.showConfirm = true
        this.confirmData.id = id
        this.confirmData.title = title
        this.confirmData.type = type
        this.confirmData.tagType = tagType
      },
      confirmCB () {
        let confirmApi
        if (this.confirmData.type === 0) {
          confirmApi = deleteKnowledge({gid: this.confirmData.id})
        } else if (this.confirmData.type === 1) {
          confirmApi = officalEnable({
            kdgBaseId: [this.confirmData.id],
            status: this.confirmData.tagType
          })
        } else if (this.confirmData.type === 2) {
          confirmApi = deleteQuestion({gid: this.confirmData.id})
        } else if (this.confirmData.type === 3) {
          confirmApi = delAnswer({gid: this.confirmData.id})
        }
        this.$Spin.show()
        this.ui.isAjax = true
        confirmApi.then((res) => {
          this.ui.isAjax = false
          this.$Spin.hide()
          this.confirmData.showConfirm = false
          if (res.code !== 1) {
            return false
          }
          this.$Message.success(res.msg)
          this.getData()
        })
      },
      // 改变页码
      changePage (index) {
        this.$Spin.show()
        this.listForm.pageIndex = index
        this.getData()
      },
      changeProPage (index) {
        this.$Spin.show()
        this.productForm.pageIndex = index
        this.getProductData()
      }
    }
  }
</script>
<style lang="less">
</style>
