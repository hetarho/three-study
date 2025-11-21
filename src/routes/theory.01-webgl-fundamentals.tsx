import { createFileRoute } from '@tanstack/react-router'
import { TheoryLayout } from '~/components/TheoryLayout'
import { CodeBlock } from '~/components/CodeBlock'

export const Route = createFileRoute('/theory/01-webgl-fundamentals')({
  component: WebGLFundamentals,
})

function WebGLFundamentals() {
  return (
    <TheoryLayout
      title="01. WebGL 기초와 Three.js의 역할"
      nextLink="/theory/02-scene-graph"
    >
      <p>
        Three.js를 깊이 이해하려면, 그 기반이 되는 <strong>WebGL</strong>이 무엇인지 알아야 합니다.
        많은 분들이 Three.js를 단순히 "3D 라이브러리"로만 알고 계시지만, 사실은 WebGL이라는 매우 복잡한 시스템을 감싸고 있는 껍질(Wrapper)에 가깝습니다.
      </p>

      <h2>WebGL이란 무엇인가?</h2>
      <p>
        WebGL(Web Graphics Library)은 웹 브라우저에서 하드웨어 가속(GPU)을 사용하여 2D와 3D 그래픽을 렌더링하기 위한 로우 레벨(Low-level) API입니다.
        "로우 레벨"이라는 말은, 우리가 점 하나, 선 하나를 그리기 위해 컴퓨터에게 아주 구체적이고 복잡한 명령을 내려야 한다는 뜻입니다.
      </p>

      <h3>WebGL vs Three.js 코드 비교</h3>
      <p>
        화면에 삼각형 하나를 그리기 위해 필요한 코드를 비교해보면 Three.js가 얼마나 많은 일을 대신 해주는지 알 수 있습니다.
      </p>

      <h4>순수 WebGL 코드 (약 100줄 이상 필요)</h4>
      <CodeBlock
        fileName="webgl_triangle.js"
        code={`// 1. 캔버스 가져오기 & WebGL 컨텍스트 생성
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl');

// 2. 쉐이더 소스 코드 작성 (GLSL)
const vsSource = \`
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
\`;
const fsSource = \`
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
\`;

// 3. 쉐이더 컴파일 및 프로그램 링크 (생략된 복잡한 과정들...)
// 4. 버퍼 생성 및 데이터 전송
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [
  -1.0,  1.0,
   1.0,  1.0,
  -1.0, -1.0,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// 5. 그리기 명령
gl.drawArrays(gl.TRIANGLES, 0, 3);`}
      />

      <h4>Three.js 코드</h4>
      <CodeBlock
        fileName="three_triangle.js"
        code={`// 1. 장면, 카메라, 렌더러 설정
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// 2. 기하학(Geometry)과 재질(Material) 정의
const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
  -1.0, -1.0,  1.0,
   1.0, -1.0,  1.0,
   1.0,  1.0,  1.0
]);
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// 3. 메쉬 생성 및 장면에 추가
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);`}
      />

      <h2>Three.js가 해주는 일</h2>
      <p>
        위 예제에서 볼 수 있듯이, Three.js는 다음과 같은 복잡한 작업들을 추상화하여 제공합니다.
      </p>

      <ul>
        <li><strong>쉐이더 컴파일</strong>: 복잡한 GLSL 코드를 자동으로 생성하고 컴파일합니다.</li>
        <li><strong>버퍼 관리</strong>: CPU의 데이터를 GPU로 효율적으로 전송합니다.</li>
        <li><strong>수학 연산</strong>: 행렬(Matrix), 벡터(Vector), 쿼터니언(Quaternion) 등의 복잡한 수학 라이브러리를 제공합니다.</li>
        <li><strong>씬 그래프 관리</strong>: 물체 간의 부모-자식 관계를 쉽게 관리할 수 있게 해줍니다.</li>
      </ul>
    </TheoryLayout>
  )
}
