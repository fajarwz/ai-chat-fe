<template>
  <AuthLayout>
    <div class="px-4 h-full">
      <div class="container mx-auto flex flex-col flex-1 h-full">
        <!-- Chat content -->
        <div class="flex-1 overflow-y-auto space-y-4" ref="chatBox">
          <div v-for="(msg, index) in messages" :key="index" class="flex flex-col pt-2">
            <div :class="msg.role === 'user' ? 'text-right' : 'text-left'">
              <div
                class="px-4 py-2 rounded max-w-[75%]"
                :class="msg.role === 'user' ? 'ml-auto bg-blue-500 text-white' : 'bg-white border text-black'"
              >
                <div v-if="msg.status === 'thinking'">💡 AI is thinking...</div>
                <div v-else-if="msg.status === 'generating'">
                  <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                    <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>
                <div 
                  class="markdown-body"
                  :class="msg.role === 'user' ? 'bg-blue-500 !text-white' : 'bg-white text-black'"
                  v-html="markedContent(msg.content)"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input box -->
        <div class="py-4 mt-4 flex">
          <textarea v-model="input" rows="2" class="flex-1 border rounded p-2 focus:outline-none" placeholder="Type your question, press Enter to send" @keydown.enter.exact.prevent="sendMessage" />
          <button @click="sendMessage" class="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">Send</button>
        </div>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import AuthLayout from "@/layouts/AuthLayout.vue";
import { ref, nextTick, onMounted } from 'vue';
import { marked } from 'marked';
import config from "@/config";

const messages = ref([]);
const input = ref('');
const chatBox = ref(null);

const fetchChatHistory = async () => {
  try {
    const response = await fetch(`${config.api.baseUrl}/chat/history`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const json = await response.json();
    messages.value = json.data;
    await nextTick(scrollToBottom);
  } catch (error) {
    console.error('Failed to load chat history:', error);
  }
};

onMounted(fetchChatHistory);

const sendMessage = async () => {
  if (!input.value.trim()) return;

  // Add user message
  const userMsg = { role: 'user', content: input.value, status: 'complete' };
  messages.value.push(userMsg);

  // AI placeholder
  const aiMsg = { role: 'assistant', content: '', status: 'thinking' };
  messages.value.push(aiMsg);

  input.value = '';

  await nextTick(scrollToBottom);
  
  try {
    const response = await fetch(`${config.api.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ message: userMsg.content }),
    });

    aiMsg.status = 'generating';
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      aiMsg.content += decoder.decode(value, { stream: true });

      messages.value = [...messages.value];
      await nextTick(scrollToBottom);
    }

    aiMsg.status = 'complete';

    messages.value = [...messages.value];
  } catch (e) {
    console.err(e);
    aiMsg.content = '⚠️ AI service unavailable';
    aiMsg.status = 'error';
  }

  await nextTick(scrollToBottom);
};

const scrollToBottom = () => {
  nextTick(() => {
    const el = chatBox.value;
    if (el) el.scrollTop = el.scrollHeight;
  });
};

const markedContent = (text) => marked.parse(text || '', { breaks: true });
</script>
