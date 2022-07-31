<template>
    <div class="card">
        <div class="card-body">
            <h5 class="card-title" v-if="data.nick">{{data.nick}}</h5>
            <p class="card-text">
                <b>Пол: {{gender}}</b>
            </p>
        </div>
    </div>
</template>

<script>

    export default {
        props: {
            data: {
                type: Object,
                default: {}
            }
        },
        computed: {
              gender() {
                switch (this.data.gender) {
                    case 1:
                        return 'Мужской'
                    case 2:
                        return 'Женский'
                }

                return 'Не указан'
            }
        }
    }
</script>

<style scoped>

</style>