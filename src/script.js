import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import { Texture } from 'three'

// Initialize Debug UI
const gui = new dat.GUI()
// DebugColor
const parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
  },
}
gui.addColor(parameters, 'color').onChange(() => {
  material.color.set(parameters.color)
})
gui.add(parameters, 'spin')

// Load Image as Textures
// const image = new Image()
// const textures = new Texture(image)

// image.onload = () => {
//   textures.needsUpdate = true
// }
// image.src = '/textures/door/color.jpg'

// Using TextureLoader
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => {
  console.log('onStart')
}
loadingManager.onloaded = () => {
  console.log('onloaded')
}
loadingManager.onProgress = () => {
  console.log('onProgress')
}
loadingManager.onError = () => {
  console.log('onError')
}

const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png')
// const colorTexture = textureLoader.load('/textures/checkerboard-8x8.png')
// const colorTexture = textureLoader.load('/textures/minecraft.png')
// const colorTexture = textureLoader.load('/textures/door/color.jpg')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load(
  '/textures/door/ambientOcclusion.jpg'
)
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// colorTexture.minFilter = THREE.NearestFilter
colorTexture.magFilter = THREE.NearestFilter

// Get Canvas
const canvas = document.querySelector('.webgl')

// Sizes
const sizes = {
  width: innerWidth,
  height: innerHeight,
}
const aspectRatio = sizes.width / sizes.height

// Scene
const scene = new THREE.Scene()

// Cube
const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ map: colorTexture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Add property in Debug UI
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation')
gui.add(mesh, 'visible')
gui.add(material, 'wireframe')

// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Renderer & its Size
const renderer = new THREE.WebGL1Renderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Window Resize
window.addEventListener('resize', () => {
  // Update Canvas Size
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update Camera Aspect Ratio
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update Renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Animation
const tick = () => {
  // Renderer
  renderer.render(scene, camera)

  // Update Controls
  controls.update()

  window.requestAnimationFrame(tick)
}

tick()
