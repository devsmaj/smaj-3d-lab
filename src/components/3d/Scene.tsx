import { Environment, Html, OrbitControls, useProgress } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Component, Suspense, type ReactNode } from 'react'
import { useLabStore } from '../../store/labStore'
import { Model } from './Model'

function Loading(){const {progress}=useProgress();return <Html center><div className="model-loading" role="status">Loading model · {Math.round(progress)}%</div></Html>}
class ModelError extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return{failed:true}}render(){return this.state.failed?<Html center><div className="model-error" role="alert">The 3D model could not be loaded. Refresh to try again.</div></Html>:this.props.children}}
type Props={rotation:[number,number,number];resetKey:number}
export function Scene({rotation,resetKey}:Props){const select=useLabStore(s=>s.selectComponent);return <Canvas shadows camera={{position:[6.8,5.2,7.2],fov:35}} dpr={[1,1.75]} onPointerMissed={()=>select(null)}><color attach="background" args={['#0a1612']}/><fog attach="fog" args={['#0a1612',12,24]}/><ambientLight intensity={0.65}/><directionalLight castShadow position={[4,8,5]} intensity={2.4} color="#fff4d0"/><pointLight position={[-5,2,-3]} intensity={12} color="#69e6b3"/><ModelError><Suspense fallback={<Loading/>}><Model rotation={rotation}/><Environment preset="city"/></Suspense></ModelError><gridHelper args={[18,18,'#214438','#132820']} position={[0,-0.35,0]}/><OrbitControls key={resetKey} makeDefault enablePan={false} minDistance={5} maxDistance={13} minPolarAngle={0.35} maxPolarAngle={Math.PI/2.1}/></Canvas>}
