<template src="./template/improve.html"></template>
<script>
  import { uploadPrimitiveData, officialImproveList, officialImproveInfo, operateOfficialImprove, unkonwledgeList, unkonwledgeInfo, unkonwledgeEdit } from '../../service/index'
  import Cookies from 'js-cookie'

  export default {
    data () {
      return {
        modalHeight: document.documentElement.clientHeight * 0.7,
        inproveMenu: 'official',
        ui: {
          showInfoAnswer: false,
          showUpload: false,
          pageIndex: 1,
          pageSize: 15,
          isAjax: false,
          total: 0
        },
        theadBody: [
          {
            title: '官方问题描述',
            key: 'desc',
            width: 200
          },
          {
            title: '现有问法',
            width: 200,
            render: (h, params) => {
              let items = params.row.questionList
              return h('ul', {
                class: 'customList'
              }, items.map(function (item) {
                return h('li', {
                  class: ['customOne', 'clearfix']
                }, [
                  h('span', {}, item)
                ])
              }))
            }
          },
          {
            title: '现有回答',
            width: 280,
            render: (h, params) => {
              let items = params.row.answerList
              return h('ul', {
                class: 'customList'
              }, items.map(function (item) {
                return h('li', {
                  class: ['customOne', 'clearfix']
                }, item)
              }))
            }
          },
          {
            title: '建议新增问法',
            width: 200,
            render: (h, params) => {
              let items = params.row.addQuestionList
              return h('ul', {
                class: 'customList'
              }, items.map(function (item) {
                return h('li', {
                  class: ['customOne', 'clearfix']
                }, item)
              }))
            }
          },
          {
            title: '建议新增回答',
            width: 280,
            render: (h, params) => {
              let items = params.row.addAnswerList
              return h('ul', {
                class: 'customList'
              }, items.map(function (item) {
                return h('li', {
                  class: ['customOne', 'clearfix']
                }, item)
              }))
            }
          },
          {
            title: '建议删除问法',
            width: 280,
            render: (h, params) => {
              let items = params.row.delQuestionList
              return h('ul', {
                class: 'customList'
              }, items.map(function (item) {
                return h('li', {
                  class: ['customOne', 'clearfix']
                }, item)
              }))
            }
          },
          {
            title: '操作',
            width: 160,
            align: 'center',
            fixed: 'right',
            render: (h, params) => {
              let operaArry = [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.getInfo(params.row.kdgBaseId)
                    }
                  }
                }, '编辑')
              ]
              return h('div', {
                class: 'customBtns'
              }, operaArry)
            }
          }
        ],
        tbodyData: [],
        infoData: {
          addAnswerList: [],
          addQuestionList: [],
          delQuestionList: [],
          modAnswerList: []
        },
        optData: {
          kdgBaseId: '',
          optId: '',
          optType: ''
        },
        cui: {
          showInfo: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          title: ''
        },
        otherTheadBody: [
          {
            name: '频次',
            width: '68'
          },
          {
            name: '问法',
            width: '200'
          },
          {
            name: '答法',
            width: '280'
          },
          {
            name: '典型问答语科',
            width: ''
          },
          {
            name: '操作',
            width: '200'
          }
        ],
        otherTbodyData: [],
        unknowledgeInfoData: {},
        unOptData: {
          unfKngId: '',
          type: ''
        },
        unknowledgeForm: {
          kbaseDesc: '',
          kdgBaseId: '',
          question: '',
          type: '',
          answerList: []
        },
        uploadData: {
          shopId: Cookies.get('shopId'),
          file: null
        },
        sizeLimit: 10240000,
        typeLimit: 'text/plain'
      }
    },
    mounted () {
      this.getData()
    },
    methods: {
      getData () {
        officialImproveList().then((res) => {
          this.tbodyData = res.data.list
          this.ui.total = res.data.rows
        })
      },
      handleFormatError (file) {
        this.uploadCancel()
        this.$Notice.warning({
          title: '文件格式错误',
          desc: `文件 ${file.name} 格式不匹配, 仅支持.txt后缀文件.`,
          duration: 3
        })
      },
      handleMaxSize (file) {
        this.uploadCancel()
        this.$Notice.warning({
          title: '文件尺寸过大',
          desc: `文件 ${file.name} 尺寸过大, 请不要超过${this.sizeLimit / 1024000}M.`,
          duration: 3
        })
      },
      uploadCancel () {
        this.uploadData.file = null
      },
      getUploadFile (file) {
        this.uploadData.file = file
        return false
      },
      checkUploadFile () {
        if (this.uploadData.file !== null) {
          if (this.typeLimit === this.uploadData.file.type && this.uploadData.file.size <= this.sizeLimit) {
            this.uploadFile()
          } else if (this.uploadData.file.size >= this.sizeLimit) {
            this.handleMaxSize(this.uploadData.file)
          } else {
            this.handleFormatError(this.uploadData.file)
          }
        } else {
          this.uploadCancel()
        }
      },
      uploadFile () {
        var data = new FormData()
        data.append('file', this.uploadData.file)
        data.append('shopId', Cookies.get('shopId'))
        this.$Spin.show()
        this.ui.isAjax = true
        uploadPrimitiveData({upLoad: true, updata: data}).then((res) => {
          this.$Spin.hide()
          this.ui.isAjax = false
          if (res.code === 1) {
            this.$Message.success(res.msg)
            this.ui.showUpload = false
            this.uploadData.file = null
            this.getData()
          }
        })
      },
      getInfo (value) {
        this.optData.kdgBaseId = value
        this.ui.showInfoAnswer = true
        officialImproveInfo({gid: this.optData.kdgBaseId}).then((res) => {
          this.infoData = {
            addAnswerList: res.data.addAnswerList || [],
            addQuestionList: res.data.addQuestionList || [],
            delQuestionList: res.data.delQuestionList || [],
            modAnswerList: res.data.modAnswerList || []
          }
        })
      },
      operate (id, type) {
        this.optData.optId = id
        this.optData.optType = type
        operateOfficialImprove(this.optData).then((res) => {
          this.$Message.success(res.msg)
          this.getInfo(this.optData.kdgBaseId)
        })
      },
      // 改变页码
      changePage (index) {
        this.ui.pageIndex = index
        this.getData()
      },
      getOtherData () {
        unkonwledgeList().then((res) => {
          this.otherTbodyData = res.data.list
          this.unknowledgeForm.answerList = []
          this.cui.total = res.data.rows
        })
      },
      fnUnknowledgeInfo (value, type, title) {
        this.cui.title = title
        this.unknowledgeForm.type = type
        this.unOptData = {
          unfKngId: value,
          type: type
        }
        unkonwledgeInfo(this.unOptData).then((res) => {
          this.cui.showInfo = true
          this.unknowledgeInfoData = res.data
        })
      },
      fnChangeSelect (value) {
        //        this.cui.content = value
        this.unknowledgeForm.kbaseDesc = value
      },
      fnSaveUnkonwledge () {
        this.ui.isAjax = true
        this.$Spin.show()
        unkonwledgeEdit(this.unknowledgeForm).then((res) => {
          this.ui.isAjax = false
          this.$Spin.hide()
          this.$Message.success(res.msg)
          this.cui.showInfo = false
          this.getOtherData()
        })
      },
      // 改变页码
      changeOtherPage (index) {
        this.cui.pageIndex = index
        this.getOtherData()
      }
    },
    watch: {
      inproveMenu () {
        this.getOtherData()
      }
    }
  }
</script>
<style lang="less">
  .officialMain td:nth-child(2) .ivu-table-cell,
  .officialMain td:nth-child(3) .ivu-table-cell,
  .officialMain td:nth-child(4) .ivu-table-cell,
  .officialMain td:nth-child(5) .ivu-table-cell,
  .officialMain td:nth-child(6) .ivu-table-cell { padding: 0; }
</style>
