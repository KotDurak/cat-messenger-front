<template>
    <div class="dropdown">
        <button v-if="view_default"
                class="btn btn-success dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                :aria-expanded="show"
                @click="show = !show"
        >
           <slot></slot>
        </button>
        <span v-else class="custom-menu-icon" @click="show = !show">
            <slot></slot>
        </span>
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
          },
          view_default: {
              type: Boolean,
              default: true
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
    .custom-menu-icon{
        cursor: pointer;
    }
</style>