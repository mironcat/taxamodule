import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import InputText from "primevue/inputtext";
import Button from 'primevue/button';
const app = createApp(App);
app.use(PrimeVue).mount('#app');
app
    .component('InputText', InputText)
    .component('Button', Button);
