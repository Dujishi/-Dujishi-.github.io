<template>
  <div class="amBox" style="padding: 10px 20px;">
    <el-radio-group class="custom-el-slide" v-model="listForm.domain" size="small" @change="getData">
      <el-radio-button :label="0">转化率</el-radio-button>
      <el-radio-button :label="1">买家问题汇总</el-radio-button>
    </el-radio-group>
    <div class="amHeader mgt20 clearfix">
      <div class="customForm clearfix">
        <span class="filterName mgr10">开始时间</span>
        <el-date-picker
          class="mgr20"
          v-model="listForm.startDate"
          type="date"
          size="mini"
          placeholder="开始时间">
        </el-date-picker>
        <!--<DatePicker class="mgr20 nobgInput fl" type="date" format="yyyy-MM-dd" v-model="listForm.startDate"></DatePicker>-->
        <span class="filterName mgr10">结束时间</span>
        <el-date-picker
          class="mgr20"
          v-model="listForm.endDate"
          type="date"
          size="mini"
          placeholder="结束时间">
        </el-date-picker>
        <!--<DatePicker class="mgr20 nobgInput fl" type="date" format="yyyy-MM-dd" v-model="listForm.endDate"></DatePicker>-->
        <span class="filterName mgr10">子账号</span>
        <el-select
          class="mgr20"
          style="width:200px"
          size="mini"
          filterable
          v-model="listForm.nick" @change="changeAccount" placeholder="请选择子账号">
          <el-option
            v-for="item in accountList"
            :value="item.value"
            :key="item.value"
            :label="item.key">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchData">查询</el-button>
      </div>
    </div>
    <div class="amBox mgt20">
      <div class="echarts" id="dataChart"></div>
      <template v-if="listForm.domain === 1">
        <Table stripe :columns="theadData" :data="tbodyData"></Table>
      </template>
      <Modal class="customModal" v-model="ui.showInfoModal" width="940" :mask-closable="false"
             ok-text="保存">
        <h2 class="modalTitle" slot="header">
          <span>{{ ui.infoTitle }}</span>
        </h2>
        <div class="modalBox">
          <div class="modalMain">
            <Table stripe border :columns="theadDataInfo" :data="tbodyDataInfo"></Table>
          </div>
        </div>
        <div slot="footer">
          <Button type="text" @click="ui.showInfoModal = false">关闭</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
  import { childAccountList, dataInfo, dataTableList, dataTableInfo } from '../../service/index'
  import echarts from 'echarts'
  import Cookies from 'js-cookie'

  const shopId = Cookies.get('shopId')
  export default {
    components: {},
    data () {
      return {
        ui: {
          showInfoModal: false,
          infoTitle: ''
        },
        listForm: {
          domain: 0,
          nick: '',
          startDate: '',
          endDate: ''
        },
        accountList: [],
        searchDate: [],
        isAjax: false,
        loading: false,
        theadData: [],
        tbodyData: [],
        theadDataInfo: [],
        tbodyDataInfo: []
      }
    },
    mounted () {
      this.$Spin.show()
      this.getAccountList()
    },
    methods: {
      getAccountList () {
        childAccountList({gid: shopId}).then((res) => {
          this.$Spin.hide()
          if (res.code !== 1) {
            return false
          }
          if (res.data.list.length) {
            this.accountList = res.data.list
            this.listForm.nick = res.data.list[0].value
          }
          this.getData()
        })
      },
      changeAccount () {
        this.$Spin.show()
        this.getData()
      },
      getData () {
        this.listForm.startDate = this.$moment().subtract(7, 'days').format('YYYY-MM-DD')
        this.listForm.endDate = this.$moment().subtract(1, 'days').format('YYYY-MM-DD')
        this.drawLine()
      },
      searchData () {
        this.$Spin.show()
        this.drawLine()
      },
      formatDate (value) {
        return this.$moment(value).format('YYYY-MM-DD')
      },
      drawLine () {
        if (this.listForm.domain === 1) {
          this.getList()
        }
        this.listForm.startDate = this.formatDate(this.listForm.startDate)
        this.listForm.endDate = this.formatDate(this.listForm.endDate)
        delete this.listForm.statInfoId
        dataInfo(this.listForm).then((res) => {
          const seriesData = []
          this.$Spin.hide()
          if (res.code === 1) {
            let dateList = res.data.dateList
            let legendNames = []
            res.data.itemList.forEach((item, index) => {
              legendNames.push(item.name)
              seriesData.push({
                name: item.name,
                stack: item.name,
                type: 'line',
                data: item.dataList
              })
              if (this.listForm.domain === 1) {
                seriesData[index].areaStyle = {}
              } else {
                delete seriesData[index].areaStyle
              }
            })
            let title = ''
            this.listForm.domain === 0 ? title = '转化率' : title = '买家问题汇总'
            let charts = echarts.init(document.getElementById('dataChart'))
            charts.clear()
            charts.setOption({
              title: {
                text: title
              },
              legend: {
                orient: 'vertical',
                right: 10,
                top: 10,
                bottom: 10,
                data: legendNames
              },
              dataZoom: [
                {
                  show: true,
                  startValue: dateList.length - 7,
                  realtime: true
                }
              ],
              toolbox: {
                show: true,
                right: '15%',
                feature: {
                  magicType: {show: true, type: ['stack', 'tiled']}
                }
              },
              grid: {
                left: '5%',
                right: '13%'
              },
              tooltip: {
                trigger: 'item',
                formatter: function (params) {
                  let value = params.value
                  let otherValue = ''
                  params.data.list.forEach((item) => {
                    otherValue += item + '<br />'
                  })
                  return params.name + '<br />' + params.marker + params.seriesName + ': ' + value + '%' + '<br />' + otherValue
                }
              },
              xAxis: [
                {
                  name: '日期',
                  type: 'category',
                  data: dateList,
                  boundaryGap: false
                }
              ],
              yAxis: [
                {
                  min: 0,
                  axisTick: {
                    show: false
                  },
                  splitLine: {
                    show: false
                  },
                  type: 'value'
                }
              ],
              series: seriesData
            }, true)
          }
        })
      },
      getList () {
        this.theadData = []
        this.tbodyData = []
        delete this.listForm.statInfoId
        dataTableList(this.listForm).then((res) => {
          if (res.code === 1) {
            res.data.titleList.forEach((item, index) => {
              let canSort
              item.sort === 0 ? canSort = false : canSort = true
              this.theadData.push({
                title: item.desc,
                key: item.name,
                sortable: canSort
              })
            })
            this.theadData[0].render = (h, params) => {
              return h('span', {}, [
                h('span', {}, params.row[this.theadData[0].key]),
                h('i', {
                  class: [
                    'iconfont', 'icon-eyes'
                  ],
                  style: {
                    fontSize: '12px',
                    marginLeft: '5px'
                  },
                  on: {
                    click: () => {
                      this.getInfo(params.row.statInfoId)
                    }
                  }
                })
              ])
            }
            this.tbodyData = res.data.dataList
          }
        })
      },
      getInfo (id) {
        this.$Spin.show()
        this.listForm.statInfoId = id
        dataTableInfo(this.listForm).then((res) => {
          this.$Spin.hide()
          if (res.code === 1) {
            this.ui.showInfoModal = true
            this.theadDataInfo = []
            res.data.titleList.forEach((item) => {
              let canSort
              item.sort === 0 ? canSort = false : canSort = true
              this.theadDataInfo.push({
                title: item.desc,
                key: item.name,
                sortable: canSort
              })
            })
            this.tbodyDataInfo = res.data.dataList
          }
        })
      }
    }
  }
</script>
<style scoped>
  .echarts {
    width: 100%;
    height: 600px;
  }
</style>
