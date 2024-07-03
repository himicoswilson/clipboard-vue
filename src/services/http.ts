import axios from 'axios'

const http = axios.create({
  baseURL: 'http://47.100.101.113:8080',
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加请求拦截器
http.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 比如可以在这里加上 token
    // config.headers.Authorization = `Bearer ${store.state.token}`;
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
http.interceptors.response.use(
  (response) => {
    // 对响应数据做些什么
    return response
  },
  (error) => {
    // 对响应错误做些什么
    return Promise.reject(error)
  }
)

export default http
