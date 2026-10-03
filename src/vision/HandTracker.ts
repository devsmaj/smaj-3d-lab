import { FilesetResolver, HandLandmarker, type HandLandmarkerResult, type NormalizedLandmark } from '@mediapipe/tasks-vision'

export type SmoothedHand={landmarks:NormalizedLandmark[];handedness:string;score:number}

export class HandTracker{
 private detector:HandLandmarker|null=null
 private previous:NormalizedLandmark[]|null=null
 private readonly smoothing=.68
 async initialize(){
  const vision=await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm')
  this.detector=await HandLandmarker.createFromOptions(vision,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',delegate:'GPU'},runningMode:'VIDEO',numHands:1,minHandDetectionConfidence:.6,minHandPresenceConfidence:.6,minTrackingConfidence:.6})
 }
 detect(video:HTMLVideoElement,timestamp:number):SmoothedHand|null{
  if(!this.detector||video.readyState<2)return null
  const result:HandLandmarkerResult=this.detector.detectForVideo(video,timestamp)
  const points=result.landmarks[0];if(!points){this.previous=null;return null}
  const landmarks=points.map((point,index)=>{const old=this.previous?.[index];return old?{x:old.x*this.smoothing+point.x*(1-this.smoothing),y:old.y*this.smoothing+point.y*(1-this.smoothing),z:old.z*this.smoothing+point.z*(1-this.smoothing),visibility:point.visibility}:{...point}})
  this.previous=landmarks
  const category=result.handedness[0]?.[0]
  return{landmarks,handedness:category?.categoryName??'Hand',score:category?.score??0}
 }
 close(){this.detector?.close();this.detector=null;this.previous=null}
}
