<style lang="less">
  @import "./main.less";
</style>
<template>
  <div class="main" :class="{'main-hide-text': shrink}">
    <div class="sidebar-menu-con" :style="{width: shrink?'60px':'220px', overflow: shrink ? 'visible' : 'auto'}">
      <shrinkable-menu :shrink="shrink" :menu-list="menuList">
        <div slot="top" class="logo-con">
          <img v-show="!shrink" src="../images/logo.png" key="max-logo"/>
          <img v-show="shrink" src="../images/logo-mini.png" key="min-logo"/>
        </div>
      </shrinkable-menu>
    </div>
    <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'220px'}">
      <div class="main-header">
        <div class="navicon-con">
          <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
            <Icon type="navicon" size="32"></Icon>
          </Button>
        </div>
        <div class="header-avator-con">
          <div class="user-dropdown-menu-con" @click="showChangeShop">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <Icon type="person" size="20" style="margin:0 10px;"></Icon>
              <!--<Avatar icon="person" shape="square" style="background: #619fe7;margin:0 10px;"></Avatar>-->
              <span>{{ users }}</span>
              <Icon type="briefcase" size="20" style="margin:0 10px;"></Icon>
              <span>{{ userName }}</span>
              <!--<a href="javascript:void(0)">-->
              <!--<span class="main-user-name">{{ userName }}</span>-->
              <!--</a>-->
              <i class="iconfont icon-change mgl10" style="color: #f77127;" title="切换店铺"></i>
              <!--<Icon type="arrow-swap" class="changeStore fr" color="#fff"></Icon>-->
            </Row>
          </div>
        </div>
      </div>
    </div>
    <div class="single-page-con" :style="{left: shrink?'60px':'220px'}">
      <div class="main-breadcrumb">
        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
      </div>
      <div class="single-page">
        <router-view></router-view>
      </div>
    </div>
    <Modal class="customModal" v-model="showChangeModal" :closable="false" width="560">
      <h2 class="modalTitle clearfix" slot="header">
        <span class="fl">切换店铺</span>
        <button class="aibutton button-error fr" @click="logOut">退出账号</button>
      </h2>
      <div class="modalBox">
        <template v-if="adminShops && adminShops.length">
          <Form :label-width="80">
            <FormItem label="其他店铺">
              <Select v-model="shopId" @on-change="adminChangeShop" label-in-value>
                <Option v-for="item in adminShops" :value="item.shopid" :key="item.shopid">{{ item.shopname }}</Option>
              </Select>
            </FormItem>
          </Form>
        </template>
        <ul class="shopList clearfix">
          <li class="shopOne fl" v-for="item in shops" :key="item.shopid">
            <div class="shop-box" @click="changeShop(item.shopid, item.shopname)" :class="{cur: shopId === item.shopid}">
              <Avatar icon="person" size="large"/>
              <p class="mgt10">{{ item.shopname }}</p>
            </div>
            <div class="mgt10">
              <div class="bind-box bind-no" v-if="item.mobile === ''" @click="showBind('')">
                请绑定您的手机号码
              </div>
              <div class="bind-box" v-if="item.mobile !== ''" @click="showBind(item.mobile)">
                已绑定手机:{{ item.mobile }}
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div slot="footer">
        <Button type="text" @click="showChangeModal = false">取消</Button>
      </div>
    </Modal>
    <Modal class-name="middle-modal" class="customModal" v-model="bindModal" :closable="false" width="300">
      <h2 class="modalTitle" slot="header">
        <span>绑定手机</span>
      </h2>
      <div class="modalBox">
        <div class="bind-form">
          <el-input placeholder="输入手机号码" v-model="bind.mobile" size="mini" :maxlength="11"></el-input>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" :disabled="ui.isAjax" @click="bindPhone">绑定</Button>
        <Button type="text" @click="bindModal = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import Cookies from 'js-cookie'
  import util from '../libs/util'
  import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue'
  import breadcrumbNav from './main-components/breadcrumb-nav.vue'
  import { logout, bindMobile } from '../service/index'

  const regularPhone = /^0{0,1}(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]19[0-9])[0-9]{8}$/
  export default {
    components: {
      shrinkableMenu,
      breadcrumbNav
    },
    data () {
      return {
        ui: {
          isAjax: false
        },
        shrink: false,
        userName: Cookies.get('username'),
        users: Cookies.get('users'),
        shopId: Cookies.get('shopId'),
        showChangeModal: false,
        shops: [],
        adminShops: [],
        bindModal: false,
        bind: {
          mobile: ''
        }
      }
    },
    computed: {
      menuList () {
        return this.$store.state.app.menuList
      },
      currentPath () {
        return this.$store.state.app.currentPath  // 当前面包屑数组
      }
    },
    methods: {
      init () {
        let pathArr = util.setCurrentPath(this, this.$route.name)
        this.$store.commit('updateMenulist')
        if (pathArr.length >= 2) {
          this.$store.commit('addOpenSubmenu', pathArr[1].name)
        }
      },
      showChangeShop () {
        this.showChangeModal = true
      },
      toggleClick () {
        this.shrink = !this.shrink
      },
      //      handleClickUserDropdown (name) {
      //        this.$router.push({
      //          name: 'login'
      //        })
      //      },
      shopList () {
        this.shops = JSON.parse(localStorage.getItem('shopList'))
        localStorage.getItem('adminShopList') !== 'undefined' ? this.adminShops = JSON.parse(localStorage.getItem('adminShopList')) : this.adminShops = []
      },
      changeShop (shopid, username) {
        this.showChangeModal = false
        Cookies.set('shopId', shopid)
        Cookies.set('username', username)
        this.$Message.info('正在切换店铺中，请稍后')
        window.location.reload()
      },
      logOut () {
        logout({}).then((res) => {
          this.$Message.info(res.msg)
          this.$router.push({name: 'login'})
        })
      },
      itemTitle (item) {
        if (typeof item.title === 'object') {
          return this.$t(item.title.i18n)
        } else {
          return item.title
        }
      },
      adminChangeShop (key) {
        Cookies.set('shopId', key.value)
        this.userName = key.label
        Cookies.set('username', key.label)
        this.$Message.info('正在切换店铺中，请稍后')
        window.location.reload()
      },
      showBind (mobile) {
        this.bind.mobile = mobile
        this.bindModal = true
      },
      isMPhone (phoneNumber) {
        let isMPhone = true
        if (phoneNumber === '' || !regularPhone.test(phoneNumber)) {
          isMPhone = false
        }
        return isMPhone
      },
      bindPhone () {
        if (!this.isMPhone(this.bind.mobile)) {
          this.$Notice.error({
            title: '手机号码格式不正确',
            desc: ''
          })
          return false
        }
        this.ui.isAjax = true
        this.$Spin.show()
        bindMobile(this.bind).then((res) => {
          this.ui.isAjax = false
          this.$Spin.hide()
          if (res.code !== 1) {
            return false
          }
          this.$Notice.success({
            title: '手机号码绑定成功,请重新登录',
            desc: ''
          })
          this.logOut()
        })
      }
    },
    mounted () {
      this.init()
      this.shopList()
    },
    watch: {
      '$route' (to, from) {
        this.$store.commit('setCurrentPageName', to.name)
        let pathArr = util.setCurrentPath(this, to.name)
        if (pathArr.length > 2) {
          this.$store.commit('addOpenSubmenu', pathArr[1].name)
        }
        localStorage.currentPageName = to.name
      }
    }
  }
</script>
