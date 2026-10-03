import { useState } from 'react'
import { useLabStore } from '../../store/labStore'
export function Model() {
 const [hovered,setHovered]=useState(false); const selected=useLabStore(s=>s.selectedComponent==='processor'); const select=useLabStore(s=>s.selectComponent)
 return <group rotation={[0,-0.2,0]}>
  <mesh receiveShadow position={[0,-0.18,0]}><boxGeometry args={[5.4,0.28,3.6]}/><meshStandardMaterial color="#16382f" roughness={0.72} metalness={0.12}/></mesh>
  <mesh castShadow position={[0.45,0.16,0.1]} onClick={e=>{e.stopPropagation();select('processor')}} onPointerEnter={e=>{e.stopPropagation();setHovered(true);document.body.style.cursor='pointer'}} onPointerLeave={()=>{setHovered(false);document.body.style.cursor='default'}}>
   <boxGeometry args={[1.5,0.34,1.5]}/><meshStandardMaterial color={selected?'#f6c85f':hovered?'#d9e7a8':'#b7c7a3'} emissive={selected?'#7d5410':'#000'} emissiveIntensity={selected?0.45:0} roughness={0.28} metalness={0.72}/>
  </mesh>
  {[-1.8,-1.2,-0.6,0,0.6,1.2,1.8].map(x=><mesh key={x} position={[x,0.02,-1.18]}><boxGeometry args={[0.3,0.22,1.35]}/><meshStandardMaterial color="#263b36" metalness={0.5} roughness={0.4}/></mesh>)}
  {[-1.75,-1.1].map(x=><mesh key={x} castShadow position={[x,0.18,0.35]}><boxGeometry args={[0.28,0.4,2.1]}/><meshStandardMaterial color="#253534" roughness={0.45} metalness={0.45}/></mesh>)}
  <mesh castShadow position={[1.78,0.16,0.8]}><boxGeometry args={[0.9,0.38,0.7]}/><meshStandardMaterial color="#68766f" roughness={0.35} metalness={0.7}/></mesh>
 </group>
}
