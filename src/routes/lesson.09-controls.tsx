import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from '@react-three/fiber'
import { LessonLayout } from '~/components/LessonLayout'
import { OrbitControls, FlyControls, FirstPersonControls, Box, Sphere, Grid } from '@react-three/drei'
import { useControls } from 'leva'

export const Route = createFileRoute('/lesson/09-controls')({
  component: ControlsLesson,
})

function ControlsScene() {
  const { controlType } = useControls({
    controlType: { options: ['Orbit', 'Fly', 'FirstPerson'], label: '컨트롤 방식' },
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      <Grid infiniteGrid fadeDistance={50} />

      <group>
        <Box args={[2, 2, 2]} position={[-5, 1, -5]}>
          <meshStandardMaterial color="orange" />
        </Box>
        <Sphere args={[1.5, 32, 32]} position={[0, 1.5, 0]}>
          <meshStandardMaterial color="hotpink" />
        </Sphere>
        <Box args={[2, 2, 2]} position={[5, 1, 5]}>
          <meshStandardMaterial color="blue" />
        </Box>
      </group>

      {/* OrbitControls: 대상을 중심으로 회전 (가장 많이 사용됨) */}
      {controlType === 'Orbit' && <OrbitControls makeDefault />}
      {/* FlyControls: 비행기처럼 자유롭게 이동 (WASD + 마우스) */}
      {controlType === 'Fly' && <FlyControls movementSpeed={5} rollSpeed={0.5} dragToLook makeDefault />}
      {/* FirstPersonControls: 1인칭 시점 이동 */}
      {controlType === 'FirstPerson' && <FirstPersonControls lookSpeed={0.1} movementSpeed={5} makeDefault />}
    </>
  )
}

function ControlsLesson() {
  return (
    <LessonLayout
      title="09. 컨트롤 (Controls)"
      description="컨트롤을 통해 사용자가 장면과 상호작용할 수 있습니다. Orbit(중심 회전), Fly(자유 비행), FirstPerson(1인칭) 모드를 전환해보세요."
    >
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <ControlsScene />
      </Canvas>
    </LessonLayout>
  )
}
