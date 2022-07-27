import {ref, watch, toRefs, onMounted} from 'vue'

export default function useUserInfo(props) {
    const {user_id} = toRefs(props)
    const {user_info} = toRefs(props)

    const menu_items = ref([])
    const showBlackListDialog = ref(false)
    const showDeleteDialog = ref(false)


    const getMenuItems = () => {
        const blackListItem = isInBlackList()
            ? {
                title: 'Удалить из черного списка',
                callback: () => {
                    const id = user_info.value.user_data.user_id;
                    console.log('Remove from black list', id)
                }
            }
            : {
                title: 'В черный список',
                callback: () => {
                    showBlackListDialog.value = true
                }
            }
        menu_items.value = [
            {
                title: 'О пользователе',
                callback: () => console.log('About', user_info.value.id)
            },
            {
                title: 'Удалить контакт',
                callback: () => {
                    showDeleteDialog.value = true
                }
            },
            blackListItem,
        ]
    }

    const isInBlackList = () => {
        return user_info.value.user_data.in_black_list || false
    }

    onMounted(getMenuItems)
    watch(user_info, getMenuItems)



    return {
        menu_items,
        showBlackListDialog,
        showDeleteDialog
    }
}