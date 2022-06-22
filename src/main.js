import { createApp } from 'vue'
import App from "@/App";
import 'bootstrap/dist/css/bootstrap.min.css'
import store from '@/store'
import components from '@/components/UI';
import directives from '@/directives';

const app = createApp(App);

components.forEach(component => {
    app.component(component.name, component);
})

directives.forEach(directive => {
   app.directive(directive.name, directive);
});

app.use(store)
app.mount('#app')
