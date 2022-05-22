import { createApp } from 'vue'
import { createWebHistory } from 'vue-router'
import createRouter from './routes'
import App from './App.vue'
import PrimeVue from 'primevue/config';
// import InputText from "primevue/inputtext";
// import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const app = createApp(App);
const router = createRouter(createWebHistory());
app
    .component('DataTable', DataTable)
    .component('Column', Column);

app.use(router).use(PrimeVue).mount('#app');

