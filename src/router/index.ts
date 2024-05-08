import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'Map',
      component: () => import('../views/MapView.vue')
    },
    {
      path: '/report',
      name: 'Report Map',
      component: () => import('../views/ReportView.vue')
    }
  ]
})

export default router
