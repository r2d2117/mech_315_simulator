<template>
  <div class="bar">

       <div class="nav-item">
             Final Report Simulation
        </div>
       <div class="nav-item main-item">
            <a href="/">Mech 315</a>
      </div>
      <div class="nav-item">
      Thomas Woodfine-MacPherson
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
padding: 1rem 0;
width: 100%;
left: 0px;
background-color: rgb(57,72,92);
display: flex;
justify-content: space-evenly;
align-items: center;
}


.nav-item{

color: white;
font-size: 1.8rem;
font-family: Verlag;
}

.main-item{
align-self: center;
font-size: 2.4rem;
font-weight: 600;
padding-bottom: 0.4rem;
}

a{
text-decoration:None;
color: white;
}

         

</style>
