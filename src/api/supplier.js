import request from './request'

// 获取所有供应商
export function getSupplierList() {
  return request.get('/api/supplier/list')
}

// 根据ID获取供应商
export function getSupplierById(id) {
  return request.get(`/api/supplier/${id}`)
}

// 添加供应商
export function addSupplier(data) {
  return request.post('/api/supplier/', data)
}

// 更新供应商
export function updateSupplier(id, data) {
  return request.put(`/api/supplier/${id}`, data)
}

// 删除供应商
export function deleteSupplier(id) {
  return request.delete(`/api/supplier/${id}`)
}
