<template>
  <div class="details" v-for="(clipboard, index) in clipboardStore.clipboards" :key="clipboard.id">
    <details @toggle="(event) => handleToggle(event, index)">
      <summary class="summary">
        <h2 class="title">{{ clipboard.title }}</h2>
        <div class="button-group">
          <button>
            <font-awesome-icon
              class="del icon"
              :icon="['far', 'trash-can']"
              @click="deleteClipboard(clipboard.id)"
            />
          </button>
          <button v-if="clipboard.open">
            <font-awesome-icon
              class="save icon"
              :icon="[clipboard.isSaveClicked ? 'fas' : 'far', 'floppy-disk']"
              @click="saveClipboard(clipboard.id, clipboard.content, index)"
            />
          </button>
          <button v-if="!clipboard.open">
            <font-awesome-icon
              class="icon"
              :icon="[clipboard.isCopyClicked ? 'fas' : 'far', 'clone']"
              @click="copyToClipboard(clipboard.content, index)"
            />
          </button>
        </div>
      </summary>
    </details>
    <div :ref="(el) => (detailsContent[index] = el)" class="details-content">
      <div class="input-container">
        <textarea
          v-model="clipboard.content"
          @input="(event) => autoResize(event, index)"
        ></textarea>
        <font-awesome-icon
          class="copy"
          :icon="[clipboard.isCopyClicked ? 'fas' : 'far', 'clone']"
          @click="copyToClipboard(clipboard.content, index)"
        />
      </div>
      <div class="info">
        <p class="info-text">{{ formatDate(clipboard.createdAt) }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useClipboardStore } from '@/stores/clipboard'
import autolog from 'autolog.js'

const clipboardStore = useClipboardStore()
const detailsContent = ref([])

onMounted(async () => {
  await clipboardStore.fetchAllClipboards()
  clipboardStore.clipboards.forEach((clipboard, index) => {
    clipboard.open = false
    clipboard.isCopyClicked = false
    clipboard.isSaveClicked = false
    nextTick(() => {
      const textarea = detailsContent.value[index]?.querySelector('textarea')
      if (textarea) {
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    })
  })
})

const autoResize = (event, index) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
  updateMaxHeight(index)
}

const handleToggle = (event, index) => {
  clipboardStore.clipboards[index].open = event.target.open
  if (event.target.open) {
    nextTick(() => {
      updateMaxHeight(index)
    })
  } else {
    detailsContent.value[index].style.maxHeight = '0'
  }
}

const updateMaxHeight = (index) => {
  const contentHeight = detailsContent.value[index]?.scrollHeight
  detailsContent.value[index].style.maxHeight = `${contentHeight}px`
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

const copyToClipboard = (content, index) => {
  navigator.clipboard.writeText(content).then(() => {
    clipboardStore.clipboards[index].isCopyClicked = true
    autolog.log('copy successful', 'success', 2500)
  })
  setTimeout(() => {
    clipboardStore.clipboards[index].isCopyClicked = false
  }, 2000)
}

const saveClipboard = async (id, content, index) => {
  await clipboardStore.updateClipboard(id, content).then(() => {
    clipboardStore.clipboards[index].isSaveClicked = true
    autolog.log('save successful', 'success', 2500)
  })
  setTimeout(() => {
    clipboardStore.clipboards[index].isSaveClicked = false
  }, 1000)
}

const deleteClipboard = async (id) => {
  await clipboardStore
    .deleteClipboard(id)
    .then(() => {
      autolog.log('delete successful', 'success', 2500)
    })
    .catch(async () => {
      autolog.log('delete failure', 'success', 2500)
    })
}
</script>
<style scoped>
.details {
  width: 270px;
  border: 4px solid var(--color-white);
  border-radius: 10px;
  margin-top: 10px;
  overflow: hidden;
  .summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    top: -1px;
    padding: 20px;
    cursor: pointer;
    background-color: var(--color-dark);
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .summary::marker {
    content: '';
  }
  .details-content {
    padding: 10px 20px;
    background-color: var(--color-dark);
    overflow: hidden;
    margin-top: -22px;
    position: relative;
    top: 12px;
    transition: max-height 0.25s ease-in-out;
  }

  details + .details-content {
    max-height: 0;
    transition: max-height 0.25s ease-in-out;
    overflow: hidden;
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

.button-group {
  padding-top: 3px;
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

.info {
  .info-text {
    margin: 25px 0;
    font-size: 14px;
    color: var(--color-white);
  }
}
</style>
