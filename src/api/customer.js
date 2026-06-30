import request from './request'

// 获取所有顾客
export function getCustomerList() {
  return request.get('/api/customer/list')
}

// 根据ID获取顾客
export function getCustomerById(id) {
  return request.get(`/api/customer/${id}`)
}

// 根据手机号获取顾客
export function getCustomerByPhone(phone) {
  return request.get(`/api/customer/phone/${phone}`)
}

// 添加顾客
export function addCustomer(data) {
  return request.post('/api/customer/', data)
}

// 更新顾客
export function updateCustomer(id, data) {
  return request.put(`/api/customer/${id}`, data)
}

// 删除顾客
export function deleteCustomer(id) {
  return request.delete(`/api/customer/${id}`)
}
