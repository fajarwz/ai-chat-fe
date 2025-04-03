<template>
  <div class="flex flex-col h-screen">
    <header class="bg-blue-600 text-white p-4 flex-shrink-0">
      <div class="container mx-auto flex justify-between items-center h-full">
        <div class="flex gap-8 items-center">
          <router-link to="/">
            <h1 class="text-lg font-bold">AI Chat</h1>
          </router-link>
          <router-link to="/chat" active-class="border-b-2 h-full">
            <div>Chat</div>
          </router-link>
        </div>
        <div class="relative">
          <div class="flex gap-2 items-center cursor-pointer" @click="toggleDropdown">
            <div>Hi, {{ userName }}</div>
            <img src="@/assets/icons/chevron-down.svg" alt="Chevron Down" class="w-5 h-5 invert" />
          </div>

          <!-- Dropdown Menu -->
          <div v-if="dropdownOpen" class="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 py-2">
            <button @click="goToProfile" class="block w-full text-left px-4 py-2 text-gray-800 cursor-pointer hover:bg-gray-100">My Profile</button>
            <button @click="logout" class="block w-full text-left px-4 py-2 text-gray-800 cursor-pointer hover:bg-gray-100">Log Out</button>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 overflow-auto">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const router = useRouter();
const userName = ref("");
const dropdownOpen = ref(false);

onMounted(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.name) {
    userName.value = user.name;
  }
});

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const goToProfile = () => {
  router.push("/my-profile");
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");
};
</script>
