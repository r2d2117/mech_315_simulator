<template>
<div>
  <label for="varName">{{ varName }}</label>
  <input type="range" id="varName" min="1" max="100" class="slider" @change="onChange" v-model.number="set">
</div>
</template>

<script>
  export default{
      name: 'ControlPanel',
      props: {
          varName: {required: true, type: String},

      },
      data(){
          return {
              set:''
          }
      },
      methods: {
          onChange() {
              this.$emit("set-mod", this.set);
          },
      },
  }
</script>

<style scoped>

.slider{
    display: block;
    margin: 0.5rem auto;
    
}

</style>
