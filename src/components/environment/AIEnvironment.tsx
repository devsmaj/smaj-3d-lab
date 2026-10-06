import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import type { Group } from 'three'
import { CursorField } from './CursorField'
import { DataStreams } from './DataStreams'
import { EnvironmentEffects } from './EnvironmentEffects'
import { HolographicNodes } from './HolographicNodes'
import { NeuralField } from './NeuralField'
import { SpatialGrid } from './SpatialGrid'
type Props={hand:{x:number;y:number}|null;tracking:boolean;selected:string;exploded:boolean;pulse:number}
export function AIEnvironment(props:Props){const root=useRef<Group>(null);const invalidate=useThree(state=>state.invalidate);useEffect(()=>{const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduced)return;const delay=window.innerWidth<700?80:40;let timer=0;const tick=()=>{if(!document.hidden)invalidate();timer=window.setTimeout(tick,delay)};tick();return()=>window.clearTimeout(timer)},[invalidate]);useFrame(({pointer})=>{if(root.current&&!document.hidden){root.current.rotation.y+=(pointer.x*.012-root.current.rotation.y)*.025;root.current.rotation.x+=(-pointer.y*.008-root.current.rotation.x)*.025}});return <group ref={root}><EnvironmentEffects pulse={props.pulse}/>{!props.tracking?<SpatialGrid/>:null}<NeuralField hand={props.hand} active={props.tracking} pulse={props.pulse}/><DataStreams pulse={props.pulse}/><HolographicNodes selected={props.selected} exploded={props.exploded}/><CursorField hand={props.hand} active={props.tracking}/></group>}
