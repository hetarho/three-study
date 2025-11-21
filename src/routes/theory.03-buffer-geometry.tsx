import { createFileRoute } from "@tanstack/react-router";
import { TheoryLayout } from "~/components/TheoryLayout";
import { CodeBlock } from "~/components/CodeBlock";

export const Route = createFileRoute("/theory/03-buffer-geometry")({
  component: BufferGeometryTheory,
});

function BufferGeometryTheory() {
  return (
    <TheoryLayout
      title="03. 버퍼 지오메트리와 메모리 관리 (Memory Layout)"
      prevLink="/theory/02-scene-graph"
      nextLink="/theory/04-materials-shaders"
    >
      <p>
        <code>BufferGeometry</code>는 이름 그대로{" "}
        <strong>Buffer(메모리 덩어리)</strong>를 관리하는 클래스입니다. Three.js
        성능 최적화의 90%는 이 버퍼를 얼마나 효율적으로 관리하느냐에 달려
        있습니다.
      </p>

      <h2>1. TypedArray와 VRAM</h2>
      <p>
        자바스크립트의 일반 배열(<code>Array</code>)은 유연하지만 느리고
        메모리를 많이 차지합니다. 반면, <strong>TypedArray</strong>(
        <code>Float32Array</code>, <code>Uint16Array</code> 등)는 C언어의
        배열처럼 연속된 메모리 공간을 차지하며, GPU에 그대로 전송할 수 있습니다.
      </p>
      <p>
        <code>BufferAttribute</code>는 이 TypedArray를 감싸고 있는 래퍼일
        뿐입니다.
      </p>

      <h2>2. Interleaved Buffer (인터리브드 버퍼)</h2>
      <p>
        보통은 위치(Position), 법선(Normal), 색상(Color)을 각각 다른 버퍼에
        담습니다. 하지만 이들을 하나의 큰 버퍼에 섞어서(Interleave) 담으면{" "}
        <strong>캐시 적중률(Cache Hit Rate)</strong>이 올라가 성능이 향상됩니다.
      </p>

      <CodeBlock
        fileName="InterleavedBuffer.js"
        code={`// [x, y, z, nx, ny, nz, u, v] 순서로 반복되는 하나의 긴 배열
const data = new Float32Array([
  // 정점 1
  -1.0, -1.0, 1.0,  0, 0, 1,  0, 0,
  // 정점 2
   1.0, -1.0, 1.0,  0, 0, 1,  1, 0,
   // ...
]);

const interleavedBuffer = new THREE.InterleavedBuffer(data, 8); // stride = 8 floats

// 하나의 버퍼를 여러 속성이 공유해서 사용
geometry.setAttribute('position', 
  new THREE.InterleavedBufferAttribute(interleavedBuffer, 3, 0)); // offset = 0

geometry.setAttribute('normal', 
  new THREE.InterleavedBufferAttribute(interleavedBuffer, 3, 3)); // offset = 3

geometry.setAttribute('uv', 
  new THREE.InterleavedBufferAttribute(interleavedBuffer, 2, 6)); // offset = 6`}
      />

      <h2>3. 데이터 업로드 과정 (CPU -&gt; GPU)</h2>
      <p>
        <code>geometry.attributes.position.needsUpdate = true</code>를 설정하면
        어떤 일이 벌어질까요?
      </p>
      <ol>
        <li>Three.js 렌더러가 변경 사항을 감지합니다.</li>
        <li>
          <code>gl.bindBuffer</code>로 해당 버퍼를 활성화합니다.
        </li>
        <li>
          <code>gl.bufferData</code> (전체 업데이트) 또는{" "}
          <code>gl.bufferSubData</code> (부분 업데이트)를 호출합니다.
        </li>
        <li>
          이때 CPU 메모리(RAM)에서 GPU 메모리(VRAM)로 데이터 복사가 일어납니다.
        </li>
      </ol>
      <p>
        <strong>주의:</strong> 데이터 전송은 느립니다(PCIe 버스 대역폭 제한). 매
        프레임 전체 버퍼를 업데이트하는 것은 피해야 합니다.
      </p>

      <h2>4. Frustum Culling과 Bounding Volume</h2>
      <p>
        GPU에게 그리기 명령을 보내기 전에, CPU는 먼저 "이 물체가 카메라 화면
        안에 있는가?"를 검사합니다. 이를 <strong>Frustum Culling</strong>이라고
        합니다.
      </p>
      <p>
        정확한 검사를 위해 모든 점을 다 계산하는 것은 너무 느리므로, 물체를
        감싸는 단순한 도형(Bounding Volume)을 사용합니다.
      </p>
      <ul>
        <li>
          <strong>BoundingSphere</strong>: 계산이 빠름 (중심점 + 반지름).
          회전해도 안 변함.
        </li>
        <li>
          <strong>BoundingBox (AABB)</strong>: 더 정확함 (최소/최대 좌표).
          회전하면 다시 계산해야 함.
        </li>
      </ul>

      <CodeBlock
        fileName="computeBoundingSphere.js"
        code={`// 정점 위치가 바뀌었다면 반드시 호출해야 함!
// 그렇지 않으면 물체가 화면에 있는데도 사라지는 버그 발생
geometry.computeBoundingSphere();
geometry.computeBoundingBox();`}
      />
    </TheoryLayout>
  );
}
