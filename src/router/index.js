import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/deals',
      name: 'Deals',
      component: () => import('../views/DealsView.vue')
    },
    {
      path: '/documents/:id',
      name: 'Documents',
      component: () => import('../views/DocumentsView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: 'deals'
    }
  ]
});

export default router;
