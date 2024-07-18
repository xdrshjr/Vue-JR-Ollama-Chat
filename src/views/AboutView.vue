<template>
  <div class="common-layout">
    <el-container>
      <!--        <el-aside width="20px">Aside</el-aside>-->
      <el-main>
        <div class="chat-container">
          <div class="result-box" ref="resultBox">
            <div v-for="(message, index) in messages" :key="index" class="message" v-html="message">
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
import {ref, nextTick, onMounted} from 'vue';
import { marked } from 'marked';

const messages = ref<any[]>(['你好，我是AI聊天助手.']);
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
      mode: 'cors', // 添加这一行
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

      // 处理content中的多个JSON对象
      const jsonObjects = content.split('\n').filter(str => str.trim() !== '');
      for (const jsonObject of jsonObjects) {
        try {
          const responseJson = JSON.parse(jsonObject);
          if (responseJson.message.role === 'assistant') {
            partialMessage += responseJson.message.content;
            messages.value[messages.value.length - 1] = <string>marked(partialMessage); // 更新最后一条消息并解析 Markdown
            await nextTick(scrollToBottom);
          }
        } catch (e) {
          // 如果解析失败，继续读取更多数据
          continue;
        }
      }
      // 清空已处理的部分
      content = '';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const sendMessage = async () => {
  if (newMessage.value.trim()) {
    const userMessage = newMessage.value.trim();
    messages.value.push(marked(userMessage)); // 添加用户消息并解析 Markdown
    newMessage.value = '';
    await nextTick(scrollToBottom);
    messages.value.push(''); // 插入一个空字符串占位，用于逐字更新的机器人回复
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
  width: 60vw;
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

.message {
  margin-bottom: 5px;
  padding: 10px;
  background-color: #f6f5f5;
  border-radius: 4px;
  border: 1px solid #97989a;
  color: #4c4c4c;
  word-wrap: break-word; /* 添加这一行 */
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
    width: 70vw;
    margin: 0 auto;
  }

  .result-box {
    height: 70vh;
  }

  .chat-input {
    height: 30vh;
  }
}
</style>