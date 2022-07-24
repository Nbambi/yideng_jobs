<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <ListView :data="virtualData" />
  </div>
</template>

<script>
import ListView from "./components/ListView.vue";

export default {
  name: "App",
  components: {
    ListView,
  },
  data() {
    return {
      virtualData: [
        { value: "张三1" },
        { value: "张三2" },
        { value: "张三3" },
        { value: "张三4" },
        { value: "张三5" },
        { value: "张三6" },
        { value: "张三7" },
        { value: "张三8" },
        { value: "张三9" },
        { value: "张三10" },
        { value: "张三11" },
        { value: "张三12" },
        { value: "张三13" },
        { value: "张三14" },
        { value: "张三15" },
        { value: "张三16" },
        { value: "张三17" },
        { value: "张三18" },
        { value: "张三19" },
        { value: "张三20" },
        { value: "张三21" },
        { value: "张三22" },
        { value: "张三23" },
        { value: "张三24" },
        { value: "张三25" },
        { value: "张三26" },
        { value: "张三27" },
      ],
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
