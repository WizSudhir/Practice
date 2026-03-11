const container = document.getElementById("pipeline3d")

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
75,
container.clientWidth/container.clientHeight,
0.1,
1000
)

camera.position.z = 8

const renderer = new THREE.WebGLRenderer({alpha:true})

renderer.setSize(container.clientWidth,container.clientHeight)

container.appendChild(renderer.domElement)


// LIGHT

const light = new THREE.PointLight(0xffffff,1)

light.position.set(10,10,10)

scene.add(light)


// PIPE MATERIAL

const pipeMaterial = new THREE.MeshStandardMaterial({
color:0x1e293b,
metalness:.6,
roughness:.2
})


// PIPE GEOMETRY

const pipeGeometry = new THREE.CylinderGeometry(.3,.3,6,32)

const pipe = new THREE.Mesh(pipeGeometry,pipeMaterial)

pipe.rotation.z = Math.PI/2

scene.add(pipe)


// REVENUE PARTICLES

let particles = []

const particleGeometry = new THREE.SphereGeometry(.05,8,8)

const particleMaterial = new THREE.MeshBasicMaterial({
color:0x22c55e
})

for(let i=0;i<120;i++){

const particle = new THREE.Mesh(particleGeometry,particleMaterial)

particle.position.x = Math.random()*6-3
particle.position.y = Math.random()*0.2

scene.add(particle)

particles.push(particle)

}


// LEAK PARTICLES

let leaks = []

const leakMaterial = new THREE.MeshBasicMaterial({
color:0xef4444
})

for(let i=0;i<30;i++){

const drop = new THREE.Mesh(particleGeometry,leakMaterial)

drop.position.x = Math.random()*4-2
drop.position.y = -1

scene.add(drop)

leaks.push(drop)

}


// ANIMATION

let leaking = true

function animate(){

requestAnimationFrame(animate)

particles.forEach(p=>{

p.position.x += 0.04

if(p.position.x > 3){

p.position.x = -3

}

})

if(leaking){

leaks.forEach(d=>{

d.position.y -= .03

if(d.position.y < -3){

d.position.y = -1

}

})

}

renderer.render(scene,camera)

}

animate()


// SCROLL EVENT

window.addEventListener("scroll",()=>{

if(window.scrollY > 150){

leaking = false

document
.querySelector(".fix-indicator")
.classList.add("active")

}

})
