import { getToken, logout } from '@/utils'
import { message } from 'ant-design-vue'
import axios, { AxiosRequestConfig } from 'axios'
import { getParameterByName, Storage } from 'wa-utils'
import { ErrorCode } from './typing'

axios.defaults.withCredentials = true

const storage = new Storage('local')

const errInfos = {
  1000005: '此会员已到有效期，不支持订单结算'
}

message.config({
  maxCount: 1
})

const isProd =
  location.host.includes('mengxiangjia') ||
  location.search?.includes('isProd') ||
  getParameterByName('isProd')

const _request = axios.create({
  baseURL: isProd
    ? 'http://111.229.138.125:18080'
    : 'http://111.229.138.125:18080',
  timeout: 150000,
  withCredentials: true
})

class R {
  public commonData: any = {}
  constructor() {
    _request.interceptors.request.use((request) => {
      if (getToken()) {
        request.headers['Authorization'] = getToken()
      }
      if (request.data?.pageNum) {
        request.data.pageNo = request.data.pageNum
      }
      console.log(request, 'request')
      return request
    })

    _request.interceptors.response.use(
      // @ts-ignore
      // eslint-disable-next-line
      (res) => {
        let data: Record<string, any> = res.data
        if (data?.code === 0) {
          if (data?.list) {
            data.raws = data?.list
          }
          return Promise.resolve(data)
        } else {
          if (data?.code === ErrorCode.未登录) {
            logout()
          }
          return Promise.reject({
            ...data,
            msg: (errInfos as any)?.[data?.code] || data.msg
          })
        }
        //比如响应一些报错信息
        return Promise.resolve(data)
      },
      function (error) {
        message.error('网络错误, 请稍后再试~')
        return Promise.reject(error)
      }
    )
  }

  request = async <T>(data: AxiosRequestConfig<any>) => {
    const res = (await _request.request(data)) as T
    return res
  }

  upDateCommonData = (data: any) => {
    this.commonData = {
      ...this.commonData,
      ...data
    }
  }
}

const request = new R()

export default request
