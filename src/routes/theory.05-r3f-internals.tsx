import { createFileRoute } from "@tanstack/react-router";
import { TheoryLayout } from "~/components/TheoryLayout";
import { CodeBlock } from "~/components/CodeBlock";

export const Route = createFileRoute("/theory/05-r3f-internals")({
  component: R3FInternalsTheory,
});

function R3FInternalsTheory() {
  return (
    <TheoryLayout
      title="05. R3F 리컨실러와 생명주기 (Reconciler Internals)"
      prevLink="/theory/04-materials-shaders"
      nextLink="/theory/06-performance"
    >
      <p>
        React Three Fiber(R3F)는 <code>react-reconciler</code> 패키지를 사용하여
        만든 커스텀 렌더러입니다. React DOM이 가상 DOM을 실제 DOM으로 바꾸듯,
        R3F는 가상 씬 그래프를 실제 Three.js 객체로 바꿉니다.
      </p>

      <h2>1. JSX가 Three.js 객체가 되는 과정</h2>
      <p>
        우리가 <code>&lt;mesh /&gt;</code>라고 적으면 내부적으로 어떤 일이
        일어날까요?
      </p>
      <ol>
        <li>
          <strong>CreateInstance</strong>: 태그 이름(<code>mesh</code>)을 보고{" "}
          <code>THREE.Mesh</code> 클래스를 찾아서 <code>new Mesh()</code>를
          호출합니다.
        </li>
        <li>
          <strong>ApplyProps</strong>: JSX에 전달된 props(<code>position</code>,{" "}
          <code>rotation</code> 등)를 Three.js 객체의 속성에 대입합니다.
        </li>
        <li>
          <strong>AppendInitialChild</strong>: 부모 객체(<code>scene</code> 또는
          다른 <code>group</code>)의 <code>add()</code> 메서드를 호출하여
          자식으로 붙입니다.
        </li>
      </ol>

      <CodeBlock
        fileName="reconciler_logic.js"
        code={`// R3F 내부 로직 (개념적)
function createInstance(type, props, rootContainerInstance, hostContext) {
  // 1. 태그 이름으로 클래스 찾기 (catalogue)
  const TargetClass = catalogue[type]; // 'mesh' -> THREE.Mesh
  
  // 2. 인스턴스 생성 (args prop이 생성자 인자로 들어감)
  const instance = new TargetClass(...props.args);
  
  // 3. 속성 적용
  applyProps(instance, props);
  
  return instance;
}`}
      />

      <h2>2. attach 속성의 비밀</h2>
      <p>
        Three.js 객체들은 서로 다른 방식으로 연결됩니다. 대부분은{" "}
        <code>add()</code>로 부모-자식 관계가 되지만, 재질(Material)이나
        기하학(Geometry)은 <code>mesh.material = ...</code> 처럼 속성으로
        할당되어야 합니다.
      </p>
      <p>
        R3F는 이를 <strong>attach</strong> 속성으로 해결합니다.
      </p>

      <CodeBlock
        fileName="attach_logic.js"
        code={`// JSX
<mesh>
  <boxGeometry attach="geometry" />
  <meshStandardMaterial attach="material" />
</mesh>

// 내부 동작
const mesh = new THREE.Mesh();
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial();

// attach="geometry"를 보고 자동으로 할당
mesh.geometry = geometry;
mesh.material = material;`}
      />

      <h2>3. 인스턴스 생명주기 (Lifecycle)</h2>
      <p>
        React 컴포넌트가 언마운트(Unmount)될 때, R3F는 자동으로 Three.js 객체의{" "}
        <code>dispose()</code>를 호출하여 메모리를 정리해줍니다. 하지만 모든
        객체가 자동으로 정리되는 것은 아닙니다.
      </p>
      <ul>
        <li>
          <strong>Geometry, Material</strong>: 자동으로 <code>dispose()</code>{" "}
          호출됨.
        </li>
        <li>
          <strong>Texture</strong>: 자동으로 <code>dispose()</code> 호출되지
          않음! (직접 관리하거나 <code>useTexture</code> 훅 사용 권장)
        </li>
        <li>
          <strong>Mesh, Group</strong>: <code>removeFromParent()</code>만
          호출됨.
        </li>
      </ul>

      <h2>4. Fiber Loop (Render Loop)</h2>
      <p>
        R3F는 자체적인 렌더 루프를 관리합니다.
        <code>Canvas</code> 컴포넌트가 마운트되면 <code>ResizeObserver</code>로
        크기를 감지하고, <code>requestAnimationFrame</code>을 시작합니다.
      </p>
      <p>
        이 루프 안에서 <code>useFrame</code>에 등록된 콜백들이 순서대로
        실행되고, 마지막으로 <code>gl.render()</code>가 호출됩니다.
      </p>
    </TheoryLayout>
  );
}
