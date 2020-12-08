<template>
  <div class="bar">


      <div class="nav-items">
      <ul>
	<li>About</li>
	<li>Contact</li>
	<li>Resume</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
name: 'Nav'
}
</script>

<style scoped>
  .bar{
      height: 5rem;
      width: 100%;
      top: 0px;
      left: 0px;
      background-color: rgb(57,72,92);
      
  }


  .nav-items{
      
      color: white;
      font-size: 1.8rem;
      height: 100%;
      text-align: right;
      margin: 0 1rem;

      
  }
  .nav-items li{
      display: inline-block;
      padding: 0 1rem;
      line-height: 5rem;
      }


</style>
