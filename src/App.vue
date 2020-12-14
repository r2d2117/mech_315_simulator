<template>
<Nav></Nav>  

  <Simulation :v1='velocity' :v2='mass' :v3='k'></Simulation>
  <div class="info">
  Acceleration applied: 2.5 m/s<br>
  Note: Wheels moving below the surface of the road means they are being compressed.
  </div>




</template>

<script>
import Nav from './components/navbar/nav.vue'
import Simulation from './components/simulation/simulation.vue'
import ControlPanel from './components/controlpanel/controlpanel.vue'

export default {
  name: 'App',
    components: {
        Nav,Simulation,
    },
    methods: {
        setVel(val){
            this.velocity = val;
        },
        setMass(val){
            this.mass = val;
        },
        setK(val){
            this.k = val;
        },
    },
    data(){
        return {
            velocity:50, mass: 50, k: 50

            }
        }
    
}

</script>

<style>
  *{
      margin: 0;
  }

  .info{
  text-align: left;
  margin: 0 30%;
  font-family: Helvetica;
  font-size: 1.2rem;
  display: block;
  padding-bottom: 4rem;
  top: -5%;
  } 



  
</style>
