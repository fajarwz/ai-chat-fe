<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="w-96 p-6 bg-white shadow-md rounded-lg">
      <h1 class="text-2xl font-bold text-center mb-4">Login</h1>
      
      <Form @submit="onSubmit" :validation-schema="schema">
        <p v-if="serverErrors.message" class="text-white bg-red-500 text-sm p-4 rounded mb-2">{{ serverErrors.message }}</p>
        <div class="mb-4">
          <label class="block">Email</label>
          <Field name="email" class="w-full p-2 border rounded" />
          <ErrorMessage name="email" class="text-red-500 text-sm" />
          <p v-if="serverErrors.email" class="text-red-500 text-sm">{{ serverErrors.email.join(" ") }}</p>
        </div>

        <div class="mb-4">
          <label class="block">Password</label>
          <Field name="password" type="password" class="w-full p-2 border rounded" />
          <ErrorMessage name="password" class="text-red-500 text-sm" />
          <p v-if="serverErrors.password" class="text-red-500 text-sm">{{ serverErrors.password.join(" ") }}</p>
        </div>

        <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded cursor-pointer disabled:bg-gray-500" :disabled="loading">
          <span v-if="loading">Please wait...</span>
          <span v-else>Login</span>
        </button>
      </Form>

      <div class="mt-4 text-center">
        Don't have an account? <a href="/register" class="underline">Register</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import config from "@/config";
import { useRouter } from "vue-router";

const router = useRouter();

const serverErrors = ref({});
const loading = ref(false);

const schema = yup.object({
  email: yup.string().label("Email").email().required(),
  password: yup.string().label("Password").required(),
});

const onSubmit = async (values) => {
  serverErrors.value = {};
  loading.value = true;

  try {
    const response = await fetch(`${config.api.baseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      router.push("/chat");
    }
    else {
      serverErrors.value = { 
        ...data.errors, 
        message: data.message 
      };
    }
  } catch (error) {
    console.err(error);
  } finally {
    loading.value = false;
  }
};
</script>
