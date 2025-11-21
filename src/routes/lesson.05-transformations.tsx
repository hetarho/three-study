import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from '@react-three/fiber'
import { LessonLayout } from '~/components/LessonLayout'
import { OrbitControls, Grid, GizmoHelper, GizmoViewport } from '@react-three/drei'
import { useControls } from 'leva'

export const Route = createFileRoute('/lesson/05-transformations')({
  component: TransformationsLesson,
})

function TransformableBox() {
  const { position, rotation, scale } = useControls({
    position: { value: [0, 0, 0], step: 0.1, label: '위치 (Position)' },
    rotation: { value: [0, 0, 0], step: 0.1, label: '회전 (Rotation)' },
    scale: { value: [1, 1, 1], step: 0.1, label: '크기 (Scale)' },
  })

  return (
    // mesh의 속성으로 position, rotation, scale을 직접 전달할 수 있습니다.
    <mesh position={position} rotation={rotation} scale={scale}>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

import { Leva } from 'leva'

function TransformationsLesson() {
  return (
    <LessonLayout
      title="05. 변환 (Transformations)"
      description="3D 객체는 위치(Position), 회전(Rotation), 크기(Scale)를 변환할 수 있습니다. 컨트롤을 사용하여 상자를 조작해보세요."
    >
      <Leva theme={{ sizes: { rootWidth: '350px' } }} />
      <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <TransformableBox />
        <Grid infiniteGrid fadeDistance={30} />
        <OrbitControls makeDefault />
        {/* GizmoHelper: 우측 하단에 축 방향을 보여주는 나침반 같은 도구 */}
        {/* 빨강(X), 초록(Y), 파랑(Z) 선은 3차원 공간의 축을 나타냅니다. */}
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
        </GizmoHelper>
      </Canvas>
    </LessonLayout>
  )
}
