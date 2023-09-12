import * as THREE from 'https://unpkg.com/three@0.108.0/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.108.0/examples/jsm/controls/OrbitControls.js'

// 전역 상수
const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight

// 전역 변수
let scene, camera, renderer, controls
const carGroup = new THREE.Group()
const wheelGroup = new THREE.Group()
let keyCode = 0
let keyDownChk = false

// 유틸리티 함수
const radians = (degrees) => (degrees * Math.PI) / 180

// 초기화 함수
const initScene = () => {
    try {
        scene = new THREE.Scene()
        camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000)

        const cameraOffset = new THREE.Vector3(0, 50, -120)
        camera.position.add(cameraOffset)
        camera.lookAt(carGroup.position)

        renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(WIDTH, HEIGHT)
        renderer.setClearColor(0x0e2255)
        document.body.appendChild(renderer.domElement)

        controls = new OrbitControls(camera, renderer.domElement)
        controls.minPolarAngle = radians(20)
        controls.maxPolarAngle = radians(120)
        controls.enablePan = false
        controls.enableZoom = false
        controls.enableDamping = true

        createGround()
    } catch (error) {
        console.error(`initScene() :  ${error}`)
    }
}

const createGround = () => {
    try {
        const planeSize = 10000
        const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize)
        const planeMaterial = new THREE.MeshPhongMaterial({
            color: 0x999999,
            side: THREE.DoubleSide,
        })

        const plane = new THREE.Mesh(planeGeometry, planeMaterial)
        plane.rotation.x = radians(-90)
        scene.add(plane)
    } catch (error) {
        console.error(`createGround() :  ${error}`)
    }
}

const addLights = () => {
    try {
        const color = 0xffffff
        const intensity = 1.3
        const light = new THREE.DirectionalLight(color, intensity)
        light.position.set(20, 80, 50)
        light.target.position.set(0, 20, 0)
        scene.add(light)
        scene.add(light.target)
        const helper = new THREE.DirectionalLightHelper(light, 5)
        scene.add(helper)
    } catch (error) {
        console.error(`addLights() : ${error}`)
    }
}

// Add grid helper
// const addGridHelper = () => {
//     const gridHelper = new THREE.GridHelper(70, 20)
//     scene.add(gridHelper)
// }

// Generate the car body
const generateCarBody = () => {
    try {
        const topLength = 12
        const topWidth = 8
        const bottomLength = 4
        const bottomWidth = 8

        const topShape = new THREE.Shape()
        topShape.moveTo(0, 0)
        topShape.lineTo(0, topLength)
        topShape.lineTo(topWidth, topLength)
        topShape.lineTo(topWidth, 0)
        topShape.lineTo(0, 0)

        const bottomShape = new THREE.Shape()
        bottomShape.moveTo(0, 0)
        bottomShape.lineTo(0, bottomLength)
        bottomShape.lineTo(bottomWidth, bottomLength)
        bottomShape.lineTo(bottomWidth, 0)
        bottomShape.lineTo(0, 0)

        const topExtrudeSettings = {
            steps: 1,
            depth: 16,
            bevelEnabled: true,
            bevelThickness: 7,
            bevelSize: 2,
            bevelOffset: 1,
            bevelSegments: 3,
        }

        const bottomExtrudeSettings = {
            steps: 1,
            depth: 22,
            bevelEnabled: true,
            bevelThickness: 7,
            bevelSize: 2,
            bevelOffset: 1,
            bevelSegments: 3,
        }

        const topGeometry = new THREE.ExtrudeGeometry(topShape, topExtrudeSettings)
        const bottomGeometry = new THREE.ExtrudeGeometry(bottomShape, bottomExtrudeSettings)

        const material = new THREE.MeshPhongMaterial({
            color: 0xc0c0c0,
            // wireframe: true,
        })

        const bottomMesh = new THREE.Mesh(topGeometry, material)
        carGroup.add(bottomMesh)

        const topMesh = new THREE.Mesh(bottomGeometry, material)
        carGroup.add(topMesh)

        // Adjust the position of the car parts within carGroup
        bottomMesh.position.set(-4, 5, -9)
        topMesh.position.set(-4, 5, -9)
    } catch (error) {
        console.error(`generateCarBody : ${error}`)
    }
}

// Generate wheels
const generateWheels = () => {
    try {
        const geometry_cylinder = new THREE.CylinderGeometry(5, 5, 3, 10)
        const material_cylinder = new THREE.MeshToonMaterial({
            color: 0x000000,
            // wireframe: true,
        })

        const createWheel = (x, y, z) => {
            const wheel = new THREE.Mesh(geometry_cylinder, material_cylinder)
            wheel.rotateZ(Math.radians(90))
            wheel.position.set(x, y, z) // y값을 0으로 설정
            wheelGroup.add(wheel)
        }

        createWheel(-8.5, 5, 8)
        createWheel(8.5, 5, 8)
        createWheel(-8.5, 5, -8)
        createWheel(8.5, 5, -8)
        carGroup.add(wheelGroup)
        scene.add(carGroup)
        document.addEventListener('keydown', onDocumentKeyDown)
        document.addEventListener('keyup', onDocumentKeyUp)
    } catch (error) {
        console.error(`generateWheels() : ${error}`)
    }
}

const onDocumentKeyDown = (event) => {
    try {
        keyCode = event.key || event.keyCode
        keyDownChk = true
    } catch (error) {
        console.error(`onDocumentKeyDown() : ${error}`)
    }
}

const onDocumentKeyUp = () => {
    try {
        keyDownChk = false
    } catch (error) {
        console.error(`onDocumentKeyUp() : ${error}`)
    }
}

// Utility function to convert degrees to radians
Math.radians = (degrees) => {
    try {
        return (degrees * Math.PI) / 180
    } catch (error) {
        console.error(`Math.radians() : ${error}`)
    }
}

// Animate the scene
const moveCar = (deltaZ, deltaX, rotationIncrement) => {
    try {
        carGroup.position.z += deltaZ

        carGroup.position.x += deltaX

        wheelGroup.children.forEach((item) => {
            item.rotation.x += rotationIncrement
        })
    } catch (error) {
        console.error(`moveCar() : ${error}`)
    }
}

const rotateCar = (direction) => {
    try {
        carGroup.rotation.y += Math.radians(direction)
    } catch (error) {
        console.error(`rotateCar() : ${error}`)
    }
}

const animate = () => {
    try {
        if (keyDownChk) {
            if (keyCode === 'ArrowUp' || keyCode === 38 || keyCode === 87 || keyCode === 'w' || keyCode === 'ㅈ') {
                moveCar(1, 0, 0.1)
            } else if (
                keyCode === 'ArrowDown' ||
                keyCode === 40 ||
                keyCode === 83 ||
                keyCode === 's' ||
                keyCode === 'ㄴ'
            ) {
                moveCar(-1, 0, -0.1)
            } else if (
                keyCode === 'ArrowLeft' ||
                keyCode === 37 ||
                keyCode === 65 ||
                keyCode === 'a' ||
                keyCode === 'ㅁ'
            ) {
                moveCar(0, 1, 0)
                rotateCar(1)
            } else if (
                keyCode === 'ArrowRight' ||
                keyCode === 39 ||
                keyCode === 68 ||
                keyCode === 'd' ||
                keyCode === 'ㅇ'
            ) {
                moveCar(0, -1, 0)
                rotateCar(-1)
            } else if (keyCode === 'r' || keyCode === 'ㄱ' || keyCode === 83 || keyCode === '82') {
                // 수직 이착륙 모드일 때 y축 상승
                carGroup.position.y += 1
            } else if (keyCode === 'v' || keyCode === 'ㅍ' || keyCode === 86 || keyCode === '85') {
                if (wheelGroup.position.y >= 1) {
                    carGroup.position.y -= 1
                }
                // 수직 이착륙 모드일 때 y축 하강
            }
        }

        // camera.lookAt(scene.position)
        camera.updateProjectionMatrix()

        controls.update()
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
    } catch (error) {
        console.error(`animate() : ${error}`)
    }
}

// Handle window resize
const stageResize = () => {
    try {
        WIDTH = window.innerWidth
        HEIGHT = window.innerHeight

        renderer.setSize(WIDTH, HEIGHT)
        camera.aspect = WIDTH / HEIGHT
    } catch (error) {
        console.error(`stageResize() : ${error}`)
    }
}

// Initialize the scene and start animation
const init = () => {
    try {
        initScene()
        generateCarBody()
        generateWheels()
        addLights()
        animate()

        window.addEventListener('resize', stageResize)
    } catch (error) {
        console.error(`init() : ${error}`)
    }
}

init()
