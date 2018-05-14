import 'whatwg-fetch'
import router from '../router/index'
import Cookies from 'js-cookie'
import { Message, Spin } from 'iview'
import env from '../../build/env'
import { baseUrl } from './config'

/* eslint-disable max-len */

function queryParams (params) {
  return Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&')
}

export default (url = '', params = {}, fetchOpts = {}) => {
  const method = fetchOpts && fetchOpts.method && fetchOpts.method.toUpperCase()
  let newUrl = baseUrl + url
  params.shopId = Cookies.get('shopId')
  if (!method || method === 'GET' || method === 'DELETE') {
    // newUrl += params.gid
    if (env !== 'development') {
      newUrl += params.gid
    } else {
      newUrl += (newUrl.indexOf('?') === -1 ? '?' : '&') + queryParams(params)
    }
  }
  if (method === 'POST' || method === 'PUT') {
    if (params.upLoad) {
      fetchOpts.body = params.updata
    } else {
      fetchOpts.body = JSON.stringify(params)
    }
  }

  const newFetchOpts = {
    ...fetchOpts,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  if (params.upLoad) {
    newFetchOpts.headers = {}
  } else {
    newFetchOpts.headers = {
      'Content-Type': 'application/json'
    }
  }
  if (env === 'development') {
    delete newFetchOpts.credentials
  }

  return fetch(newUrl, newFetchOpts)
    .then(res => res.json())
    .then((res) => {
      if (res.code === 0) {
        Message.warning(res.msg)
        // Spin.hide()
        // return Promise.reject(res.msg)
      }
      if (res.code === -1) {
        if (res.msg) {
          // Spin.hide()
          Message.warning(res.msg)
        }
        location = location.pathname + '#/login'
        return false
      }
      return res
    })
    .catch(error => console.log(error))
    .finally(() => {
       setTimeout(()=>{
         Spin.hide()
       },8000)
    });
}
