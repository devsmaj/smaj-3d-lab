import { Bot, Expand, Hand, MousePointer2, RotateCcw, Settings, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ModelInfo } from '../components/3d/ModelInfo'
import { Scene } from '../components/3d/Scene'
import { CameraFeed } from '../components/camera/CameraFeed'
import { AccountPanel } from '../components/ui/AccountPanel'
import { TutorPanel } from '../components/ui/TutorPanel'
import { components } from '../data/components'
import { InteractionController } from '../controllers/InteractionController'
import type { GestureResult } from '../gestures/GestureEngine'
import { useProgressSync } from '../hooks/useProgressSync'
import { useAuthStore } from '../store/authStore'
import { useLabStore } from '../store/labStore'

export function Lab(){
 const[tutorOpen,setTutorOpen]=useState(false);const[accountOpen,setAccountOpen]=useState(false);const initializeAuth=useAuthStore(s=>s.initialize);const selected=useLabStore(s=>s.selectedComponent);const select=useLabStore(s=>s.selectComponent);useProgressSync()
 const[rotation,setRotation]=useState<[number,number,number]>([-.12,-.35,0]);const[resetKey,setResetKey]=useState(0);const[tracking,setTracking]=useState(false);const[gesture,setGesture]=useState<GestureResult|null>(null);const[grabbed,setGrabbed]=useState(false);const[selection,setSelection]=useState<{id:number;x:number;y:number}|null>(null);const[zoom,setZoom]=useState<{id:number;delta:number}|null>(null);const controller=useRef(new InteractionController());const signal=useRef(0)
 const turn=(x:number,y:number)=>setRotation(([rx,ry,rz])=>[Math.max(-1.15,Math.min(1.15,rx+x)),ry+y,rz]);const reset=()=>{setRotation([-.12,-.35,0]);setResetKey(k=>k+1)}
 const handleGesture=(result:GestureResult|null)=>{setGesture(result);if(!result){controller.current.reset();setGrabbed(false);return}const command=controller.current.update(result);setGrabbed(command.grabbed);if(command.rotationX||command.rotationY)turn(command.rotationX,command.rotationY);if(command.selectAt)setSelection({id:++signal.current,...command.selectAt});if(command.zoomDelta)setZoom({id:++signal.current,delta:command.zoomDelta})}
 useEffect(()=>{const key=(event:KeyboardEvent)=>{if(event.key==='ArrowLeft')turn(0,-.15);if(event.key==='ArrowRight')turn(0,.15);if(event.key==='ArrowUp')turn(-.15,0);if(event.key==='ArrowDown')turn(.15,0);if(event.key==='Home')reset()};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[])
 useEffect(()=>{void initializeAuth()},[initializeAuth])
 const gestureName=gesture?.gesture==='OPEN_PALM'?'Open palm':gesture?.gesture==='SWIPE_LEFT'?'Swipe left':gesture?.gesture==='SWIPE_RIGHT'?'Swipe right':gesture?.gesture==='POINT'?'Point':gesture?.gesture==='PINCH'?'Pinch':null
 const fullscreen=()=>document.documentElement.requestFullscreen?.()
 return <main className="lab-shell ar-lab"><div className="ar-stage"><CameraFeed onTrackingChange={setTracking} onGesture={handleGesture}/><div className="ar-shade"/><Scene rotation={rotation} resetKey={resetKey} selection={selection} zoom={zoom}/><header className="topbar ar-topbar"><div className="top-actions"><div className={`status ${tracking?'is-tracking':''}`}><span/>{grabbed?'Pinch control':gestureName??(tracking?'Hands online':'Camera ready')}</div><button onClick={()=>setTutorOpen(true)}><Bot size={15}/>Tutor</button><button onClick={()=>setAccountOpen(true)} aria-label="Learning account"><UserRound size={15}/></button></div></header><div className="ar-lesson"><ModelInfo/></div><nav className="ar-tools" aria-label="View tools"><button className="active" aria-label="Hand interaction"><Hand size={17}/></button><button onClick={reset} aria-label="Reset view"><RotateCcw size={17}/></button><button onClick={fullscreen} aria-label="Full screen"><Expand size={17}/></button><button aria-label="Settings"><Settings size={17}/></button></nav><div className="ar-title"><span>LAB 01 / COMPUTER SYSTEMS</span><strong>Spatial component viewer</strong></div>{tracking&&gesture?.gesture==='POINT'?<div className="gesture-cursor ar-hand-focus" style={{left:`${gesture.screenPointer.x*100}%`,top:`${gesture.screenPointer.y*100}%`}}><Hand size={36}/></div>:null}<nav className="model-dock" aria-label="Computer components">{components.map(item=><button key={item.id} className={selected===item.id?'active':''} onClick={()=>select(item.id)}><span>{item.shortName.slice(0,2).toUpperCase()}</span>{item.shortName}</button>)}</nav><div className="interaction-hint"><MousePointer2 size={14}/>{tracking?'Raise one hand - point, pinch, move':'Enable camera for spatial hand control'}</div></div><TutorPanel open={tutorOpen} onClose={()=>setTutorOpen(false)}/><AccountPanel open={accountOpen} onClose={()=>setAccountOpen(false)}/></main>
}