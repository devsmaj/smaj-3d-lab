import { distance, type Landmark } from './point'
export function pinchConfidence(landmarks:Landmark[],palmScale:number){if(landmarks.length<21||palmScale<=0)return 0;const ratio=distance(landmarks[4],landmarks[8])/palmScale;return Math.max(0,Math.min(1,(.62-ratio)/.34))}
export const isPinching=(landmarks:Landmark[],palmScale:number)=>pinchConfidence(landmarks,palmScale)>=.58
