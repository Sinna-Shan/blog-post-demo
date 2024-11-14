<script setup>
import { reactive, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import Post from '@/components/Post.vue'
import RingLoader from 'vue-spinner/src/RingLoader.vue'

const state = reactive({
  isLoading: true,
  posts: [],
  sortBy: 'title',
  sortDirection: 'desc',
  limit: 3,
  currentPage: 1,
  totalPages: 1,
  lastVisibleId: null,
})

const router = useRouter()

const fetchPosts = async () => {
  state.isLoading = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(
      `http://localhost:8000/api/v1/posts?limit=${state.limit}&page=${state.currentPage}&lastVisibleId=${state.lastVisibleId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    const data = await res.json()
    state.posts = data.posts
    state.totalPages = data.totalPages
    state.currentPage = data.currentPage
    state.lastVisibleId = data.lastVisibleId
  } catch (e) {
    console.log(e.message)
    router.push('/login')
  } finally {
    state.isLoading = false
  }
}

onMounted(fetchPosts)

const handleSortChange = (event) => {
  state.sortBy = event.target.value;
}

const handleSortDirection = (e) => {
  const direction = e.target.value; 
  const value = state.sortBy;
  
  if (direction === 'asc') {
    state.posts.sort((a, b) => a[value].localeCompare(b[value]));
  } else if (direction === 'desc') {
    state.posts.sort((a, b) => b[value].localeCompare(a[value]));
  }
}

const handlePageChange = (page) => {
  state.currentPage = page
  if (page === 1) {
    state.lastVisibleId = null
  }
  fetchPosts()
}

const handleLogout = () => {
  if (window.confirm('Are you sure you want to log out ?')) {
    localStorage.removeItem('token')
    router.push('/login')
  }
}
</script>

<template>
  <div v-if="state.isLoading" class="h-screen w-full flex items-center justify-center bg-neutral-900">
    <RingLoader />
  </div>

  <div v-else class="bg-neutral-900 min-h-screen flex flex-col items-center">
    <div class="bg-neutral-900 w-full flex gap-2 justify-end py-2 pr-2 shadow-lg">
      <RouterLink
        to="/posts/create"
        class="bg-green-800 my-2 flex items-center gap-2 justify-center px-4 py-2 rounded-full text-white text-lg"
      >
        <i class="pi pi-plus-circle text-lg"></i> New post
      </RouterLink>
      <button
        class="bg-red-800 my-2 flex items-center justify-center px-4 rounded-full text-white text-lg"
        @click="handleLogout"
      >
        <i class="pi pi-sign-out"></i>
      </button>
    </div>

    <div class="w-full flex p-4 justify-between">
      <div class="flex gap-2 items-center">
        <label for="sort" class="text-neutral-400">Sort by:</label>
        <select
          id="sort"
          @change="handleSortChange"
          class="rounded-full p-3 bg-neutral-600 text-neutral-300"
        >
          <option value="title">Title</option>
          <option value="subtitle">Sub tittle</option>
        </select>

        <select
          @change="handleSortDirection"
          class="rounded-full p-3 bg-neutral-600 text-neutral-300"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div class="flex gap-2 justify-center items-center my-4">
        <button :disabled="state.currentPage === 1" @click="handlePageChange(1)" class="text-neutral-300">
          <i class="pi pi-arrow-circle-left text-2xl"></i>
        </button>
        <span class="text-neutral-300">Page {{ state.currentPage }} of {{ state.totalPages }}</span>
        <button
          :disabled="state.currentPage === state.totalPages"
          @click="handlePageChange(state.currentPage + 1)"
          class="text-neutral-300"
        >
          <i class="pi pi-arrow-circle-right text-2xl"></i>
        </button>
      </div>
    </div>
    <div class="w-full" v-if="state.posts.length > 0">
      <ul class="grid grid-cols-3 gap-3 p-3">
        <li
          v-for="post in state.posts"
          :key="post.id"
          class="bg-zinc-800 rounded flex flex-col items-center border border-neutral-500 shadow-lg"
        >
          <Post :post="post" :fetch="fetchPosts" />
        </li>
      </ul>
    </div>
    <div v-else class="text-xl h-72 w-full flex flex-col items-center justify-center text-stone-600 text-center"><span class="text-5xl">No posts yet.</span><br>Create a new post by clicking the button above.</div>
  </div>
</template>

