<template src="./index.html"></template>
<script>
  import { userPortraitList, userPortraitInfo } from '../../service/index'

  export default {
    data () {
      return {
        modalHeight: document.documentElement.clientHeight * 0.7,
        ui: {
          total: 0,
          pageSize: 15,
          isAjax: false,
          showEditModal: false,
          infoTitle: ''
        },
        listForm: {
          buyerId: '',
          pageIndex: 1
        },
        theadData: [
          {
            name: '买家昵称'
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
          id: '',
          title: ''
        },
        infoData: {
          portrait: [],
          goods: []
        },
        goodsHeader: [
          {
            title: '商品链接',
            width: '19%'
          },
          {
            title: '咨询时间',
            width: '18%',
            class: 'ta-c'
          },
          {
            title: '购买时间',
            width: '18%',
            class: 'ta-c'
          },
          {
            title: '是否购买',
            width: '15%',
            class: 'ta-c'
          },
          {
            title: '推荐尺码',
            // title: '关注咨询商品维度',
            width: '30%',
            class: 'ta-c'
          }
        ]
      }
    },
    mounted () {
      this.getData()
    },
    methods: {
      getData () {
        this.$Spin.show()
        userPortraitList(this.listForm).then((res) => {
          if (res.code === 1) {
            this.tbodyData = res.data.data
            this.ui.total = res.data.rows
          } else {
            this.$Message.info(res.msg)
          }
          this.$Spin.hide()
        })
      },
      editPortrait (id, title) {
        this.ui.infoTitle = title
        this.$Spin.show()
        this.infoData = {
          portrait: [],
          goods: []
        }
        userPortraitInfo({buyerId: id}).then((res) => {
          this.$Spin.hide()
          if (res.code === 1) {
            this.ui.showEditModal = true
            this.infoData = res.data
          }
        })
      },
      // 改变页码
      changePage (index) {
        this.listForm.pageIndex = index
        this.getData()
      }
    }
  }
</script>
<style lang="less">
</style>
