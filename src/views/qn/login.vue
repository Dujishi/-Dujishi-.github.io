<template lang="html">

</template>
<script>
  import { qnLogin } from '../../service/index'
  import Cookies from 'js-cookie'
  import { baseUrl } from '../../libs/config'
  import { httpGetRequest } from '../../libs/params'

  let times = 0
  let self
  let timeOut
  export default {
    data () {
      return {
        ui: {
          isAjax: false
        },
        form: {
          username: '',
          token: Cookies.get('token')
        }
      }
    },
    methods: {
      goLogin () {
        this.form.username = httpGetRequest('account')
        fetch(baseUrl + '/user/loginQN', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(this.form)
        }).then(res => res.json())
          .then((res) => {
            if (res.code === -1) {
              clearTimeout(timeOut)
              this.$router.push('/')
            }
            if (res.code === 0) {
              times++
              timeOut = setTimeout(function () {
                self.$Message.info(res.msg)
                if (times < 4) {
                  self.goLogin()
                } else {
                  self.$Message.error('登录失败，正在重试')
                  window.location.href = window.location.href
                }
              }, 5 * 1000)
            }
            if (res.code === 1) {
              clearTimeout(timeOut)
              let cookieday = res.data.timeout / 60 / 60 / 24
              // Cookies.set('token', res.data.token, {expires: cookieday, path: ''})
              Cookies.set('username', res.data.shops[0].shopname, {expires: cookieday, path: ''})
              Cookies.set('shopId', res.data.shops[0].shopid, {expires: cookieday, path: ''})
              localStorage.setItem('shopList', JSON.stringify(res.data.shops))
              this.$Message.info(res.msg)
              this.$router.push('/')
            }
          })
          .catch(error => console.log(error))
      }
    },
    mounted () {
      this.goLogin()
    },
    created () {
      self = this
    }
  }
</script>
