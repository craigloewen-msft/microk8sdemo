<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  components: {
  },
  computed: {
  },
  created: function () {
  }
};
</script>


<style>
#app {
  /* font-family: "Nunito", sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

body {
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
