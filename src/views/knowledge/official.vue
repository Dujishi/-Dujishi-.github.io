<template src="./template/official.html"></template>

<script>
  import { questionSlideMenu, knowledgeList, initEditAnswer, editAnswer, saveEditAnswer, delAnswer, defaultAnswer, officalEnable, needhuman, relatedProductList, getRegular, getErrorCode, getCommConfValue, labelList, hiddenConfig } from '../../service/index'
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
        isAdmin: Cookies.get('isAdmin'),
        developing: true, // 开发中模块
        modalHeight: document.documentElement.clientHeight * 0.7,
        slideMenuList: {
          index: '',
          items: []
        },
        listForm: {
          answer: '',
          categoryId: '',
          description: '',
          industryId: '', // 行业ID
          pageIndex: 1,
          type: 0 // 0.官方 1.自定义 2.关键词
        },
        ui: {
          total: 0,
          pageSize: 15,
          isAjax: false,
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
          // {
          //   name: '',
          //   width: '50'
          // },
          {
            name: '问题描述',
            width: '200'
          },
          {
            name: '问法示例',
            width: '240'
          },
          {
            name: '客服答案',
            width: '',
            length: 2
          },
          {
            name: '状态',
            width: '80'
          },
          {
            name: '操作',
            width: '140'
          }
        ],
        tbodyData: [],
        answerForm: {
          ansId: '',
          buyerEmotion: '',
          buyerIdentity: '',
          content: '',
          endTurn: 0,
          paramExtract: '',
          kdgBaseId: '',
          variables: [],
          needHuman: 0,
          orderStatus: '',
          periodTimeId: '',
          productList: '',
          productStocks: '',
          questionList: [],
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
          errorCodes: '',
          commonConfigId: '',
          commonConfigValue: '',
          isRedirect: 0,
          redirectType: 1,
          redirectContextType: 0,
          portraitSceneList: []
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
          commonConfigId: {
            checked: false
          },
          portraitScene: {
            checked: false
          }
        },
        portraitSceneItems: [],
        ailabelList: [],
        errorCode: {},
        errorCodes: [],
        errorTitle: '',
        comConfSingleValue: {},
        commonConfigValue: [],
        regularList: [],
        products: [],
        productsdata: [],
        productForm: {
          subjectId: '',
          type: 1,
          name: '',
          pageIndex: 1
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
        form: {
          periodTimeId: '',
          name: '',
          type: '0',
          startTime: '',
          endTime: ''
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
      this.getSlideMenu()
    },
    methods: {
      getSlideMenu () {
        let reqData = {
          answer: this.listForm.answer,
          description: this.listForm.description,
          type: 0
        }
        questionSlideMenu(reqData).then((res) => {
          if (res.code === 1) {
            this.slideMenuList.items = res.data.data
            let items = this.slideMenuList.items
            for (var x in items) {
              if (items[x].total > 0) {
                this.slideMenuList.index = items[x].orderNo
                this.listForm.categoryId = this.slideMenuList.index
                this.$Spin.show()
                this.getData()
                return false
              } else {
                this.slideMenuList.index = items[0].orderNo
              }
            }
            // this.slideMenuList.index === '' ? this.slideMenuList.index = parseInt(res.data.data[0].paramId) : this.slideMenuList.index = this.slideMenuList.index
            this.listForm.categoryId = this.slideMenuList.index
            this.$Spin.show()
            this.getData()
          } else {
            this.$Message.error(res.msg)
          }
        })
      },
      changeMenu (index) {
        this.slideMenuList.index = index
        this.listForm.categoryId = index
        this.listForm.pageIndex = 1
        this.$Spin.show()
        this.getData()
      },
      searchData () {
        this.listForm.pageIndex = 1
        this.$Spin.show()
        this.getSlideMenu()
      },
      getData () {
        knowledgeList(this.listForm).then((res) => {
          this.ui.loading = false
          if (res.code === 1) {
            this.tbodyData = res.data.data
            this.ui.total = res.data.rows
          }
          this.$Spin.hide()
        })
      },
      checkboxChange (value) {
        console.log(value)
      },
      // 新建/编辑/删除答案
      showEditAnswerModal (ansId, kdgBaseId, isDefault) {
        // 权限
        hiddenConfig({gid: ''}).then((res) => {
          if (res.code === 1) {
            let permissions = {}
            this.$store.commit('updateParamList', res.data.list)
          } else {
            this.$store.commit('updateParamList', [])
          }
        })
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
          if (this.otherConditionData.buyerEmotion && this.otherConditionData.buyerEmotion.checkedItem) {
            this.answerForm.buyerEmotion = this.otherConditionData.buyerEmotion.checkedItem
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
            this.answerForm.questionList = this.editData.questionsChecked
            // this.answerNewData.redirectLabelId.checked = this.editData.redirectLabelId.checked
            this.answerForm.redirectLabelId = this.editData.redirectLabelId.value
            this.answerForm.relatedTimes = this.editData.relatedTimesChecked
            this.relatedTimes = this.editData.timesRel.relatedTimes
            // this.answerCheckedData.questionPre = this.editData.questionPre.checked
            // this.answerCheckedData.timesRel = this.editData.timesRel.checked
            this.$refs.umeditor.setContent(this.editData.content.replace(/\n/g, '<br />'))
            this.answerNewData.paramExtract.checked = this.editData.paramExtract.checked
            this.answerForm.paramExtract = this.editData.paramExtract.value
            this.answerNewData.commonConfigId.checked = this.editData.commonConfigId.checked
            this.answerForm.commonConfigId = this.editData.commonConfigId.value
            this.answerNewData.orderGuide = res.data.orderGuide
            this.answerNewData.productRec = res.data.productRec
            this.answerNewData.paramExtract = res.data.paramExtract
            this.answerNewData.commonConfigId = res.data.commonConfigId
            this.answerForm.aiLabelId = this.editData.questionPre.value
            this.answerForm.orderGuide = this.answerNewData.orderGuide.value
            this.answerForm.productRec = this.answerNewData.productRec.value
            this.answerForm.persona = this.editData.persona.attrConditions
            this.answerForm.productAttr = this.editData.productAttr.attrConditions
            this.answerForm.keyword = this.editData.keyword.value
            this.answerForm.missParam = this.editData.missParam
            this.answerForm.isRedirect = this.editData.isRedirect
            this.answerForm.redirectType = this.editData.redirectType
            this.answerForm.redirectContextType = this.editData.redirectContextType
            this.answerNewData.portraitScene.checked = this.editData.portraitScene.checked
            this.answerForm.endTurn = this.editData.endTurn || 0
            if (res.data.portraitScene.selectList && res.data.portraitScene.selectList.length > 0) {
              this.answerForm.portraitSceneList = res.data.portraitScene.selectList
            } else {
              this.answerForm.portraitSceneList = [{portraitScene: '', portraitSceneValue: ''}]
            }
            this.portraitSceneItems = res.data.portraitScene.items
          } else {
            this.answerForm.redirectLabelId = ''
            this.answerForm.questionList = []
            this.relatedTimes = []
            this.$refs.umeditor.setContent('')
            this.answerForm.paramExtract = ''
            // this.answerForm.isRedirect = 0
            this.answerForm.aiLabelId = ''
            this.answerForm.persona = []
            this.answerNewData.paramExtract.checked = false
            this.answerForm.productAttr = []
            this.answerForm.keyword = ''
            this.answerForm.missParam = ''
            this.answerNewData.commonConfigId.checked = false
            this.answerForm.commonConfigId = ''
            this.answerForm.isRedirect = 0
            this.answerForm.redirectType = 1
            this.answerForm.redirectContextType = 0
            this.answerForm.portraitSceneList = [{portraitScene: '', portraitSceneValue: ''}]
            this.answerForm.endTurn = this.editData.endTurn || 0
          }
          if (this.$store.state.admin.paramList.indexOf('跳转') === -1 && this.isAdmin === '1') {
            this.answerForm.isRedirect === 0
          }
          this.umStatus()
          if (this.answerForm.isRedirect === 1 && this.answerForm.redirectType === 1) {
            this.getAiLablel()
          }
          if (this.editData.questionPre.checked) {
            this.getAiLablel()
          }
          if (this.answerNewData.paramExtract.checked && this.answerForm.paramExtract !== '') {
            this.getErrorCode()
          }
          if (this.answerNewData.commonConfigId.checked && this.answerForm.commonConfigId !== '') {
            this.getCommConfValue()
          }
        })
      },
      searchLabel (content) {
        this.listForm.description = content
        this.searchData()
      },
      umStatus () {
        if (this.answerForm.isRedirect === 1) {
          console.log(this.answerForm.isRedirect)
          if (this.$store.state.admin.paramList.indexOf('跳转') === -1) {
            this.$refs.umeditor.setEnabled()
          } else {
            this.$refs.umeditor.setDisabled()
          }
          if (!this.ailabelList.length) {
            this.getAiLablel()
          }
        } else if (this.answerForm.isRedirect === 0) {
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
        if (this.answerNewData.paramExtract.checked) {
          this.getErrorCode()
        }
      },
      getErrorCode () {
        let errorCode = {
          ansId: this.answerForm.ansId,
          paramExtract: this.answerForm.paramExtract
        }
        getErrorCode(errorCode).then((res) => {
          if (res.code !== 1) {
            return false
          }
          this.errorCode = res.data
          this.errorCodes = this.errorCode.checkedItem
          this.errorTitle = res.data.title
        })
      },
      selectCommConf (value) {
        if (value && this.answerForm.commonConfigId !== '' && this.answerForm.sccId) {
          this.getCommConfValue()
        }
      },
      changeCommConf () {
        if (this.answerNewData.commonConfigId.checked && this.answerForm.commonConfigId !== '') {
          this.getCommConfValue()
        }
      },
      getCommConfValue () {
        let comConfSingleValue = {
          ansId: this.answerForm.ansId,
          commonConfigId: this.answerForm.commonConfigId
        }
        getCommConfValue(comConfSingleValue).then((res) => {
          if (res.code !== 1) {
            return false
          }
          this.comConfSingleValue = res.data
          this.commonConfigValue = this.comConfSingleValue.checkedItem
        })
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
        if (search === 1) {
          this.productForm.pageIndex = 1
        }
        this.productForm.subjectId = this.answerForm.ansId
        relatedProductList(this.productForm).then((res) => {
          this.$Spin.hide()
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
              this.answerForm.productList.forEach((x) => {
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
            this.ui.proTotal = res.data.rows
          }
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
        } else if (this.answerForm.content === '' && this.answerForm.isRedirect !== 1 && this.answerForm.redirectType !== 1) {
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
        if (this.otherConditionData.buyerEmotion) {
          if (!this.otherConditionData.buyerEmotion.checked) {
            this.answerForm.buyerEmotion = ''
          } else {
            this.answerForm.buyerEmotion = this.otherConditionData.buyerEmotion.checkedItem.toString()
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
        if (!this.answerNewData.portraitScene.checked) {
          this.answerForm.portraitSceneList = []
        }
        delete this.answerForm.relatedTimesChecked
        delete this.answerForm.variables
        // 编辑器内容变量替换
        if (this.answerForm.isRedirect === 1 && this.answerForm.redirectType === 1) {
          this.answerForm.content = ''
        } else {
          let contentShow = this.$refs.umeditor.getPlainTxt().split(/\$\{([^}]+)\}/)
          // let contentShow = this.$refs.umeditor.getContent().split(/<span>\${([^<]+)}<\/span>/)
          contentShow.forEach((item, index) => {
            this.editData.variables.forEach((x) => {
              if (item === x.paramValue) {
                contentShow.splice(index, 1, '${' + x.paramId + '}')
              }
            })
          })
          this.answerForm.content = contentShow.join('')
        }
        // 编辑器2.1
        this.editData.orderGuide && this.editData.orderGuide.checked ? this.answerForm.orderGuide = this.editData.orderGuide.value : this.answerForm.orderGuide = ''
        this.editData.productRec && this.editData.productRec.checked ? this.answerForm.productRec = this.editData.productRec.value : this.answerForm.productRec = ''
        if (!this.answerNewData.paramExtract.checked) {
          this.answerForm.paramExtract = ''
          this.answerForm.errorCodes = ''
        } else {
          if (this.answerForm.paramExtract === '') {
            this.answerForm.errorCodes = ''
          } else {
            this.answerForm.errorCodes = this.errorCodes.toString()
          }
        }
        if (!this.answerNewData.commonConfigId.checked) {
          this.answerForm.commonConfigId = ''
          this.answerForm.commonConfigValue = ''
        } else {
          if (this.answerForm.commonConfigId === '') {
            this.answerForm.commonConfigValue = ''
          } else {
            this.answerForm.commonConfigValue = this.commonConfigValue.toString()
          }
        }
        if (this.answerForm.isRedirect !== 1 || this.answerForm.redirectType !== 1) {
          this.answerForm.redirectLabelId = ''
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
        if (this.answerForm.needHuman === 1) {
          this.answerForm.endTurn = 0
        }
        this.ui.isAjax = true
        saveEditAnswer(this.answerForm).then((res) => {
          this.ui.isAjax = false
          if (res.code !== 1) {
            return false
          }
          this.ui.showEditAnswer = false
          this.$Message.success(res.msg)
          this.$Spin.show()
          this.getData()
          this.answerForm.relatedTimes = []
        })
      },
      changeStatus () {
        this.$Spin.show()
        this.ui.isAjax = true
        needhuman({
          kdgBaseId: [this.confirmData.id],
          needHuman: this.confirmData.tagType
        }).then((res) => {
          this.ui.isAjax = false
          this.$Spin.hide()
          this.confirmData.showConfirm = false
          if (res.code === 1) {
            this.$Message.success(res.msg)
          } else {
            return false
          }
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
        if (this.confirmData.type === 2) {
          confirmApi = delAnswer({gid: this.confirmData.id})
        } else if (this.confirmData.type === 0) {
          confirmApi = defaultAnswer({gid: this.confirmData.id})
        } else if (this.confirmData.type === 3) {
          confirmApi = officalEnable({
            kdgBaseId: [this.confirmData.id],
            status: this.confirmData.tagType
          })
        } else if (this.confirmData.type === 4) {
          confirmApi = needhuman({
            kdgBaseId: [this.confirmData.id],
            needHuman: this.confirmData.tagType
          })
        }
        this.$Spin.show()
        this.ui.isAjax = true
        confirmApi.then((res) => {
          this.$Spin.hide()
          this.ui.isAjax = false
          if (res.code !== 1) {
            return false
          }
          this.confirmData.showConfirm = false
          this.$Message.success(res.msg)
          this.getData()
        })
      },
      getStartTime (date) {
        this.form.startTime = date
      },
      getEndTime (time) {
        this.form.endTime = time
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
    },
    computed: {
      option: {
        get: function () {
          return this.portraitSceneItems.filter((item) => {
            return item.value === this.answerForm.portraitSceneList[0].portraitScene
          })[0].options
        }
      },
      type: {
        get: function () {
          if (this.answerForm.portraitSceneList[0].portraitScene !== '') {
            return this.portraitSceneItems.filter((item) => {
              return item.value === this.answerForm.portraitSceneList[0].portraitScene
            })[0].type
          } else {
            return 'text'
          }
        }
      }
    }
  }
</script>
<style lang="less">
  .officialMain td:nth-child(4) .ivu-table-cell { padding: 0; }
  .officialMain td:last-child .ivu-table-cell { padding: 0; }
</style>
