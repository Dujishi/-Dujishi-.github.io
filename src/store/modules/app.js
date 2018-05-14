import { otherRouter, appRouter } from '@/router/router'

const app = {
  state: {
    menuList: [],
    currentPageName: '',
    openedSubmenuArr: [],
    pageOpenedList: [{
      title: '首页',
      path: '',
      name: 'home_index'
    }],
    currentPath: [],  // 面包屑数组
    routers: [
      otherRouter,
      ...appRouter
    ],
    messageCount: 0
  },
  mutations: {
    updateMenulist (state) {
      state.menuList = appRouter
    },
    setCurrentPath (state, pathArr) {
      state.currentPath = pathArr
    },
    setCurrentPageName (state, name) {
      state.currentPageName = name
    },
    addOpenSubmenu (state, name) {
      let hasThisName = false
      let isEmpty = false
      if (name.length === 0) {
        isEmpty = true
      }
      if (state.openedSubmenuArr.indexOf(name) > -1) {
        hasThisName = true
      }
      if (!hasThisName && !isEmpty) {
        state.openedSubmenuArr.push(name)
      }
    }
  }
}

export default app
