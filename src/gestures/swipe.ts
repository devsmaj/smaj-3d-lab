export type SwipeDirection='LEFT'|'RIGHT'
type Sample={x:number;time:number}
export class SwipeDetector{
 private samples:Sample[]=[];private lastSwipe=0
 detect(x:number,time:number):SwipeDirection|null{this.samples.push({x,time});this.samples=this.samples.filter(sample=>time-sample.time<=280);const first=this.samples[0];if(!first||time-this.lastSwipe<650)return null;const delta=x-first.x;if(Math.abs(delta)<.22)return null;this.lastSwipe=time;this.samples=[];return delta<0?'LEFT':'RIGHT'}
 reset(){this.samples=[];this.lastSwipe=0}
}
