import { fingerExtended, type Landmark } from './point'
export function openPalmConfidence(landmarks:Landmark[]){if(landmarks.length<21)return 0;const fingers=[[8,6,5],[12,10,9],[16,14,13],[20,18,17]] as const;const extended=fingers.filter(([tip,pip,mcp])=>fingerExtended(landmarks,tip,pip,mcp)).length;const thumbAway=Math.abs(landmarks[4].x-landmarks[5].x)>Math.abs(landmarks[2].x-landmarks[5].x)*.45;return(extended+(thumbAway?1:0))/5}
export const isOpenPalm=(landmarks:Landmark[])=>openPalmConfidence(landmarks)>=.8
