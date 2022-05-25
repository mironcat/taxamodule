import { createApp } from 'vue'
import { createWebHistory } from 'vue-router'
import createRouter from './routes'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';

const app = createApp(App);
const router = createRouter(createWebHistory());
app.use(PrimeVue).use(ToastService)
app
    .component('DataTable', DataTable)
    .component('Column', Column)
    .component('Button', Button)
    .component('Toast', Toast)
    .component('InputText', InputText);

app.use(router).mount('#app');

