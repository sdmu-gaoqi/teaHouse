export const adminPerm = '*:*:*'
export const discounts = Array.from({ length: 50 }).map((item, index) => {
  const v = 100 - (index + 1)
  const l = v % 10 ? v : String(v)?.slice(0, 1)
  return {
    label: `${l}折`,
    value: v / 100
  }
})

export const isLocal = location.origin.includes('localhost')
export const ossOrigin = isLocal
  ? 'http://111.229.138.125:8080'
  : `${location.origin}:8080`
