import request from './request'

// 获取所有订单
export function getOrderList() {
  return request.get('/api/order/list')
}

// 根据ID获取订单
export function getOrderById(id) {
  return request.get(`/api/order/${id}`)
}

// 根据订单编号获取订单
export function getOrderByNo(orderNo) {
  return request.get(`/api/order/no/${orderNo}`)
}

// 根据顾客ID获取订单
export function getOrdersByCustomerId(customerId) {
  return request.get(`/api/order/customer/${customerId}`)
}

// 根据状态获取订单
export function getOrdersByStatus(status) {
  return request.get(`/api/order/status/${status}`)
}

// 获取订单明细
export function getOrderItems(orderId) {
  return request.get(`/api/order/${orderId}/items`)
}

// 创建订单
export function createOrder(data) {
  return request.post('/api/order/', data)
}

// 更新订单状态
export function updateOrderStatus(orderId, status) {
  return request.put(`/api/order/${orderId}`, { status })
}

// 删除订单
export function deleteOrder(orderId) {
  return request.delete(`/api/order/${orderId}`)
}
