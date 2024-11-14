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
  <div class="rounded w-full flex flex-col px-4 text-stone-300">
    <div class="flex mt-6 gap-2">
      <img
        v-if="post.imageUrl"
        :src="post.imageUrl"
        :alt="post.title"
        class="w-32 h-32 border-2 border-neutral-700 bg-red-300 rounded-full object-cover shadow-md mb-6"
      />
    </div>
    <h1 class="text-3xl mb-1 text-yellow-700 font-mono font-bold uppercase">{{ post.title }}</h1>
    <h3 class="text-xl mb-3 font-light text-stone-500">{{ post.subtitle }}</h3>
    <p class="rounded text-sm">
      {{ truncatedDescription }}
      <span v-if="truncatedDescription.length > 90">
        <button @click="toggleDescription" v-if="!showFullDescription" class="text-blue-700">
          Show more
        </button>
        <button @click="toggleDescription" v-else class="text-blue-700">Hide</button>
      </span>
    </p>

    <div class="flex gap-2 my-5">
      <button class="bg-red-900 text-white w-12 p-3 rounded-full" @click="handleDelete">
        <i class="pi pi-trash text-xl"></i>
      </button>
      <RouterLink
        class="bg-neutral-700 text-white w-12 p-3 rounded-full flex items-center justify-center"
        :to="`posts/${props.post.id}`"
        ><i class="pi pi-pen-to-square text-xl"></i></RouterLink
      >
    </div>
  </div>
</template>
