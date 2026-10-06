import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh } from 'three'
export function EnvironmentEffects({pulse}:{pulse:number}){const glow=useRef<Mesh>(null);useFrame(({clock})=>{if(glow.current&&!document.hidden){const material=glow.current.material as import('three').MeshBasicMaterial;material.opacity=.025+Math.sin(clock.elapsedTime*.25)*.008+Math.min(.03,pulse*.006)}});return <mesh ref={glow} position={[0,0,-14]} scale={[18,10,1]}><planeGeometry/><meshBasicMaterial color="#087ab5" transparent opacity={.03} depthWrite={false}/></mesh>}