import CryptoJS from 'crypto-js'

const key = CryptoJS.enc.Utf8.parse('KwNT45x/sjZ9*jr3')
const iv = CryptoJS.enc.Utf8.parse('sYXRmb3JtIjoLCJj')

export function getTimestamp() {
  return Date.parse(new Date()) / 1000
}

export function md5(str) {
  return CryptoJS.MD5(str).toString()
}

export function base64_encode(str) {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str))
}

export function base64_decode(str) {
  return CryptoJS.enc.Base64.parse(str).toString(CryptoJS.enc.Utf8)
}

export function encrypt(word) {
  return CryptoJS.AES.encrypt(word, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
}

// aes解密
export function decrypt(word) {
  const decrypted = CryptoJS.AES.decrypt(word, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}
