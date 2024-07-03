<template>
  <div>
    <header>
      <h1>文件</h1>
      <button @click="navigateTo('/files')">查看所有文件</button>
    </header>
    <div>
      <input type="file" @change="uploadFile" />
      <div>
        <button @click="deleteFile">删除</button>
        <button @click="downloadFile">下载</button>
      </div>
      <div>
        <p>{{ fileName }}</p>
        <p>{{ fileTime }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFileStore } from '@/stores/file'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const fileStore = useFileStore()
const fileName = ref(fileStore.fileName)
const router = useRouter()

fileStore.fetchLatestFile()

const uploadFile = (event) => {
  const file = event.target.files[0]
  if (file) {
    fileStore.uploadFile(file)
  }
}

const deleteFile = async () => {
  await fileStore.deleteFile()
}

const downloadFile = async () => {
  await fileStore.downloadFile()
}

const navigateTo = (path) => {
  router.push(path)
}
</script>
