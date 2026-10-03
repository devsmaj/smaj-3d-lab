import { Html, useGLTF } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { Mesh, MeshStandardMaterial } from 'three'
import { componentByModelName, components } from '../../data/components'
import { useLabStore } from '../../store/labStore'

type Props={rotation:[number,number,number];explode?:number}
const labelPositions:Record<string,[number,number,number]>={MOTHERBOARD:[-2.15,.35,1.5],CPU:[.45,.65,.1],RAM:[-1.48,.72,.35],GPU:[.15,.68,-1.05],SSD:[1.82,.62,.82],COOLING:[1.72,.82,-.18]}
export function Model({rotation,explode=0}:Props){
 const{scene}=useGLTF(`${import.meta.env.BASE_URL}models/motherboard.gltf`);const selected=useLabStore(s=>s.selectedComponent),select=useLabStore(s=>s.selectComponent)
 const model=useMemo(()=>{const clone=scene.clone(true);clone.traverse(object=>{if(object instanceof Mesh)object.material=(object.material as MeshStandardMaterial).clone()});return clone},[scene])
 useEffect(()=>{model.traverse(object=>{if(!(object instanceof Mesh)||!componentByModelName[object.name])return;const material=object.material as MeshStandardMaterial;const active=componentByModelName[object.name]===selected;material.emissive.set(active?'#8b6015':'#000000');material.emissiveIntensity=active ? .58 : 0})},[model,selected])
 useEffect(()=>{model.children.forEach((object,index)=>{const base=scene.children[index]?.position;if(!base)return;object.position.copy(base);if(object.name!=='MOTHERBOARD'){object.position.y+=explode*(.55+index*.08);object.position.x+=explode*((index%2?1:-1)*.16)}})},[model,scene,explode])
 const choose=(event:ThreeEvent<MouseEvent>)=>{const id=componentByModelName[event.object.name];if(id){event.stopPropagation();select(id)}}
 return <group rotation={rotation} scale={1.08}><primitive object={model} onClick={choose} onPointerEnter={()=>document.body.style.cursor='pointer'} onPointerLeave={()=>document.body.style.cursor='default'}/>{components.map(component=><Html key={component.id} position={labelPositions[component.modelName]} center distanceFactor={9}><button className={`part-label ${selected===component.id?'active':''}`} onClick={()=>select(component.id)}>{component.shortName}</button></Html>)}</group>
}
useGLTF.preload(`${import.meta.env.BASE_URL}models/motherboard.gltf`)
