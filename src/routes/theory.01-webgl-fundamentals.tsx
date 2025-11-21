import { createFileRoute } from "@tanstack/react-router";
import { TheoryLayout } from "~/components/TheoryLayout";
import { CodeBlock } from "~/components/CodeBlock";

export const Route = createFileRoute("/theory/01-webgl-fundamentals")({
  component: WebGLFundamentals,
});

function WebGLFundamentals() {
  return (
    <TheoryLayout
      title="01. WebGL 파이프라인 심층 분석 (The Pipeline)"
      nextLink="/theory/02-scene-graph"
    >
      <p>
        Three.js를 제대로 이해하려면 먼저 <strong>WebGL</strong>이 무엇인지
        알아야 합니다. WebGL은 웹 브라우저에서 GPU를 활용해 3D 그래픽을
        렌더링하는 저수준 API입니다. Three.js는 이 복잡한 WebGL을 쉽게 사용할 수
        있도록 도와주는 라이브러리죠.
      </p>
      <p>
        WebGL의 내부 동작 원리를 이해하면, 성능 문제를 해결하고 더 효율적인 3D
        애플리케이션을 만들 수 있습니다. 이제{" "}
        <strong>GPU 파이프라인의 각 단계</strong>에서 무슨 일이 일어나는지
        차근차근 알아보겠습니다.
      </p>

      <h2>1. Draw Call의 해부 (Anatomy of a Draw Call)</h2>
      <p>
        <code>renderer.render(scene, camera)</code>를 호출하면, Three.js는
        내부적으로 수많은 준비 과정을 거쳐 최종적으로 <code>gl.drawArrays</code>{" "}
        또는 <code>gl.drawElements</code>를 호출합니다. 이것이{" "}
        <strong>Draw Call</strong>입니다.
      </p>
      <p>
        이 함수가 호출되는 순간, CPU는 GPU에게 "명령 대기열(Command Buffer)"을
        전송하고 손을 뗍니다. 이제부터는 GPU의 세상입니다.
      </p>

      <h2>2. GPU 파이프라인 단계별 상세 (The Pipeline Stages)</h2>

      <h3>Step 1: Vertex Specification (데이터 조립)</h3>
      <p>
        GPU는 VRAM(비디오 메모리)에 있는 <strong>Attribute Buffer</strong>에서
        데이터를 읽어옵니다. 이때 중요한 것은 <strong>Stride</strong>와{" "}
        <strong>Offset</strong>입니다.
      </p>
      <ul>
        <li>
          <strong>Stride</strong>: 다음 정점 데이터까지 몇 바이트를 건너뛰어야
          하는가?
        </li>
        <li>
          <strong>Offset</strong>: 이 속성(예: Position)은 정점 데이터의
          시작점에서 몇 바이트 떨어져 있는가?
        </li>
      </ul>

      <h3>Step 2: Vertex Shader (정점 처리)</h3>
      <p>
        읽어온 정점 하나하나마다 Vertex Shader 프로그램이 실행됩니다. 이 단계의
        핵심 임무는{" "}
        <strong>Local Space의 좌표를 Clip Space(-1.0 ~ 1.0)로 변환</strong>하는
        것입니다.
      </p>
      <CodeBlock
        language="glsl"
        fileName="vertex_transform.glsl"
        code={`// Three.js 내부의 실제 변환 로직 (간소화됨)
// attribute: 버퍼에서 읽어온 정점 데이터 (Read-only)
// uniform: CPU에서 보낸 전역 변수 (Read-only)
// varying: Fragment Shader로 보낼 데이터 (Write-only)

void main() {
  // 1. Local -> World (Model Matrix)
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  
  // 2. World -> View (View Matrix)
  vec4 viewPosition = viewMatrix * worldPosition;
  
  // 3. View -> Clip (Projection Matrix)
  gl_Position = projectionMatrix * viewPosition;
}`}
      />

      <h3>Step 3: Primitive Assembly & Rasterization (조립 및 래스터화)</h3>
      <p>
        Clip Space로 변환된 정점들은 <strong>Primitive Assembly</strong>{" "}
        단계에서 삼각형으로 조립됩니다. 그 후 <strong>Rasterization</strong>{" "}
        단계에서 이 삼각형이 화면의 어떤 픽셀(Fragment)을 덮는지 계산합니다.
      </p>
      <p>
        이때 <strong>Interpolation(보간)</strong>이 일어납니다. Vertex
        Shader에서 보낸 <code>varying</code> 데이터(색상, UV 등)가 삼각형 내부의
        각 픽셀 위치에 맞게 부드럽게 섞입니다. 이것은 하드웨어(Rasterizer)가
        자동으로 처리하는 고정 기능(Fixed Function)입니다.
      </p>

      <h3>Step 4: Fragment Shader (픽셀 처리)</h3>
      <p>
        생성된 각 Fragment(픽셀 후보)마다 Fragment Shader가 실행됩니다. 여기서
        최종 색상을 결정합니다. 텍스처를 읽거나(Texture Fetch), 조명을
        계산(Lighting Calculation)합니다.
      </p>

      <h3>Step 5: Per-Sample Operations (테스트 및 블렌딩)</h3>
      <p>
        Fragment Shader가 색상을 내뱉었다고 끝이 아닙니다. 마지막 관문들이
        남았습니다.
      </p>
      <ul>
        <li>
          <strong>Scissor Test</strong>: 그리기 영역 안에 있는가?
        </li>
        <li>
          <strong>Stencil Test</strong>: 스텐실 버퍼 조건에 맞는가?
        </li>
        <li>
          <strong>Depth Test</strong>: 이미 그려진 픽셀보다 앞에 있는가?
          (Z-Buffer 확인)
        </li>
        <li>
          <strong>Blending</strong>: 이미 그려진 색상과 어떻게 섞을 것인가?
          (Alpha Blending)
        </li>
      </ul>
      <p>이 테스트를 통과해야만 비로소 화면(Frame Buffer)에 기록됩니다.</p>

      <h2>3. Three.js의 역할: State Management</h2>
      <p>
        WebGL은 <strong>State Machine</strong>입니다. "지금부터 사용할 쉐이더는
        A야", "지금부터 사용할 버퍼는 B야"라고 상태를 설정해두면, 그 다음
        명령들은 모두 그 상태를 따릅니다.
      </p>
      <p>
        Three.js의 <code>WebGLRenderer</code>는 이 상태 변경을 최소화(State
        Sorting)하여 성능을 최적화합니다. 예를 들어, 같은 재질을 쓰는 물체끼리
        모아서 그리면 쉐이더 변경 비용을 아낄 수 있습니다.
      </p>
    </TheoryLayout>
  );
}
