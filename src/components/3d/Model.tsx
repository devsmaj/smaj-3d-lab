import { Html, useGLTF } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { Mesh, MeshStandardMaterial } from 'three'
import { componentByModelName, componentById } from '../../data/components'
import { useLabStore } from '../../store/labStore'

type Props={rotation:[number,number,number]}
const scaleByComponent={motherboard:.92,cpu:2.15,ram:1.65,gpu:1.25,ssd:2.05,cooling:2.05} as const
export function Model({rotation}:Props){
 const{scene}=useGLTF(`${import.meta.env.BASE_URL}models/motherboard.gltf`);const selected=useLabStore(s=>s.selectedComponent),select=useLabStore(s=>s.selectComponent);const component=componentById[selected]
 const model=useMemo(()=>{const clone=scene.clone(true);clone.traverse(object=>{if(object instanceof Mesh){const material=(object.material as MeshStandardMaterial).clone();material.color.set('#e7ebec');material.metalness=.78;material.roughness=.16;material.transparent=true;material.opacity=.84;material.emissive.set('#8b9698');material.emissiveIntensity=.22;object.material=material}});return clone},[scene])
 useEffect(()=>{model.children.forEach(object=>{const id=componentByModelName[object.name];object.visible=id===selected;if(object.visible){object.position.set(0,0,0);if(object instanceof Mesh){const material=object.material as MeshStandardMaterial;material.color.set('#ffffff');material.emissive.set('#dff8ff');material.emissiveIntensity=.48;material.opacity=.9}}})},[model,selected])
 const choose=(event:ThreeEvent<MouseEvent>)=>{event.stopPropagation();select(selected)}
 return <group rotation={rotation} scale={scaleByComponent[selected]}><primitive object={model} onClick={choose} onPointerEnter={()=>document.body.style.cursor='grab'} onPointerLeave={()=>document.body.style.cursor='default'}/><Html position={[0,1.15,0]} center distanceFactor={9}><div className="solo-part-label"><span>ACTIVE COMPONENT</span><strong>{component.shortName}</strong></div></Html></group>
}
useGLTF.preload(`${import.meta.env.BASE_URL}models/motherboard.gltf`)