import { createRouter } from 'vue-router'
import Homepage from './pages/Home.vue';
import TaxaList from './pages/TaxaList.vue';

const routes = [
    {
        path: '/',
        component: Homepage
    },

    {
        path: '/taxa',
        component: TaxaList
    },

]

export default function (history) {
    return createRouter({
        history,
        routes
    })
}