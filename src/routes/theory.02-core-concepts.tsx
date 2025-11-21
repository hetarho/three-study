import { createFileRoute } from '@tanstack/react-router'
import { TheoryLayout } from '~/components/TheoryLayout'

export const Route = createFileRoute('/theory/02-core-concepts')({
  component: TheoryCoreConcepts,
})

function TheoryCoreConcepts() {
  return (
    <TheoryLayout
      title="02. 핵심 개념 (Core Concepts)"
      prevLink="/theory/01-intro"
    >
      <p>
        Three.js로 3D 장면을 만들기 위해서는 반드시 필요한 3가지 요소가 있습니다. 
        이것들은 영화 촬영 현장과 매우 비슷합니다.
      </p>

      <h2>1. 장면 (Scene)</h2>
      <p>
        장면은 모든 물체, 조명, 카메라가 배치되는 <strong>무대</strong>입니다. 
        우리가 만들고자 하는 3D 세계의 컨테이너라고 생각하면 됩니다.
        R3F에서는 <code>&lt;Canvas&gt;</code> 컴포넌트가 이 역할을 대신하며 자동으로 Scene을 생성해줍니다.
      </p>

      <h2>2. 카메라 (Camera)</h2>
      <p>
        카메라는 이 무대를 <strong>바라보는 눈</strong>입니다. 
        카메라의 위치와 각도에 따라 화면에 보이는 모습이 달라집니다.
      </p>
      <ul>
        <li><strong>PerspectiveCamera (원근 카메라)</strong>: 사람의 눈처럼 멀리 있는 물체는 작게 보입니다. 가장 일반적으로 사용됩니다.</li>
        <li><strong>OrthographicCamera (직교 카메라)</strong>: 거리에 상관없이 물체의 크기가 일정하게 보입니다. 2D 게임이나 설계 도면 등에 사용됩니다.</li>
      </ul>

      <h2>3. 렌더러 (Renderer)</h2>
      <p>
        렌더러는 장면과 카메라의 정보를 바탕으로 실제 화면에 <strong>그림을 그리는 화가</strong>입니다. 
        매 프레임마다 계산을 수행하여 3D 공간을 2D 화면(픽셀)으로 변환합니다.
        R3F의 <code>&lt;Canvas&gt;</code>는 내부적으로 WebGLRenderer를 생성하고 관리해줍니다.
      </p>

      <h2>4. 메쉬 (Mesh)</h2>
      <p>
        실제로 화면에 보이는 <strong>물체</strong>입니다. 메쉬는 두 가지 요소로 구성됩니다.
      </p>
      <ul>
        <li><strong>Geometry (기하학)</strong>: 물체의 뼈대나 형상 (예: 상자 모양, 구 모양)</li>
        <li><strong>Material (재질)</strong>: 물체의 표면 색상이나 질감 (예: 빨간색 플라스틱, 반짝이는 금속)</li>
      </ul>
      
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>
{`<mesh>
  <boxGeometry />       {/* 모양 */}
  <meshStandardMaterial color="orange" /> {/* 재질 */}
</mesh>`}
        </code>
      </pre>
    </TheoryLayout>
  )
}
