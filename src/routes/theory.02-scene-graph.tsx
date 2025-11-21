import { createFileRoute } from "@tanstack/react-router";
import { TheoryLayout } from "~/components/TheoryLayout";
import { CodeBlock } from "~/components/CodeBlock";

export const Route = createFileRoute("/theory/02-scene-graph")({
  component: SceneGraphTheory,
});

function SceneGraphTheory() {
  return (
    <TheoryLayout
      title="02. 행렬 수학과 씬 그래프 (Matrix Internals)"
      prevLink="/theory/01-webgl-fundamentals"
      nextLink="/theory/03-buffer-geometry"
    >
      <p>
        Three.js의 씬 그래프(Scene Graph)는 매우 편리한 기능이지만, 그 내부에는
        선형대수학이 숨어 있습니다. <code>position</code>, <code>rotation</code>
        , <code>scale</code> 같은 친숙한 속성들이 어떻게 GPU가 이해할 수 있는
        행렬로 변환되는지 이해하면, 복잡한 3D 변환과 애니메이션을 자유자재로
        다룰 수 있게 됩니다.
      </p>

      <h2>1. 행렬의 합성 (Compose)과 분해 (Decompose)</h2>
      <p>
        Three.js의 <code>Object3D</code>는 <code>position</code>,{" "}
        <code>rotation</code>, <code>scale</code>이라는 친숙한 속성을 가집니다.
        하지만 GPU는 이 값들을 모릅니다. 오직 <strong>4x4 행렬(Matrix4)</strong>
        만 이해합니다.
      </p>

      <h3>Compose: TRS &rarr; Matrix</h3>
      <p>
        렌더링 직전에 Three.js는 이 세 가지 속성을 하나의 행렬로 합칩니다. 이
        과정을 <strong>Compose</strong>라고 하며, 순서는{" "}
        <strong>T * R * S</strong> 입니다.
      </p>
      <CodeBlock
        fileName="Matrix4.js"
        code={`// Three.js 소스 코드의 compose 메서드 (개념적)
compose(position, quaternion, scale) {
  // 1. Scale 행렬 생성
  this.makeScale(scale.x, scale.y, scale.z);
  
  // 2. Rotation 행렬을 곱함 (Quaternion -> Rotation Matrix)
  this.multiply(makeRotationFromQuaternion(quaternion));
  
  // 3. Position을 행렬의 마지막 열에 삽입 (Translation)
  this.elements[12] = position.x;
  this.elements[13] = position.y;
  this.elements[14] = position.z;
  
  return this;
}`}
      />

      <h3>Decompose: Matrix &rarr; TRS</h3>
      <p>
        반대로, 이미 합쳐진 행렬에서 위치, 회전, 크기를 추출해낼 수도 있습니다.
        물리 엔진이나 IK(Inverse Kinematics)를 구현할 때 필수적입니다.
      </p>
      <CodeBlock
        fileName="decompose_usage.js"
        code={`const matrix = new THREE.Matrix4();
const position = new THREE.Vector3();
const quaternion = new THREE.Quaternion();
const scale = new THREE.Vector3();

// 행렬에서 성분 추출
matrix.decompose(position, quaternion, scale);`}
      />

      <h2>2. 오일러 회전의 비밀 (Euler Order)</h2>
      <p>
        <code>rotation.x</code>, <code>rotation.y</code>,{" "}
        <code>rotation.z</code>를 사용하는 방식을{" "}
        <strong>오일러 각(Euler Angles)</strong>이라고 합니다. 하지만 3차원
        회전은 축을 돌리는 <strong>순서</strong>가 매우 중요합니다.
      </p>
      <p>
        Three.js의 기본 순서는 <strong>XYZ</strong>입니다. 즉, X축을 먼저
        돌리고, 그 다음 Y축, 마지막으로 Z축을 돌립니다. 이 순서에 따라 결과가
        완전히 달라지며, 특정 각도에서 축이 겹치는{" "}
        <strong>짐벌 락(Gimbal Lock)</strong> 현상이 발생할 수 있습니다.
      </p>

      <CodeBlock
        fileName="EulerOrder.js"
        code={`const object = new THREE.Mesh();

// 회전 순서 변경 (예: 카메라 제어 시 YXZ가 더 자연스러울 수 있음)
object.rotation.reorder('YXZ');

object.rotation.y = Math.PI / 2; // 고개를 돌리고
object.rotation.x = Math.PI / 4; // 위를 쳐다봄`}
      />

      <h2>3. 씬 그래프와 월드 행렬 업데이트 (updateMatrixWorld)</h2>
      <p>
        부모가 움직이면 자식도 따라 움직여야 합니다. 이를 위해{" "}
        <strong>Local Matrix</strong>와 <strong>World Matrix</strong>가
        구분됩니다.
      </p>
      <ul>
        <li>
          <strong>
            Local Matrix (<code>matrix</code>)
          </strong>
          : 부모를 기준으로 한 나의 위치/회전/크기
        </li>
        <li>
          <strong>
            World Matrix (<code>matrixWorld</code>)
          </strong>
          : 세상의 원점(0,0,0)을 기준으로 한 나의 절대적인 위치/회전/크기
        </li>
      </ul>

      <p>
        매 프레임 렌더링 직전에 <code>scene.updateMatrixWorld()</code>가
        호출되면, 재귀적으로 모든 자식들의 월드 행렬이 갱신됩니다.
      </p>

      <CodeBlock
        fileName="Object3D.js"
        code={`// Three.js 내부 로직 (재귀적 업데이트)
updateMatrixWorld(force) {
  if (this.matrixAutoUpdate) this.updateMatrix(); // Local Matrix 갱신

  if (this.matrixWorldNeedsUpdate || force) {
    if (this.parent === null) {
      // 부모가 없으면 Local이 곧 World
      this.matrixWorld.copy(this.matrix);
    } else {
      // 부모의 World Matrix * 나의 Local Matrix = 나의 World Matrix
      this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
    }
    
    this.matrixWorldNeedsUpdate = false;
    force = true; // 자식들도 강제로 업데이트하게 만듦
  }

  // 자식들에게 전파
  const children = this.children;
  for (let i = 0, l = children.length; i < l; i++) {
    children[i].updateMatrixWorld(force);
  }
}`}
      />

      <p>
        <strong>성능 팁:</strong> <code>matrixAutoUpdate = false</code>로
        설정하면 이 모든 연산을 건너뛸 수 있습니다. 움직이지 않는 정적인
        물체(Static Object)에는 필수적인 최적화입니다.
      </p>
    </TheoryLayout>
  );
}
