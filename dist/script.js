const cover=document.getElementById('cover');
const invitation=document.getElementById('invitation');
const audio=document.getElementById('wedding-audio');
const pullThread=document.getElementById('pull-thread');
const target=new Date('2026-12-09T16:00:00+05:30').getTime();
let opening=false;
function openInvitation(){if(opening)return;opening=true;pullThread.disabled=true;cover.classList.add('opening');audio.play().catch(()=>{});setTimeout(()=>{cover.hidden=true;invitation.hidden=false;window.scrollTo(0,0)},900)}
document.getElementById('open-invitation').addEventListener('click',openInvitation);
let pullStart=null;
function resetPull(){pullStart=null;pullThread.classList.remove('dragging');pullThread.style.setProperty('--pull','0px');}
pullThread.addEventListener('pointerdown',event=>{pullStart=event.clientY;pullThread.setPointerCapture(event.pointerId);pullThread.classList.add('dragging');});
pullThread.addEventListener('pointermove',event=>{if(pullStart===null)return;const distance=Math.max(0,Math.min(120,event.clientY-pullStart));pullThread.style.setProperty('--pull',`${distance}px`);if(distance>78)openInvitation();});
pullThread.addEventListener('pointerup',resetPull);
pullThread.addEventListener('pointercancel',resetPull);
pullThread.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openInvitation();}});
document.getElementById('restart').addEventListener('click',()=>{audio.pause();audio.currentTime=0;invitation.hidden=true;cover.hidden=false;cover.classList.remove('opening');opening=false;pullThread.disabled=false;resetPull();journeyPlayed=false;cancelAnimationFrame(journeyFrame);resetJourney();window.scrollTo(0,0)});
function renderCountdown(){let left=Math.max(0,target-Date.now()),s=Math.floor(left/1000);let values=[Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60],labels=['Days','Hours','Minutes','Seconds'];document.getElementById('countdown').innerHTML=values.map((v,i)=>`<div class="time-unit"><span class="time-value">${String(v).padStart(2,'0')}</span><span class="time-label">${labels[i]}</span></div>`).join('')}
renderCountdown();setInterval(renderCountdown,1000);
const scratch=document.getElementById('scratch');
const scratchCard=document.querySelector('.scratch-card');
const scratchInstruction=document.getElementById('scratch-instruction');
const revealDateButton=document.getElementById('reveal-date');
const scratchContext=scratch?.getContext('2d',{willReadFrequently:true});
let scratchRevealed=false,scratchPointer=null,lastScratch=null,lastScratchCheck=0;
function paintGold(){if(!scratchContext)return;const ctx=scratchContext,w=scratch.width,h=scratch.height;ctx.globalCompositeOperation='source-over';const gradient=ctx.createLinearGradient(0,0,w,h);gradient.addColorStop(0,'#8f6234');gradient.addColorStop(.34,'#edce7d');gradient.addColorStop(.55,'#fff0b6');gradient.addColorStop(.78,'#d3a85e');gradient.addColorStop(1,'#8c5c34');ctx.fillStyle=gradient;ctx.fillRect(0,0,w,h);ctx.strokeStyle='rgba(255,248,210,.34)';ctx.lineWidth=2;for(let x=-h;x<w;x+=22){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+h,h);ctx.stroke();}ctx.strokeStyle='rgba(74,42,50,.56)';ctx.lineWidth=7;ctx.strokeRect(34,34,w-68,h-68);ctx.strokeStyle='rgba(255,239,180,.6)';ctx.lineWidth=2;ctx.strokeRect(46,46,w-92,h-92);ctx.fillStyle='#3c2140';ctx.textAlign='center';ctx.font='42px Georgia';ctx.fillText('✦',w/2,148);ctx.font='italic 52px Georgia';ctx.fillText('A date written in gold',w/2,270);ctx.font='26px Arial';ctx.fillText('SCRATCH TO REVEAL',w/2,350);}
function revealDate(){if(scratchRevealed)return;scratchRevealed=true;scratchCard.classList.add('revealed');scratch.setAttribute('aria-hidden','true');scratchInstruction.textContent='9–11 December 2026 — our forever begins.';revealDateButton.hidden=true;}
function scratchPoint(event){const rect=scratch.getBoundingClientRect();return{x:(event.clientX-rect.left)*scratch.width/rect.width,y:(event.clientY-rect.top)*scratch.height/rect.height,r:28*scratch.width/rect.width};}
function checkScratched(){if(scratchRevealed||!scratchContext)return;const {data,width,height}=scratchContext.getImageData(0,0,scratch.width,scratch.height);let cleared=0,total=0;for(let y=0;y<height;y+=12)for(let x=0;x<width;x+=12){total++;if(data[(y*width+x)*4+3]<60)cleared++;}if(cleared/total>.32)revealDate();}
function eraseAt(event){if(scratchRevealed||!scratchContext)return;const point=scratchPoint(event),ctx=scratchContext;ctx.globalCompositeOperation='destination-out';ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=point.r*2;ctx.beginPath();if(lastScratch)ctx.moveTo(lastScratch.x,lastScratch.y);else ctx.moveTo(point.x,point.y);ctx.lineTo(point.x,point.y);ctx.stroke();ctx.beginPath();ctx.arc(point.x,point.y,point.r,0,Math.PI*2);ctx.fill();lastScratch=point;const now=performance.now();if(now-lastScratchCheck>150){lastScratchCheck=now;checkScratched();}}
if(scratch&&scratchCard&&scratchContext){paintGold();scratch.addEventListener('pointerdown',event=>{scratchPointer=event.pointerId;lastScratch=null;scratch.setPointerCapture(event.pointerId);eraseAt(event);});scratch.addEventListener('pointermove',event=>{if(event.pointerId===scratchPointer)eraseAt(event);});for(const eventName of ['pointerup','pointercancel'])scratch.addEventListener(eventName,event=>{if(event.pointerId===scratchPointer){scratchPointer=null;lastScratch=null;checkScratched();}});revealDateButton.addEventListener('click',revealDate);}else if(scratchCard){revealDate();}
const journeySection=document.querySelector('.journey');
const route=document.querySelector('.route');
const traveller=document.getElementById('traveller');
const caption=document.getElementById('caption');
let journeyPlayed=false,journeyFrame=0;
function resetJourney(){route.classList.remove('arriving','joined');traveller.style.left='15%';traveller.style.top='18.06%';caption.textContent='Siddharth is waiting in Mumbai…';}
function cubicPoint(t,a,b,c,d){const u=1-t;return{x:u*u*u*a.x+3*u*u*t*b.x+3*u*t*t*c.x+t*t*t*d.x,y:u*u*u*a.y+3*u*u*t*b.y+3*u*t*t*c.y+t*t*t*d.y};}
function routePoint(progress){if(progress<.5)return cubicPoint(progress*2,{x:60,y:65},{x:345,y:30},{x:350,y:165},{x:170,y:172});return cubicPoint((progress-.5)*2,{x:170,y:172},{x:-10,y:179},{x:40,y:292},{x:305,y:295});}
function playJourney(){cancelAnimationFrame(journeyFrame);resetJourney();let startedAt;
  function step(now){if(!startedAt)startedAt=now;const progress=Math.min(1,(now-startedAt)/6500);const point=routePoint(progress);traveller.style.left=`${point.x/400*100}%`;traveller.style.top=`${point.y/360*100}%`;route.classList.toggle('arriving',progress>.91);if(progress>=1){route.classList.add('joined');caption.textContent='She arrives. He takes his hand. Their forever begins.';return;}journeyFrame=requestAnimationFrame(step);}
  journeyFrame=requestAnimationFrame(step);
}
document.getElementById('replay').addEventListener('click',playJourney);
const journeyObserver=new IntersectionObserver(([entry])=>{if(entry.isIntersecting&&!journeyPlayed&&!invitation.hidden){journeyPlayed=true;playJourney();journeyObserver.unobserve(journeySection);}},{threshold:.25});
journeyObserver.observe(journeySection);
