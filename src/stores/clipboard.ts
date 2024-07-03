import { defineStore } from 'pinia'
import http from '@/services/http'

interface Clipboard {
  id?: number
  title: string
  content: string
  createdAt: string
}

export const useClipboardStore = defineStore('clipboard', {
  state: (): { latest: Clipboard[]; clipboards: Clipboard[] } => ({
    latest: [],
    clipboards: []
  }),
  actions: {
    async fetchLatestClipboard() {
      const response = await http.get('/api/clipboard/latest')
      this.latest = {
        ...response.data[0],
        title: response.data[0].content.slice(0, 10) + '...'
      }
    },
    async saveClipboard(content: string, createdAt: string) {
      await http.post('/api/clipboard', { content, createdAt })
      this.fetchAllClipboards()
    },
    async fetchAllClipboards() {
      const response = await http.get('/api/clipboard')
      this.clipboards = response.data.map((clipboard: Clipboard) => ({
        ...clipboard,
        title: clipboard.content.slice(0, 10) + '...'
      }))
    },
    async updateClipboard(id: number, content: string) {
      const response = await http.put(`/api/clipboard/${id}`, {
        content: content
      })
      this.latest = response.data
      this.fetchAllClipboards()
    },
    async deleteClipboard(id: number) {
      await http.delete(`/api/clipboard/${id}`)
      this.fetchAllClipboards()
    }
  }
})
