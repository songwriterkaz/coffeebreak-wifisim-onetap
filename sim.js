const steps=[];function step(t){steps.push(t);$('#steps').innerHTML=steps.map(s=>'<li>'+s+'</li>').join('');$('#step').textContent=t;say(t)}
function show(id){['start','busy','done'].forEach(x=>$('#'+x).classList.toggle('hide',x!==id))}
let me;
function finish(){put('setup',1);show('done');$('#me').textContent=me;$('#me').setAttribute('aria-label','Your call ID is '+me.split('').join(' '));buzz([80,60,80]);say("You're connected. Your call ID is "+me.replace(/-/g,' ')+'. It is saved.');
 try{new QRCode($('#qr'),{text:'https://songwriterkaz.github.io/coffeebreak-onetap-phone/?add='+me,width:200,height:200})}catch(e){}}
onState=ok=>{$('#st').textContent=ok?'Online':'Reconnecting…';$('#st').style.color=ok?'#2ee66b':'#ffd84d'};
async function run(){buzz();show('busy');$('#err').textContent='';
 step('Checking WiFi');if(!navigator.onLine){step('No internet. Please turn on WiFi.');setTimeout(()=>show('start'),4000);return}
 step('Making your call ID');me=myNum();
 step('Asking for the microphone');try{const s=await mic();s.getTracks().forEach(t=>t.stop())}catch(e){steps.push('Microphone not allowed yet. You can allow it when you call.')}
 step('Connecting');let done=false;onReady=()=>{if(done)return;done=true;step('Saving');setTimeout(finish,500)};startPeer(me);
 setTimeout(()=>{if(!done){$('#err').textContent='Still connecting. It will keep trying by itself.';say('Still connecting. It will keep trying.')}},15000)}
$('#go').onclick=run;
$('#share').onclick=async()=>{buzz();const u='https://songwriterkaz.github.io/coffeebreak-onetap-phone/?add='+me;try{if(navigator.share){await navigator.share({title:'Coffeebreak call ID',text:'Call me over WiFi on Coffeebreak: '+me,url:u});return}}catch(e){if(e.name==='AbortError')return}
 try{await navigator.clipboard.writeText(u);$('#share').textContent='Link copied';say('Link copied')}catch(e){prompt('Copy your link',u)}};
if(get('setup')){me=myNum();finish();onReady=()=>{};startPeer(me)}
