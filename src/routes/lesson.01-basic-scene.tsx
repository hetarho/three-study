import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { LessonLayout } from '~/components/LessonLayout'
import * as THREE from 'three'

export const Route = createFileRoute('/lesson/01-basic-scene')({
  component: BasicSceneLesson,
})

function Box(props: any) {
  // useRef: THREE.Mesh 객체에 직접 접근하기 위한 참조를 생성합니다.
  // 애니메이션이나 직접적인 조작이 필요할 때 사용합니다.
  const ref = useRef<THREE.Mesh>(null!)
  
  // useState: 컴포넌트의 상태(마우스 오버, 클릭 여부)를 관리합니다.
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  
  // useFrame: 매 프레임마다 실행되는 훅입니다. (보통 초당 60회)
  // 여기서 메쉬를 회전시켜 애니메이션을 만듭니다.
  useFrame((state, delta) => (ref.current.rotation.x += delta))
  
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      {/* boxGeometry: 정육면체 형태를 정의합니다. args는 [가로, 세로, 깊이] 입니다. */}
      <boxGeometry args={[1, 1, 1]} />
      {/* meshStandardMaterial: 빛에 반응하는 표준 재질입니다. */}
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function BasicSceneLesson() {
  return (
    <LessonLayout
      title="01. 기본 장면 (Basic Scene)"
      description="3D의 'Hello World'입니다. 회전하는 큐브를 통해 Canvas, Mesh, Geometry, Material의 기본 개념을 익힙니다."
    >
      <Canvas>
        {/* ambientLight: 모든 방향에서 균일하게 비추는 빛 */}
        <ambientLight intensity={Math.PI / 2} />
        {/* spotLight: 특정 방향으로 비추는 조명 */}
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        {/* pointLight: 한 지점에서 퍼져나가는 조명 */}
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
    </LessonLayout>
  )
}
