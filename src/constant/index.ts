export const adminPerm = '*:*:*'
export const discounts = Array.from({ length: 50 }).map((item, index) => {
  const v = 100 - (index + 1)
  return {
    label: `${String(+v / 10)}折`,
    value: v / 100
  }
})

export const isLocal = location.origin.includes('localhost')
export const ossOrigin = isLocal
  ? 'http://111.229.138.125:8080'
  : `${location.origin}:8080`
