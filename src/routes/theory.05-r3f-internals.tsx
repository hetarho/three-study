import { createFileRoute } from '@tanstack/react-router'
import { TheoryLayout } from '~/components/TheoryLayout'
import { CodeBlock } from '~/components/CodeBlock'

export const Route = createFileRoute('/theory/05-r3f-internals')({
  component: R3FInternalsTheory,
})

function R3FInternalsTheory() {
  return (
    <TheoryLayout
      title="05. R3F 내부 구조 (R3F Internals)"
      prevLink="/theory/04-materials-shaders"
      nextLink="/theory/06-performance"
    >
      <p>
        React Three Fiber (R3F)는 단순한 React 래퍼(Wrapper)가 아닙니다. 
        React의 <strong>Reconciler(재조정자)</strong>를 사용하여 Three.js를 React의 렌더링 시스템에 직접 연결한 것입니다.
      </p>

      <h2>리액트와 Three.js의 만남</h2>
      <p>
        React Three Fiber(R3F)는 단순한 React 래퍼가 아닙니다. 
        Three.js의 복잡한 명령형(Imperative) API를 React의 선언형(Declarative) API로 변환해주는 <strong>Reconciler(재조정자)</strong>입니다.
      </p>

      <h2>[Expert] 이벤트 시스템 (Event System)</h2>
      <p>
        R3F는 DOM 이벤트와 유사한 이벤트 시스템을 3D 공간에 구현했습니다.
        이것은 내부적으로 <strong>Raycasting(광선 투사)</strong> 알고리즘을 사용합니다.
      </p>

      <ol>
        <li>마우스를 클릭하면 화면 좌표(x, y)를 구합니다.</li>
        <li>카메라에서 그 좌표 방향으로 보이지 않는 광선(Ray)을 쏩니다.</li>
        <li>광선에 부딪힌 물체들을 거리순으로 정렬합니다.</li>
        <li>가장 앞에 있는 물체의 <code>onClick</code> 핸들러를 실행합니다.</li>
        <li><code>event.stopPropagation()</code>이 없으면 뒤에 있는 물체로 이벤트가 전파됩니다(Bubbling).</li>
      </ol>

      <CodeBlock
        fileName="event_bubbling.jsx"
        code={`<mesh
  onClick={(e) => {
    e.stopPropagation(); // 뒤에 있는 물체는 클릭되지 않음
    console.log('앞에 있는 물체 클릭됨');
    console.log('클릭 지점:', e.point); // 3D 월드 좌표
    console.log('거리:', e.distance);   // 카메라로부터의 거리
  }}
>
  <boxGeometry />
  <meshStandardMaterial color="red" />
</mesh>`}
      />

      <h2>[Expert] Context Bridge (컨텍스트 브릿지)</h2>
      <p>
        <code>&lt;Canvas&gt;</code>는 새로운 React Root를 생성합니다. 
        즉, <code>Canvas</code> 밖의 Context(Redux, Router, Theme 등)는 <code>Canvas</code> 안으로 전달되지 않습니다.
        이를 해결하기 위해 <strong>Context Bridge</strong> 패턴을 사용해야 합니다.
      </p>

      <CodeBlock
        fileName="ContextBridge.jsx"
        code={`function App() {
  // 1. Canvas 밖에서 Context를 사용
  const theme = useContext(ThemeContext);

  return (
    <Canvas>
      {/* 2. Canvas 안으로 값을 직접 넘겨주거나, 별도의 Provider를 다시 감싸야 함 */}
      <ThemeContext.Provider value={theme}>
        <Scene />
      </ThemeContext.Provider>
    </Canvas>
  )
}

// 또는 drei 라이브러리의 useContextBridge 사용
import { useContextBridge } from '@react-three/drei'

function App() {
  const ContextBridge = useContextBridge(ThemeContext, AuthContext)
  return (
    <Canvas>
      <ContextBridge>
        <Scene />
      </ContextBridge>
    </Canvas>
  )
}`}
      />

      <h2>useFrame의 올바른 사용법</h2>
      <p>
        <code>useFrame</code>은 매 프레임(초당 60~144회)마다 실행됩니다.
        여기서 <code>setState</code>를 호출하면 리액트가 매번 리렌더링을 시도하여 성능이 폭락합니다.
      </p>

      <h3>❌ 나쁜 예 (React State 사용)</h3>
      <CodeBlock
        fileName="BadAnimation.jsx"
        code={`function BadBox() {
  const [x, setX] = useState(0);
  
  useFrame(() => {
    setX(x + 0.01); // 매 프레임 리렌더링 발생! (절대 금지)
  });

  return <mesh position-x={x}><boxGeometry /></mesh>;
}`}
      />

      <h3>✅ 좋은 예 (Ref 직접 수정)</h3>
      <CodeBlock
        fileName="GoodAnimation.jsx"
        code={`function GoodBox() {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    // 리액트 렌더링을 건너뛰고 Three.js 객체를 직접 수정
    meshRef.current.position.x += delta;
  });

  return <mesh ref={meshRef}><boxGeometry /></mesh>;
}`}
      />

      <h2>extend 함수</h2>
      <p>
        Three.js의 모든 클래스를 R3F 컴포넌트로 만들 수 있습니다.
        <code>extend</code>를 사용하면 <code>new ClassName()</code>을 <code>&lt;className /&gt;</code>으로 변환해줍니다.
      </p>

      <CodeBlock
        fileName="extend_usage.jsx"
        code={`import { extend } from '@react-three/fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 1. Three.js 클래스 등록
extend({ OrbitControls })

// 2. 컴포넌트로 사용 (camelCase로 자동 변환됨)
function Scene() {
  return (
    <>
      <orbitControls args={[camera, gl.domElement]} />
    </>
  )
}`}
      />
    </TheoryLayout>
  )
}
