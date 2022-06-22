<template>
<div>
    <!-- 三级联动全局组件：已经注册为全局组件因此不需要引用 -->
    <TypeNav/>
    <ListContainer/>
    <Recommend/>
    <Rank/>
    <Like/>
    <Floor v-for="(floor,index) in floorList" :key="floor.id" :floor="floor"></Floor>
    <Brand/>
</div>
</template>

<script>
//引入其余组件
import ListContainer from '@/pages/Home/ListContainer'
import Recommend from '@/pages/Home/Recommend'
import Rank from '@/pages/Home/Rank'
import Like from '@/pages/Home/Like'
import Floor from '@/pages/Home/Floor'
import Brand from '@/pages/Home/Brand'
import { mapState } from 'vuex'

export default {
    name:'',
    components:{
        ListContainer,
        Recommend,
        Rank,
        Like,
        Floor,
        Brand,
    },
   mounted() {
       //派发action
       this.$store.dispatch("getFloorList")
       
   },
   computed:{
       ...mapState({
           floorList:state=>state.home.floorList,
       })
   },

}
</script>

<style>
</style>