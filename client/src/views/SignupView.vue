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

    const res = await fetch('http://localhost:8000/api/v1/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })

      const data = await res.json()
    if (res.status == 201) {
      localStorage.setItem('token', data.token)
      router.push('/posts')
      toast.success('Login successful!')
    } else {
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
  <main class="w-screen h-screen bg-stone-900 flex items-center justify-center">
    <div class="bg-neutral-800 border border-neutral-700 w-[30%] rounded-md p-6 flex flex-col gap-y-2">
      <h1 class="text-3xl mb-6 text-center text-neutral-400 font-mono uppercase font-bold">Sign up</h1>
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-2">
        <label for="email" class="text-base text-neutral-400"> email</label>
        <input
          type="email"
          v-model="email"
          name="email"
          id="email"
          class="bg-neutral-500 text-neutral-300 rounded-md h-10 pl-2"
        />
        <p class="text-yellow-700" v-if="emailNotEmpty === false">*email is required.</p>

        <label for="password" class="text-base text-neutral-400"> password</label>
        <input
          type="password"
          v-model="password"
          name="password"
          id="password"
          class="bg-neutral-500 text-neutral-300 rounded-md h-10 pl-2"
        />
        <p class="text-yellow-700" v-if="passwordNotEmpty === false">*password is required.</p>

        <button class="bg-green-700 text-white h-10 rounded-md mt-5" type="submit">Sign up</button>
      </form>
      <p class="text-neutral-400 text-sm mt-2">already have an account?</p>

      <RouterLink class="bg-transparent border-2 border-neutral-400 text-white h-10 rounded-md flex items-center justify-center" to="/login">Log in</RouterLink>
    </div>
  </main>
</template>

