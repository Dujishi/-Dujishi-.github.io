import Main from '@/views/Main.vue'

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: resolve => { require(['@/views/login.vue'], resolve) }
}
export const ychLogin = {
  path: '/ychlogin',
  name: 'ychlogin',
  meta: {
    title: 'Login - 登录'
  },
  component: resolve => { require(['@/views/login-back.vue'], resolve) }
}
export const qnLogin = {
  path: '/qnLogin',
  name: 'qnLogin',
  meta: {
    title: '登录中'
  },
  component: resolve => { require(['@/views/qn/login.vue'], resolve) }
}

export const page404 = {
  path: '/*',
  name: 'error-404',
  meta: {
    title: '404-页面不存在'
  },
  component: resolve => { require(['@/views/error-page/404.vue'], resolve) }
}

export const page403 = {
  path: '/403',
  meta: {
    title: '403-权限不足'
  },
  name: 'error-403',
  component: resolve => { require(['@//views/error-page/403.vue'], resolve) }
}

export const page500 = {
  path: '/500',
  meta: {
    title: '500-服务端错误'
  },
  name: 'error-500',
  component: resolve => { require(['@/views/error-page/500.vue'], resolve) }
}

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  component: Main,
  children: [
    {
      path: '/',
      title: '首页',
      name: 'home_index',
      component: resolve => { require(['@/views/knowledge/official.vue'], resolve) }
    }
  ]
}

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/knowledge',
    icon: 'ios-folder',
    name: 'knowledge',
    title: '知识库',
    component: Main,
    children: [
      {
        path: 'official',
        // icon: 'ios-paper-outline',
        name: 'official',
        title: '官方知识库',
        component: resolve => { require(['@/views/knowledge/official.vue'], resolve) }
      }
      // ,
      // {
      //   path: 'custom',
      //   // icon: 'ios-list-outline',
      //   name: 'custom',
      //   title: '自定义知识库',
      //   component: resolve => { require(['@/views/knowledge/custom.vue'], resolve) }
      // },
      // {
      //   path: 'keywords',
      //   // icon: 'ios-list-outline',
      //   name: 'keywords',
      //   title: '关键词知识库',
      //   component: resolve => { require(['@/views/knowledge/keywords.vue'], resolve) }
      // },
      // {
      //   path: 'improve',
      //   // icon: 'ios-list-outline',
      //   name: 'improve',
      //   title: '待改进知识库',
      //   component: resolve => { require(['@/views/knowledge/improve.vue'], resolve) }
      // },
      // {
      //   path: 'chatlog',
      //   // icon: 'ios-list-outline',
      //   name: 'chatlog',
      //   title: 'AI回复语料统计',
      //   component: resolve => { require(['@/views/knowledge/chatlog.vue'], resolve) }
      // },
      // {
      //   path: 'answerManage',
      //   // icon: 'ios-list-outline',
      //   name: 'answerManage',
      //   title: '答案时效管理',
      //   component: resolve => { require(['@/views/knowledge/answerManage'], resolve) }
      // }
    ]
  },
  {
    path: '/dataReport',
    icon: 'stats-bars',
    title: '数据统计',
    name: 'dataReport',
    component: Main,
    children: [
      {
        path: 'index',
        title: '数据统计',
        name: 'data-index',
        // component: resolve => { require(['@/views/data/indexOld.vue'], resolve) }
        component: resolve => { require(['@/views/data/index.vue'], resolve) }
      }
    ]
  },
  {
    path: '/goods',
    icon: 'ios-paper',
    title: '商品管理',
    name: 'goods',
    component: Main,
    children: [
      {
        path: 'index',
        title: '商品设置',
        name: 'goodIndex',
        component: resolve => { require(['@/views/goods/goods.vue'], resolve) }
      },
      {
        path: 'sizeChart',
        title: '尺码设置',
        name: 'sizeChart',
        component: resolve => { require(['@/views/goods/sizeChart.vue'], resolve) }
      }
    ]
  },
  {
    path: '/active',
    icon: 'fireball',
    title: '活动管理',
    name: 'active',
    component: Main,
    children: [
      {
        path: 'index',
        title: '活动配置',
        name: 'index',
        component: resolve => { require(['@/views/active/index.vue'], resolve) }
      }
    ]
  },
  // {
  //   path: '/userPortrait',
  //   icon: 'ios-body',
  //   title: '用户画像',
  //   name: 'userPortrait',
  //   component: Main,
  //   children: [
  //     {
  //       path: 'index',
  //       title: '用户画像',
  //       name: 'portraitIndex',
  //       component: resolve => { require(['@/views/userPortrait/index.vue'], resolve) }
  //     }
  //   ]
  // },
  {
    path: '/guide',
    icon: 'navigate',
    title: '引导话术配置',
    name: 'guide',
    component: Main,
    children: [
      {
        path: 'index',
        title: '引导话术配置',
        name: 'guide-index',
        component: resolve => { require(['@/views/guide/index.vue'], resolve) }
      }
    ]
  },
  {
    path: '/reminderMan',
    icon: 'chatbox-working',
    title: '催单管理',
    name: 'reminderMan',
    component: Main,
    children: [
      {
        path: 'index',
        title: '催单设置',
        name: 'reminderIndex',
        component: resolve => { require(['@/views/reminder/index.vue'], resolve) }
      }
    ]
  },
  {
    path: '/commonConf',
    icon: 'gear-b',
    title: '通用配置',
    name: 'commonConf',
    component: Main,
    children: [
      {
        path: 'index',
        title: '通用配置',
        name: '通用配置',
        component: resolve => { require(['@/views/common-conf/index.vue'], resolve) }
      }
    ]
  },
  {
    path: '/service',
    icon: 'calendar',
    title: '客服状态设置',
    name: 'service',
    component: Main,
    children: [
      {
        path: 'index',
        title: '客服状态设置',
        name: '客服状态设置',
        component: resolve => { require(['@/views/service/index.vue'], resolve) }
      }
    ]
  },
  {
    path: '/chatbot',
    icon: 'chatbubbles',
    title: '聊天机器人',
    name: 'chatbot',
    component: Main,
    children: [
      {
        path: 'index',
        title: '聊天机器人',
        name: '聊天机器人',
        component: resolve => { require(['@/views/chatbot/index.vue'], resolve) }
      }
    ]
  },
  {
    path: '/download',
    icon: 'ios-download',
    title: '客户端下载',
    name: 'download',
    component: Main,
    children: [
      {
        path: 'clientDownload',
        title: '客户端下载',
        name: 'clientDownload',
        component: resolve => { require(['@/views/download/clientDownload.vue'], resolve) }
      }
    ]
  },
  {
    path: '/setting',
    icon: 'gear-a',
    title: '设置',
    name: 'setting',
    component: Main,
    children: [
      {
        path: 'index',
        title: '设置',
        name: '设置',
        component: resolve => { require(['@/views/setting/index.vue'], resolve) }
      }
    ]
    // },
    // {
    //   path: '/users',
    //   icon: 'person',
    //   title: '用户中心',
    //   name: 'users',
    //   component: Main,
    //   children: [
    //     {
    //       path: 'index',
    //       title: '用户中心',
    //       name: '用户中心',
    //       component: resolve => { require(['@/views/user/index.vue'], resolve) }
    //     }
    //   ]
  }
]

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  qnLogin,
  ychLogin,
  loginRouter,
  otherRouter,
  ...appRouter,
  page500,
  page403,
  page404
]
