<template src="./login.html"></template>

<script>
  import { login } from '../service/index'
  import md5 from 'js-md5'
  import Cookies from 'js-cookie'

  export default {
    data () {
      return {
        ui: {
          isAjax: false
        },
        rememberPwd: null,
        autoLogin: null,
        loginForm: {
          username: Cookies.get('users') || '',
          password: ''
        },
        rules: {
          username: [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.rememberPwd = parseInt(Cookies.get('rememberPwd')) || false
        // this.autoLogin = parseInt(Cookies.get('autoLogin')) || false
        if (this.rememberPwd) {
          this.loginForm.password = Cookies.get('password')
        }
        // if (this.autoLogin) {
        //   this.handleSubmit()
        // }
      },
      checked () {
        if (this.loginForm.username === '') {
          this.$notify.warning({
            title: '账号不能为空',
            duration: 3000
          })
          return false
        } else if (this.loginForm.password === '') {
          this.$notify.warning({
            title: '密码不能为空',
            duration: 3000
          })
          return false
        } else {
          return true
        }
      },
      handleSubmit () {
        if (!this.checked()) {
          return false
        }
        this.ui.isAjax = true
        this.$Spin.show()
        login({
          username: this.loginForm.username,
          password: md5(this.loginForm.password)
        }).then((res) => {
          this.ui.isAjax = false
          this.$Spin.hide()
          if (res.code === 1) {
            let cookieday = res.data.timeout / 60 / 60 / 24
            if (this.rememberPwd) {
              Cookies.set('password', this.loginForm.password, {expires: cookieday, path: ''})
            }
            Cookies.set('rememberPwd', this.rememberPwd, {expires: cookieday, path: ''})
            Cookies.set('autoLogin', this.autoLogin, {expires: cookieday, path: ''})
            Cookies.set('users', this.loginForm.username)
            if (res.data.redirect === 1) {
              window.location.href = res.data.verifyUrl
              return false
            } else {
              // Cookies.set('token', res.data.token, {expires: cookieday, path: ''})
              Cookies.set('username', res.data.shops[0].shopname, {expires: cookieday, path: ''})
              Cookies.set('shopId', res.data.shops[0].shopid, {expires: cookieday, path: ''})
              let isAdmin = 0
              if (res.data.otherShops) {
                isAdmin = 1
              } else {
                isAdmin = 0
              }
              Cookies.set('isAdmin', isAdmin)
              localStorage.setItem('shopList', JSON.stringify(res.data.shops))
              localStorage.setItem('adminShopList', JSON.stringify(res.data.otherShops))
              this.$Message.info(res.msg)
              this.$router.push('/')
            }
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../styles/login.less';
</style>
