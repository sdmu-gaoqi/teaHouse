export const adminPerm = '*:*:*'
export const discounts = [
  {
    label: '6折',
    value: 0.6
  },
  {
    label: '6.5折',
    value: 0.65
  },
  {
    label: '7折',
    value: 0.7
  },
  {
    label: '7.5折',
    value: 0.75
  },
  {
    label: '8折',
    value: 0.8
  },
  {
    label: '8.5折',
    value: 0.85
  },
  {
    label: '9折',
    value: 0.9
  },
  {
    label: '9.5折',
    value: 0.95
  }
]

export const isLocal = location.origin.includes('localhost')
export const ossOrigin = isLocal
  ? 'http://111.229.138.125:8080'
  : `${locationData.origin}:8080`
