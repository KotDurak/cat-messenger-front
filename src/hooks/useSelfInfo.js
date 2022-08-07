import {ref} from 'vue'

export default function getSelfInfo() {
    const menu_items = ref([])
    const showExitDialog = ref(false)
    const confirmExitText = ref('Вы уверены что хотите выйти?')

    menu_items.value = [
        {
            title: 'Выход',
            callback: () => {
                showExitDialog.value = true
            }
        },
        {
            title: 'Информация',
            callback: () => console.log('Show info about user')
        }
    ]

    return {
        menu_items,
        showExitDialog,
        confirmExitText
    }
}