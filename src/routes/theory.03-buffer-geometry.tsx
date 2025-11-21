import { createFileRoute } from '@tanstack/react-router'
import { TheoryLayout } from '~/components/TheoryLayout'
import { CodeBlock } from '~/components/CodeBlock'

export const Route = createFileRoute('/theory/03-buffer-geometry')({
  component: BufferGeometryTheory,
})

function BufferGeometryTheory() {
  return (
    <TheoryLayout
      title="03. BufferGeometry와 최적화 (BufferGeometry & Optimization)"
      prevLink="/theory/02-scene-graph"
      nextLink="/theory/04-materials-shaders"
    >
      <p>
        Three.js의 모든 3D 물체는 결국 <strong>BufferGeometry</strong>입니다.
        이것은 GPU 메모리에 직접 올라가는 데이터 덩어리입니다.
      </p>

      <h2>BufferAttribute란?</h2>
      <p>
        점(Vertex) 하나는 여러 가지 정보를 가질 수 있습니다.
      </p>
      <ul>
        <li><strong>position</strong>: 위치 (x, y, z)</li>
        <li><strong>normal</strong>: 법선 벡터 (빛 반사 계산용)</li>
        <li><strong>uv</strong>: 텍스처 좌표 (u, v)</li>
        <li><strong>color</strong>: 정점 색상 (r, g, b)</li>
      </ul>
      <p>
        이 각각의 정보들을 담고 있는 배열이 바로 <code>BufferAttribute</code>입니다.
      </p>

      <CodeBlock
        fileName="custom_triangle.js"
        code={`// 삼각형 하나를 만드는 가장 기초적인 방법
const geometry = new THREE.BufferGeometry();

// 1. 위치 데이터 (x, y, z) * 3개 점 = 9개 숫자
const vertices = new Float32Array([
  -1.0, -1.0,  1.0, // 점 1
   1.0, -1.0,  1.0, // 점 2
   1.0,  1.0,  1.0  // 점 3
]);

// 2. BufferAttribute 생성 (3은 하나의 점이 3개의 숫자로 이루어졌다는 뜻)
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

const mesh = new THREE.Mesh(geometry, material);`}
      />

      <h2>R3F에서의 선언적 사용</h2>
      <p>
        React Three Fiber에서는 이것을 JSX 문법으로 더 직관적으로 표현할 수 있습니다.
      </p>

      <CodeBlock
        fileName="CustomGeometry.jsx"
        code={`function CustomTriangle() {
  const positions = useMemo(() => new Float32Array([
    -1, -1, 0,
     1, -1, 0,
     0,  1, 0
  ]), [])

  return (
    <mesh>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <meshBasicMaterial color="orange" />
    </mesh>
  )
}`}
      />

      <h2>[Expert] 인터리브드 버퍼 (Interleaved Buffer)</h2>
      <p>
        보통은 위치 배열 따로, 색상 배열 따로, UV 배열 따로 만듭니다. 하지만 이것은 캐시 효율이 떨어질 수 있습니다.
        <strong>인터리브드 버퍼</strong>는 한 점의 모든 정보를 하나의 긴 배열에 섞어서(Interleave) 저장하는 방식입니다.
      </p>

      <CodeBlock
        fileName="interleaved_buffer.js"
        code={`// [x, y, z, u, v, x, y, z, u, v, ...] 순서로 저장
const data = new Float32Array([
  -1, -1, 0,  0, 0,  // 점 1 (위치 + UV)
   1, -1, 0,  1, 0,  // 점 2
   0,  1, 0,  0.5, 1 // 점 3
]);

const interleavedBuffer = new THREE.InterleavedBuffer(data, 5); // 5개씩 끊어서 읽어라

// 위치는 0번째부터 3개 읽어라
geometry.setAttribute('position', new THREE.InterleavedBufferAttribute(interleavedBuffer, 3, 0));
// UV는 3번째부터 2개 읽어라
geometry.setAttribute('uv', new THREE.InterleavedBufferAttribute(interleavedBuffer, 2, 3));`}
      />

      <h2>[Expert] 프러스텀 컬링 (Frustum Culling)과 Bounding Volume</h2>
      <p>
        Three.js는 기본적으로 카메라 시야(Frustum) 밖에 있는 물체는 그리지 않습니다. 이를 <strong>프러스텀 컬링</strong>이라고 합니다.
        하지만 GPU가 "이 물체가 화면 안에 있나?"를 판단하려면 계산 비용이 듭니다.
      </p>
      
      <p>
        그래서 복잡한 메쉬 대신, 그 메쉬를 감싸는 단순한 도형(<strong>Bounding Sphere</strong> 또는 <strong>Bounding Box</strong>)을 사용하여 검사합니다.
        커스텀 지오메트리를 만들었다면 반드시 이 경계 구역을 계산해줘야 컬링이 제대로 작동합니다.
      </p>

      <CodeBlock
        fileName="compute_bounds.js"
        code={`// 커스텀 지오메트리 생성 후 반드시 호출해야 함
geometry.computeBoundingBox();
geometry.computeBoundingSphere();

// 만약 물체의 위치를 쉐이더에서만 바꾼다면(Vertex Shader Animation),
// CPU는 물체가 움직인 걸 모르기 때문에 엉뚱하게 컬링될 수 있습니다.
// 이럴 땐 frustumCulled를 끄거나, Bounding Sphere를 아주 크게 잡아야 합니다.
mesh.frustumCulled = false;`}
      />
    </TheoryLayout>
  )
}
