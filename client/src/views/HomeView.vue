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
  currentPage: 0,
  totalPages: 1,
  lastVisibleId: null,
})

const router = useRouter()

const fetchPosts = async () => {
  state.isLoading = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(
      `http://localhost:8000/api/v1/posts?limit=${state.limit}&page=${state.currentPage}&sortBy=${state.sortBy}&sortDirection=${state.sortDirection}&lastVisibleId=${state.lastVisibleId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    const data = await res.json()
    console.log(data.posts)
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

const handleSortChange = (field) => {
  state.sortBy = field
  state.currentPage = 1
  state.lastVisibleId = null
  fetchPosts()
}

const handlePageChange = (page) => {
  console.log('page : ', page)
  console.log('current page', state.currentPage)
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
  <div v-if="state.isLoading" class="h-screen w-full flex items-center justify-center bg-gray-700">
    <RingLoader />
  </div>

  <div v-else class="bg-slate-300 min-h-screen flex flex-col items-center">
    <!-- Top bar for creating new posts and logging out -->
    <div class="bg-blue-900 w-full flex gap-2 justify-end pr-2">
      <RouterLink
        to="/posts/create"
        class="w-48 bg-green-500 my-2 flex items-center justify-center p-2 rounded text-white text-lg"
      >
        Create a new post
      </RouterLink>
      <button
        class="bg-red-500 my-2 flex items-center justify-center p-2 rounded text-white text-lg"
        @click="handleLogout"
      >
        Log out
      </button>
    </div>

    <!-- Sorting and filtering controls -->
    <div class="w-full flex justify-between p-4">
      <div>
        <label for="sort">Sort by:</label>
        <select id="sort" v-model="state.sortBy" @change="handleSortChange(state.sortBy)">
          <option value="title">Title</option>
          <option value="subtitle">Sub tittle</option>
          <!-- Add other sorting fields as needed -->
        </select>

        <select v-model="state.sortDirection" @change="fetchPosts">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>

    <!-- Display posts -->
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

    <!-- Pagination controls -->
    <div class="flex gap-2 justify-center my-4">
      <button
        :disabled="state.currentPage === 1"
        @click="handlePageChange(state.currentPage - 1)"
        class="bg-gray-500 px-4 py-2 rounded text-white"
      >
        Previous
      </button>
      <span>Page {{ state.currentPage }} of {{ state.totalPages }}</span>
      <button
        :disabled="state.currentPage === state.totalPages"
        @click="handlePageChange(state.currentPage + 1)"
        class="bg-gray-500 px-4 py-2 rounded text-white"
      >
        Next
      </button>
    </div>
  </div>
</template>
