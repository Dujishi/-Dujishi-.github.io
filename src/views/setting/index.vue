<template src="./index.html"></template>

<script>
  import { settingConf, saveSetting } from '../../service/index'
  import Cookies from 'js-cookie'
  import UMeditor from '../components/um.vue'

  export default {
    components: {
      UMeditor
    },
    data () {
      return {
        settingForm: {
          nightEnable: 1,
          nightTime: '',
          nightAnswer: '',
          humanAnswer: '',
          buyerNick: '',
          bestCustomService: '',
          humanAnswerPre: '',
          enableShopAi: 0,
          greetings: '',
          offlineStore: 0,
          answerRepeat: 0,
          answerIntervalTime: '',
          answerRepeatTimes: '',
          serviceList: [],
          labelRepeat: 0,
          labelIntervalTime: '',
          labelRepeatTimes: '',
          remind: 0,
          replyDelay: '',
          // guidedInterval: 0,
          sessionTime: ''
        },
        replyDelayList: '',
        nightTime: {
          start: '',
          end: ''
        },
        um: {
          content: '欢迎语',
          source: '',
          config: {
            zIndex: 900,
            maximumWords: 200,
            initialFrameHeight: 150
          },
          toolbar: []
        }
      }
    },
    mounted () {
      this.$Spin.show()
      this.getData()
    },
    methods: {
      getData () {
        settingConf({gid: Cookies.get('shopId')}).then((res) => {
          this.$Spin.hide()
          if (res.code !== 1) {
            return false
          }
          // this.settingForm = res.data
          this.settingForm = {
            nightEnable: res.data.nightEnable || 1,
            nightTime: res.data.nightTime || '',
            nightAnswer: res.data.nightAnswer || '',
            humanAnswer: res.data.humanAnswer || '',
            buyerNick: res.data.buyerNick || '',
            bestCustomService: res.data.bestCustomService || '',
            humanAnswerPre: res.data.humanAnswerPre || '',
            enableShopAi: res.data.enableShopAi || 0,
            greetings: res.data.greetings || '',
            offlineStore: res.data.offlineStore || 0,
            answerRepeat: res.data.answerRepeat || 0,
            answerIntervalTime: res.data.answerIntervalTime || '',
            answerRepeatTimes: res.data.answerRepeatTimes || '',
            serviceList: res.data.serviceList || [],
            labelRepeat: res.data.labelRepeat || 0,
            labelIntervalTime: res.data.labelIntervalTime || '',
            labelRepeatTimes: res.data.labelRepeatTimes || '',
            remind: res.data.remind || 0,
            replyDelay: res.data.replyDelay || '',
            // guidedInterval: res.data.guidedInterval || 0,
            sessionTime: res.data.sessionTime || ''
          }
          this.replyDelayList = res.data.replyDelayList || []
          let nightTimes = this.settingForm.nightTime.split('~')
          this.nightTime.start = nightTimes[0]
          this.nightTime.end = nightTimes[1]
          res.data.serviceList.length > 0 ? this.settingForm.serviceList = res.data.serviceList : this.settingForm.serviceList = ['']
          if (this.settingForm.enableShopAi === 1) {
            this.setContent()
          }
        })
      },
      setContent () {
        setTimeout(() => {
          this.$refs.umeditor.setContent(this.settingForm.greetings.replace(/\n/g, '<br />'))
        }, 1000)
      },
      changeStatus (status) {
        if (status === 1) {
          this.setContent()
        }
      },
      changeStartTimes (value) {
        this.nightTime.start = value
        this.settingForm.nightTime = this.nightTime.start + '~' + this.nightTime.end
      },
      changeEndTimes (value) {
        this.nightTime.end = value
        this.settingForm.nightTime = this.nightTime.start + '~' + this.nightTime.end
      },
      changeTimes (value) {
        this.nightTime = value
        this.settingForm.nightTime = value.join('~')
      },
      addArr (arr) {
        arr.push('')
      },
      minusArr (arr, index) {
        arr.splice(index, 1)
      },
      saveSetting () {
        if (this.settingForm.labelRepeat === 1) {
          if (this.settingForm.labelIntervalTime === '') {
            this.$Message.error('重复标签设置的时间长度不能为空')
            return false
          } else if (this.settingForm.labelRepeatTimes === '') {
            this.$Message.error('重复标签设置的进入次数不能为空')
            return false
          }
        } else if (this.settingForm.answerRepeat === 1) {
          if (this.settingForm.answerIntervalTime === '') {
            this.$Message.error('重复答案设置的时间长度不能为空')
            return false
          } else if (this.settingForm.answerRepeatTimes === '') {
            this.$Message.error('重复答案设置的进入次数不能为空')
            return false
          }
        }
        this.$Spin.show()
        this.settingForm.enableShopAi === 1 ? this.settingForm.greetings = this.$refs.umeditor.getPlainTxt() : this.settingForm.greetings = ''
        saveSetting(this.settingForm).then((res) => {
          this.$Spin.hide()
          if (res.code !== 1) {
            return false
          }
          this.$Message.success(res.msg)
        })
      }
    }
  }
</script>
<style scoped>
  .settingBox { padding: 30px; }
  .customOpera { margin-top: 2px; }
</style>
