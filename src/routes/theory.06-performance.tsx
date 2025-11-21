import { createFileRoute } from '@tanstack/react-router'
import { TheoryLayout } from '~/components/TheoryLayout'
import { CodeBlock } from '~/components/CodeBlock'

export const Route = createFileRoute('/theory/06-performance')({
  component: PerformanceTheory,
})

function PerformanceTheory() {
  return (
    <TheoryLayout
      title="06. 성능 최적화 (Performance Optimization)"
      prevLink="/theory/05-r3f-internals"
    >
      <p>
        3D 웹 애플리케이션에서 성능은 매우 중요합니다. 
        초당 60프레임(60 FPS)을 유지하지 못하면 화면이 끊겨 보이고 사용자 경험이 나빠집니다.
        Three.js 성능 최적화의 핵심 기법들을 소개합니다.
      </p>

      <h2>1. 드로우 콜 (Draw Calls) 줄이기</h2>
      <p>
        GPU에게 "이거 그려줘"라고 명령하는 횟수를 <strong>드로우 콜</strong>이라고 합니다.
        물체가 1000개 있으면 1000번의 명령을 내려야 할까요? 그러면 CPU가 너무 바빠집니다.
      </p>
      
      <h3>Instancing (인스턴싱)</h3>
      <p>
        같은 모양의 물체(예: 숲속의 나무 1000그루)를 한 번의 명령으로 그리는 기술입니다.
        R3F에서는 <code>&lt;InstancedMesh&gt;</code>를 사용하여 구현할 수 있습니다.
      </p>

      <CodeBlock
        fileName="InstancingExample.jsx"
        code={`function Forest() {
  const meshRef = useRef()
  const count = 1000
  
  // 더미 객체로 행렬 계산을 미리 수행
  const dummy = new THREE.Object3D()

  useLayoutEffect(() => {
    for (let i = 0; i < count; i++) {
      // 랜덤한 위치와 크기 설정
      dummy.position.set(
        (Math.random() - 0.5) * 20,
        0,
        (Math.random() - 0.5) * 20
      )
      dummy.scale.setScalar(Math.random())
      dummy.updateMatrix()
      
      // i번째 인스턴스에 행렬 적용
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    // 변경 사항을 GPU에 알림
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry />
      <meshStandardMaterial color="green" />
    </instancedMesh>
  )
}`}
      />

      <h2>2. 기하학 단순화</h2>
      <p>
        멀리 있는 물체는 디테일하게 그릴 필요가 없습니다.
        점(Vertex)의 개수가 많을수록 GPU의 부하가 커집니다.
        필요 이상으로 <code>segments</code>를 높이지 마세요.
      </p>

      <CodeBlock
        fileName="GeometryOptimization.jsx"
        code={`// ❌ 나쁜 예: 너무 많은 세그먼트 (구 하나에 수만 개의 삼각형)
<Sphere args={[1, 128, 128]} />

// ✅ 좋은 예: 적절한 세그먼트 (눈으로 보기에 충분히 둥글다면 OK)
<Sphere args={[1, 32, 32]} />`}
      />

      <h2>3. 텍스처 최적화</h2>
      <p>
        너무 큰 텍스처 이미지는 로딩 시간을 늦추고 GPU 메모리를 많이 차지합니다.
        가능하면 텍스처 크기를 줄이고, 압축된 포맷(WebP, KTX2)을 사용하는 것이 좋습니다.
      </p>

      <h2>4. 불필요한 렌더링 방지</h2>
      <p>
        화면에 변화가 없을 때는 렌더링을 멈추는 것이 좋습니다.
        <code>&lt;Canvas frameloop="demand"&gt;</code>를 사용하면 필요할 때만 렌더링하여 배터리를 절약할 수 있습니다.
      </p>

      <h2>5. 객체 재사용 (Object Pooling)</h2>
      <p>
        총알이나 파티클처럼 자주 생성되고 사라지는 물체들은 매번 <code>new</code>로 만들지 말고, 
        미리 만들어둔 것을 재사용하는 것이 좋습니다. 
        자바스크립트의 가비지 컬렉션(Garbage Collection)으로 인한 끊김 현상을 막을 수 있습니다.
      </p>
    </TheoryLayout>
  )
}
