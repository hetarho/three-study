import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from '@react-three/fiber'
import { LessonLayout } from '~/components/LessonLayout'
import { OrbitControls, useGLTF, Stage } from '@react-three/drei'

export const Route = createFileRoute('/lesson/11-loading-models')({
  component: ModelsLesson,
})

function Model() {
  // useGLTF: 외부 GLTF/GLB 파일을 로드합니다.
  // scene 객체는 로드된 모델의 루트 노드를 포함합니다.
  const { scene } = useGLTF('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb')
  return <primitive object={scene} />
}

function ModelsLesson() {
  return (
    <LessonLayout
      title="11. 모델 로딩 (Loading Models)"
      description="외부 파일에서 3D 모델을 로드할 수 있습니다. 이 예제는 오리 GLTF(GLB) 모델을 로드합니다."
    >
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
        <Stage environment="city" intensity={0.6}>
          {/* Suspense: 모델이 로드되는 동안 앱이 멈추지 않도록 처리합니다. */}
          <React.Suspense fallback={null}>
            <Model />
          </React.Suspense>
        </Stage>
        <OrbitControls makeDefault />
      </Canvas>
    </LessonLayout>
  )
}
