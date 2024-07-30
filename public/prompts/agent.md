修改一下这个组件，我需要更换查询接口为https://metaagent.hk.cpolar.io/async_run，这个接口不是流式传输，直接去除content填充聊天结果。
入参格式样例：
{
"question": "蔡徐坤是谁?"
}
返回值格式样例：
{
"model": "qwen2",
"created_at": "2024-07-19 11:03:04",
"message": {
"role": "system",
"content": "蔡徐坤，1998年8月2日出生于浙江省温州市，户籍湖南省吉首市，是中国内地的男歌手、演员、原创音乐制作人以及MV导演。他在2012年开始步入大众视线，通过参演偶像剧《童话二分之一》而被人们所熟知。蔡徐坤于2018年参加竞演类综艺节目《偶像练习生》，以总票数第一的成绩正式出道，并成为限定男团NINE PERCENT的一员。"
},
"done": false
}
代码：
<template>
  <div class="common-layout">
    <el-container>
      <el-main class="el-main-class">
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
                @keyup.enter="handleEnter"
                @keydown.shift.enter.native.prevent="insertNewLine"
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

const handleEnter = (event: KeyboardEvent) => {
  if (!event.shiftKey) {
    sendMessage();
  }
};

const callApi = async (message: string) => {
  try {
    const systemPrompt = "你是一个知识丰富的助手，请帮忙回答用户的问题。当用户以任何方式问你是谁的时候，记住你的名字叫小悬，你的开发团队是JR-AI"; // 系统提示词
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

const insertNewLine = (event: KeyboardEvent) => {
  const textarea = event.target as HTMLTextAreaElement;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  newMessage.value = newMessage.value.substring(0, start) + '\n' + newMessage.value.substring(end);
  nextTick(() => {
    textarea.selectionStart = textarea.selectionEnd = start + 1;
  });
};

onMounted(scrollToBottom);
</script>

<style scoped>

</style>