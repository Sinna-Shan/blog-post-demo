<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { useToast } from 'vue-toastification'
const toast = useToast()

const email = ref('')
const password = ref('')
const emailNotEmpty = ref(true)
const passwordNotEmpty = ref(true)
const handleSubmit = async () => {
  try {
    if (email.value.trim() === '') return (emailNotEmpty.value = false)
    if (password.value.trim() === '') return (passwordNotEmpty.value = false)

    const res = await fetch('http://localhost:8000/api/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })

    if (res.status == 200) {
      const data = await res.json()
      localStorage.setItem('token', data.token)
      router.push('/posts')
      toast.success('Login successful!')
    } else {
      const data = await res.json()
      toast.error(data.message)
    }

    email.value = ''
    password.value = ''
    emailNotEmpty.value = true
    passwordNotEmpty.value = true
  } catch (err) {
    console.error('Error submitting form', err.message)
  }
}
</script>

<template>
  <main class="w-screen h-screen bg-sky-500 flex items-center justify-center">
    <div class="bg-white rounded-md p-6 flex flex-col gap-y-2">
      <h1 class="text-3xl mb-6 text-center">Welcome to writer</h1>
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-2">
        <label for="email" class="text-base text-slate-500"> email</label>
        <input
          type="email"
          v-model="email"
          name="email"
          id="email"
          class="bg-gray-100 rounded-md h-10 pl-2"
        />
        <p class="text-red-600 text-sm" v-if="emailNotEmpty === false">*email is required.</p>

        <label for="password" class="text-base text-slate-500"> password</label>
        <input
          type="password"
          v-model="password"
          name="password"
          id="password"
          class="bg-gray-100 rounded-md h-10 pl-2"
        />
        <p class="text-red-600 text-sm" v-if="passwordNotEmpty === false">*password is required.</p>

        <button class="bg-green-400 text-white h-10 rounded-md mt-5" type="submit">Login</button>
      </form>
      <p class="text-gray-800 text-sm mt-2">don't have an account?</p>

      <RouterLink class="bg-blue-400 text-white h-10 rounded-md flex items-center justify-center" to="/signup">Sign up</RouterLink>
    </div>
  </main>
</template>
