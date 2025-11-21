import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from '@react-three/fiber'
import { LessonLayout } from '~/components/LessonLayout'
import { OrbitControls, Sphere, Environment, ContactShadows } from '@react-three/drei'
import { useControls } from 'leva'

export const Route = createFileRoute('/lesson/10-environment')({
  component: EnvironmentLesson,
})

function EnvironmentScene() {
  const { preset, background, blur } = useControls({
    preset: {
      options: ['sunset', 'dawn', 'night', 'warehouse', 'forest', 'apartment', 'studio', 'city', 'park', 'lobby'],
      value: 'sunset',
      label: '환경 프리셋'
    },
    background: { value: true, label: '배경 표시' },
    blur: { value: 0, min: 0, max: 1, label: '배경 흐림' },
  })

  return (
    <>
      {/* Environment: HDRI 이미지를 사용하여 사실적인 조명과 반사를 제공합니다. */}
      <React.Suspense fallback={null}>
        <Environment preset={preset as any} background={background} blur={blur} />
      </React.Suspense>
      
      <Sphere args={[1, 64, 64]} position={[0, 1, 0]}>
        {/* 금속 재질(metalness=1)은 환경 맵을 선명하게 반사합니다. */}
        <meshStandardMaterial roughness={0} metalness={1} />
      </Sphere>

      <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
      <OrbitControls makeDefault />
    </>
  )
}

function EnvironmentLesson() {
  return (
    <LessonLayout
      title="10. 환경 맵 (Environment)"
      description="환경 맵은 사실적인 조명과 반사 효과를 제공합니다. 프리셋을 변경하여 크롬 구체에 비치는 풍경이 어떻게 변하는지 확인해보세요."
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <EnvironmentScene />
      </Canvas>
    </LessonLayout>
  )
}
