import { createFileRoute } from "@tanstack/react-router";
import { TheoryLayout } from "~/components/TheoryLayout";
import { CodeBlock } from "~/components/CodeBlock";

export const Route = createFileRoute("/theory/04-materials-shaders")({
  component: MaterialsShadersTheory,
});

function MaterialsShadersTheory() {
  return (
    <TheoryLayout
      title="04. 쉐이더 청크와 프로그램 캐시 (Shader Internals)"
      prevLink="/theory/03-buffer-geometry"
      nextLink="/theory/05-r3f-internals"
    >
      <p>
        Three.js의 가장 큰 마법 중 하나는 수천 줄의 GLSL 코드를 자동으로
        생성해준다는 것입니다. 이 마법의 핵심에는 <strong>ShaderChunk</strong>와{" "}
        <strong>ProgramCache</strong>가 있습니다.
      </p>

      <h2>1. ShaderChunk 시스템</h2>
      <p>
        Three.js는 거대한 GLSL 문자열을 조각조각 잘라서 관리합니다. 이를{" "}
        <strong>ShaderChunk</strong>라고 합니다.
        <code>MeshStandardMaterial</code> 같은 내장 재질들은 이 청크들을 레고
        블록처럼 조립해서 만들어집니다.
      </p>
      <p>
        우리가 <code>onBeforeCompile</code>을 사용하면 이 조립 과정에 개입하여
        원하는 코드를 끼워 넣을 수 있습니다.
      </p>

      <CodeBlock
        fileName="onBeforeCompile.js"
        code={`const material = new THREE.MeshStandardMaterial({ color: 'blue' });

material.onBeforeCompile = (shader) => {
  // shader.vertexShader와 shader.fragmentShader에는 
  // 이미 조립된 GLSL 코드가 들어있습니다.
  
  // 기존 코드를 찾아서 내가 원하는 코드로 바꿔치기(Injection)
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>', // Three.js의 내장 청크
    \`
    #include <begin_vertex>
    // 내 커스텀 로직 추가: y좌표를 사인파로 흔들기
    transformed.y += sin(position.x * 10.0) * 0.5;
    \`
  );
  
  // Uniform 변수 추가
  shader.uniforms.uTime = { value: 0 };
};`}
      />

      <h2>2. WebGLProgram과 Program Cache</h2>
      <p>
        GLSL 코드를 컴파일하고 링크하여 GPU에서 실행 가능한 상태로 만든 것을{" "}
        <strong>WebGLProgram</strong>이라고 합니다. 이 과정은 매우 비싼
        연산(수십~수백 ms 소요)입니다. 따라서 Three.js는 한 번 만든 프로그램을
        절대 버리지 않고 캐싱합니다.
      </p>

      <h3>캐시 키(Cache Key) 생성 원리</h3>
      <p>
        Three.js는 재질의 속성들을 조합하여 긴 문자열(Hash)을 만듭니다. 예를
        들어, 조명이 있는지, 안개가 있는지, 텍스처가 있는지 등을 확인합니다.
      </p>
      <CodeBlock
        fileName="ProgramCache.js"
        code={`// 개념적인 캐시 키 생성 로직
const cacheKey = [
  material.type,
  scene.fog ? 'fog' : 'no-fog',
  renderer.outputEncoding,
  material.map ? 'map' : 'no-map',
  // ... 수십 가지 속성
].join('_');

// 이미 이 키로 컴파일된 프로그램이 있다면 재사용!
const program = programCache.get(cacheKey);`}
      />

      <p>
        <strong>주의:</strong> 재질의 속성을 런타임에 바꾸면(예:{" "}
        <code>material.map = texture</code> 추가), 캐시 키가 달라져서{" "}
        <strong>재컴파일(Recompile)</strong>이 발생할 수 있습니다. 이는 순간적인
        프레임 드랍(Stuttering)의 주원인이 됩니다.
      </p>

      <h2>3. Uniforms vs Defines</h2>
      <p>쉐이더에 데이터를 넘기는 방법은 두 가지가 있습니다.</p>
      <ul>
        <li>
          <strong>Uniform</strong>: 런타임에 값을 바꿀 수 있음. (예: 시간,
          마우스 위치)
        </li>
        <li>
          <strong>Define</strong>: <code>#define PI 3.14</code>처럼 컴파일
          타임에 상수로 박제됨. 값을 바꾸면 재컴파일 필요.
        </li>
      </ul>
      <p>
        Three.js는 성능을 위해 가능한 많은 것을 Define으로 처리하려고 합니다.
        예를 들어 조명의 개수는 Define으로 박혀있습니다. 따라서 조명을 하나 더
        추가하면 쉐이더를 다시 컴파일해야 합니다.
      </p>
    </TheoryLayout>
  );
}
