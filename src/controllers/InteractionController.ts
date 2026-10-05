import type { GestureResult } from '../gestures/GestureEngine'

export type InteractionCommand={rotationX:number;rotationY:number;zoomDelta:number;selectAt:{x:number;y:number}|null;grabbed:boolean;released:boolean;toggleExplode:boolean}
export class InteractionController{
 private grabbed=false;private lastPointer:{x:number;y:number}|null=null;private lastPalmScale=0;private lastSelection=0
 update(result:GestureResult,time=performance.now()):InteractionCommand{
  const command:InteractionCommand={rotationX:0,rotationY:0,zoomDelta:0,selectAt:null,grabbed:this.grabbed,released:false,toggleExplode:false}
  if(result.gesture==='POINT'&&time-this.lastSelection>500){command.selectAt=result.screenPointer;this.lastSelection=time}
  if(result.gesture==='OPEN_PALM'&&result.activated)command.toggleExplode=true
  if(result.gesture==='PINCH'){
   if(!this.grabbed){this.grabbed=true;this.lastPointer=result.screenPointer}
   else if(this.lastPointer){const dx=result.screenPointer.x-this.lastPointer.x,dy=result.screenPointer.y-this.lastPointer.y;if(Math.abs(dx)>.004)command.rotationY=dx*4.2;if(Math.abs(dy)>.004)command.rotationX=dy*3.6;this.lastPointer=result.screenPointer}
  }else if(result.gesture==='OPEN_PALM'&&this.grabbed){this.grabbed=false;this.lastPointer=null;command.released=true}
  if(result.activated&&result.gesture==='SWIPE_LEFT')command.rotationY=-.42
  if(result.activated&&result.gesture==='SWIPE_RIGHT')command.rotationY=.42
  if(this.lastPalmScale>0&&result.gesture!=='PINCH'){const delta=result.palmScale-this.lastPalmScale;if(Math.abs(delta)>.0025)command.zoomDelta=-delta*18}
  this.lastPalmScale=result.palmScale;command.grabbed=this.grabbed;return command
 }
 reset(){this.grabbed=false;this.lastPointer=null;this.lastPalmScale=0;this.lastSelection=0}
}
