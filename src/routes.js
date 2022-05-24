import { createRouter } from 'vue-router'
import Homepage from './pages/Home.vue';
import TaxaList from './pages/TaxaList.vue';
import TaxaByID from './pages/TaxaByID.vue';
const routes = [
    {
        path: '/',
        component: Homepage
    },

    {
        path: '/taxa',
        component: TaxaList
    },
    { 
        path: '/taxa/:id',
        component: TaxaByID 
    },

]

export default function (history) {
    return createRouter({
        history,
        routes
    })
}