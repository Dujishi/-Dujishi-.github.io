<template>
  <div class="">
    <div class="amHeader clearfix">
      <div class="customForm clearfix">
        <span class="filterName mgr10 fl">开始时间</span>
        <DatePicker class="mgr20 nobgInput fl" type="datetime" format="yyyy-MM-dd HH:mm" :value="list.startDate" @on-change="changeStartDate"></DatePicker>
        <span class="filterName mgr10 fl">结束时间</span>
        <DatePicker class="mgr20 nobgInput fl" type="datetime" format="yyyy-MM-dd HH:mm" :value="list.endDate" @on-change="changeEndDate"></DatePicker>
        <div class="customBtns fl">
          <Button type="info" size="small" style="margin-top: 4px; width: 100px; color: #fff;" @click="getData">筛选</Button>
        </div>
      </div>
    </div>
    <div class="amBox mgt20">
      <table class="aiTable">
        <thead>
        <tr>
          <th v-for="(item,index) in theadData" :key="item.index" :width="item.width">
            <div class="tdCell" :class="item.class">{{ item.name }}</div>
          </th>
        </tr>
        </thead>
        <tbody v-if="tbodyData.length">
        <tr v-for="(item,index) in tbodyData" :key="item.periodTimeId">
          <td>
            <div class="tdCell ta-c">{{ index + 1 }}</div>
          </td>
          <td>
            <div class="tdCell">
              <span v-if="item.wordType === 0" style="color:#858e99">{{ item.content }}</span>
            </div>
          </td>
          <td>
            <div class="tdCell">
              <span v-if="item.wordType === 1">{{ item.content }}</span>
            </div>
          </td>
          <td>
            <div class="tdCell ta-c">
              <span v-if="item.isAI === 1">是</span>
              <span v-else-if="item.isAI === 0">否</span>
            </div>
          </td>
          <td>
            <div class="tdCell ta-c">
              <span v-if="item.clientReview === 0" style="color: #858e99">未标记</span>
              <span v-else-if="item.clientReview === 1" style="color: #00a2ff">正确</span>
              <span v-else-if="item.clientReview === 2" style="color: #f47474">错误</span>
            </div>
          </td>
          <td>
            <div class="tdCell ta-c">
              <span v-if="item.backendReview === 0" style="color: #858e99">未标记</span>
              <span v-else-if="item.backendReview === 1" style="color: #00a2ff">正确</span>
              <span v-else-if="item.backendReview === 2" style="color: #f47474">错误</span>
            </div>
          </td>
          <td>
            <div class="tdCell ta-c">
              <div class="customBtns">
                <Button type="info" :disabled="item.backendReview === 1" size="small" @click="showConfirm(item.chatLogId,'将会话' + index + '设为正确吗',1)">正确</Button>
                <Button type="error" :disabled="item.backendReview === 2" size="small" @click="showConfirm(item.chatLogId,'将会话' + index + '设为错误吗',0)">错误</Button>
              </div>
            </div>
          </td>
        </tr>
        </tbody>
        <tbody v-else="tbodyData.length">
        <tr>
          <td class="ta-c" :colspan="theadData.length">
            <div class="tdCell">暂无数据</div>
          </td>
        </tr>
        </tbody>
      </table>
      <Page v-if="list.total > list.pageSize ? true : false" class="mgt30 ta-c"
            :current="list.pageIndex"
            :page-size="list.pageSize" :total="list.total"
            show-total show-elevator
            @on-change="changePage"></Page>
    </div>
    <confirm-modal :cd="confirmData" :ui="ui" :cb="confirmCB"></confirm-modal>
  </div>
</template>

<script>
  import { chatLogList, chatLogTag } from '../../service/index'
  import confirmModal from '../components/confirm.vue'

  export default {
    components: {
      confirmModal
    },
    data () {
      return {
        list: {
          startDate: '',
          endDate: '',
          total: 0,
          pageIndex: 1,
          pageSize: 20
        },
        ui: {
          loading: true,
          isAjax: false,
          showModal: false
        },
        theadData: [
          {
            name: '会话号',
            width: '90',
            class: 'ta-c'
          },
          {
            name: '买家语句',
            width: '',
            class: ''
          },
          {
            name: '客服语句',
            width: '',
            class: ''
          },
          {
            name: '是否AI回答',
            width: '100',
            class: 'ta-c'
          },
          {
            name: '客户端标记',
            width: '100',
            class: 'ta-c'
          },
          {
            name: '后台标记',
            width: '100',
            class: 'ta-c'
          },
          {
            name: '操作',
            width: '220',
            class: 'ta-c'
          }
        ],
        tbodyData: [],
        confirmData: {
          showConfirm: false,
          title: '',
          id: '',
          type: ''
        },
        markForm: {
          title: '',
          periodTimeId: '',
          isCorrect: ''
        }
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        let startDate = this.$moment().subtract(1, 'days').set({'hour': '00', 'minute': '00'})
        let endDate = this.$moment().set({'hour': '00', 'minute': '00'})
        this.list.startDate = this.$moment(startDate).format('YYYY-MM-DD HH:mm')
        this.list.endDate = this.$moment(endDate).format('YYYY-MM-DD HH:mm')
        this.getData()
      },
      getData () {
        chatLogList(
          {
            startDate: this.list.startDate,
            endDate: this.list.endDate,
            pageIndex: this.list.pageIndex
          }
        ).then((res) => {
          this.tbodyData = res.data.list
          this.list.total = res.data.rows
        })
        this.ui.loading = false
      },
      changeStartDate (value) {
        this.list.startDate = value
      },
      changeEndDate (value) {
        this.list.endDate = value
      },
      showConfirm (id, title, type) {
        this.confirmData.showConfirm = true
        this.confirmData.id = id
        this.confirmData.title = title
        this.confirmData.type = type
      },
      confirmCB () {
        chatLogTag(
          {
            chatLogId: this.confirmData.id,
            isCorrect: this.confirmData.type
          }
        ).then((res) => {
          this.confirmData.showConfirm = false
          this.$Message.success(res.msg)
          this.getData()
        })
      },
      // 改变页码
      changePage (index) {
        this.list.pageIndex = index
        this.getData()
      }
    }
  }
</script>
<style lang="less">
</style>
