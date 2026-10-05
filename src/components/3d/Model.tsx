import { Html, useGLTF } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { Mesh, MeshStandardMaterial, Vector3 } from 'three'
import { componentByModelName, components } from '../../data/components'
import { useLabStore } from '../../store/labStore'

type Props={rotation:[number,number,number];explode?:number}
const labelPositions:Record<string,[number,number,number]>={MOTHERBOARD:[-2.15,.35,1.5],CPU:[.45,.65,.1],RAM:[-1.48,.72,.35],GPU:[.15,.68,-1.05],SSD:[1.82,.62,.82],COOLING:[1.72,.82,-.18]}
const explodedOffsets:Record<string,[number,number,number]>={MOTHERBOARD:[0,-.7,0],CPU:[0,1.25,.2],RAM:[-1.6,1.7,.1],GPU:[1.45,1.65,-.2],SSD:[1.8,.15,.65],COOLING:[.45,2.7,-.35]}
const offsetFor=(name:string,index=0)=>explodedOffsets[name]??[(index%3-1)*.45,.35+(index%2)*.45,(index%2?1:-1)*.35]
export function Model({rotation,explode=0}:Props){
 const{scene}=useGLTF(`${import.meta.env.BASE_URL}models/motherboard.gltf`);const selected=useLabStore(s=>s.selectedComponent),select=useLabStore(s=>s.selectComponent)
 const model=useMemo(()=>{const clone=scene.clone(true);clone.traverse(object=>{if(object instanceof Mesh){const material=(object.material as MeshStandardMaterial).clone();material.color.set('#dce4e5');material.metalness=.72;material.roughness=.18;material.transparent=true;material.opacity=object.name==='MOTHERBOARD'?.34:.76;object.material=material}});return clone},[scene])
 useEffect(()=>{model.traverse(object=>{if(!(object instanceof Mesh)||!componentByModelName[object.name])return;const material=object.material as MeshStandardMaterial;const active=componentByModelName[object.name]===selected;material.color.set(active?'#ffffff':'#d5dddf');material.emissive.set(active?'#dff9ff':'#6f7b7e');material.emissiveIntensity=active ? .72 : .18;material.opacity=active ? .92 : (object.name==='MOTHERBOARD'?.3:.7)})},[model,selected])
 useEffect(()=>{model.children.forEach((object,index)=>{const base=scene.children[index]?.position;if(!base)return;const offset=offsetFor(object.name,index);object.position.copy(base).add(new Vector3(offset[0]*explode,offset[1]*explode,offset[2]*explode))})},[model,scene,explode])
 const choose=(event:ThreeEvent<MouseEvent>)=>{const id=componentByModelName[event.object.name];if(id){event.stopPropagation();select(id)}}
 return <group rotation={rotation} scale={1.02}><primitive object={model} onClick={choose} onPointerEnter={()=>document.body.style.cursor='pointer'} onPointerLeave={()=>document.body.style.cursor='default'}/>{components.map(component=>{const base=labelPositions[component.modelName],offset=offsetFor(component.modelName);return <Html key={component.id} position={[base[0]+offset[0]*explode,base[1]+offset[1]*explode,base[2]+offset[2]*explode]} center distanceFactor={9}><button className={`part-label ${selected===component.id?'active':''}`} onClick={()=>select(component.id)}>{component.shortName}</button></Html>})}</group>
}
useGLTF.preload(`${import.meta.env.BASE_URL}models/motherboard.gltf`)