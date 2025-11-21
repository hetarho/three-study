import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from '@react-three/fiber'
import { LessonLayout } from '~/components/LessonLayout'
import { OrbitControls, Sphere } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { useControls } from 'leva'

export const Route = createFileRoute('/lesson/15-post-processing')({
  component: PostProcessingLesson,
})

function PostProcessingScene() {
  const { bloomIntensity, vignetteDarkness } = useControls({
    bloomIntensity: { value: 1, min: 0, max: 5, label: '블룸(Bloom) 세기' },
    vignetteDarkness: { value: 0.5, min: 0, max: 1, label: '비네트(Vignette) 어두움' },
  })

  return (
    <>
      <color attach="background" args={['#111']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* emissive 속성을 사용하여 스스로 빛을 내는 것처럼 보이게 합니다. Bloom 효과와 함께 사용하면 좋습니다. */}
      <Sphere args={[1, 32, 32]} position={[-2, 0, 0]}>
        <meshStandardMaterial color="hotpink" emissive="hotpink" emissiveIntensity={2} />
      </Sphere>

      <Sphere args={[1, 32, 32]} position={[2, 0, 0]}>
        <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={2} />
      </Sphere>

      {/* EffectComposer: 포스트 프로세싱 효과들을 조합합니다. */}
      <EffectComposer>
        {/* Bloom: 밝은 영역을 빛나게(번지게) 만듭니다. */}
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} mipmapBlur intensity={bloomIntensity} />
        {/* Vignette: 화면 가장자리를 어둡게 하여 시선을 중앙으로 모읍니다. */}
        <Vignette eskil={false} offset={0.1} darkness={vignetteDarkness} />
      </EffectComposer>

      <OrbitControls makeDefault />
    </>
  )
}

function PostProcessingLesson() {
  return (
    <LessonLayout
      title="15. 후처리 (Post Processing)"
      description="후처리(Post-processing) 효과는 장면이 렌더링된 후에 적용됩니다. Bloom은 밝은 물체를 빛나게 하고, Vignette는 가장자리를 어둡게 합니다."
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <PostProcessingScene />
      </Canvas>
    </LessonLayout>
  )
}
