<template>
  <div class="amBox mgt20">
    <ul v-if="listData.length" class="download-list clearfix" :style="{ minHeight: mainHeight + 'px'}">
      <li class="download-one fl" v-for="item in listData">
        <h3 class="download-title">小微机器人客户端下载</h3>
        <div class="download-box">
          <div class="download-pic">{{ item.versionNo }}</div>
          <p class="download-text mgt30" :title="item.remark">{{ item.remark }}</p>
          <span class="download-btn" @click="downloadClient(item.clientUrl)">下载</span>
        </div>
      </li>
    </ul>
    <div class="no-data" v-else>
      <div><img src="../../images/xiaowei.png" alt=""></div>
      <p>暂无数据</p>
    </div>
  </div>
</template>
<script>
  import { getClientVersions, downloadClient } from '../../service/index'

  export default {
    data () {
      return {
        mainHeight: document.documentElement.clientHeight - 200,
        listData: []
      }
    },
    mounted () {
      this.$Spin.show()
      this.getData()
    },
    methods: {
      getData () {
        getClientVersions({gid: ''}).then((res) => {
          this.$Spin.hide()
          if (res.code !== 1) {
            return
          }
          this.listData = res.data.list || []
        })
      },
      downloadClient (url) {
        window.open(url, '_blank')
      }
    }
  }
</script>
<style lang="less" src="../../styles/download.less"></style>
