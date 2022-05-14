import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/profile',
    component: () => import('@/views/profile.vue')
  },
  {
    path: '/home',
    component: () => import('@/views/home.vue')
  },
  {
    path: '/chat',
    component: () => import('@/views/chat/chat.vue')
  },
  {
    path: '/chat/stranger/:id',
    component: () => import('@/views/chat/chat.vue')
  },
  {
    path: '/chat/friend/:id',
    component: () => import('@/views/chat/chat.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
