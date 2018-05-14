<template>
  <div>
    <h2>本周工作</h2>
    <Table border :columns="columns1" :data="data1" width="700"></Table>
    <h2>下周计划</h2>
    <Table class="mgt20" border :columns="columns2" :data="data2" width="700"></Table>
    <p>1</p>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        columns1: [
          {
            title: '工作事项',
            key: 'name',
            width: 150
          },
          {
            title: '进度',
            key: 'progress',
            width: 100
          },
          {
            title: '计划',
            key: 'plan',
            width: 100
          },
          {
            title: '描述',
            key: 'desc'
          }
        ],
        data1: [
          {
            name: '通用配置页面',
            progress: '开发连调完成',
            plan: '2018-02-23',
            desc: '通用配置页面按照PRD修改优化'
          },
          {
            name: '官方知识库页面',
            progress: '开发完成',
            plan: '2018-02-23',
            desc: '没有关联任何答案的问法以红色高亮突出显示'
          },
          {
            name: '活动配置页面',
            progress: '开发完成',
            plan: '2018-02-23',
            desc: '修复【BUG】：编辑内容开始时间、结束时间格式修改为yyyy-MM-dd HH:mm:ss'
          },
          {
            name: '官方知识库页面',
            progress: '开发完成',
            plan: '2018-02-23',
            desc: '修复【BUG】：答案编辑器中，表情选择，第二行第八个，第二行第九个显示一样'
          }
        ],
        columns2: [
          {
            title: '工作事项',
            key: 'name',
            width: 150
          },
          {
            title: '开始时间',
            key: 'begin',
            width: 100
          },
          {
            title: '结束时间',
            key: 'end',
            width: 100
          },
          {
            title: '描述',
            key: 'desc'
          }
        ],
        data2: [
          {
            name: '权限处理',
            begin: '2017-02-26',
            end: '2017-02-26',
            desc: ''
          },
          {
            name: 'admin增加全局切换店铺',
            begin: '2017-02-26',
            end: '2017-02-26',
            desc: ''
          },
          {
            name: '商品批量设置',
            begin: '2017-02-27',
            end: '2017-02-27',
            desc: ''
          }
        ]
      }
    }
  }
</script>

