<template>
  <div class="">
    <div class="amHeader clearfix">
      <div class="search fl">
        <Input class="searchInput" v-model="list.name" autocomplete="off" icon="search" placeholder="搜关键词" @on-click="searchData" @on-enter="searchData"/>
      </div>
      <div class="operationBtn fr">
        <Button type="primary" class="blue" @click="getInfo('')">新增时效</Button>
      </div>
    </div>
    <div class="amBox mgt20">
      <table class="aiTable">
        <thead>
        <tr>
          <th v-for="(item,index) in theadData" :key="item.index" :width="item.width">
            <div class="tdCell ta-c" :class="item.class">{{ item.name }}</div>
          </th>
        </tr>
        </thead>
        <tbody v-if="tbodyData.length">
        <tr v-for="item in tbodyData" :key="item.periodTimeId">
          <td>
            <div class="tdCell">{{ item.name }}</div>
          </td>
          <td>
            <div class="tdCell ta-c">{{ item.typeName }}</div>
          </td>
          <td>
            <div class="tdCell ta-c">{{ item.startTime }}</div>
          </td>
          <td>
            <div class="tdCell ta-c">{{ item.endTime }}</div>
          </td>
          <td>
            <div class="tdCell ta-c">
              <span v-if="item.status === '生效中'" style="color: #00a2ff">{{ item.status }}</span>
              <span v-if="item.status === '已失效'" style="color: #f47474">{{ item.status }}</span>
              <span v-if="item.status === '未生效'" style="color: #858e99">{{ item.status }}</span>
            </div>
          </td>
          <td>
            <div class="tdCell">
              <div class="iconfontList dibList ta-c">
                <i class="iconfont icon-edit" @click="getInfo(item.periodTimeId)"></i>
                <i class="iconfont icon-trash" @click="showConfirm(item.periodTimeId, '确定删除时效：' + item.name + '吗')"></i>
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
      <Page v-if="ui.total > ui.pageSize ? true : false" class="mgt30 ta-c"
            :current="list.pageIndex"
            :page-size="ui.pageSize" :total="ui.total"
            show-total show-elevator
            @on-change="changePage"></Page>
    </div>
    <confirm-modal :cd="confirmData" :ui="ui" :cb="confirmCB"></confirm-modal>
    <Modal class="customModal" v-model="ui.showEditModal" width="560" :mask-closable="false"
           ok-text="保存">
      <h2 class="modalTitle" slot="header">
        <span>{{ ui.infoTitle }}</span>
      </h2>
      <div class="modalBox">
        <div class="modalMain">
          <Form ref="editForm" label-position="left" :model="editForm" :label-width="80">
            <FormItem label="时效名称">
              <Input v-model="editForm.name" placeholder="请输入时效名称"></Input>
            </FormItem>
            <FormItem>
              <RadioGroup v-model="editForm.type">
                <Radio label="0">不重复时间</Radio>
                <Radio label="1">每日重复时间段</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem>
              <Row v-if="editForm.type === '0'">
                <Col span="10">
                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" :value="editForm.startTime" @on-change="getStartTime" placeholder="开始时间"></DatePicker>
                </Col>
                <Col span="1" style="text-align: center">
                -</Col>
                <Col span="10">
                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" :value="editForm.endTime" @on-change="getEndTime" placeholder="结束时间"></DatePicker>
                </Col>
              </Row>
              <Row v-else-if="editForm.type === '1'">
                <Col span="10">
                <TimePicker format="HH:mm" :value="editForm.startTime" placeholder="开始时间" @on-change="getStartTime"></TimePicker>
                </Col>
                <Col span="1" style="text-align: center">
                -</Col>
                <Col span="10">
                <TimePicker format="HH:mm" :value="editForm.endTime" placeholder="结束时间" @on-change="getEndTime"></TimePicker>
                </Col>
              </Row>
            </FormItem>
          </Form>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" :disabled="ui.isAjax" @click="saveEdit">确定</Button>
        <Button type="text" @click="ui.showEditModal = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { answerManList, answerInfo, answerSave } from '../../service/index'
  import confirmModal from '../components/confirm.vue'

  export default {
    components: {
      confirmModal
    },
    data () {
      return {
        list: {
          name: '',
          pageIndex: 1
        },
        ui: {
          loading: true,
          pageSize: 15,
          total: 0,
          isAjax: false,
          showEditModal: false,
          infoTitle: ''
        },
        theadData: [
          {
            name: '时效名称',
            width: '20%',
            class: ''
          },
          {
            name: '类型',
            width: '10%',
            class: 'ta-c'
          },
          {
            name: '开始时间',
            width: '25%',
            class: ''
          },
          {
            name: '结束时间',
            width: '25%',
            class: ''
          },
          {
            name: '状态',
            width: '10%',
            class: ''
          },
          {
            name: '操作',
            width: '10%',
            class: 'ta-c'
          }
        ],
        tbodyData: [],
        editForm: {
          periodTimeId: '',
          name: '',
          type: '0',
          startTime: '',
          endTime: ''
        },
        confirmData: {
          showConfirm: false,
          title: '',
          id: ''
        },
        delForm: {
          periodTimeId: '',
          name: ''
        }
      }
    },
    mounted () {
      this.$Spin.show()
      this.getData()
    },
    methods: {
      getData () {
        answerManList(this.list).then((res) => {
          this.ui.loading = false
          this.$Spin.hide()
          if (res.code !== 1) {
            return false
          }
          this.tbodyData = res.data.list
          this.ui.total = res.data.rows
        })
      },
      searchData () {
        this.$Spin.show()
        this.list.pageIndex = 1
        this.getData()
      },
      getInfo (info) {
        if (info && info !== '') {
          this.$Spin.show()
          answerInfo({gid: info}, 'GET').then((res) => {
            this.$Spin.hide()
            if (res.code !== 1) {
              return false
            }
            this.ui.infoTitle = '时效编辑'
            this.editForm = {
              periodTimeId: info,
              name: res.data.name,
              type: res.data.type.toString(),
              startTime: this.$moment(res.data.startTime).format('YYYY-MM-DD HH:mm:ss'),
              endTime: this.$moment(res.data.endTime).format('YYYY-MM-DD HH:mm:ss')
            }
          })
        } else {
          this.ui.infoTitle = '新建时效'
          this.editForm = {
            periodTimeId: '',
            name: '',
            type: '0',
            startTime: '',
            endTime: ''
          }
        }
        this.ui.showEditModal = true
      },
      getStartTime (date) {
        this.editForm.startTime = date
      },
      getEndTime (time) {
        this.editForm.endTime = time
      },
      saveEdit () {
        this.$Spin.show()
        answerSave(this.editForm).then((res) => {
          this.$Spin.hide()
          if (res.code !== 1) {
            return false
          }
          this.$Message.success(res.msg)
          this.getData()
          this.ui.showEditModal = false
        })
      },
      showConfirm (id, title) {
        this.confirmData.showConfirm = true
        this.confirmData.id = id
        this.confirmData.title = title
      },
      confirmCB () {
        this.$Spin.show()
        answerInfo({gid: this.confirmData.id}, 'DELETE').then((res) => {
          this.$Spin.hide()
          if (res.code !== 1) {
            return false
          }
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
    }
  }
</script>
