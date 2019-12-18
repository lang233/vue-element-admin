import { getTimestamp, encrypt, md5, base64_encode } from '@/utils/common'

// 得到签名
export function generateSign(data) {
  const common = {
    'app_key': 'kuaiwan_backend',
    'timestamp': getTimestamp(),
    'version': 100,
    'platform': 3
  }
  const sign = Object.assign(common, data)
  let signStr = ''
  Object.keys(sign).sort().forEach(function(key) {
    signStr += `&${key}=${sign[key]}`
  })
  signStr = signStr.substring(1)
  signStr = encrypt(md5(signStr))
  common['sign'] = signStr
  signStr = base64_encode(JSON.stringify(common))
  return signStr
}
