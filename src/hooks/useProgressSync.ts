import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { useLabStore } from '../store/labStore'
import type { ComponentId } from '../data/components'
export function useProgressSync(){const user=useAuthStore(s=>s.user),visited=useLabStore(s=>s.visited),quizResults=useLabStore(s=>s.quizResults),merge=useLabStore(s=>s.mergeProgress),loaded=useRef<string|null>(null);useEffect(()=>{if(!supabase||!user||loaded.current===user.id)return;loaded.current=user.id;void supabase.from('learning_progress').select('visited,quiz_results').eq('user_id',user.id).maybeSingle().then(({data})=>{if(data)merge((data.visited??[]) as ComponentId[],data.quiz_results??{})})},[user,merge]);useEffect(()=>{if(!supabase||!user||loaded.current!==user.id)return;const timer=setTimeout(()=>{void supabase.from('learning_progress').upsert({user_id:user.id,visited,quiz_results:quizResults,updated_at:new Date().toISOString()},{onConflict:'user_id'})},500);return()=>clearTimeout(timer)},[user,visited,quizResults])}
