import { openPalmConfidence } from './openPalm'
import { pinchConfidence } from './pinch'
import { distance, pointConfidence, type Landmark } from './point'
import { SwipeDetector } from './swipe'

export type Gesture='POINT'|'PINCH'|'OPEN_PALM'|'SWIPE_LEFT'|'SWIPE_RIGHT'|'NONE'
export type NormalizedPoint={x:number;y:number;z:number}
export type GestureResult={gesture:Gesture;confidence:number;activated:boolean;pointer:NormalizedPoint;screenPointer:{x:number;y:number};palmScale:number;landmarkCount:number}

export function normalizeLandmarks(landmarks:Landmark[]){const wrist=landmarks[0];const scale=Math.max(distance(wrist,landmarks[9]),.001);return{points:landmarks.map(point=>({x:(point.x-wrist.x)/scale,y:(point.y-wrist.y)/scale,z:(point.z-wrist.z)/scale})),scale}}

export class GestureEngine{
 private swipe=new SwipeDetector();private candidate:Gesture='NONE';private candidateFrames=0;private stable:Gesture='NONE';private lastActivation=0
 detect(landmarks:Landmark[],time=performance.now()):GestureResult{
  if(landmarks.length<21)return this.empty()
  const normalized=normalizeLandmarks(landmarks);const palmCenter=(landmarks[0].x+landmarks[5].x+landmarks[9].x+landmarks[13].x+landmarks[17].x)/5
  const swipe=this.swipe.detect(palmCenter,time);const pinch=pinchConfidence(landmarks,normalized.scale);const palm=openPalmConfidence(landmarks);const point=pointConfidence(landmarks)
  let next:Gesture='NONE',confidence=0
  if(swipe){next=swipe==='LEFT'?'SWIPE_LEFT':'SWIPE_RIGHT';confidence=1}else if(pinch>=.58){next='PINCH';confidence=pinch}else if(palm>=.8){next='OPEN_PALM';confidence=palm}else if(point>=.67){next='POINT';confidence=point}
  if(next===this.candidate)this.candidateFrames++;else{this.candidate=next;this.candidateFrames=1}
  const required=next.startsWith('SWIPE')?1:3;if(this.candidateFrames>=required)this.stable=next
  const activated=this.stable!=='NONE'&&this.stable!==this.candidate?false:this.candidateFrames===required&&time-this.lastActivation>450
  if(activated)this.lastActivation=time
  return{gesture:this.stable,confidence,activated,pointer:normalized.points[8],screenPointer:{x:1-landmarks[8].x,y:landmarks[8].y},palmScale:normalized.scale,landmarkCount:landmarks.length}
 }
 reset(){this.swipe.reset();this.candidate='NONE';this.candidateFrames=0;this.stable='NONE';this.lastActivation=0}
 private empty():GestureResult{return{gesture:'NONE',confidence:0,activated:false,pointer:{x:0,y:0,z:0},screenPointer:{x:.5,y:.5},palmScale:0,landmarkCount:0}}
}
