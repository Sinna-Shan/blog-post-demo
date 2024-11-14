<script setup>
import { onMounted, reactive, ref} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import { useToast } from 'vue-toastification'

const route = useRoute()
const postId = route.params.id || ''

const router = useRouter()
const toast = useToast()

const form = reactive({
  title: '',
  subtitle: '',
  description: '',
  file: null,
})
const token = localStorage.getItem('token')

const isEmptyTitle = ref(false)
const isEmptySub = ref(false)
const isEmptyDesc = ref(false)
const isLoading = ref(true)

onMounted(async () => {
  try {
    if (postId === '') return

    const res = await fetch(`http://localhost:8000/api/v1/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const post = await res.json()

    form.title = post.title
    form.subtitle = post.subtitle
    form.description = post.description
  } catch (e) {
    console.log(e.message)
    toast.error({
      message: 'Failed to fetch post data',
      position: 'top-right',
    })
  } finally {
    isLoading.value = false
  }
})

const handleImageChange = (event) => {
  form.file = event.target.files[0]
}

const handleSubmit = async () => {
  try {
    if (form.title == '') {
      isEmptyTitle.value = true
    } else {
      isEmptyTitle.value = false
    }

    if (form.subtitle == '') {
      isEmptySub.value = true
    } else {
      isEmptySub.value = false
    }
    if (form.description == '') {
      isEmptyDesc.value = true
    } else {
      isEmptyDesc.value = false
    }

    if (form.title == '' || form.subtitle == '' || form.description == '') return

    const formData = new FormData()

    formData.append('title', form.title)
    formData.append('subtitle', form.subtitle)
    formData.append('description', form.description)
    formData.append('file', form.file)

    if (postId === '') {
      isLoading.value = true
      const res = await fetch('http://localhost:8000/api/v1/posts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      console.log(await res.json())
      toast.success('posts created successfully.')
    } else {
      isLoading.value = true
      const res = await fetch(`http://localhost:8000/api/v1/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      console.log(await res.json())
      toast.success('posts updated successfully.')
    }

    isEmptyTitle.value, isEmptySub.value, (isEmptyDesc.value = false)
    router.push('/posts')
  } catch (e) {
    console.log(e.message)
    toast.error('operation failed.')
  } finally {
    isLoading.value = false
  }
}



</script>
<template>
  <div v-if="isLoading" class="h-screen w-full flex items-center justify-center bg-neutral-800">
    <RingLoader />
  </div>
  <div
    v-else
    class="relative bg-gray-100 min-h-screen flex items-center justify-center flex-col bg-neutral-800 text-stone-500"
  >
    <h1 class="text-3xl mb-6 text-neutral-400 uppercase">{{ postId === '' ? 'Create a new post' : 'Update post' }}</h1>
    <div class="w-full absolute top-4 left-20">
      <RouterLink to="/posts"
        class="rounded-full w-12 h-12 bg-neutral-700 gap-2 text-white text-xl flex items-center justify-center"
      >
        <i class="pi pi-arrow-left text-lg"></i>
      </RouterLink>
    </div>

    <form @submit.prevent="handleSubmit" class="flex justify-center flex-col gap-3">
      <label for="title" class="text-neutral-400">title</label>
      <input
        type="text"
        name="title"
        id="title"
        v-model="form.title"
        class="rounded-sm h-10 pl-2 bg-neutral-500 text-neutral-300"
      />
      <p v-if="isEmptyTitle" class="text-yellow-700">*This field is required.</p>

      <label for="sub-title" class="text-neutral-400">sub title</label>
      <input
        type="text"
        name="sub-title"
        id="sub-title"
        v-model="form.subtitle"
        class="rounded-sm h-10 pl-2 bg-neutral-500 text-neutral-300"
      />
      <p v-if="isEmptySub" class="text-yellow-700">*This field is required.</p>

      <label for="description" class="text-neutral-400">discription</label>
      <textarea
        name="description"
        id="description"
        cols="100"
        rows="5"
        v-model="form.description"
        class="rounded-sm pl-2 pt-2 bg-neutral-500 text-neutral-300"
      ></textarea>
      <p v-if="isEmptyDesc" class="text-yellow-700">*This field is required.</p>

      <label for="images" class="text-neutral-400">images</label>
      <input type="file" name="images" id="images" @change="handleImageChange" class="text-neutral-300"/>

      <div class="flex gap-2 items-center self-end">
        <button
          class="bg-green-800 text-white rounded w-32 h-12 text-lg flex items-center justify-center"
          :disabled="isLoading"
        >
          <i class="pi pi-check-circle text-2xl"></i>
        </button>
      </div>
    </form>
  </div>
</template>
