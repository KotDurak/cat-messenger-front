<template>
    <div class="dropdown">
        <button
                class="btn btn-success dropdown-toggle"
                type="button" id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                :aria-expanded="show"
                @click="show = !show"
        >
           <slot></slot>
        </button>
        <ul class="dropdown-menu" :class="{'show': show}" aria-labelledby="dropdownMenuButton1">
            <li v-for="(item, index) in items" :key="index">
                <a href="" class="dropdown-item" @click.prevent="item.callback">{{item.title}}</a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "drop-down-menu",
        props: {
          items: {
              type: Array,
              default: []
          }
        },
        data() {
            return {
                show: false
            }
        }
    }
</script>

<style scoped>

</style>