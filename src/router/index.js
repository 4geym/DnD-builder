import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CharacterGenerator from '../components/CharacterGenerator.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/character',
    name: 'character',
    component: CharacterGenerator
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
