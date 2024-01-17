import { ProjectTypeItem } from '@/types'
import { Storage, isEmpty } from 'wa-utils'
const storage = new Storage('local')

export const isLogin = () => {
  return !isEmpty(storage.baseGet('Admin-Token'))
}

export const logout = () => {
  storage.remove('Admin-Token')
}

export const getToken = () => {
  const token = storage.baseGet('Admin-Token')
  return token
}

export function getParameterByName(name = '', byHash = false) {
  // @ts-nocheck
  // eslint-disable-next-line no-param-reassign
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
  const regex = new RegExp(`[\\?&]${name}=([^&#]*)`)
  let results = regex.exec(location[byHash ? 'hash' : 'search'])
  // eslint-disable-next-line eqeqeq
  return results == null ? '' : decodeURIComponent(results[1])
}

export const numberRule = {
  validator: (rule: any, value: any, callback: any) => {
    if (isEmpty(value)) {
      return Promise.resolve()
    } else {
      const n = String(value)?.split('.')[1]
      if (n.length > 2) {
        return Promise.reject('小数位不能超过两位')
      }
      return Promise.resolve()
    }
  }
}
export function formatMoney(value: any) {
  if (!value) {
    return '0'
  }
  // 将参数转换为浮点数
  let floatValue = parseFloat(value || 0)

  // 检查是否是有效的数值
  if (isNaN(floatValue)) {
    return 'Invalid value'
  }

  // 使用toFixed()方法将浮点数转换为字符串，并指定小数位数为2
  let formattedValue = floatValue.toFixed(2)

  // 返回格式化后的字符串
  return formattedValue
}

export const moneyRule = ({
  min = 0,
  precision = 2
}: {
  min?: number
  precision?: number
}) => {
  return (rule: any, value: any, callback: any) => {
    if (isEmpty(value)) {
      return Promise.resolve()
    } else if (isNaN(value)) {
      return Promise.reject('请输入正确的数字')
    } else if (Number(value) < min) {
      return Promise.reject(`不能小于${min}`)
    } else {
      const n = String(value)?.split('.')[1]
      if (n?.length > precision) {
        return Promise.reject(`小数位不能超过${precision}位`)
      }
      return Promise.resolve()
    }
  }
}

export const transformProjectTypeTree = (
  data: ProjectTypeItem[],
  memoMain = true
) => {
  const main = [
    {
      categoryName: '价目表分类',
      categoryId: 0,
      level: -1,
      categoryItems: data
    }
  ] as ProjectTypeItem[]
  return memoMain ? main : data
}
