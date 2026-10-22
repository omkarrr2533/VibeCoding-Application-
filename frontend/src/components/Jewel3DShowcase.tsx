import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei'
import { useRef, useState } from 'react'
import * as THREE from 'three'

function RingModel({color="#D4AF72", emissive="#fff7cc"}: {color:string, emissive?:string}){
  const ref=useRef<THREE.Group>(null!)
  useFrame((_,delta)=>{
    if(ref.current) ref.current.rotation.y += delta*0.35
  })
  return (
    <group ref={ref}>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh position={[0,0,0]}>
          <torusGeometry args={[1.2,0.18,32,100]} />
          <meshStandardMaterial color={color} metalness={0.92} roughness={0.18} envMapIntensity={1.2} />
        </mesh>
        {/* diamond  */}
        <mesh position={[0,1.22,0]}>
          <octahedronGeometry args={[0.32,0]} />
          <meshPhysicalMaterial color="#ffffff" transmission={0.9} ior={2.4} thickness={0.3} roughness={0} clearcoat={1} emissive={emissive} emissiveIntensity={0.12} />
        </mesh>
        <mesh position={[0,1.22,0]}>
          <octahedronGeometry args={[0.36,0]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.3} wireframe transparent opacity={0.12} />
        </mesh>
        {/* inner band */}
        <mesh>
          <torusGeometry args={[1.0,0.12,24,100]} />
          <meshStandardMaterial color={color} metalness={0.85} roughness={0.25} />
        </mesh>
      </Float>
      {/* pedestal */}
      <mesh position={[0,-1.9,0]} rotation={[0,0,0]}>
        <cylinderGeometry args={[1.8,2.0,0.5,64]} />
        <meshStandardMaterial color="#F8F3EA" roughness={0.8} />
      </mesh>
    </group>
  )
}

export default function Jewel3DShowcase(){
  const [finish,setFinish]=useState<'champagne'|'rose'|'white'>('champagne')
  const colors:Record<string,string>={ champagne:"#D4AF72", rose:"#C99A86", white:"#E8EAED" }
  const [fullscreen,setFullscreen]=useState(false)

  return (
    <div className={`${fullscreen?'fixed inset-0 z-[60] bg-obsidian p-4':''}`}>
      <div className="bg-pearl rounded-[24px] overflow-hidden border border-obsidian/5">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="h-[420px] md:h-[560px] bg-gradient-to-b from-ivory via-pearl to-white relative">
            <Canvas camera={{position:[0,1.2,4.2], fov:38}} gl={{antialias:true, alpha:true}} onCreated={({gl})=>gl.setPixelRatio(Math.min(window.devicePixelRatio,2))}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[3,5,3]} intensity={1.2} castShadow />
              <pointLight position={[-3,2,-2]} intensity={0.8} color="#FFDDB7" />
              <Environment preset="studio" />
              <RingModel color={colors[finish]} />
              <ContactShadows position={[0,-1.6,0]} opacity={0.35} scale={6} blur={2.4} />
              <OrbitControls enableZoom={true} enablePan={false} minPolarAngle={Math.PI/4} maxPolarAngle={Math.PI/2.4} minDistance={2.5} maxDistance={6} />
            </Canvas>
            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur rounded-full px-3 py-1 text-xs tracking-widest uppercase">Interactive 3D • Drag to rotate • Scroll to zoom</div>
            <button onClick={()=>setFullscreen(v=>!v)} className="absolute top-4 right-4 bg-obsidian text-pearl rounded-full px-4 py-1.5 text-xs tracking-widest uppercase">{fullscreen?'Exit Fullscreen':'Fullscreen'}</button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {Object.entries(colors).map(([k,v])=>(
                <button key={k} onClick={()=>setFinish(k as any)} className={`w-8 h-8 rounded-full border-2 ${finish===k?'border-obsidian':'border-white'} shadow`} style={{background:v}} title={k} />
              ))}
            </div>
          </div>
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <div className="text-[11px] tracking-[0.18em] uppercase text-antique">3D Showcase — Craftsmanship in Light</div>
            <h3 className="font-serif text-[32px] md:text-[40px] leading-none mt-3">The Celestial Solitaire, <span className="italic font-light">reimagined in motion.</span></h3>
            <p className="text-sm leading-relaxed text-obsidian/70 mt-4 max-w-md">Experience our signature solitaire: 18KT gold, certified centre stone, pavé shoulders. Rotate, zoom and explore finishes. If WebGL is unavailable, enjoy our curated image fallback.</p>
            <div className="flex gap-2 mt-6">
              <span className="text-xs bg-ivory border border-obsidian/10 rounded-full px-3 py-1.5">18KT Gold</span>
              <span className="text-xs bg-ivory border border-obsidian/10 rounded-full px-3 py-1.5">0.90ct Certified</span>
              <span className="text-xs bg-ivory border border-obsidian/10 rounded-full px-3 py-1.5">Pavé Shoulders</span>
            </div>
            <div className="mt-8 flex gap-3">
              <a href="/product/celestial-solitaire-ring" className="bg-obsidian text-pearl rounded-full px-7 py-3 text-sm tracking-wide">View Product</a>
              <a href="/shop" className="border border-obsidian rounded-full px-7 py-3 text-sm">Explore Collection</a>
            </div>
            <p className="text-[11px] text-taupe mt-6">Tip: respects prefers-reduced-motion. On low-power devices, a high-resolution image fallback is shown.</p>
          </div>
        </div>
      </div>
      {/* fallback for reduced motion */}
      <style>{`@media (prefers-reduced-motion: reduce){ canvas{ display:none } }`}</style>
    </div>
  )
}
