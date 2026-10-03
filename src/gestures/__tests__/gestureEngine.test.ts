import { describe,expect,it } from 'vitest'
import { normalizeLandmarks } from '../GestureEngine'
import { pinchConfidence } from '../pinch'
import { SwipeDetector } from '../swipe'
import type { Landmark } from '../point'
const hand=Array.from({length:21},(_,index)=>({x:index*.01,y:index*.015,z:0})) as Landmark[]
hand[0]={x:.5,y:.8,z:0};hand[9]={x:.5,y:.5,z:0}
describe('gesture math',()=>{it('normalizes positions by palm size',()=>{const result=normalizeLandmarks(hand);expect(result.scale).toBeCloseTo(.3);expect(result.points[0]).toEqual({x:0,y:0,z:0})});it('recognizes a close thumb-index pinch',()=>{const points=hand.map(point=>({...point}));points[4]={x:.4,y:.4,z:0};points[8]={x:.41,y:.4,z:0};expect(pinchConfidence(points,.3)).toBeGreaterThan(.9)});it('detects horizontal swipe direction and applies cooldown',()=>{const swipe=new SwipeDetector();expect(swipe.detect(.7,1000)).toBeNull();expect(swipe.detect(.4,1200)).toBe('LEFT');expect(swipe.detect(.8,1300)).toBeNull()})})
