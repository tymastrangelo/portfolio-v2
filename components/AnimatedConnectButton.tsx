'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    THREE: any
  }
}

export default function AnimatedConnectButton() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Load Three.js UMD build (exposes to window.THREE)
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    script.onload = () => {
      setTimeout(initScene, 100) // Small delay to ensure THREE is ready
    }
    document.head.appendChild(script)

    const initScene = () => {
      const THREE = (window as any).THREE
      if (!THREE) return

      const container = containerRef.current
      if (!container) return

      const scene = new THREE.Scene()
      const width = container.clientWidth
      const height = container.clientHeight

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
      camera.position.z = 5

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.domElement.style.display = 'block'
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      renderer.domElement.style.position = 'absolute'
      renderer.domElement.style.top = '0'
      renderer.domElement.style.left = '0'
      renderer.domElement.style.zIndex = '20'
      container.appendChild(renderer.domElement)

      // Lights
      scene.add(new THREE.AmbientLight(0xffffff, 0.5))
      const pointLight = new THREE.PointLight(0xffffff, 2)
      pointLight.position.set(2, 3, 4)
      scene.add(pointLight)

      // Glass material
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0,
        metalness: 0.1,
        transmission: 0.95,
        thickness: 0.5,
        ior: 1.5,
        opacity: 0.8,
        transparent: true,
        clearcoat: 1,
      })

      // Geometry
      const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 128, 32)
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      // Animation loop
      let animationId: number
      const animate = () => {
        animationId = requestAnimationFrame(animate)
        mesh.rotation.x += 0.01
        mesh.rotation.y += 0.015
        renderer.render(scene, camera)
      }
      animate()

      // Handle resize
      const handleResize = () => {
        const newWidth = container.clientWidth
        const newHeight = container.clientHeight
        camera.aspect = newWidth / newHeight
        camera.updateProjectionMatrix()
        renderer.setSize(newWidth, newHeight)
      }
      window.addEventListener('resize', handleResize)

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize)
        cancelAnimationFrame(animationId)
        renderer.dispose()
        geometry.dispose()
        material.dispose()
        if (container && renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement)
        }
      }
    }

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"]'
      )
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  return (
    <a
      href="mailto:mastrangelo.tyler@gmail.com"
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-24 h-24 rounded-full flex items-center justify-center overflow-hidden cursor-hover group"
      style={{ transform: 'translateX(-50%)' }}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 rounded-full"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="absolute inset-0 rounded-full bg-black/40 backdrop-blur-md border border-white/20 group-hover:border-white/40 group-hover:bg-black/50 transition-all z-10" />
      <span className="text-xs text-white font-medium uppercase tracking-wider relative z-30">
        Connect
      </span>
    </a>
  )
}
