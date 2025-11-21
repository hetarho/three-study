import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Canvas, useFrame } from '@react-three/fiber'
import { LessonLayout } from '~/components/LessonLayout'
import { OrbitControls, Sphere, Plane, SoftShadows } from '@react-three/drei'
import { useControls } from 'leva'
import * as THREE from 'three'

export const Route = createFileRoute('/lesson/07-shadows')({
  component: ShadowsLesson,
})

function ShadowScene() {
  const { lightPosition, shadowMapSize } = useControls({
    lightPosition: { value: [5, 5, 5], step: 0.1, label: '조명 위치' },
    shadowMapSize: { value: 1024, options: [512, 1024, 2048, 4096], label: '그림자 해상도' },
  })

  const sphereRef = React.useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    sphereRef.current.position.y = Math.sin(state.clock.elapsedTime) * 1.5 + 2
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        castShadow // 그림자를 생성하도록 설정
        position={lightPosition}
        intensity={1.5}
        shadow-mapSize={[shadowMapSize, shadowMapSize]} // 그림자 맵 크기 설정 (클수록 선명함)
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* castShadow: 이 물체는 그림자를 만듭니다 */}
      <Sphere ref={sphereRef} castShadow args={[1, 32, 32]} position={[0, 2, 0]}>
        <meshStandardMaterial color="hotpink" />
      </Sphere>

      {/* receiveShadow: 이 물체는 그림자를 받습니다 (바닥) */}
      <Plane receiveShadow args={[10, 10]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#f0f0f0" />
      </Plane>

      {/* SoftShadows: 그림자 경계를 부드럽게 처리 */}
      <SoftShadows size={10} samples={10} focus={0} />
    </>
  )
}

function ShadowsLesson() {
  return (
    <LessonLayout
      title="07. 그림자 (Shadows)"
      description="그림자는 깊이감과 사실감을 더해줍니다. 물체는 'castShadow'(그림자 생성)와 'receiveShadow'(그림자 받기) 속성을 가져야 하며, 조명도 'castShadow'가 켜져 있어야 합니다."
    >
      <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
        <ShadowScene />
        <OrbitControls makeDefault />
      </Canvas>
    </LessonLayout>
  )
}
