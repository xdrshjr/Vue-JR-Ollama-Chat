<template>
  <div class="common-layout">
    <el-container>
        <el-header class="el-header-title">
          <div class="debate-person-box">
            <div style="width: 70px">模型选择</div>
            <el-select v-model="selectValue" placeholder="Select" style="width: 150px; margin-left: 10px">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
            <div style="width: 70px; margin-left: 10px">回合数</div>
            <el-input v-model="round_num" style="margin-left:0px;width: 150px" placeholder="蔡徐坤" />
          </div>
          <div class="debate-person-box">
            <div style="width: 70px">辩手1</div>
            <el-input v-model="input1" style="margin-left:10px;width: 150px" placeholder="蔡徐坤" />
            <el-input v-model="input1_profile" style="margin-left:10px; width: 220px" placeholder="知名歌手" />
          </div>
          <div class="debate-person-box-2">
            <div style="width: 70px">辩手2</div>
            <el-input v-model="input2" style="margin-left:10px;width: 150px" placeholder="丁真" />
            <el-input v-model="input2_profile" style="margin-left:10px; width: 220px" placeholder="知名艺人" />
          </div>
        </el-header>
        <el-main class="el-main-class">
          <div class="chat-container">
            <div class="result-box" ref="resultBox">
              <div
                  v-for="(message, index) in messages"
                  :key="index"
                  :class="[
                  'message-container',
                  message.role === 'user' ? 'user-message-container' : 'assistant-message-container'
                ]"
              >
                <img v-if="message.role === 'user'" src="/user.png" class="avatar" />
                <img v-if="message.role === 'assistant'" src="/robot.png" class="avatar" />
                <img v-if="message.role === 'debate'" src="/作家.png" class="avatar" />
                <img v-if="message.role === 'anti_debate'" src="/经理.png" class="avatar" />
                <div
                    :class="['message', message.role === 'user' ? 'user-message' : 'assistant-message']"
                    v-html="message.content"
                ></div>
              </div>
              <div v-if="loading" class="loading-container">
                <el-icon><Loading /></el-icon>
                <div class="loading-text">Agent辩论中...大号模型需要较长时间...</div>
              </div>
              <div v-if="error" class="error-text">获取消息失败，请稍后重试。</div>
            </div>
            <div class="chat-input">
              <el-input
                  v-model="newMessage"
                  maxlength="2000"
                  class="input-box"
                  placeholder="Transformers如何改进?"
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
import { ElLoading, ElMessage } from 'element-plus';
import { Loading } from '@element-plus/icons-vue';

const messages = ref<any[]>([{ role: 'assistant', content: '你好，我是AI聊天助手小悬，我将为你组织一场辩论赛，请输入议题和辩手信息.', loading: false, progress: 0 }]);
let newMessage = ref<string>('');
const loading = ref<boolean>(false);
const error = ref<boolean>(false);
const selectValue = ref('Qwen-7b')
const round_num = ref<string>('4');

const options = [
  {
    value: 'Qwen-7b',
    label: 'Qwen-7b',
  },
  {
    value: 'Llama3.1-70b',
    label: 'Llama3.1-70b',
  }
]

const input1 = ref("蔡徐坤")
const input1_profile = ref("深度学习专家")
const input2 = ref("丁真")
const input2_profile = ref("大模型专家")

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
  loading.value = true;
  error.value = false;

  const systemPrompt = "你是一个知识丰富的助手，请帮忙回答用户的问题。当用户以任何方式问你是谁的时候，记住你的名字叫小悬。当别人没问你的时候不要回答你的名字，以下是问题："; // 系统提示词
  const req_messages = systemPrompt + message;

  try {
    const response = await fetch('https://debate-agent-jr.nas.cpolar.cn/start_debate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idea: req_messages,
        investment: 4,
        model_name: selectValue.value,
        n_round: parseInt(round_num.value),
        debator1_name: input1.value,
        debator1_profile: input1_profile.value,
        debator2_name: input2.value,
        debator2_profile: input2_profile.value,
      }),
    });

    if (!response.body) {
      throw new Error('ReadableStream not supported by the browser.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let assistantMessage = '';

    const processChunk = async () => {
      const { done, value } = await reader.read();
      if (done) {
        loading.value = false;
        return;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(Boolean);

      for (const line of lines) {
        // 去掉 'data: ' 前缀
        const jsonString = line.startsWith('data: ') ? line.slice(6) : line;

        try {
          const data = JSON.parse(jsonString);
          if (data.done) {
            loading.value = false;
            return;
          } else {
            if (messages.value[messages.value.length - 1].content === '等待消息中...') {
              messages.value.pop();
            }
            const newAssistantMessage = `[${data.name || '对不起，我无法获取到姓名。'}] [${data.profile || '对不起，我无法获取到描述。'}]: ${data.message || '对不起，我无法回答你的问题。'}`;
            if (data.name === input1.value) {
              messages.value.push({ role: 'debate', content: marked(newAssistantMessage), loading: false, progress: 0 });
            } else {
              messages.value.push({ role: 'anti_debate', content: marked(newAssistantMessage), loading: false, progress: 0 });
            }
            await nextTick(scrollToBottom);
          }
        } catch (error) {
          console.error('JSON 解析错误:', error);
        }
      }

      setTimeout(processChunk, 2000); // 每2秒处理一次
    };

    processChunk();

  } catch (error) {
    console.error('Error fetching data:', error);
    loading.value = false;
    error.value = true;
  }
};

const clearMessages = async () => {
  try {
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
    messages.value.push({ role: 'assistant', content: '等待消息中...', loading: true, progress: 0 });
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
.debate-person-box {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.debate-person-box-2 {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.loading-text {
  font-size: 16px;
  margin-left: 10px;
}

.error-text {
  color: red;
  font-size: 16px;
  text-align: center;
  margin-top: 20px;
}

.el-main-class {
  padding: 0 0 0 0;
  margin-top: 8%;
}

.el-header-title {
  position: fixed;
  width: 100%;
  height: 120px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

.common-layout {
  margin-top: 20px;
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
  margin-bottom: 50px;
  margin-top: 50px;
}

.message-container {
  display: flex;
  margin-bottom: 5px;
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
  .message-container {
    display: flex;
    margin-bottom: 15px;
  }

  .el-main-class {
    padding: 0;
    margin-top: 35%;
  }

  .el-header-title {
    position: fixed;
    width: 100%;
    height: 80px;
    background: #343537;
  }

  .common-layout {
    margin-top: 0px;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
  }

  .chat-container {
    height: calc(80vh - 55px);
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