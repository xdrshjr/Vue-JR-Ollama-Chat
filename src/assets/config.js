export const API_URLS = {
    CHAT_API_4Card: 'https://ollama-chat.hk.cpolar.io/test/chat',
    CHAT_API_4Card_JDQQJR: 'https://llama31-chat-jr.nas.cpolar.cn/test/chat',
    CHAT_API_xdrshjr: 'http://ollama-qwen-xdrshjr.vip.cpolar.top/test/chat',
    CHAT_API_QWEN_MAX: 'https://qwen-max-chat.hk.cpolar.io/test/ask'
};

export const MODEL_NAME = {
    QWEN: 'qwen2',
    LLAMA31: 'llama3.1:8b',
    LLAMA31_70: 'llama3.1:70b',
    GEMMA2: 'gemma2:27b',
    QWEN_MAX: 'qwen-max'
};

export function getModelInfo(model_info) {
    let model_url = ''
    let model_name = ''
    if (model_info === 'Qwen-7b') {
        model_url = API_URLS.CHAT_API_4Card_JDQQJR
        model_name = MODEL_NAME.QWEN
    }
    if (model_info === 'Llama3.1-70b') {
        model_url = API_URLS.CHAT_API_4Card_JDQQJR
        model_name = MODEL_NAME.LLAMA31_70
    }
    if (model_info === 'gemma2:27b') {
        model_url = API_URLS.CHAT_API_4Card_JDQQJR
        model_name = MODEL_NAME.GEMMA2
    }
    if (model_info === 'Qwen-MAX') {
        model_url = API_URLS.CHAT_API_QWEN_MAX
        model_name = MODEL_NAME.QWEN_MAX
    }
    return {model_url, model_name};
}