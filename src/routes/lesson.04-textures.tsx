import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from '@react-three/fiber'
import { LessonLayout } from '~/components/LessonLayout'
import { OrbitControls, useTexture, Stage } from '@react-three/drei'
import { useControls } from 'leva'
import * as THREE from 'three'

export const Route = createFileRoute('/lesson/04-textures')({
  component: TexturesLesson,
})

function TexturedSphere() {
  // useTexture: URL에서 이미지를 로드하여 텍스처로 변환합니다.
  const props = useTexture({
    map: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/uv_grid_opengl.jpg',
  })
  
  const { displacementScale } = useControls({
    displacementScale: { value: 0, min: 0, max: 1, label: '변위(Displacement) 크기' },
  })

  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        {...props}
        displacementScale={displacementScale}
      />
    </mesh>
  )
}

function TexturesLesson() {
  return (
    <LessonLayout
      title="04. 텍스처 (Textures)"
      description="텍스처는 2D 이미지를 3D 표면에 입히는 것입니다. 이 예제는 UV 그리드 이미지를 구체에 매핑합니다."
    >
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
        <Stage environment="city" intensity={0.6}>
          <React.Suspense fallback={null}>
            <TexturedSphere />
          </React.Suspense>
        </Stage>
        <OrbitControls makeDefault />
      </Canvas>
    </LessonLayout>
  )
}
