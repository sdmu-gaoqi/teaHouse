// @ts-nocheck

import COS from 'cos-js-sdk-v5'

const useCors = () => {
  const Bucket = 'rxyy-1318831585' /* 存储桶，必须字段 */
  const Region = 'ap-shanghai'
  const cos = new COS({
    SecretId: 'AKIDQn3A9zg9tZCgy3yjLzRjsoaFl5DAxHPK',
    SecretKey: 'pTu881gCUeeT3RN8oOqAMPI6kGbkgQ6g'
  })

  return {
    cos,
    Bucket,
    Region
  }
}

export default useCors
