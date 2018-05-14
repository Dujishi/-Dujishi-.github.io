<template src="./index.html"></template>
<script>
  import Cookies from 'js-cookie'
  import { initChatbot } from '../../service/index'

  const user = Cookies.get('users')
  export default {
    data () {
      return {
        talkHeight: document.documentElement.clientHeight - 340,
        websock: null,
        isConnect: false,
        ailabelList: [],
        nick: '',
        shopName: '',
        websocketUrl: '',
        msgValue: '',
        msgObj: {
          imServerUser: {
            appkey: 'cntaobao',
            nick: user
          },
          imServerMsg: {
            cid: {
              appkey: 'cntaobao',
              display: user,
              nick: user,
              portrait: '',
              status: -1,
              type: 1
            },
            extinfo: {
              autochatmsg: 0,
              fixmsgread: 0,
              others: {
                msg_feature: '1',
                realFromId: 'cntaobao' + user,
                realToId: ''
              },
              syschatmsg: 0
            },
            fromid: {
              appkey: 'cntaobao',
              display: user,
              nick: user,
              portrait: '',
              status: -1
            },
            msgbody: [
              {
                jvale: {
                  FONT_COLOR: 0,
                  FONT_FAMILY: '微软雅黑',
                  FONT_SIZE: 12
                },
                type: 0,
                value: ''
              }
            ],
            msgid: '',
            msgstatus: 0,
            msgtime: '',
            msgtype: 0,
            readflag: 0,
            svrtime: '',
            toid: {
              appkey: 'cntaobao',
              display: '',
              nick: '',
              portrait: '',
              status: -1
            }
          }
        },
        talkData: [],
        timeOutHeart: null,
        timeOutConnect: null,
        wsTime: 2,
        leavePage: null
      }
    },
    mounted () {
      this.$Spin.show()
      this.appkey = 'cntaobao'
      this.getAiLablel()
    },
    methods: {
      getAiLablel () {
        initChatbot({gid: Cookies.get('shopId')}).then((res) => {
          if (res.code !== 1) {
            return false
          }
          this.ailabelList = res.data.aiLabels || []
          this.shopName = res.data.shopName || ''
          this.nick = res.data.nick + ':' + new Date().getTime() || ''
          this.websocketUrl = res.data.websocketUrl || ''
          this.initWebSocket()
        })
      },
      sendMsg (event) {
        if (event.keyCode === 13 && event.ctrlKey) {
          this.msgValue = this.msgValue + '\r'
        } else if (event.keyCode === 13 && !event.ctrlKey) {
          if (this.msgValue === '') {
            return false
          }
          // 发送消息封装为旺旺格式 start
          this.msgObj.imServerUser.appkey = 'cntaobao'
          this.msgObj.imServerMsg.extinfo.others.realToId = 'cntaobao' + this.nick
          this.msgObj.imServerMsg.msgbody[0].value = this.msgValue
          this.msgObj.imServerMsg.msgid = new Date().getTime().toString()
          this.msgObj.imServerMsg.msgtime = new Date().getTime().toString()
          this.msgObj.imServerMsg.svrtime = new Date().getTime().toString()
          this.msgObj.imServerMsg.toid.display = this.nick
          this.msgObj.imServerMsg.toid.nick = this.nick
          // 发送消息封装为旺旺格式 end
          if (this.websock.readyState === this.websock.OPEN) {
            this.webSocketSend(JSON.stringify(this.msgObj))
          } else if (this.websock.readyState === this.websock.CONNECTING) {
            setTimeout(() => {
              this.webSocketSend(JSON.stringify(this.msgObj))
            }, 300)
          } else {
            this.initWebSocket()
            setTimeout(() => {
              this.webSocketSend(JSON.stringify(this.msgObj))
            }, 500)
          }
        }
      },
      initWebSocket () {
        const wsUri = this.websocketUrl + '?appkey=' + this.appkey + '&nick=' + encodeURI(this.nick)
        this.websock = new WebSocket(wsUri)
        this.websock.onopen = this.webSocketOnOpen
        this.websock.onerror = this.webSocketOnError
        this.websock.onmessage = this.webSocketOnMessage
        this.websock.onclose = this.webSocketClose
      },
      webSocketOnOpen () {
        this.$Spin.hide()
        this.isConnect = true
        this.heartCheckStart()
      },
      webSocketSend (agentData) {
        this.websock.send(agentData)
        if (agentData !== '') {
          this.talkData.push({
            type: 0,
            user: user,
            times: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            value: this.msgValue
          })
          this.msgValue = ''
        }
      },
      webSocketOnMessage (e) { // 数据接收
        this.heartCheckReset()
        const redata = JSON.parse(e.data)
        if (redata.imServerMsgType === 1) {
          let needHuman = ''
          redata.msgObject.msgs[0].needHuman ? needHuman = true : needHuman = false
          this.talkData.push({
            type: 1,
            needHuman: needHuman,
            user: this.nick,
            times: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            value: redata.msgObject.msgs[0].answer
          })
        }
      },
      webSocketClose (e) {
        console.log('closed (' + e + ')')
        clearInterval(this.timeOutHeart)
        if (this.leavePage) {
          return false
        }
        this.isConnect = false
        this.reconnetWebScoket()
      },
      webSocketOnError (e) {
        console.log('error (' + e + ')')
        clearInterval(this.timeOutHeart)
        if (this.leavePage) {
          return false
        }
        this.isConnect = false
        this.reconnetWebScoket()
      },
      heartCheckStart () {
        let timeOut = 4 * 1000
        this.timeOutHeart = setInterval(() => {
          this.webSocketSend('')
          console.log('heart')
        }, timeOut)
      },
      heartCheckReset () {
        clearInterval(this.timeOutHeart)
        this.heartCheckStart()
      },
      pollTime (n) {
        if (n === 1 | n === 2) {
          return 1
        }
        return this.pollTime(n - 1) + this.pollTime(n - 2)
      },
      reconnetWebScoket () {
        if (this.isConnect) return
        this.isConnect = true
        clearTimeout(this.timeOutConnect)
        if (this.wsTime > 8) {
          this.wsTime = 2
        }
        this.timeOutConnect = setTimeout(() => {
          this.initWebSocket()
          this.wsTime++
        }, this.pollTime(this.wsTime) * 1000)
      }
    },
    updated () {
      this.$nextTick(function () {
        this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight
      })
    },
    destroyed () {
      this.leavePage = true
      this.websock.close()
    }
  }
</script>
<style lang="less">
  @import "../../styles/chatbot.less";
</style>
