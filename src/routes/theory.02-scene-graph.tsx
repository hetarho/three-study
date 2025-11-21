import { createFileRoute } from '@tanstack/react-router'
import { TheoryLayout } from '~/components/TheoryLayout'
import { CodeBlock } from '~/components/CodeBlock'

export const Route = createFileRoute('/theory/02-scene-graph')({
  component: SceneGraphTheory,
})

function SceneGraphTheory() {
  return (
    <TheoryLayout
      title="02. 씬 그래프와 행렬 (Scene Graph & Matrices)"
      prevLink="/theory/01-webgl-fundamentals"
      nextLink="/theory/03-buffer-geometry"
    >
      <p>
        3D 프로그램에서 물체들이 어떻게 배치되고 움직이는지 이해하려면 <strong>씬 그래프(Scene Graph)</strong>와 <strong>행렬(Matrix)</strong>의 개념이 필수적입니다.
      </p>

      <h2>씬 그래프 (Scene Graph)</h2>
      <p>
        Three.js의 <code>Scene</code>은 트리(Tree) 구조로 되어 있습니다. 이를 씬 그래프라고 부릅니다.
        모든 물체는 다른 물체의 자식(Child)이 될 수 있습니다.
      </p>
      
      <ul>
        <li><strong>부모(Parent)</strong>가 움직이면 <strong>자식(Children)</strong>도 따라 움직입니다.</li>
        <li>자식의 위치(Position), 회전(Rotation), 크기(Scale)는 부모를 기준으로 한 <strong>상대적인 값(Local Space)</strong>입니다.</li>
      </ul>

      <CodeBlock
        fileName="solar_system.js"
        code={`// 태양계 예시: 계층 구조 만들기
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
const moon = new THREE.Mesh(moonGeometry, moonMaterial);

// 1. 태양을 씬에 추가 (태양은 우주의 중심)
scene.add(sun);

// 2. 지구를 태양의 자식으로 추가
// 지구의 position은 이제 태양을 기준으로 (5, 0, 0)만큼 떨어진 곳에 위치함
earth.position.set(5, 0, 0);
sun.add(earth);

// 3. 달을 지구의 자식으로 추가
// 달의 position은 지구를 기준으로 (1, 0, 0)만큼 떨어진 곳에 위치함
moon.position.set(1, 0, 0);
earth.add(moon);

// 결과: 태양을 회전시키면 지구와 달이 함께 공전합니다.
function animate() {
  sun.rotation.y += 0.01; // 태양 자전 -> 지구 공전
  earth.rotation.y += 0.02; // 지구 자전 -> 달 공전
}`}
      />

      <h2>로컬 공간 vs 월드 공간 (Local vs World Space)</h2>
      <p>
        초보자들이 가장 많이 헷갈려하는 부분입니다.
      </p>
      <ul>
        <li><strong>Local Position</strong>: <code>mesh.position</code>. 부모로부터 얼마나 떨어져 있는가?</li>
        <li><strong>World Position</strong>: <code>mesh.getWorldPosition()</code>. 게임 세상의 원점(0,0,0)으로부터 실제로 어디에 있는가?</li>
      </ul>

      <CodeBlock
        fileName="world_position.js"
        code={`const target = new THREE.Vector3();

// 달의 월드 좌표 구하기
moon.getWorldPosition(target);

console.log(target); 
// 출력: Vector3 { x: 6, y: 0, z: 0 }
// 태양(0) + 지구거리(5) + 달거리(1) = 6`}
      />

      <h2>[Expert] 행렬 (Matrix4)과 TRS 순서</h2>
      <p>
        컴퓨터는 위치(Translation), 회전(Rotation), 크기(Scale)를 각각 따로 계산하지 않고, 
        <strong>4x4 행렬(Matrix4)</strong>이라는 하나의 수학적 도구로 뭉쳐서 계산합니다.
      </p>
      
      <p>
        이때 중요한 것은 <strong>순서</strong>입니다. Three.js는 기본적으로 <strong>Scale -&gt; Rotate -&gt; Translate (SRT)</strong> 순서로 행렬을 만듭니다.
        순서가 바뀌면 완전히 다른 결과가 나옵니다.
      </p>

      <CodeBlock
        fileName="matrix_calculation.js"
        code={`// Three.js 내부에서의 행렬 계산 (개념적 코드)
const matrix = new THREE.Matrix4();

// 1. 크기 변환
matrix.makeScale(x, y, z);
// 2. 회전 변환 (곱하기)
matrix.multiply(new THREE.Matrix4().makeRotationFromEuler(euler));
// 3. 위치 변환 (곱하기)
matrix.multiply(new THREE.Matrix4().makeTranslation(x, y, z));

// 이 최종 행렬 하나만 있으면 GPU는 점을 어디로 보내야 할지 알 수 있습니다.`}
      />

      <h2>[Expert] 짐벌 락(Gimbal Lock)과 쿼터니언(Quaternion)</h2>
      <p>
        우리가 흔히 쓰는 <code>rotation.x, y, z</code>는 <strong>오일러 각(Euler Angles)</strong>이라고 합니다.
        하지만 오일러 각에는 치명적인 약점이 있는데, 바로 <strong>짐벌 락</strong> 현상입니다.
        특정 각도(주로 90도)에서 두 축이 겹쳐버려 한 축의 회전이 불가능해지는 현상입니다.
      </p>

      <p>
        이를 해결하기 위해 3D 그래픽스에서는 <strong>쿼터니언(Quaternion)</strong>이라는 4차원 복소수 체계를 사용합니다.
        Three.js는 내부적으로 모든 회전을 쿼터니언으로 관리합니다.
      </p>

      <CodeBlock
        fileName="quaternion.js"
        code={`// 두 물체 사이를 부드럽게 회전시키기 (Slerp)
const start = new THREE.Quaternion();
const end = new THREE.Quaternion();

// 0.5는 50% 지점을 의미
const result = start.slerp(end, 0.5); 

// 오일러 각으로는 이런 부드러운 보간(Interpolation)이 매우 어렵습니다.`}
      />
    </TheoryLayout>
  )
}
