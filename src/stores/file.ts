import { defineStore } from 'pinia'
import http from '@/services/http'

export const useFileStore = defineStore('file', {
  state: () => ({
    fileName: '',
    fileTime: '',
    files: []
  }),
  actions: {
    async fetchLatestFile() {
      const response = await http.get('/api/file')
      this.fileName = response.data.fileName
      this.fileTime = response.data.createdAt
    },
    async uploadFile(file: File) {
      const formData = new FormData()
      formData.append('file', file)
      await http.post('/api/file/upload', formData)
      this.fetchLatestFile()
    },
    async deleteFile(id: number) {
      await http.delete(`/api/file/${id}`)
      this.fetchLatestFile()
    },
    async downloadFile(id: number) {
      const response = await http.get(`/api/file/download/${id}`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', this.fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
  }
})
