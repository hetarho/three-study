import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from '@react-three/fiber'
import { LessonLayout } from '~/components/LessonLayout'
import { OrbitControls, Sphere, Stage } from '@react-three/drei'
import { useControls } from 'leva'

export const Route = createFileRoute('/lesson/03-materials')({
  component: MaterialsLesson,
})

function MaterialShowcase() {
  const { materialType, color, roughness, metalness, wireframe } = useControls({
    materialType: { options: ['Standard', 'Physical', 'Basic', 'Normal'], label: '재질 종류' },
    color: { value: '#4f46e5', label: '색상' },
    roughness: { value: 0.5, min: 0, max: 1, label: '거칠기 (Roughness)' },
    metalness: { value: 0.5, min: 0, max: 1, label: '금속성 (Metalness)' },
    wireframe: { value: false, label: '와이어프레임' },
  })

  return (
    <Sphere args={[1, 64, 64]}>
      {/* Standard: 물리 기반 렌더링(PBR)의 표준 재질. 빛, 거칠기, 금속성에 반응 */}
      {materialType === 'Standard' && (
        <meshStandardMaterial
          key="standard"
          color={color}
          roughness={roughness}
          metalness={metalness}
          wireframe={wireframe}
        />
      )}
      {/* Physical: Standard의 확장판. 클리어코트(자동차 도장 같은 코팅) 등 고급 효과 지원 */}
      {materialType === 'Physical' && (
        <meshPhysicalMaterial
          key="physical"
          color={color}
          roughness={roughness}
          metalness={metalness}
          clearcoat={1}
          clearcoatRoughness={0.1}
          wireframe={wireframe}
        />
      )}
      {/* Basic: 빛에 반응하지 않는 가장 단순한 재질. 그림자가 생기지 않음 */}
      {materialType === 'Basic' && (
        <meshBasicMaterial key="basic" color={color} wireframe={wireframe} />
      )}
      {/* Normal: 표면의 법선 벡터(Normal Vector)를 색상으로 시각화. 디버깅용으로 유용 */}
      {materialType === 'Normal' && (
        <meshNormalMaterial key="normal" wireframe={wireframe} />
      )}
    </Sphere>
  )
}

import { Leva } from 'leva'

function MaterialsLesson() {
  return (
    <LessonLayout
      title="03. 재질 (Materials)"
      description="재질(Material)은 물체가 빛과 어떻게 상호작용하는지를 정의합니다. 컨트롤을 사용하여 다양한 재질과 속성을 실험해보세요."
    >
      <Leva theme={{ sizes: { rootWidth: '350px' } }} />
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
        <Stage environment="city" intensity={0.6}>
          <MaterialShowcase />
        </Stage>
        <OrbitControls makeDefault />
      </Canvas>
    </LessonLayout>
  )
}
