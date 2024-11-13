<!-- eslint-disable no-unused-vars -->
<script setup>
import { defineProps, ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
const toast = useToast()
const token = localStorage.getItem('token')

const props = defineProps({
  post: Object,
  fetch: Function,
})

const showFullDescription = ref(false)

const truncatedDescription = computed(() => {
  let description = props.post.description
  if (!showFullDescription.value && description.length > 90) {
    description = description.substring(0, 90) + '...'
  }
  return description
})

const toggleDescription = () => {
  showFullDescription.value = !showFullDescription.value
}

const handleDelete = async () => {
  try {
    alert('Are you sure you want to delete the post?')
    const res = await fetch(`http://localhost:8000/api/v1/posts/${props.post.id}`, {
      method: 'DELETE',
       headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (res.ok) {
      toast.success('Post deleted successfully!')
      await props.fetch()
    } else {
      toast.error('Failed to delete post.')
    }
  } catch (err) {
    console.log(err.message)
    toast.error('Failed to delete post.')
  }
}
</script>

<template>
  <div class="bg-white rounded flex flex-col items-center">
    <div class="flex mt-6 gap-2">
      <img
        v-if="post.imageUrl"
        :src="post.imageUrl"
        :alt="post.title"
        class="w-32 h-32 bg-red-300 rounded-full object-cover"
      />
    </div>
    <h1 class="text-3xl mb-1 text-gray-800">{{ post.title }}</h1>
    <h3 class="text-xl mb-3">{{ post.subtitle }}</h3>
    <p class="p-2 rounded text-sm">
      {{ truncatedDescription }}
      <span v-if="truncatedDescription.length > 90">
        <button @click="toggleDescription" v-if="!showFullDescription" class="text-blue-700">
          Show more
        </button>
        <button @click="toggleDescription" v-else class="text-blue-700">Hide</button>
      </span>
    </p>

    <div class="flex gap-2 my-5">
      <button class="bg-red-500 text-white w-32 h-10 rounded-full" @click="handleDelete">
        delete
      </button>
      <RouterLink
        class="bg-slate-400 text-white w-32 h-10 rounded-full flex items-center justify-center"
        :to="`posts/${props.post.id}`"
        >view</RouterLink
      >
    </div>
  </div>
</template>
