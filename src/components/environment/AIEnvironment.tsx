import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { CursorField } from './CursorField'
import { DataStreams } from './DataStreams'
import { EnvironmentEffects } from './EnvironmentEffects'
import { HolographicNodes } from './HolographicNodes'
import { NeuralField } from './NeuralField'
import { SpatialGrid } from './SpatialGrid'
type Props={hand:{x:number;y:number}|null;tracking:boolean;selected:string;exploded:boolean;pulse:number}
export function AIEnvironment(props:Props){const root=useRef<Group>(null);useFrame(({pointer})=>{if(root.current&&!document.hidden){root.current.rotation.y+=(pointer.x*.012-root.current.rotation.y)*.025;root.current.rotation.x+=(-pointer.y*.008-root.current.rotation.x)*.025}});return <group ref={root}><EnvironmentEffects pulse={props.pulse}/>{!props.tracking?<SpatialGrid/>:null}<NeuralField hand={props.hand} active={props.tracking} pulse={props.pulse}/><DataStreams pulse={props.pulse}/><HolographicNodes selected={props.selected} exploded={props.exploded}/><CursorField hand={props.hand} active={props.tracking}/></group>}