import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EditPost from '../components/EditPost.vue';
import PostView from '../views/PostView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
  
      {
        path: '/posts',
        component: () => import('../views/BlogPosts.vue'),
        beforeEnter: (to, from, next) => {
          const isAuthenticated = !!localStorage.getItem('authToken');
          if (isAuthenticated) {
            next();
          } else {
            next('/login');
          }
        },
      },
      { path: '/posts/:slug', component: PostView, props: true },
  ]
})

export default router
