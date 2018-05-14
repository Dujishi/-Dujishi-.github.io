<template>
  <div>
    <div class="amHeader clearfix">
      <div class="customForm clearfix">
        <span class="filterName mgr10 fl">开始时间</span>
        <DatePicker class="mgr20 nobgInput fl" type="date" format="yyyy-MM-dd" v-model="listForm.startDate"></DatePicker>
        <span class="filterName mgr10 fl">结束时间</span>
        <DatePicker class="mgr20 nobgInput fl" type="date" format="yyyy-MM-dd" v-model="listForm.endDate"></DatePicker>
        <div class="customBtns fl">
          <Button type="info" size="small" style="margin-top: 4px; width: 100px; color: #fff;" @click="searchData">查询</Button>
        </div>
      </div>
    </div>
    <div class="amBox mgt20">
      <div class="echarts" id="dataChart"></div>
      <!--<button @click="doRandom">Random</button>-->
    </div>
  </div>
</template>
<script>
  import { dataInfoOld } from '../../service/index'
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/line')
  require('echarts/lib/component/tooltip')
  export default {
    components: {},
    data () {
      return {
        listForm: {
          startDate: '',
          endDate: ''
        },
        searchDate: [],
        isAjax: false,
        loading: false
      }
    },
    mounted () {
      this.$Spin.show()
      this.init()
    },
    methods: {
      init () {
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
        this.listForm.startDate = this.formatDate(this.listForm.startDate)
        this.listForm.endDate = this.formatDate(this.listForm.endDate)
        dataInfoOld(this.listForm).then((res) => {
          this.$Spin.hide()
          if (res.code === 1) {
            let charts = echarts.init(document.getElementById('dataChart'))
            let dateList = res.data.dateList
            let transRateList = res.data.transRateList
            charts.setOption({
              title: {
                text: '转化率折线图'
              },
              color: '#3398DB',
              grid: {
                bottom: '3%',
                containLabel: true,
                left: '3%'
              },
              tooltip: {
                padding: 10,
                trigger: 'axis',
                axisPointer: {
                  type: 'line'
                },
                formatter: function (params) {
                  return params[0].name + '<br />' + params[0].marker + params[0].seriesName + ': ' + (params[0].value * 100).toFixed(2) + '%'
                }
              },
              xAxis: {
                name: '时间',
                axisTick: {
                  inside: true,
                  alignWithLabel: true
                },
                axisLabel: {
                  rotate: -30
                },
                // type: 'category',
                data: dateList,
                boundaryGap: false
              },
              yAxis: {
                name: '转化率',
                axisLabel: {
                  formatter: function (val) {
                    return (val) * 100 + '%'
                  }
                },
                min: 0,
                max: 1,
                splitLine: {
                  show: false
                },
                // splitNumber: 1,
                axisTick: false,
                type: 'value'
              },
              series: [
                {
                  name: '转化率',
                  type: 'line',
                  data: transRateList
                }
              ]
            })
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
