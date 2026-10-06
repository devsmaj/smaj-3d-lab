import type { ComponentId } from '../data/components'
import { componentById } from '../data/components'
import { supabaseAnonKey, supabaseUrl } from '../lib/supabase'

export type TutorMessage={role:'student'|'tutor';text:string;error?:boolean}
export type NovaContext={componentId:ComponentId;lesson:string;interactionState:'assembled'|'exploded';handTracking:boolean;gesture:string|null;visited:ComponentId[];passed:ComponentId[];availableActions:string[]}
type AskOptions={message:string;history:TutorMessage[];context:NovaContext;signal?:AbortSignal;onDelta?:(text:string,fullText:string)=>void}
type NovaEvent={type:'delta';delta:string}|{type:'done'}|{type:'error';message:string;code?:string}

export class NovaError extends Error{constructor(message:string,public readonly code='nova_error'){super(message);this.name='NovaError'}}

async function errorFrom(response:Response){try{const body=await response.json() as {error?:{message?:string;code?:string}|string};const error=body.error;return new NovaError(typeof error==='string'?error:error?.message??`NOVA backend returned ${response.status}`,typeof error==='object'?error?.code??'backend_error':'backend_error')}catch{return new NovaError(`NOVA backend returned ${response.status}`,'backend_error')}}

export async function askTutor({message,history,context,signal,onDelta}:AskOptions){
 if(!supabaseUrl||!supabaseAnonKey)throw new NovaError('NOVA is not configured. Add the public Supabase URL and anon key; keep OPENAI_API_KEY only in Supabase secrets.','not_configured')
 const component=componentById[context.componentId]
 const response=await fetch(`${supabaseUrl}/functions/v1/tutor`,{method:'POST',headers:{Authorization:`Bearer ${supabaseAnonKey}`,apikey:supabaseAnonKey,'Content-Type':'application/json',Accept:'text/event-stream'},body:JSON.stringify({message,history:history.filter(item=>item.text&&!item.error).slice(-12).map(({role,text})=>({role,text})),context:{...context,component:{name:component.name,summary:component.summary,role:component.role,analogy:component.analogy}}}),signal})
 if(!response.ok)throw await errorFrom(response)
 if(!response.body)throw new NovaError('NOVA returned an empty stream.','empty_stream')
 const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='',answer=''
 const receive=(block:string)=>{const line=block.split(/\r?\n/).find(value=>value.startsWith('data:'));if(!line)return;const event=JSON.parse(line.slice(5).trim()) as NovaEvent;if(event.type==='delta'){answer+=event.delta;onDelta?.(event.delta,answer)}else if(event.type==='error')throw new NovaError(event.message,event.code)}
 while(true){const{done,value}=await reader.read();buffer+=decoder.decode(value,{stream:!done});const blocks=buffer.split(/\r?\n\r?\n/);buffer=blocks.pop()??'';for(const block of blocks)receive(block);if(done)break}
 if(buffer.trim())receive(buffer)
 if(!answer.trim())throw new NovaError('NOVA completed without an answer.','empty_response')
 return{answer:answer.trim()}
}
