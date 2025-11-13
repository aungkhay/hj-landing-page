import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // always scroll to top
        // return { top: 0 }
        return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve({ top: 0, behavior: 'smooth', })
            }, 300)
        })
    }
})

export default router