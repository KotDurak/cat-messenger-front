<template>
    <ul class="menu cleafix">
        <li class="parent">
            <a href @click.prevent><slot></slot></a>
            <ul class="children">
                <li v-for="(item, index) in items" :key="index">
                    <a href class="dropdown-item" @click.prevent="item.callback">{{item.title}}</a>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "drop-down-menu",
        props: {
          items: {
              type: Array,
              default: []
          },
        },
        data() {
            return {
                show: false
            }
        },
        watch: {
            items() {
                this.show = false
            }
        }
    }
</script>

<style scoped>
    .menu {
        display: inline-block;
        margin: 0 auto;
        list-style-type: none;
    }
    .menu a {
        display: block;
        margin: 0;
        padding: 16px 25px;
        color: #333;
        text-decoration: none;
        background-color: #fff;
    }
    .menu li {
        position: relative;
        float: left;
        margin: 0;
        border-left: 1px solid #eee;
    }
    .menu li:first-child {
        border-left: none;
    }

    .menu li:hover .children, .menu li:focus .children {
        opacity: 1;
        transform: rotateX(0) translateZ(0);
    }
    .menu .children {
        opacity: 0;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        transform: rotateX(-90deg);
        transform-style: preserve-3d;
        transform-origin: top center;
        transition: transform 0.4s cubic-bezier(0.17, 0.67, 0.59, 1.21), opacity 0.1s 0.1s;
        z-index: 100;
        list-style-type: none;
        position: absolute;
        top: 100%;
        left: 0;
        width: 200px;
        margin: 0;
        padding: 10px 0;
        background-color: #fff;
        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.1);
        text-align: left;
    }
    .menu .children li {
        float: none;
    }
    .menu .children a {
        background-color: transparent;
    }
    .menu .children a:hover, .menu .children a:focus {
        color: #333;
        background-color: #f9f9f9;
    }

    .clearfix:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }

    .menu .parent a:hover{
        color: #333;
        background-color: #f9f9f9;
    }
</style>