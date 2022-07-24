import {createStore} from 'vuex'
import {auth} from "@/store/auth.module";
import {contacts} from "@/store/contacts.module";
import {messages} from "@/store/messages.module";
import {sockets} from "@/store/sockets";

export default createStore({
    modules: {
        auth,
        contacts,
        messages,
        sockets
    }
});
