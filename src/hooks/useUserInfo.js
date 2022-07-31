import {ref, watch, toRefs, onMounted} from 'vue'

export default function useUserInfo(props) {
    const {user_id} = toRefs(props)
    const {user_info} = toRefs(props)

    const menu_items = ref([])
    const showBlackListDialog = ref(false)
    const showDeleteDialog = ref(false)
    const showUserInfoDialog = ref(false)
    const isLoadingUserInfo = ref(true)
    const userData = ref({})


    const getMenuItems = () => {
        const blackListItem = isInBlackList()
            ? {
                title: 'Удалить из черного списка',
                callback: () => {
                    showBlackListDialog.value = true
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
                callback: () => {
                    showUserInfoDialog.value = true
                }
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

    const setLoadingUserInfo = value => {
        isLoadingUserInfo.value = value
    }

    const setUserData = data => {
        userData.value = data
    }

    onMounted(getMenuItems)
    watch(user_info, getMenuItems)
    watch(user_info.value, getMenuItems)



    return {
        menu_items,
        showBlackListDialog,
        showDeleteDialog,
        isInBlackList,
        showUserInfoDialog,
        isLoadingUserInfo,
        setLoadingUserInfo,
        userData,
        setUserData
    }
}