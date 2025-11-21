import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Canvas, useFrame } from '@react-three/fiber'
import { LessonLayout } from '~/components/LessonLayout'
import { OrbitControls, Text, Float } from '@react-three/drei'

export const Route = createFileRoute('/lesson/14-text')({
  component: TextLesson,
})

function TextScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Float: 자식 요소를 둥둥 떠다니게 만드는 헬퍼 */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Text: SDF(Signed Distance Field)를 사용하여 확대해도 깨지지 않는 텍스트 렌더링 */}
        <Text
          fontSize={1}
          color="#4f46e5"
          anchorX="center"
          anchorY="middle"
          position={[0, 0, 0]}
        >
          Hello Three.js!
        </Text>
      </Float>

      <Text
        fontSize={0.5}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
        position={[0, -1.5, 0]}
      >
        (SDF Text)
      </Text>

      <OrbitControls makeDefault />
    </>
  )
}

function TextLesson() {
  return (
    <LessonLayout
      title="14. 텍스트 (Text)"
      description="3D 공간에 텍스트를 렌더링하는 것은 @react-three/drei를 사용하면 쉽습니다. SDF(Signed Distance Fields)를 사용하여 어떤 줌 레벨에서도 선명한 텍스트를 보여줍니다."
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <TextScene />
      </Canvas>
    </LessonLayout>
  )
}
