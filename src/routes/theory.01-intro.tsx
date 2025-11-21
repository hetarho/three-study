import { createFileRoute } from '@tanstack/react-router'
import { TheoryLayout } from '~/components/TheoryLayout'

export const Route = createFileRoute('/theory/01-intro')({
  component: TheoryIntro,
})

function TheoryIntro() {
  return (
    <TheoryLayout
      title="01. Three.js란 무엇인가?"
      nextLink="/theory/02-core-concepts"
    >
      <p>
        <strong>Three.js</strong>는 웹 브라우저에서 3D 그래픽을 쉽게 만들고 표시할 수 있게 해주는 자바스크립트 라이브러리입니다.
        WebGL이라는 저수준 API를 직접 다루는 것은 매우 복잡하고 어렵지만, Three.js는 이를 추상화하여 훨씬 직관적인 코드로 3D 장면을 구성할 수 있게 도와줍니다.
      </p>

      <h2>왜 Three.js를 배워야 할까요?</h2>
      <ul>
        <li><strong>웹 접근성</strong>: 별도의 플러그인 없이 모든 최신 브라우저에서 동작합니다.</li>
        <li><strong>강력한 기능</strong>: 조명, 그림자, 재질, 물리 엔진 등 복잡한 3D 효과를 쉽게 구현할 수 있습니다.</li>
        <li><strong>커뮤니티</strong>: 방대한 예제와 문서, 그리고 활발한 커뮤니티가 있어 학습하기 좋습니다.</li>
      </ul>

      <h2>React Three Fiber (R3F)</h2>
      <p>
        우리는 이 프로젝트에서 <strong>React Three Fiber (R3F)</strong>를 사용하고 있습니다. 
        R3F는 Three.js를 React 생태계로 가져온 라이브러리입니다. 
        React의 컴포넌트 기반 구조를 그대로 사용하여 3D 장면을 선언적으로 구성할 수 있다는 장점이 있습니다.
      </p>
      
      <blockquote>
        <p>
          "Three.js는 3D를 위한 jQuery와 같고, React Three Fiber는 3D를 위한 React와 같습니다."
        </p>
      </blockquote>

      <h2>준비물</h2>
      <p>
        특별한 도구는 필요 없습니다. 브라우저와 코드 에디터만 있으면 됩니다. 
        하지만 3D 공간에 대한 기본적인 이해(X, Y, Z 좌표계)가 있으면 더욱 좋습니다.
      </p>
    </TheoryLayout>
  )
}
