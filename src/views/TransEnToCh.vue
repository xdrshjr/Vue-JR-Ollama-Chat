<template>
  <div class="common-layout">
    <el-container>
      <el-header class="options-header">
        <div style="margin-right: 10px">
          <p>模型选择:</p>
        </div>
        <el-select v-model="value" placeholder="Select" style="width: 200px; margin-right: 10px">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <div class="button-box">
          <el-button type="primary" class="send-button-clear" @click="clearContext()" color="#626aef">清除上下文</el-button>
        </div>
      </el-header>
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
              >
                <span v-html="message.formattedContent"></span>
              </div>
            </div>
          </div>
          <div class="chat-input">
            <el-input
                v-model="newMessage"
                maxlength="20000"
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

<style scoped>
.el-main-class {
  padding: 0;
  margin-top: 80px; /* 根据实际高度调整 */
}

.options-header {
  display: flex;
  justify-content: flex-start; /* 确保内容居中 */
  align-items: center; /* 确保内容垂直居中 */
  position: fixed; /* 固定在页面顶部 */
  top: 60px; /* 固定在页面的顶部 */
  width: 100%; /* 占据全屏宽度 */
  z-index: 1000; /* 确保它在其他内容之上 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

.common-layout {
  height: 100vh;
  width: 80vw;
  display: flex;
  flex-direction: column;
  margin-left: 10rem;
}

.chat-container {
display: flex;
flex-direction: column;
height: calc(90vh - 8vh);
width: 100%;
margin: 0;
}

.result-box {
flex-grow: 1;
padding: 10px;
background-color: #393838;
overflow-y: auto;
overflow-x: auto;
}

.message-container {
display: flex;
margin-bottom: 5px;
align-items: flex-start; /* 确保消息在开始对齐 */
}

.user-message-container {
  justify-content: flex-start;
  flex-direction: row-reverse;
}

.assistant-message-container {
  justify-content: flex-start;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  margin-left: 10px;
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
  text-align: left;
  margin-left: 10px;
  max-width: 80%; /* 限制用户消息的最大宽度 */
  word-wrap: break-word;
}

.assistant-message {
  background-color: #373737;
  align-self: flex-start;
  text-align: left;
  margin-right: 10px;
  max-width: 83%; /* 限制助手消息的最大宽度 */
  word-wrap: break-word;
}

::v-deep .code-block {
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #97989a;
  overflow-x: auto;
  white-space: pre-wrap;
  margin: 5px 0 5px 0;
  font-family: 'Consolas', monospace;
}

.chat-input {
  position: fixed;
  bottom: 0;
  height: 5vh;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  background-color: #353535;
  padding: 10px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  left: 200px;
  right: 0;
}

.send-button {
  width: 100%;
  margin-left: 5px;
  height: 100%;
}

.clear-button {
  width: 100%;
  margin-left: 5px;
  height: 100%;
}

.chat-input .input-box {
  width: 100%;
  height: 100%;
}

.button-box {
  display: flex;
  justify-content: center;
  height: 100%;
  flex-wrap: nowrap;
  align-items: center;
  align-content: space-between;
  flex-direction: row;
}

.progress-container {
  padding: 0 1rem;
  box-sizing: border-box;
  margin-top: 10px;
  margin-left: 5%;
}

@media (max-width: 768px) {
  .send-button-clear {
    height: 50%;
  }

  .options-header {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .message-container {
    display: flex;
    margin-bottom: 15px;
  }

  .common-layout {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    margin-left: 0;
  }

  .chat-container {
    height: calc(80vh - 50px);
    width: 100%;
    overflow: hidden;
  }

  .result-box {
    height: 100%;
    background-color: #393838;
    margin-bottom: 50px;
  }

  .chat-input {
    height: 8vh;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 60px;
    left: 0;
  }

  .send-button {
    margin-left: 5px;
    height: 100%;
  }

  .clear-button {
    height: 100%;
  }

  .assistant-message {
    background-color: #373737;
    align-self: flex-start;
    text-align: left;
    margin-right: 10px;
    max-width: 80%;
  }
}
</style>

<script lang="ts" setup>
import { ref, nextTick, onMounted, watch } from 'vue';
import { marked } from 'marked';
import { API_URLS, MODEL_NAME, getModelInfo } from '@/assets/config';

const messages = ref<any[]>([{ role: 'assistant', content: '你好，我是一个专业的英文翻译中文的大师..', loading: false, progress: 0 }]);
const newMessage = ref<string>('');

const resultBox = ref<HTMLElement | null>(null);

const value = ref('gemma2:27b') // Qwen-MAX

const options = [
  {
    value: 'Qwen-7b',
    label: 'Qwen-7b',
  },
  {
    value: 'Qwen-MAX',
    label: 'Qwen-MAX',
  },
  {
    value: 'Llama3.1-70b',
    label: 'Llama3.1-70b',
  },
  {
    value: 'gemma2:27b',
    label: 'gemma2:27b',
  }
]

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

const callApi = async (message: string, model_url: string, model_name: string) => {
  try {
    const systemPrompt = "You are a professional Chinese translation master. Your native language is Chinese, and your translation style aligns with the standards of top academic conferences in computer science. Your translations are accurate, elegant, and consistent with native language habits. Please translate the user's content to Chinese. You should only return the translated content without any unrelated information.";
    const filteredMessages = messages.value.filter(m => !(m.role === 'assistant' && m.content === '等待消息中...'));
    const response = await fetch(model_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-8b00dcc0eabc477f8ccea0f640b3d8bb'
      },
      body: JSON.stringify({
        model: model_name,
        messages: [
          { role: 'system', content: systemPrompt },
          ...filteredMessages.map(m => ({ role: m.role, content: m.content }))
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

          // Check if the model is Qwen-MAX and parse accordingly
          if (model_name === MODEL_NAME.QWEN_MAX) {
            const choice = responseJson.choices[0];
            if (choice && choice.delta) {
              partialMessage += choice.delta.content || '';
              messages.value[messages.value.length - 1].content = marked(partialMessage);
              messages.value[messages.value.length - 1].progress = done ? 100 : messages.value[messages.value.length - 1].progress + 10;
              await nextTick(() => {
                formatMessageContent();
                scrollToBottom();
              });
            }
          } else {
            if (responseJson.message.role === 'assistant') {
              partialMessage += responseJson.message.content;
              messages.value[messages.value.length - 1].content = marked(partialMessage);
              messages.value[messages.value.length - 1].progress = done ? 100 : messages.value[messages.value.length - 1].progress + 10;
              await nextTick(() => {
                formatMessageContent();
                scrollToBottom();
              });
            }
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
  newMessage.value = ''
};

const escapeHtml = (unsafe: any) => {
  return unsafe.replace(/[&<"']/g, (match: any) => {
    switch (match) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#039;';
    }
  });
};

const clearContext = () => {
  messages.value = []
}

const sendMessage = async () => {
  if (newMessage.value.trim()) {
    const userMessage = escapeHtml(newMessage.value.trim());
    messages.value.push({ role: 'user', content: marked(userMessage), loading: false, progress: 0 });
    newMessage.value = '';
    await nextTick(() => {
      formatMessageContent();
      scrollToBottom();
    });
    messages.value.push({ role: 'assistant', content: '等待消息中...', loading: true, progress: 0 });
    let {model_url, model_name} = getModelInfo(value.value);
    await callApi(userMessage, model_url, model_name);
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

const isCodeBlock = (content: string) => {
  return content.includes('<pre><code');
};

const formatMessageContent = () => {
  messages.value.forEach(message => {
    if (isCodeBlock(message.content)) {
      message.formattedContent = message.content.replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g, (match, p1) => {
        return `<pre class="code-block"><code>${p1}</code></pre>`;
      });
    } else {
      message.formattedContent = message.content;
    }
  });
};

onMounted(() => {
  formatMessageContent();
  scrollToBottom();
});

// 监听消息内容的变化，确保每次变化后重新格式化内容
watch(messages, () => {
  nextTick(formatMessageContent);
}, { deep: true });
</script>