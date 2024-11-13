<script setup>
import { reactive, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import Post from '@/components/Post.vue'
import RingLoader from 'vue-spinner/src/RingLoader.vue'

const state = reactive({
  isLoading: true,
  posts: [],
})

const fetchPosts = async () => {
  try {
    const token = localStorage.getItem('token')
    console.log(token)
    const res = await fetch('http://localhost:8000/api/v1/posts', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    state.posts = await res.json()
  } catch (e) {
    console.log(e.message)
  } finally {
    state.isLoading = false
  }
}

onMounted(async () => {
  fetchPosts()
})
</script>
<template>
  <div v-if="state.isLoading" class="h-screen w-full flex items-center justify-center bg-gray-700">
    <RingLoader />
  </div>
  <div v-else class="bg-slate-300 min-h-screen flex flex-col items-center">
    <div class="bg-blue-900 w-full flex gap-2 justify-end pr-2">
      <RouterLink
        to="/posts/create"
        class="w-48 bg-green-500 my-2 flex items-center justify-center p-2 rounded text-white text-lg"
      >
        create a new post</RouterLink
      >
      <button class="bg-red-500 my-2 flex items-center justify-center p-2 rounded text-white text-lg">log out</button>
    </div>
    <div class="w-full" v-if="state.posts.length > 0">
      <ul class="grid grid-cols-3 gap-3 p-3">
        <li
          v-for="post in state.posts"
          :key="post.id"
          class="bg-white rounded flex flex-col items-center"
        >
          <Post :post="post" :fetch="fetchPosts" />
        </li>
      </ul>
    </div>
    <div v-else>Create a new post by clicking the button above.</div>
  </div>
</template>
