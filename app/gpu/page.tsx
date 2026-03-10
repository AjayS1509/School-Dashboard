import { Canvas } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

const FractalMaterial = shaderMaterial(
  { time: 0 },
  vertexShader,
  fragmentShader,
);

export default function App() {
  return (
    <Canvas
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 4] }}
    >
      <Fractal />
    </Canvas>
  );
}
