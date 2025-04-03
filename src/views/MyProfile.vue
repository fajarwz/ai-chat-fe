<template>
  <AuthLayout>
    <div class="container mx-auto mt-4">
      <div class="p-6 bg-white shadow-md rounded-lg">
        <h1 class="text-2xl font-bold mb-4">My Profile</h1>

        <Form @submit="onSubmit" :validation-schema="schema">
          <div class="mb-4 w-96">
            <label class="block">Email</label>
            <Field name="email" v-model="form.email" class="w-full p-2 border rounded disabled:bg-gray-100" disabled />
          </div>

          <div class="mb-4 w-96">
            <label class="block">Name</label>
            <Field name="name" v-model="form.name" class="w-full p-2 border rounded" />
            <ErrorMessage name="name" class="text-red-500 text-sm" />
            <p v-if="serverErrors.name" class="text-red-500 text-sm">{{ serverErrors.name.join(' ') }}</p>
          </div>

          <div class="w-96 flex flex-col gap-3">
            <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded cursor-pointer disabled:bg-gray-500" :disabled="loading">
              <span v-if="loading">Please wait...</span>
              <span v-else>Save Changes</span>
            </button>
            <button type="button" @click="router.go(-1)" class="w-full border-blue-500 py-2 rounded cursor-pointer" :disabled="loading">
              <span>Cancel</span>
            </button>
          </div>
        </Form>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import AuthLayout from "@/layouts/AuthLayout.vue";
import { onMounted, ref } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useRouter } from 'vue-router';
import config from '@/config';
import * as yup from 'yup';

const router = useRouter();
const serverErrors = ref({});
const loading = ref(false);

const form = ref({
  name: '',
  email: '',
});

const fetchUserData = async () => {
  try {
    const response = await fetch(`${config.api.baseUrl}/user/profile`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const json = await response.json();
    if (response.ok) {
      form.value = {
        email: json.data.email,
        name: json.data.name,
      }
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

onMounted(fetchUserData);

const schema = yup.object({
  name: yup.string().label('Name').required(),
});

const onSubmit = async (values) => {
  loading.value = true;
  serverErrors.value = {};

  try {
    const response = await fetch(`${config.api.baseUrl}/user/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Profile updated successfully!');
      router.push('/my-profile');
    } else {
      serverErrors.value = {
        ...data.errors,
        message: data.message,
      };
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

</script>
