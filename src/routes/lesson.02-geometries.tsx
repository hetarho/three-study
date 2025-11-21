import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { LessonLayout } from '~/components/LessonLayout'
import * as THREE from 'three'
import { OrbitControls, Text } from '@react-three/drei'

export const Route = createFileRoute('/lesson/02-geometries')({
  component: GeometriesLesson,
})

function GeometryShowcase({ position, geometry, label }: { position: [number, number, number], geometry: React.ReactNode, label: string }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.2
    meshRef.current.rotation.y += delta * 0.5
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        {geometry}
        <meshStandardMaterial color={hovered ? '#4f46e5' : '#6366f1'} wireframe={false} />
      </mesh>
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  )
}

function GeometriesLesson() {
  return (
    <LessonLayout
      title="02. 기하학 (Geometries)"
      description="Three.js는 다양한 기본 도형(Geometry)을 제공합니다. 아래는 자주 사용되는 도형들입니다."
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* Box: 정육면체 (가로, 세로, 깊이) */}
        <GeometryShowcase position={[-4, 2, 0]} label="Box (상자)" geometry={<boxGeometry args={[1.5, 1.5, 1.5]} />} />
        {/* Sphere: 구 (반지름, 가로 분할수, 세로 분할수) - 분할수가 높을수록 매끄러움 */}
        <GeometryShowcase position={[0, 2, 0]} label="Sphere (구)" geometry={<sphereGeometry args={[1, 32, 32]} />} />
        {/* Cone: 원뿔 (반지름, 높이, 분할수) */}
        <GeometryShowcase position={[4, 2, 0]} label="Cone (원뿔)" geometry={<coneGeometry args={[1, 2, 32]} />} />
        
        {/* Cylinder: 원기둥 (윗면 반지름, 아랫면 반지름, 높이, 분할수) */}
        <GeometryShowcase position={[-4, -2, 0]} label="Cylinder (원기둥)" geometry={<cylinderGeometry args={[1, 1, 2, 32]} />} />
        {/* Torus: 도넛 모양 (반지름, 튜브 두께, 방사형 분할수, 튜브 분할수) */}
        <GeometryShowcase position={[0, -2, 0]} label="Torus (도넛)" geometry={<torusGeometry args={[1, 0.4, 16, 100]} />} />
        {/* TorusKnot: 꼬인 도넛 모양 */}
        <GeometryShowcase position={[4, -2, 0]} label="Torus Knot (매듭)" geometry={<torusKnotGeometry args={[0.8, 0.3, 100, 16]} />} />

        <OrbitControls />
      </Canvas>
    </LessonLayout>
  )
}
