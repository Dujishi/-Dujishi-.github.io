<template src="./index.html"></template>

<script>
  import { guideList, guideInfo, guideUpdate, guideThemesList, guideAdd, guideDelete } from '../../service/index'
  import confirmModal from '../components/confirm.vue'

  export default {
    components: {
      confirmModal
    },
    data () {
      return {
        loading: true,
        ui: {
          total: 0,
          pageSize: 15,
          isAjax: false,
          showEditModal: false,
          infoTitle: ''
        },
        listForm: {
          pageIndex: 1
        },
        theadData: [
          {
            name: '会话主题',
            width: '300',
            class: 'ta-c'
          },
          {
            name: '话术',
            class: 'ta-c'
          },
          {
            name: '操作',
            width: '340',
            class: 'ta-c'
          }
        ],
        tbodyData: [],
        editData: {},
        wordsThemes: [],
        confirmData: {
          showConfirm: false,
          title: '',
          id: ''
        }
      }
    },
    mounted () {
      this.$Spin.show()
      this.getList()
    },
    methods: {
      getList () {
        guideList(this.listForm).then((res) => {
          this.$Spin.hide()
          if (res.code !== 1) {
            return false
          }
          this.tbodyData = res.data.list
          this.ui.total = res.data.rows
        })
      },
      changePage (index) {
        this.$Spin.show()
        this.listForm.pageIndex = index
        this.getList()
      },
      editGuide (id, title) {
        this.$Spin.show()
        this.ui.infoTitle = title
        let infoApi = null
        if (id === '') {
          infoApi = guideThemesList()
        } else {
          infoApi = guideInfo({guidedWordsId: id})
        }
        infoApi.then((res) => {
          this.$Spin.hide()
          if (res.code !== 1) {
            this.$Message.error({
              content: res.msg,
              duration: 4,
              closable: true
            })
            return false
          }
          if (id === '') {
            this.editData = {
              wordsContent: '',
              wordsTheme: ''
            }
            this.wordsThemes = res.data.list || []
            delete this.editData.guidedWordsId
          } else {
            this.editData = {
              guidedWordsId: res.data.guidedWordsId || '',
              wordsContent: res.data.wordsContent || '',
              wordsTheme: res.data.wordsTheme || ''
            }
            this.wordsThemes = res.data.wordsThemes || []
          }
          this.ui.showEditModal = true
        })
      },
      saveEdit () {
        this.ui.isAjax = true
        this.$Spin.show()
        let editApi = null
        if (this.editData.guidedWordsId) {
          editApi = guideUpdate(this.editData)
        } else {
          editApi = guideAdd(this.editData)
        }
        editApi.then((res) => {
          this.ui.isAjax = false
          this.$Spin.hide()
          if (res.code !== 1) {
            this.$Message.error({
              content: res.msg,
              duration: 4,
              closable: true
            })
            return false
          }
          this.ui.showEditModal = false
          this.$Message.success({
            content: res.msg,
            duration: 4,
            closable: true
          })
          this.$Spin.show()
          this.getList()
        })
      },
      showConfirm (id, title) {
        this.confirmData.showConfirm = true
        this.confirmData.id = id
        this.confirmData.title = title
      },
      confirmCB () {
        this.$Spin.show()
        guideDelete({guidedWordsId: this.confirmData.id}).then((res) => {
          this.$Spin.hide()
          this.confirmData.showConfirm = false
          this.$Message.success(res.msg)
          this.$Spin.show()
          this.getList()
        })
      }
    }
  }
</script>
<style scoped></style>
