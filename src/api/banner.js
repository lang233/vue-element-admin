import request from '@/utils/request'

export function edit(data) {
  return request({
    url: '/banner/edit',
    method: 'post',
    data
  })
}

export function fetchList(query) {
  return request({
    url: '/banner/index',
    method: 'get',
    params: query
  })
}
