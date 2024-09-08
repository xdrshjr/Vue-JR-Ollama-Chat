<template>
  <div class="common-layout">
    <el-container>
      <el-header class="options-header">
        <div style="margin-right: 10px">
          <p>{{ $t('model_switch') }}</p>
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
          <el-button type="primary" class="send-button-clear" @click="clearContext()" color="#626aef">
            <p>{{ $t('clear_context') }}</p>
          </el-button>
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
              <img v-if="message.role === 'user'" src="/user.png" class="avatar"/>
              <img v-if="message.role === 'assistant'" src="/robot.png" class="avatar"/>
              <div
                  :class="['message', message.role === 'user' ? 'user-message' : 'assistant-message']"
              >
                <span v-html="message.formattedContent"></span>
              </div>
              <el-button
                  v-if="message.role === 'assistant' && !message.loading"
                  @click="playAudio(message.formattedContent)"
                  circle
                  class="play-button"
                  style="margin-left: 2px;"
              >
                <el-icon>
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="24px"
                      height="24px"
                  >
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03zM14 3.23v2.06c3.39.49 6 3.39 6 6.71s-2.61 6.22-6 6.71v2.06c4.01-.52 7-3.92 7-8.77s-2.99-8.25-7-8.77z"/>
                  </svg>
                </el-icon>
              </el-button>
            </div>
          </div>
          <div class="chat-input">
            <el-input
                v-model="newMessage"
                maxlength="20000"
                class="input-box"
                placeholder="Please input your question."
                show-word-limit
                type="text"
                resize="none"
                :autosize="{ minRows: 1, maxRows: 8 }"
                @keyup.enter="handleEnter"
                @keydown.shift.enter.native.prevent="insertNewLine"
            />
            <div class="button-box">
              <el-button type="primary" class="send-button" @click="sendMessage" color="#626aef">
                {{ $t('send_button') }}
              </el-button>
              <el-button type="primary" class="clear-button" @click="clearMessages" color="#626aef">
                {{ $t('clear_button') }}
              </el-button>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.play-button {
  margin-left: 2px;
  margin-bottom: 5px;
  align-self: flex-end;
  transform: scale(0.6);
}

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
import {ref, nextTick, onMounted, watch} from 'vue';
import {marked} from 'marked';
import {API_URLS, MODEL_NAME, getModelInfo} from '@/assets/config';

const greeting_info = '你好，我是你的聊天助手，请问有什么可以帮助你的吗？'
const messages = ref<any[]>([{role: 'assistant', content: greeting_info, loading: false, progress: 0}]);
const newMessage = ref<string>('');

const resultBox = ref<HTMLElement | null>(null);

const value = ref('gemma2:27b') // Qwen-MAX

const options = [
  {
    value: 'Qwen-7b',
    label: 'Qwen-7b',
  },
  // {
  //   value: 'Qwen-MAX',
  //   label: 'Qwen-MAX',
  // },
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
    const systemPrompt = "你是一个知识丰富的助手，请帮忙回答用户的问题。当用户以任何方式问你是谁的时候，记住你的名字叫小悬，你的开发团队是JR-AI";
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
          {role: 'system', content: systemPrompt},
          ...filteredMessages.map(m => ({role: m.role, content: m.content}))
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
      const {value, done: doneReading} = await reader?.read()!;
      done = doneReading;
      content += decoder.decode(value, {stream: !done});

      const jsonObjects = content.split('\n').filter(str => str.trim() !== '');
      for (const jsonObject of jsonObjects) {
        try {
          const responseJson = JSON.parse(jsonObject);

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

    messages.value[messages.value.length - 1].loading = false; // Set loading to false when done
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
    messages.value.push({role: 'user', content: marked(userMessage), loading: false, progress: 0});
    newMessage.value = '';
    await nextTick(() => {
      formatMessageContent();
      scrollToBottom();
    });
    messages.value.push({role: 'assistant', content: '等待消息中...', loading: true, progress: 0});
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

const playAudio = async (content: string) => {
  console.log("Button pressed");
  let sanitizedContent = content.replace(/<[^>]*>/g, '');
  let qwenResponse = sanitizedContent.replace(/\n-/g, "，")
      .replace(/ - /g, '，')
      .replace(/--/g, '，')
      .replace(/---/g, '，')
      .replace(/\*/g, '，')
      .replace(/#/g, '，');
  const dingzhen_voice_text = '大家好我是丁真，很高兴作为奥运一夏，的活动发起官，为奥运助力一下。'
  const standard_voice_text = '该实验室致力于提供最优秀的性能体验。在核心性能、通信和AI这三个领域进行了深入研究，并通过百名工程师团队的共同合作，在底层进行技术合作。'
  const response = await fetch('https://cosyvoice-xdrshjr.nas.cpolar.cn/inference/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: qwenResponse,
      prompt_text: dingzhen_voice_text,
      prompt_speech: "audio_dingzhen_dingzhen_61.wav"
    })
  });

  const reader = response.body.getReader();
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const sampleRate = 22050;
  let bufferSize = sampleRate / 2; // Adjust buffer size as needed (0.5 seconds buffer)
  let audioBufferQueue = [];
  let source;
  let isPlaying = false;
  let leftover = new Uint8Array(0);

  function processBuffer() {
    if (isPlaying || !audioBufferQueue.length) return;
    console.log("processBuffer() enter");

    const tmpBufQueue = audioBufferQueue;
    audioBufferQueue = [];
    const totalLength = tmpBufQueue.reduce((acc, chunk) => acc + chunk.length, 0);
    console.log("total length: ", totalLength);
    const audioBuffer = audioContext.createBuffer(1, totalLength, sampleRate);
    const combinedArray = new Float32Array(totalLength);

    let offset = 0;
    while (tmpBufQueue.length) {
      const chunk = tmpBufQueue.shift();
      combinedArray.set(chunk, offset);
      offset += chunk.length;
    }

    audioBuffer.copyToChannel(combinedArray, 0);

    source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.onended = () => {
      isPlaying = false;
      if (audioBufferQueue.length > 0) {
        processBuffer();
      }
    };
    source.start();
    isPlaying = true;
  }

  while (true) {
    const {done, value} = await reader.read();
    if (done) break;

    // Combine leftover with new data
    const combinedValue = new Uint8Array(leftover.length + value.length);
    combinedValue.set(leftover);
    combinedValue.set(value, leftover.length);

    const byteLength = combinedValue.byteLength;
    const remainder = byteLength % 4;
    const validLength = byteLength - remainder;

    // Separate valid data and leftover
    const validData = combinedValue.slice(0, validLength);
    leftover = combinedValue.slice(validLength);

    const float32Array = new Float32Array(validData.buffer);
    audioBufferQueue.push(float32Array);

    // Process buffer if enough data is collected
    processBuffer();
  }
}

onMounted(() => {
  formatMessageContent();
  scrollToBottom();
});

// 监听消息内容的变化，确保每次变化后重新格式化内容
watch(messages, () => {
  nextTick(formatMessageContent);
}, {deep: true});
</script>