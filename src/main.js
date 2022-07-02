import { createApp } from 'vue'
import App from "@/App";
import 'bootstrap/dist/css/bootstrap.min.css'
import store from '@/store'
import components from '@/components/UI';
import directives from '@/directives';
import VueSocketIO from "vue-3-socket.io";
import SocketIO from 'socket.io-client'
import BootstrapIcon from '@dvuckovic/vue3-bootstrap-icons'


const app = createApp(App);

components.forEach(component => {
    app.component(component.name, component);
})

app.component('BootstrapIcon', BootstrapIcon);

directives.forEach(directive => {
   app.directive(directive.name, directive);
});

app.use(new VueSocketIO({
    debug: true,
    connection:  SocketIO(process.env.VUE_APP_SOCKET_SERVER),
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    },
}));

app.use(store)
app.mount('#app')
