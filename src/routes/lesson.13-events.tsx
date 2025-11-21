import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from '@react-three/fiber'
import { LessonLayout } from '~/components/LessonLayout'
import { OrbitControls, Sphere } from '@react-three/drei'
import { useState } from 'react'

export const Route = createFileRoute('/lesson/13-events')({
  component: EventsLesson,
})

function InteractiveSphere({ position }: { position: [number, number, number] }) {
  const [hovered, setHover] = useState(false)
  const [clicked, setClick] = useState(false)

  return (
    <Sphere
      args={[1, 32, 32]}
      position={position}
      scale={clicked ? 1.5 : 1}
      onClick={(e) => {
        e.stopPropagation() // 이벤트 버블링 방지 (뒤에 있는 물체나 배경이 클릭되는 것 방지)
        setClick(!clicked)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHover(true)
      }}
      onPointerOut={(e) => setHover(false)}
    >
      <meshStandardMaterial color={clicked ? 'hotpink' : hovered ? 'orange' : 'white'} />
    </Sphere>
  )
}

function EventsLesson() {
  return (
    <LessonLayout
      title="13. 이벤트 (Events)"
      description="상호작용은 필수적입니다. 구체를 클릭하거나 마우스를 올려보세요. 'stopPropagation'이 이벤트 전파를 막는 것을 확인하세요."
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <InteractiveSphere position={[-2, 0, 0]} />
        <InteractiveSphere position={[2, 0, 0]} />
        
        <OrbitControls makeDefault />
      </Canvas>
    </LessonLayout>
  )
}
