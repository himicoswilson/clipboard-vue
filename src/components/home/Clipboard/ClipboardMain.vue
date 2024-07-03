<template>
  <div class="clipboard-container">
    <header class="header">
      <h1 class="title">Clip</h1>
      <div class="button-group">
        <button>
          <font-awesome-icon
            class="save icon"
            :icon="[isSaveClicked ? 'fas' : 'far', 'floppy-disk']"
            @click="saveClipboard"
          />
        </button>
        <button>
          <font-awesome-icon class="new icon" :icon="['fas', 'plus']" @click="createNewClipboard" />
        </button>
      </div>
    </header>
    <div class="content">
      <div class="input-container">
        <textarea
          class="input"
          ref="textarea"
          v-model="currentClip.content"
          @input="autoResize"
        ></textarea>
        <font-awesome-icon
          class="copy"
          :icon="[isCopyClicked ? 'fas' : 'far', 'clone']"
          @click="copyToClipboard"
        />
      </div>
      <div class="info">
        <p class="info-text">{{ title }}</p>
        <p class="info-text">{{ formatDate(currentClip.createdAt) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useClipboardStore } from '@/stores/clipboard'
import autolog from 'autolog.js'

const clipboardStore = useClipboardStore()
const currentClip = ref([])
const title = ref()
const textarea = ref(null)

const isCopyClicked = ref(false)
const isSaveClicked = ref(false)

onMounted(() => {
  createNewClipboard()
  nextTick(() => {
    textarea.value.style.height = `${textarea.value.scrollHeight}px`
  })
})

const autoResize = (event) => {
  const textareaElement = event.target
  textareaElement.style.height = 'auto'
  textareaElement.style.height = `${textareaElement.scrollHeight}px`
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(currentClip.value.content).then(() => {
    isCopyClicked.value = true
    autolog.log('copy successful', 'success', 2500)
  })
  setTimeout(() => {
    isCopyClicked.value = false
  }, 2000)
}
const createNewClipboard = () => {
  currentClip.value = []
  title.value = 'new clipboard'
  currentClip.value.createdAt = new Date().toISOString().split('Z')[0]
}

const saveClipboard = async () => {
  await clipboardStore
    .saveClipboard(currentClip.value.content, currentClip.value.createdAt)
    .then(() => {
      isSaveClicked.value = true
      createNewClipboard()
      autolog.log('save successful', 'success', 2500)
    })
  setTimeout(() => {
    isSaveClicked.value = false
  }, 1000)
}

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  const offset = 8 * 60
  const localDate = new Date(date.getTime() + offset * 60 * 1000)
  const year = localDate.getFullYear()
  const month = (localDate.getMonth() + 1).toString().padStart(2, '0')
  const day = localDate.getDate().toString().padStart(2, '0')
  const hours = localDate.getHours().toString().padStart(2, '0')
  const minutes = localDate.getMinutes().toString().padStart(2, '0')

  return `${year}.${month}.${day} ${hours}:${minutes}`
}
</script>
<style scoped>
.clipboard-container {
  width: 270px;
  min-height: 250px;
  padding: 20px;
  border-radius: 10px;
  background-color: var(--color-dark);
  border: 4px solid var(--color-white);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .title {
    font-size: 24px;
    margin: 0;
    cursor: pointer;
  }

  .button-group {
    padding-top: 3px;
  }

  button {
    width: 25px;
    height: 25px;
    padding: 0;
    margin: 0;
    margin-left: 6px;
    background: none;
    border: none;
  }

  .icon {
    padding: 6px;
    border-radius: 8px;
    transition: 0.2s;

    color: var(--color-dark);
    background-color: var(--color-white);
  }

  .icon:hover {
    background-color: #d7d8d8;
  }

  .icon:active {
    background-color: #eef1f1;
  }
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;

  .copy {
    position: absolute;
    right: 7px;
    top: 3px;
    padding: 5px;
    cursor: pointer;
    border-radius: 5px;
    transition: 0.2s;
    color: var(--color-dark);
  }

  .copy:hover {
    background-color: #d7d8d8a2;
  }

  textarea {
    width: 100%;
    min-height: 100px;
    resize: none;
    padding: 8px;
    padding-right: 30px;
    font-size: 14px;
    border-radius: 10px;
    border: none;
    overflow: hidden;
  }
  textarea:focus {
    outline: none;
    box-shadow: 0 0 5px var(--color-white);
  }
}

.content {
  display: flex;
  flex-direction: column;

  .info {
    margin-top: 20px;
  }

  .info-text {
    margin: 0;
    font-size: 14px;
    color: var(--color-white);
  }
}
</style>
