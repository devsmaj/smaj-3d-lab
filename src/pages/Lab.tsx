import { FlaskConical, MousePointer2, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ModelInfo } from '../components/3d/ModelInfo'
import { Scene } from '../components/3d/Scene'
import { CameraFeed } from '../components/camera/CameraFeed'

export function Lab(){
 const[rotation,setRotation]=useState<[number,number,number]>([0,-.2,0]);const[resetKey,setResetKey]=useState(0);const[tracking,setTracking]=useState(false)
 const turn=(x:number,y:number)=>setRotation(([rx,ry,rz])=>[rx+x,ry+y,rz]);const reset=()=>{setRotation([0,-.2,0]);setResetKey(k=>k+1)}
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='ArrowLeft')turn(0,-.15);if(e.key==='ArrowRight')turn(0,.15);if(e.key==='ArrowUp')turn(-.15,0);if(e.key==='ArrowDown')turn(.15,0);if(e.key==='Home')reset()};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[])
 return <main className="lab-shell"><header className="topbar"><a className="brand" href={import.meta.env.BASE_URL} aria-label="SMAJ 3D Lab home"><span className="brand-mark"><FlaskConical size={19}/></span><span>SMAJ <strong>3D Lab</strong></span></a><div className="lab-title"><span>Lab 01</span><strong>Inside a computer</strong></div><div className={`status ${tracking?'is-tracking':''}`}><span/>{tracking?'Hand tracking active':'Mouse mode'}</div></header><section className="workspace" aria-label="Interactive 3D computer lab"><div className="scene-wrap"><Scene rotation={rotation} resetKey={resetKey}/><div className="scene-label">Motherboard study model</div><div className="mode-chip"><MousePointer2 size={14}/>Select · Orbit · Zoom</div><div className="model-controls" aria-label="Model rotation controls"><button onClick={()=>turn(0,-.15)} aria-label="Rotate model left">←</button><button onClick={()=>turn(-.15,0)} aria-label="Rotate model up">↑</button><button onClick={()=>turn(.15,0)} aria-label="Rotate model down">↓</button><button onClick={()=>turn(0,.15)} aria-label="Rotate model right">→</button><button onClick={reset} aria-label="Reset model view"><RotateCcw size={15}/></button></div></div><div className="side-rail"><ModelInfo/><CameraFeed onTrackingChange={setTracking}/></div></section><footer className="lab-footer"><span>Learn. Explore. Interact.</span><span>Camera processing stays on this device</span></footer></main>
}
