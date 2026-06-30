import request from './request'

// 获取所有水果
export function getFruitList() {
  return request.get('/api/fruit/list')
}

// 根据ID获取水果
export function getFruitById(id) {
  return request.get(`/api/fruit/${id}`)
}

// 根据分类获取水果
export function getFruitsByCategory(category) {
  return request.get(`/api/fruit/category/${category}`)
}

// 添加水果
export function addFruit(data) {
  return request.post('/api/fruit/', data)
}

// 更新水果
export function updateFruit(id, data) {
  return request.put(`/api/fruit/${id}`, data)
}

// 删除水果
export function deleteFruit(id) {
  return request.delete(`/api/fruit/${id}`)
}
