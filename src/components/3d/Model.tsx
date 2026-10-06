import { Html, useGLTF } from '@react-three/drei'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { Color, Group, Mesh, MeshPhysicalMaterial, Vector3 } from 'three'
import { componentById, componentIds, type ComponentId } from '../../data/components'
import { useLabStore } from '../../store/labStore'

type Props={rotation:[number,number,number];explode?:number}
const colors:Record<ComponentId,string>={motherboard:'#19e6d2',cpu:'#00d8ff',ram:'#a875ff',gpu:'#268cff',ssd:'#ff5ee4',cooling:'#76f5ff'}
const labelPositions:Record<ComponentId,[number,number,number]>={motherboard:[-2.6,.8,0],cpu:[.4,2.2,-.4],ram:[-2.4,2.35,-.2],gpu:[2.7,2.45,1.4],ssd:[-2.7,1.8,1.8],cooling:[.4,4.35,-.4]}
const isComponentId=(value:unknown):value is ComponentId=>typeof value==='string'&&(componentIds as readonly string[]).includes(value)
const componentFromMesh=(mesh:Mesh)=>{const stored=mesh.userData.component;return isComponentId(stored.toLowerCase?.())?stored.toLowerCase() as ComponentId:undefined}

export function Model({rotation,explode=0}:Props){
 const selected=useLabStore(s=>s.selectedComponent),select=useLabStore(s=>s.selectComponent),component=componentById[selected]
 const invalidate=useThree(state=>state.invalidate),gltf=useGLTF(`${import.meta.env.BASE_URL}models/computer-system.glb`)
 const model=useMemo(()=>{const clone=gltf.scene.clone(true) as Group;clone.traverse(object=>{if(!(object instanceof Mesh))return;const id=componentFromMesh(object)??'motherboard';object.userData.component=id;object.userData.assembled=object.position.clone();const color=new Color(colors[id]);object.material=new MeshPhysicalMaterial({color,emissive:color,emissiveIntensity:1.7,transparent:true,opacity:.38,roughness:.22,metalness:.28,wireframe:true,depthWrite:false});object.castShadow=true;object.receiveShadow=true});return clone},[gltf.scene])
 useEffect(()=>{model.traverse(object=>{if(!(object instanceof Mesh))return;const id=componentFromMesh(object)??'motherboard',material=object.material as MeshPhysicalMaterial;material.wireframe=id!==selected;material.opacity=id===selected ? .72 : .3;material.emissiveIntensity=id===selected?3.2:1.35;material.depthWrite=id===selected;material.needsUpdate=true})},[model,selected])
 useFrame((_,delta)=>{let moving=false;model.traverse(object=>{if(!(object instanceof Mesh))return;const base=object.userData.assembled as Vector3|undefined,offset=object.userData.explode as number[]|undefined;if(!base||!offset)return;const target=new Vector3(base.x+offset[0]*explode,base.y+offset[1]*explode,base.z+offset[2]*explode);if(object.position.distanceToSquared(target)>.00001){object.position.lerp(target,Math.min(1,delta*5.5));moving=true}});if(moving){model.updateMatrixWorld();invalidate()}})
 useEffect(()=>{model.traverse(object=>{if(!(object instanceof Mesh))return;const base=object.userData.assembled as Vector3|undefined,offset=object.userData.explode as number[]|undefined;if(base&&offset&&explode===0)object.position.copy(base)});invalidate()},[explode,model,invalidate])
 const choose=(event:ThreeEvent<MouseEvent>)=>{event.stopPropagation();const object=event.object instanceof Mesh?event.object:undefined,id=object?componentFromMesh(object):undefined;if(id)select(id)}
 return <group rotation={rotation} scale={.68} onClick={choose} onPointerEnter={()=>document.body.style.cursor='pointer'} onPointerLeave={()=>document.body.style.cursor='default'}><primitive object={model}/>{explode>.15?<Html position={labelPositions[selected]} center distanceFactor={10}><div className="piece-info"><strong>{component.name}</strong><span>{component.role}</span></div></Html>:null}</group>
}
useGLTF.preload(`${import.meta.env.BASE_URL}models/computer-system.glb`)