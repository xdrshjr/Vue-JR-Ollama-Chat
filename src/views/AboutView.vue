<template>
  <div class="common-layout">
    <el-container>
      <!--        <el-aside width="20px">Aside</el-aside>-->
      <el-main>
        <div class="chat-container">
          <div class="result-box" ref="resultBox">
            <div v-for="(message, index) in messages" :key="index" class="message">
              {{ message }}
            </div>
          </div>
          <div class="chat-input">
            <el-input
                v-model="newMessage"
                maxlength="2000"
                class="input-box"
                placeholder="请输入您的问题"
                show-word-limit
                type="textarea"
                resize='none'
                :autosize="{ minRows: 8, maxRows: 8}"
            />
            <el-button type="primary" class="send-button" @click="sendMessage">Send</el-button>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted } from 'vue';

const messages = ref<string[]>(['你好，我是AI聊天助手.']);
const newMessage = ref<string>('');

const resultBox = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  if (resultBox.value) {
    resultBox.value.scrollTop = resultBox.value.scrollHeight;
  }
};

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push(newMessage.value.trim());
    newMessage.value = '';
    nextTick(scrollToBottom);
  }
};
onMounted(scrollToBottom);
</script>

<style scoped>
.common-layout {
  height: 100vh;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 60rem;
  gap: 10px;
  width: 60vw; /* 添加这一行 */
  margin: 0 auto; /* 添加这一行，使其居中 */
}

.result-box {
  height: 80rem;
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow-y: auto;
  background-color: #f6f5f5;
}

.message {
  margin-bottom: 5px;
  padding: 10px;
  background-color: #f6f5f5;
  border-radius: 4px;
  border: 1px solid #97989a;
  color: #4c4c4c;
}

.chat-input {
  position: relative;
  height: 30rem;
  padding: 1rem;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #f6f5f5;
}
.chat-input .input-box {
  width: 100%;
  margin-bottom: 1rem;
}

.chat-input .send-button {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
}

@media (max-width: 768px) {
  .chat-container {
    height: 70vh;
    width: 70vw; /* 添加这一行 */
    margin: 0 auto; /* 添加这一行，使其居中 */
  }

  .result-box {
    height: 70vh;
  }

  .chat-input {
    height: 30vh;
  }
}
</style>