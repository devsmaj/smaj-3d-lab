export type Landmark={x:number;y:number;z:number}
export const distance=(a:Landmark,b:Landmark)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)
export const fingerExtended=(landmarks:Landmark[],tip:number,pip:number,mcp:number)=>distance(landmarks[tip],landmarks[mcp])>distance(landmarks[pip],landmarks[mcp])*1.35
export const fingerFolded=(landmarks:Landmark[],tip:number,pip:number,mcp:number)=>distance(landmarks[tip],landmarks[mcp])<distance(landmarks[pip],landmarks[mcp])*1.18
export function pointConfidence(landmarks:Landmark[]){if(landmarks.length<21)return 0;const index=fingerExtended(landmarks,8,6,5);const folded=[fingerFolded(landmarks,12,10,9),fingerFolded(landmarks,16,14,13),fingerFolded(landmarks,20,18,17)];return index?folded.filter(Boolean).length/3:0}
export const isPointing=(landmarks:Landmark[])=>pointConfidence(landmarks)>=.67
