import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from '@react-three/fiber'
import { LessonLayout } from '~/components/LessonLayout'
import { OrbitControls, PerspectiveCamera, OrthographicCamera, Box, Sphere } from '@react-three/drei'
import { useControls } from 'leva'

export const Route = createFileRoute('/lesson/08-cameras')({
  component: CamerasLesson,
})

function CameraScene() {
  const { cameraType, fov, zoom } = useControls({
    cameraType: { options: ['Perspective', 'Orthographic'], label: '카메라 종류' },
    fov: { value: 50, min: 10, max: 100, render: (get) => get('cameraType') === 'Perspective', label: '시야각 (FOV)' },
    zoom: { value: 1, min: 0.1, max: 5, render: (get) => get('cameraType') === 'Orthographic', label: '줌 (Zoom)' },
  })

  return (
    <>
      {/* PerspectiveCamera: 원근법 적용 (가까운 건 크게, 먼 건 작게) - 사람 눈과 유사 */}
      {cameraType === 'Perspective' ? (
        <PerspectiveCamera key="perspective" makeDefault position={[0, 0, 10]} fov={fov} />
      ) : (
        /* OrthographicCamera: 원근법 없음 (거리에 상관없이 크기 일정) - 2D 게임이나 설계도면 등에 사용 */
        <OrthographicCamera key="orthographic" makeDefault position={[0, 0, 10]} zoom={zoom * 40} />
      )}

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      <group>
        <Box args={[2, 2, 2]} position={[-3, 0, -5]} rotation={[0, 0.5, 0]}>
          <meshStandardMaterial color="orange" />
        </Box>
        <Sphere args={[1.5, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial color="hotpink" />
        </Sphere>
        <Box args={[2, 2, 2]} position={[3, 0, 5]} rotation={[0, -0.5, 0]}>
          <meshStandardMaterial color="blue" />
        </Box>
      </group>

      <OrbitControls />
    </>
  )
}

function CamerasLesson() {
  return (
    <LessonLayout
      title="08. 카메라 (Cameras)"
      description="카메라는 시점을 정의합니다. Perspective(원근) 카메라는 사람의 눈처럼 멀리 있는 것을 작게 보여주고, Orthographic(직교) 카메라는 거리에 상관없이 일정한 크기로 보여줍니다."
    >
      <Canvas>
        <CameraScene />
      </Canvas>
    </LessonLayout>
  )
}
