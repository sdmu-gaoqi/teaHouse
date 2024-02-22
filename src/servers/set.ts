import { Request } from 'wa-utils'

// const isProd = location?.origin?.includes('mengxiangjia.rixinyy.com')
const isProd = false

const request = new Request({
  baseUrl: isProd
    ? 'http://124.223.96.225:12001/'
    : 'http://111.229.138.125:12001/'
})

export const getVersionLogs = () => {
  return request.instence.request({
    url: '/static/storeUplog.json'
  })
}
