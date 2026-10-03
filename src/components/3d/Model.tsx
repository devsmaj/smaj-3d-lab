import { useGLTF } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { Mesh, MeshStandardMaterial } from 'three'
import { useLabStore } from '../../store/labStore'

type Props={rotation:[number,number,number]}
export function Model({rotation}:Props){
 const {scene}=useGLTF(`${import.meta.env.BASE_URL}models/motherboard.gltf`)
 const model=useMemo(()=>scene.clone(true),[scene])
 const selected=useLabStore(s=>s.selectedComponent==='processor');const select=useLabStore(s=>s.selectComponent)
 useEffect(()=>{const cpu=model.getObjectByName('CPU') as Mesh|undefined;if(!cpu)return;cpu.material=(cpu.material as MeshStandardMaterial).clone();const material=cpu.material as MeshStandardMaterial;material.emissive.set(selected?'#7d5410':'#000000');material.emissiveIntensity=selected ? .5 : 0},[model,selected])
 const choose=(event:ThreeEvent<MouseEvent>)=>{event.stopPropagation();if(event.object.name==='CPU')select('processor')}
 return <primitive object={model} rotation={rotation} onClick={choose} onPointerEnter={()=>document.body.style.cursor='pointer'} onPointerLeave={()=>document.body.style.cursor='default'}/>
}
useGLTF.preload(`${import.meta.env.BASE_URL}models/motherboard.gltf`)
