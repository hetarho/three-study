import { createFileRoute } from '@tanstack/react-router'
import { TheoryLayout } from '~/components/TheoryLayout'
import { CodeBlock } from '~/components/CodeBlock'

export const Route = createFileRoute('/theory/04-materials-shaders')({
  component: MaterialsShadersTheory,
})

function MaterialsShadersTheory() {
  return (
    <TheoryLayout
      title="04. 재질과 쉐이더 (Materials & Shaders)"
      prevLink="/theory/03-buffer-geometry"
      nextLink="/theory/05-r3f-internals"
    >
      <p>
        재질(Material)은 물체가 빛에 어떻게 반응하는지를 정의합니다.
        하지만 그 내부를 들여다보면 결국 <strong>쉐이더(Shader)</strong>라는 작은 프로그램이 돌고 있습니다.
      </p>

      <h2>[Expert] 조명 모델 (Lighting Models)</h2>
      <p>
        컴퓨터 그래픽스 역사에는 다양한 조명 계산 방식이 존재했습니다.
      </p>

      <ul>
        <li><strong>Lambert</strong>: <code>MeshLambertMaterial</code>. 가장 단순함. 표면의 각도(Normal)와 빛의 각도(Light)만 고려. 반짝임(Specular) 없음.</li>
        <li><strong>Phong / Blinn-Phong</strong>: <code>MeshPhongMaterial</code>. 반짝임(Specular)을 계산하여 플라스틱 같은 느낌을 냄.</li>
        <li><strong>PBR (Physically Based Rendering)</strong>: <code>MeshStandardMaterial</code>. 물리 법칙에 기반하여 현실적인 재질 표현. 금속성(Metalness)과 거칠기(Roughness) 사용.</li>
      </ul>

      <CodeBlock
        fileName="lighting_model_comparison.js"
        code={`// 1. Lambert (무광, 빠름)
const lambert = new THREE.MeshLambertMaterial({ color: 'red' });

// 2. Phong (유광, 반짝임 조절 가능)
const phong = new THREE.MeshPhongMaterial({ 
  color: 'red',
  specular: 0x111111, // 반사광 색상
  shininess: 30       // 반짝임 정도
});

// 3. Standard (PBR, 현실적)
const standard = new THREE.MeshStandardMaterial({
  color: 'red',
  metalness: 0.5, // 0: 비금속, 1: 금속
  roughness: 0.2  // 0: 매끈함, 1: 거침
});`}
      />

      <h2>[Expert] 텍스처 필터링 (Texture Filtering)</h2>
      <p>
        작은 이미지를 크게 늘리거나, 큰 이미지를 작게 줄여서 보여줄 때 픽셀을 어떻게 처리할지 결정하는 기술입니다.
      </p>

      <ul>
        <li><strong>NearestFilter</strong>: 가장 가까운 픽셀을 선택. 픽셀 아트나 마인크래프트 스타일에 적합. (계단 현상 발생)</li>
        <li><strong>LinearFilter</strong>: 주변 픽셀을 부드럽게 섞음. (흐릿해짐)</li>
        <li><strong>Mipmap</strong>: 멀리 있는 물체는 미리 작게 줄여놓은 이미지(Mipmap)를 사용하여 성능과 퀄리티를 모두 잡음.</li>
      </ul>

      <CodeBlock
        fileName="texture_filtering.js"
        code={`const texture = new THREE.TextureLoader().load('pixel_art.png');

// 픽셀 아트 느낌을 살리려면:
texture.magFilter = THREE.NearestFilter;
texture.minFilter = THREE.NearestFilter;

// 일반적인 부드러운 텍스처라면:
texture.magFilter = THREE.LinearFilter;
texture.minFilter = THREE.LinearMipMapLinearFilter; // 기본값`}
      />

      <h2>GLSL 쉐이더 기초</h2>
      <p>
        Three.js의 모든 재질은 결국 GLSL(OpenGL Shading Language) 코드로 변환됩니다.
        우리가 직접 <code>ShaderMaterial</code>을 쓰면 이 코드를 직접 작성할 수 있습니다.
      </p>

      <h3>Vertex Shader (정점 쉐이더)</h3>
      <p>
        점의 위치를 결정합니다. "이 점을 화면 어디에 찍을까?"를 고민합니다.
      </p>
      <CodeBlock
        fileName="vertexShader.glsl"
        code={`void main() {
  // projectionMatrix: 3D -> 2D 화면 변환
  // modelViewMatrix: 월드 좌표 -> 카메라 앞 좌표 변환
  // position: 내 점의 원래 위치
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`}
      />

      <h3>Fragment Shader (프래그먼트 쉐이더)</h3>
      <p>
        픽셀의 색상을 결정합니다. "이 픽셀을 무슨 색으로 칠할까?"를 고민합니다.
      </p>
      <CodeBlock
        fileName="fragmentShader.glsl"
        code={`uniform vec3 uColor; // CPU에서 보내준 색상

void main() {
  gl_FragColor = vec4(uColor, 1.0); // R, G, B, A
}`}
      />

      <h2>R3F에서 쉐이더 사용하기</h2>
      <p>
        <code>shaderMaterial</code>을 <code>extend</code>하여 JSX에서 태그처럼 사용할 수 있습니다.
      </p>

      <CodeBlock
        fileName="MyShaderMaterial.jsx"
        code={`import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'

// 1. 쉐이더 재질 정의
const MyMaterial = shaderMaterial(
  { uTime: 0, uColor: new THREE.Color(0.2, 0.0, 0.1) }, // Uniforms (변수들)
  // Vertex Shader
  \`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  \`,
  // Fragment Shader
  \`
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      gl_FragColor = vec4(0.5 + 0.3 * sin(vUv.y * 20.0 + uTime), 0.0, 1.0, 1.0);
    }
  \`
)

// 2. R3F에 등록
extend({ MyMaterial })

// 3. 컴포넌트에서 사용
function Scene() {
  const materialRef = useRef()
  
  useFrame((state, delta) => {
    // 시간 값을 계속 업데이트해서 애니메이션 효과
    materialRef.current.uTime += delta
  })

  return (
    <mesh>
      <planeGeometry />
      {/* <myMaterial> 태그로 사용 가능 (소문자로 시작) */}
      <myMaterial ref={materialRef} />
    </mesh>
  )
}`}
      />
    </TheoryLayout>
  )
}
