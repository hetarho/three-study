import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from '@react-three/fiber'
import { LessonLayout } from '~/components/LessonLayout'
import { OrbitControls, Sphere, Plane, useHelper } from '@react-three/drei'
import { useControls } from 'leva'
import * as THREE from 'three'

export const Route = createFileRoute('/lesson/06-lights')({
  component: LightsLesson,
})

function LightsScene() {
  // Leva 컨트롤 설정
  // 값을 변경하면 리액트가 컴포넌트를 다시 렌더링하여 화면에 즉시 반영됩니다.
  const { 
    ambientIntensity, 
    ambientColor,
    directionalIntensity, 
    directionalColor,
    pointIntensity, 
    pointColor,
    spotIntensity,
    spotColor
  } = useControls({
    // Ambient Light (환경광): 모든 물체를 균일하게 비추는 빛. 그림자가 생기지 않음.
    ambientIntensity: { value: 0.3, min: 0, max: 2, label: 'Ambient 세기' },
    ambientColor: { value: '#ffffff', label: 'Ambient 색상' },
    
    // Directional Light (직사광): 태양처럼 멀리서 한 방향으로 비추는 빛. 그림자 생성 가능.
    directionalIntensity: { value: 1, min: 0, max: 5, label: 'Directional 세기' },
    directionalColor: { value: '#ffffff', label: 'Directional 색상' },
    
    // Point Light (점광원): 전구처럼 한 지점에서 모든 방향으로 퍼지는 빛.
    pointIntensity: { value: 1, min: 0, max: 5, label: 'Point 세기' },
    pointColor: { value: '#ff0000', label: 'Point 색상' },
    
    // Spot Light (스포트라이트): 무대 조명처럼 원뿔 모양으로 비추는 빛.
    spotIntensity: { value: 1, min: 0, max: 5, label: 'Spot 세기' },
    spotColor: { value: '#0000ff', label: 'Spot 색상' },
  })

  // 조명에 대한 참조(Reference) 생성
  // useHelper를 사용하기 위해 필요합니다.
  const directionalRef = React.useRef<THREE.DirectionalLight>(null!)
  const pointRef = React.useRef<THREE.PointLight>(null!)
  const spotRef = React.useRef<THREE.SpotLight>(null!)

  // 조명의 위치와 방향을 시각적으로 보여주는 헬퍼(Helper) 연결
  // 개발 중에 조명이 어디 있는지 확인하기 좋습니다.
  useHelper(directionalRef, THREE.DirectionalLightHelper, 1)
  useHelper(pointRef, THREE.PointLightHelper, 0.5)
  useHelper(spotRef, THREE.SpotLightHelper, 'blue')

  return (
    <>
      {/* Ambient Light: 전체적인 밝기를 담당 */}
      <ambientLight intensity={ambientIntensity} color={ambientColor} />
      
      {/* Directional Light: 주광원 (태양 역할) */}
      <directionalLight
        ref={directionalRef}
        position={[5, 5, 5]}
        intensity={directionalIntensity}
        color={directionalColor}
      />

      {/* Point Light: 붉은색 전구 역할 */}
      <pointLight
        ref={pointRef}
        position={[-5, 5, -5]}
        intensity={pointIntensity}
        color={pointColor}
      />

      {/* Spot Light: 파란색 스포트라이트 */}
      <spotLight
        ref={spotRef}
        position={[0, 5, 0]}
        intensity={spotIntensity}
        angle={0.3}
        penumbra={1}
        color={spotColor}
      />

      {/* 빛을 받는 물체 (구) */}
      <Sphere args={[0.5, 32, 32]} position={[0, 0.5, 0]}>
        {/* StandardMaterial은 빛에 반응하는 재질입니다. */}
        <meshStandardMaterial color="white" roughness={0.1} metalness={0.1} />
      </Sphere>
      
      {/* 바닥 */}
      <Plane args={[10, 10]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#444" />
      </Plane>
    </>
  )
}

import { Leva } from 'leva'

function LightsLesson() {
  return (
    <LessonLayout
      title="06. 조명 (Lights)"
      description="3D 장면에서 조명은 필수적입니다. 다양한 조명의 종류와 속성을 실험해보세요. 우측 패널에서 값을 조절할 수 있습니다."
    >
      {/* Leva 패널의 너비를 늘려서 한글 라벨이 잘 보이도록 설정 */}
      <Leva theme={{ sizes: { rootWidth: '350px' } }} />
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <LightsScene />
        <OrbitControls makeDefault />
      </Canvas>
    </LessonLayout>
  )
}
