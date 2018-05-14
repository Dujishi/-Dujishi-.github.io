import env from '../../build/env'

function BASE_URL () {
  let url
  if (env === 'development') {
    // url = '//10.0.0.11:8088' // sunli
    // url = '//10.0.0.6:8088' // zenghaibin
    // url = '//192.168.102.219:8088' // yang
    url = '//rap.ywwl.com:8080/mockjsdata/38'
  } else if (env === 'javadev') {
    url = '//172.16.15.126:8200'
  } else if (env === 'test') {
    url = '//172.16.15.121:8200'
  } else if (env === 'pre') {
    url = '//merchant.pre.weierai.com:8200'
  } else if (env === 'production') {
    url = '//api.weierai.com'
  }
  return url
}

export const baseUrl = BASE_URL()
