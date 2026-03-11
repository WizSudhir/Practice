document.addEventListener("DOMContentLoaded", () => {

const container = document.getElementById("pipeline3d")
if(!container) return


/* ================================
SCENE SETUP
================================ */

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
75,
container.clientWidth / container.clientHeight,
0.1,
1000
)

camera.position.z = 8


const renderer = new THREE.WebGLRenderer({
alpha:true,
antialias:true
})

renderer.setSize(container.clientWidth, container.clientHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

container.appendChild(renderer.domElement)



/* ================================
LIGHTING
================================ */

const light = new THREE.PointLight(0xffffff,1.2)
light.position.set(10,10,10)

scene.add(light)



/* ================================
PIPELINE
================================ */

const pipeMaterial = new THREE.MeshStandardMaterial({
color:0x334155,   // more visible
metalness:0.9,
roughness:0.2
})

const pipeGeometry = new THREE.CylinderGeometry(.6,.6,7,32)

const pipe = new THREE.Mesh(pipeGeometry,pipeMaterial)

pipe.rotation.y = 0.2
pipe.rotation.z = Math.PI / 2

scene.add(pipe)



/* ================================
REVENUE FLOW PARTICLES
================================ */

let particles = []

const particleGeometry = new THREE.SphereGeometry(.06,8,8)

const particleMaterial = new THREE.MeshBasicMaterial({
color:0x22c55e,
transparent:true,
opacity:.9
})

for(let i=0;i<120;i++){

const particle = new THREE.Mesh(particleGeometry, particleMaterial)

particle.position.x = Math.random()*6 - 3
particle.position.y = 0
particle.position.z = (Math.random() - 0.5) * 0.3

scene.add(particle)

particles.push(particle)

}



/* ================================
LEAK PARTICLES
================================ */

const leakMaterial = new THREE.MeshBasicMaterial({
color:0xef4444
})

let leaks = []

const leakPositions = [-1.5,0,1.5]

for(let i=0;i<30;i++){

const pos = leakPositions[i % 3]

const drop = new THREE.Mesh(particleGeometry, leakMaterial)

drop.position.x = pos
drop.position.y = 0      // start inside pipe
drop.position.z = 0

scene.add(drop)

leaks.push(drop)

}



/* ================================
ANIMATION LOOP
================================ */

let leaking = true

function animate(){

requestAnimationFrame(animate)


/* Revenue Flow */

particles.forEach(p=>{

p.position.x += 0.04

if(p.position.x > 3){
p.position.x = -3
}

})


/* Leakage Animation */

if(leaking){

leaks.forEach(d=>{

d.position.y -= .03

if(d.position.y < -2){
d.position.y = 0
}

})

}


renderer.render(scene,camera)

}

animate()



/* ================================
SCROLL: PRACTICEGRID FIX
================================ */

window.addEventListener("scroll",()=>{

if(window.scrollY > 150){

leaking = false

pipe.material.color.set(0x22c55e)

const fixIndicator = document.querySelector(".fix-indicator")
if(fixIndicator){
fixIndicator.classList.add("active")
}

}

})



/* ================================
WINDOW RESIZE
================================ */

window.addEventListener("resize",()=>{

camera.aspect = container.clientWidth / container.clientHeight
camera.updateProjectionMatrix()

renderer.setSize(container.clientWidth, container.clientHeight)

})

})
