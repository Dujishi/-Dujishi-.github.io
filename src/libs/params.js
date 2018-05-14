/**
 * 获取url中queryName的值
 * @method queryParam
 * @param  {String}   name
 * @param  {String}   url
 * @return {String}
 */
export const queryParam = (name, url) => {
  if (!url) {
    return
  }
  /* eslint-disable */
  const newName = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]')
  const regexS = `[\\?&]${newName}=([^&#]*)`
  const regex = new RegExp(regexS)
  const results = regex.exec(url)
  return results == null ? null : results[1]
}

export function GetQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

export function pubCheckHVal (exp) {
  // console.log(exp)
  if (!!exp && typeof (exp) !== 'undefined' && exp !== '') {
    return true
  } else {
    return false
  }
}

export function httpGetRequest (paras, retnull) {
  let url = location.href
  let paraString = url.substring(url.indexOf('?') + 1, url.length).split('&')
  let paraObj = {}
  let j = 0
  for (let i = 0; j = paraString[i]; i++) {
    paraObj[j.substring(0, j.indexOf('=')).toLowerCase()] = j.substring(j.indexOf('=') + 1, j.length)
  }
  let returnValue = paraObj[paras.toLowerCase()]
  if (typeof (returnValue) === 'undefined') {
    if (typeof (retnull) !== 'undefined' && retnull === true) {
      return null
    }
    return ''
  } else {
    returnValue = returnValue.replace(/#/, '')
    return returnValue
  }
}

export function httpHasChildReq (myurl) {
  let url = location.href
  let paraString = url
  if (url.indexOf('?') > 0) {
    paraString = url.substring(0, url.indexOf('?'))
  }
  if (paraString == null) return false
  if (paraString.indexOf(myurl) === -1) return false
  paraString = paraString.substring(paraString.indexOf(myurl) + 1 + myurl.length, paraString.length)
  if (paraString == null || paraString === '' || paraString === '/') return false
  return true
}

export function saveParam (name, value) {
  if (window.localStorage) {
    // console.log("saveParam="+name);
    window.localStorage.setItem(name, value)
  }
}

export function removeParam (name) {
  if (window.localStorage) {
    // console.log("saveParam="+name);
    window.localStorage.removeItem(name)
  }
}

export function loadParam (name) {
  if (window.localStorage) {
    // console.log("loadParam="+name);
    return window.localStorage.getItem(name)
  }
  return null
}

export function saveSessionParam (name, value) {
  if (window.sessionStorage) {
    // console.log("saveParam="+name);
    window.sessionStorage.setItem(name, value)
  }
}

export function loadSessionParam (name) {
  if (window.sessionStorage) {
    // console.log("loadParam="+name);
    return window.sessionStorage.getItem(name)
  }
  return null
}

export function delSessionParam (name) {
  if (window.sessionStorage) {
    // console.log("loadParam="+name);
    return window.sessionStorage.removeItem(name)
  }
  return null
}

export function logd (obj) {
  console.log(obj)
}

/**
 * QQ号判断
 * @method isQQ
 * @param  {String}  str
 * @return {Boolean}
 */
export const isQQ = str => RegExp(/^[1-9][0-9]{4,9}$/).test(str)

/**
 * 手机号判断
 * @method isMPhone
 * @param  {String}  str
 * @return {Boolean}
 */
export const isMPhone = (str) => {
  const reg = /^0{0,1}(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])[0-9]{8}$/
  return !(str === '' || !reg.test(str))
}

export const isInt = str => /^[0-9]*$/.test(str)

export const checkPwd = (str) => {
  return str.indexOf(' ') < 0 && /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,18}$/.test(str)
}

/**
 * 判别是否为微信浏览器
 * @method isWechatBrowser
 * @return {Boolean}
 */
export const isWechatBrowser = () => typeof WeixinJSBridge !== 'undefined'

export function formatDate (date, fmt) {
  // console.log(date);
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}
