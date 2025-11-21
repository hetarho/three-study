import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Canvas, useFrame } from '@react-three/fiber'
import { LessonLayout } from '~/components/LessonLayout'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

export const Route = createFileRoute('/lesson/12-particles')({
  component: ParticlesLesson,
})

function Particles() {
  const count = 5000
  // useMemo 대신 useState(initializer)를 사용하여 초기화 시 한 번만 계산하도록 합니다.
  const [positions] = React.useState(() => {
    const pos = new Float32Array(count * 3) // x, y, z 좌표를 위해 3배 크기 할당
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10     // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10 // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 // z
    }
    return pos
  })

  const points = React.useRef<THREE.Points>(null!)

  useFrame((state, delta) => {
    // 전체 입자 시스템을 천천히 회전시킵니다.
    points.current.rotation.x += delta * 0.1
    points.current.rotation.y += delta * 0.05
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        {/* bufferAttribute: GPU에 직접 데이터를 전달하여 성능을 최적화합니다. */}
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      {/* pointsMaterial: 입자를 렌더링하기 위한 재질 */}
      <pointsMaterial
        size={0.05}
        sizeAttenuation={true} // 거리에 따라 크기가 조절되도록 설정
        color="#ffffff"
        transparent
        opacity={0.8}
      />
    </points>
  )
}

function ParticlesLesson() {
  return (
    <LessonLayout
      title="12. 입자 (Particles)"
      description="입자(Particle) 시스템은 별, 먼지, 비와 같이 수천 개의 작은 물체를 효율적으로 렌더링할 때 사용됩니다."
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Particles />
        <OrbitControls makeDefault />
      </Canvas>
    </LessonLayout>
  )
}
