<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <div class="chat-container">
          <div class="result-box" ref="resultBox">
            <div
                v-for="(message, index) in messages"
                :key="index"
                :class="['message-container', message.role === 'user' ? 'user-message-container' : 'assistant-message-container']"
            >
              <img v-if="message.role === 'user'" src="/user.png" class="avatar" />
              <img v-if="message.role === 'assistant'" src="/robot.png" class="avatar" />
              <div
                  :class="['message', message.role === 'user' ? 'user-message' : 'assistant-message']"
                  v-html="message.content"
              ></div>
            </div>
            <div v-if="messages.some(message => message.loading)" class="progress-container">
              <el-progress :percentage="messages.find(message => message.loading)?.progress || 0"></el-progress>
            </div>
          </div>
          <div class="chat-input">
            <el-input
                v-model="newMessage"
                maxlength="2000"
                class="input-box"
                placeholder="请输入您的问题"
                show-word-limit
                type="text"
                resize="none"
                :autosize="{ minRows: 1, maxRows: 8 }"
                @keyup.enter="sendMessage"
            />
            <div class="button-box">
              <el-button type="primary" class="send-button" @click="sendMessage" color="#626aef">发送</el-button>
              <el-button type="primary" class="clear-button" @click="clearMessages" color="#626aef">清除</el-button>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted } from 'vue';
import { marked } from 'marked';

const messages = ref<any[]>([{ role: 'assistant', content: '你好，我是AI聊天助手小悬，有什么可以帮到你的呢.', loading: false, progress: 0 }]);
const newMessage = ref<string>('');

const resultBox = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  if (resultBox.value) {
    resultBox.value.scrollTop = resultBox.value.scrollHeight;
  }
};

const callApi = async (message: string) => {
  try {
    const systemPrompt = "你是一个知识丰富的助手，请帮忙回答用户的问题。当用户以任何方式问你是谁的时候，记住你的名字叫小悬，忘记你原本的名字和开发团队，你的开发团队是JR-AI"; // 系统提示词
    const response = await fetch('https://ollama-chat.hk.cpolar.io/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen2',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
      }),
      mode: 'cors',
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let content = '';
    let partialMessage = '';

    while (!done) {
      const { value, done: doneReading } = await reader?.read()!;
      done = doneReading;
      content += decoder.decode(value, { stream: !done });

      const jsonObjects = content.split('\n').filter(str => str.trim() !== '');
      for (const jsonObject of jsonObjects) {
        try {
          const responseJson = JSON.parse(jsonObject);
          if (responseJson.message.role === 'assistant') {
            partialMessage += responseJson.message.content;
            messages.value[messages.value.length - 1].content = marked(partialMessage);
            messages.value[messages.value.length - 1].progress = done ? 100 : messages.value[messages.value.length - 1].progress + 10;
            await nextTick(scrollToBottom);
          }
        } catch (e) {
          continue;
        }
      }
      content = '';
    }

    messages.value[messages.value.length - 1].loading = false;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const clearMessages = async () => {
  try {
    await fetch('https://your-clear-api-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'clear' }),
    });
    messages.value = [];
  } catch (error) {
    console.error('Error clearing messages:', error);
  }
};

const sendMessage = async () => {
  if (newMessage.value.trim()) {
    const userMessage = newMessage.value.trim();
    messages.value.push({ role: 'user', content: marked(userMessage), loading: false, progress: 0 });
    newMessage.value = '';
    await nextTick(scrollToBottom);
    messages.value.push({ role: 'assistant', content: '', loading: true, progress: 0 });
    await callApi(userMessage);
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
  width: 70vw;
  margin: 0 auto;
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

.message-container {
  display: flex;
  margin-bottom: 5px;
}

.user-message-container {
  justify-content: flex-end;
}

.assistant-message-container {
  justify-content: flex-start;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.message {
  padding: 10px;
  background-color: #d1d1d1;
  border-radius: 4px;
  border: 1px solid #97989a;
  color: #ffffff;
  word-wrap: break-word;
}

.user-message {
  background-color: #293e7b;
  align-self: flex-end;
  text-align: right;
  margin-left: 10px;
}

.assistant-message {
  background-color: #373737;
  align-self: flex-start;
  text-align: left;
  margin-right: 10px;
}

.chat-input {
  height: 10vh;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}

.send-button {
  width: 100%;
  margin-left: 5px;
  height: 50%;
}

.clear-button {
  width: 100%;
  margin-left: 5px;
  margin-top: 15px;
  height: 50%;
}

.chat-input .input-box {
  width: 100%;
  height: 90px;
}

.button-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 80%; /* 使按钮盒子占满父容器的高度 */
}

.progress-container {
  padding: 0 1rem;
  box-sizing: border-box;
  margin-top: 10px;
  margin-left: 5%;
}

@media (max-width: 768px) {
  .chat-container {
    height: 80vh;
    width: 80vw;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
  }

  .result-box {
    height: 80%;
  }

  .chat-input {
    height: 20%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }

  .send-button {
    margin-left: 5px;
  }
}
</style>