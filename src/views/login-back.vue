<template lang="html">

</template>

<script>
  import { ychLogin } from '../service/index'
  import Cookies from 'js-cookie'
  import { httpGetRequest } from '../libs/params'
  import { baseUrl } from '../libs/config'

  let times = 0
  let timeOut

  export default {
    data () {
      return {
        ui: {
          isAjax: false
        },
        loginForm: {
          username: httpGetRequest('token'),
          type: httpGetRequest('type')
        }
      }
    },
    mounted () {
      this.$Spin.show()
      this.goLogin()
    },
    methods: {
      goLogin () {
        fetch(baseUrl + '/user/loginYCH', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(this.loginForm)
        }).then(res => res.json())
          .then((res) => {
            if (res.code === -1) {
              clearTimeout(timeOut)
              this.$router.push('/')
            }
            if (res.code === 0) {
              times++
              timeOut = setTimeout(() => {
                this.$Message.info(res.msg)
                if (times < 4) {
                  this.goLogin()
                } else {
                  this.$Spin.hide()
                  this.$Message.error({
                    content: '登录失败，正在重试',
                    duration: 3
                  })
                  window.location.href = window.location.href
                }
              }, 5 * 1000)
            }
            if (res.code === 1) {
              this.$Spin.hide()
              clearTimeout(timeOut)
              let cookieday = res.data.timeout / 60 / 60 / 24
              // Cookies.set('token', res.data.token, {expires: cookieday, path: ''})
              Cookies.set('username', res.data.shops[0].shopname, {expires: cookieday, path: ''})
              Cookies.set('shopId', res.data.shops[0].shopid, {expires: cookieday, path: ''})
              let isAdmin
              if (this.loginForm.username === 'admin') {
                isAdmin = 1
              } else {
                isAdmin = 0
              }
              Cookies.set('isAdmin', isAdmin)
              localStorage.setItem('shopList', JSON.stringify(res.data.shops))
              localStorage.setItem('adminShopList', JSON.stringify(res.data.otherShops))
              this.$Message.info({
                content: res.msg,
                duration: 3
              })
              this.$router.push('/')
            }
          })
          .catch(error => console.log(error))
      }
    }
  }
</script>
