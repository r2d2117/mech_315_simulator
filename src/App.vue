<template>
<Nav></Nav>  
<div class="inner">
  <Simulation :v1='velocity' :v2='mass' :v3='k'></Simulation>
  <div class="cp-outer">
    <div class="cp">
      <div class="cp-title"><p> Control Panel</p></div>
      <ControlPanel varName="Velocity" @set-mod="setVel"></ControlPanel>
      <ControlPanel varName="Mass" @set-mod="setMass"></ControlPanel>
      <ControlPanel varName="Spring Constant" @set-mod="setK"></ControlPanel>
      <h3> Velocity: {{velocity}} </h3>
      <h3> Mass: {{mass}} </h3>
      <h3> Spring Constant: {{k}} </h3>
    </div>
  </div>
</div>


</template>

<script>
import Nav from './components/navbar/nav.vue'
import Simulation from './components/simulation/simulation.vue'
import ControlPanel from './components/controlpanel/controlpanel.vue'

export default {
  name: 'App',
    components: {
        Nav,Simulation, ControlPanel
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
  .inner{
      margin: 0 20%;
  }
  .cp-outer{
  
    display: block;
    margin: 0 auto;
    text-align: center;
    padding: 0 25%;
}

.cp-title{
    font-size: 1.5rem;
    margin-bottom: 0.7rem;
    }
  
.cp{
    
    padding: 2rem;
    background-color: rgb(200,200,200);
    border: solid 3px black;
  
  }

  
</style>
