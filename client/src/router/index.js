/* eslint-disable no-unused-vars */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import PostFormView from '@/views/PostFormView.vue'
import { useToast } from 'vue-toastification'
const toast = useToast()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/posts',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/posts/:id',
      name: 'update-post',
      component: PostFormView,
    },
    {
      path: '/posts/create',
      name: 'create-post',
      component: PostFormView,
    },
    {
      path: '/login',
      index: true,
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    toast.error('You need to be logged in to access this page')
    next('/login')
  } else {
    next()
  }
})

export default router
