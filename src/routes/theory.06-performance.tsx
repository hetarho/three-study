import { createFileRoute } from "@tanstack/react-router";
import { TheoryLayout } from "~/components/TheoryLayout";
import { CodeBlock } from "~/components/CodeBlock";

export const Route = createFileRoute("/theory/06-performance")({
  component: PerformanceTheory,
});

function PerformanceTheory() {
  return (
    <TheoryLayout
      title="06. 렌더 루프와 워커 (Render Loop & Workers)"
      prevLink="/theory/05-r3f-internals"
    >
      <p>
        마지막으로, 브라우저가 3D 장면을 어떻게 화면에 뿌려주는지, 그리고 메인
        스레드의 부하를 어떻게 줄일 수 있는지 알아봅니다.
      </p>

      <h2>1. requestAnimationFrame (rAF)의 진실</h2>
      <p>
        <code>setInterval</code>이나 <code>setTimeout</code>은 정확한 시간을
        보장하지 않으며, 화면 주사율(60Hz, 144Hz)과 동기화되지 않습니다. 반면{" "}
        <code>requestAnimationFrame</code>은 브라우저의{" "}
        <strong>VSync(수직 동기화)</strong> 신호에 맞춰 실행됩니다.
      </p>

      <h3>프레임 스킵 (Frame Skip)</h3>
      <p>
        만약 자바스크립트 연산이 너무 오래 걸려서(예: 20ms), 다음 VSync 신호를
        놓치면 어떻게 될까요? 브라우저는 그 프레임을 건너뛰고(Drop), 화면은 멈춘
        것처럼 보입니다(Jank). 이것이 <strong>60FPS 방어</strong>가 중요한
        이유입니다. 1프레임당 주어진 시간은 단 <strong>16.6ms</strong> 뿐입니다.
      </p>

      <h2>2. WebXR과 setAnimationLoop</h2>
      <p>
        VR/AR 환경(WebXR)에서는 브라우저의 <code>requestAnimationFrame</code>을
        쓸 수 없습니다. 헤드셋의 주사율(90Hz, 120Hz)에 맞춰야 하기 때문입니다.
        그래서 Three.js는 <code>renderer.setAnimationLoop(callback)</code>라는
        추상화된 메서드를 제공합니다.
      </p>

      <CodeBlock
        fileName="setAnimationLoop.js"
        code={`// 일반적인 웹 환경: 내부적으로 requestAnimationFrame 사용
// WebXR 환경: 내부적으로 헤드셋의 프레임 콜백 사용
renderer.setAnimationLoop((time) => {
  mesh.rotation.x = time / 2000;
  renderer.render(scene, camera);
});`}
      />

      <h2>3. OffscreenCanvas와 Web Worker</h2>
      <p>
        자바스크립트는 <strong>싱글 스레드</strong>입니다. 즉, 무거운 물리
        연산이나 데이터 파싱을 하면 렌더링도 같이 멈춥니다. 이를 해결하기 위해{" "}
        <strong>Web Worker</strong>에서 렌더링을 할 수 있는 기술이 바로{" "}
        <code>OffscreenCanvas</code>입니다.
      </p>

      <CodeBlock
        fileName="worker.js"
        code={`// 메인 스레드 (Main Thread)
const canvas = document.getElementById('c');
const offscreen = canvas.transferControlToOffscreen();
const worker = new Worker('worker.js');
worker.postMessage({ canvas: offscreen }, [offscreen]);

// 워커 스레드 (Worker Thread)
self.onmessage = function(e) {
  const canvas = e.data.canvas;
  const renderer = new THREE.WebGLRenderer({ canvas });
  // ... 여기서 렌더링 루프 실행 ...
  // 메인 스레드가 멈춰도 렌더링은 계속됨!
};`}
      />

      <p>
        <strong>한계점:</strong> DOM 접근이 불가능하므로,{" "}
        <code>OrbitControls</code> 같은 이벤트 기반 라이브러리를 그대로 쓸 수
        없습니다. 이벤트 프록시(Proxy)를 직접 구현해야 하는 난이도가 있습니다.
      </p>

      <h2>4. 실무에서 활용하기</h2>
      <p>
        지금까지 WebGL 파이프라인부터 R3F 내부 구조, 그리고 성능 최적화 기법까지
        깊게 살펴보았습니다. 이러한 지식은 실무에서 다음과 같은 상황에 큰 도움이
        됩니다:
      </p>
      <ul>
        <li>
          <strong>성능 문제 디버깅</strong>: 프레임 드랍이 발생할 때 어디를 먼저
          확인해야 할지 알 수 있습니다.
        </li>
        <li>
          <strong>복잡한 3D 기능 구현</strong>: 커스텀 쉐이더, 물리 엔진 통합 등
          고급 기능을 자신있게 다룰 수 있습니다.
        </li>
        <li>
          <strong>최적화된 아키텍처 설계</strong>: 메모리 관리와 렌더링 효율을
          고려한 구조를 처음부터 설계할 수 있습니다.
        </li>
      </ul>
      <p>
        이제 여러분은 Three.js와 WebGL의 기초를 모두 이해했습니다. 실제
        프로젝트에서 이 지식들을 적용해보며 더 깊이 있는 학습을 이어가시기
        바랍니다!
      </p>
    </TheoryLayout>
  );
}
