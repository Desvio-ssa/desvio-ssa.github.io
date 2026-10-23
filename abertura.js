
const CREAM='#F3F0E8',CARD='#FBF9F3',COBALT='#2F52D9',INDIGO='#1C2A72',SKY='#9DB2F2',YEL='#F2B705';
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const R=rng(7);
const ez={out3:x=>1-Math.pow(1-x,3),in3:x=>x*x*x,inout:x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,
 back:x=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)}};
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)), seg=(t,a,b)=>cl((t-a)/(b-a));
let renderer,scene,camera,ready=false,wall=[],hero,plate,wordGroup,diamond,tag,parts=[],dl;
function cv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function tex(c){const t=new THREE.CanvasTexture(c);t.anisotropy=8;t.colorSpace=THREE.SRGBColorSpace;return t}
function tileCanvas(bg,line,dia){const c=cv(256,256),x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,256,256);
 x.strokeStyle=line;x.lineWidth=7;x.strokeRect(18,18,220,220);x.lineWidth=3;x.strokeRect(34,34,188,188);
 x.fillStyle=dia;[[34,34],[222,34],[34,222],[222,222]].forEach(p=>{x.save();x.translate(p[0],p[1]);x.rotate(Math.PI/4);x.fillRect(-9,-9,18,18);x.restore()});
 x.strokeStyle=line;x.globalAlpha=.55;x.lineWidth=4;[[34,34,0],[222,34,1],[34,222,3],[222,222,2]].forEach(p=>{x.beginPath();x.arc(p[0],p[1],64,p[2]*Math.PI/2,p[2]*Math.PI/2+Math.PI/2);x.stroke()});return c}
function heroCanvas(){const c=cv(1024,1024),x=c.getContext('2d');x.fillStyle=COBALT;x.fillRect(0,0,1024,1024);
 const g=x.createLinearGradient(0,0,1024,1024);g.addColorStop(0,'rgba(255,255,255,.18)');g.addColorStop(1,'rgba(0,0,0,.12)');x.fillStyle=g;x.fillRect(0,0,1024,1024);
 x.strokeStyle=CARD;x.lineWidth=14;x.strokeRect(50,50,924,924);x.lineWidth=5;x.strokeRect(86,86,852,852);
 x.fillStyle=YEL;[[86,86],[938,86],[86,938],[938,938]].forEach(p=>{x.save();x.translate(p[0],p[1]);x.rotate(Math.PI/4);x.fillRect(-24,-24,48,48);x.restore()});
 x.strokeStyle='rgba(157,178,242,.8)';x.lineWidth=7;[[86,86,0],[938,86,1],[86,938,3],[938,938,2]].forEach(p=>{[110,170,230].forEach(r=>{x.beginPath();x.arc(p[0],p[1],r,p[2]*Math.PI/2,p[2]*Math.PI/2+Math.PI/2);x.stroke()})});
 x.font="640px 'Alfa Slab One'";x.textAlign='center';x.textBaseline='alphabetic';
 x.fillStyle=INDIGO;x.fillText('D',500+22,700+22);x.fillStyle=CARD;x.fillText('D',500,700);
 // arrow
 const ar=(col,o,lw)=>{x.save();x.translate(o,o);x.strokeStyle=col;x.fillStyle=col;x.lineCap='butt';x.lineJoin='round';x.lineWidth=lw;
  x.beginPath();x.moveTo(640,830);x.lineTo(640,740);x.quadraticCurveTo(640,670,710,670);x.lineTo(790,670);x.stroke();
  x.beginPath();x.moveTo(770,610);x.lineTo(870,670);x.lineTo(770,730);x.closePath();x.fill();x.restore()};
 ar(INDIGO,14,56);ar(YEL,0,50);return c}
function plateCanvas(){const c=cv(1200,360),x=c.getContext('2d');x.fillStyle=CARD;x.fillRect(0,0,1200,360);x.strokeStyle=INDIGO;x.lineWidth=14;x.strokeRect(7,7,1186,346);return c}
function wordCanvases(){ // returns {front,side,wd,ws,gap,W,H}
 const mk=(fa,fb)=>{const c=cv(1400,360),x=c.getContext('2d');x.font="190px 'Alfa Slab One'";x.textBaseline='alphabetic';
  const wd=x.measureText('desvio').width,ws=x.measureText('ssa').width,gap=70,tot=wd+gap+ws,x0=(1400-tot)/2;
  x.fillStyle=fa;x.fillText('desvio',x0,250);x.fillStyle=fb;x.fillText('ssa',x0+wd+gap,250);return {c,wd,ws,gap,x0}};
 return {front:mk(INDIGO,COBALT),side:mk('#9DB2F2','#9DB2F2')}}
function tagCanvas(){const c=cv(900,150),x=c.getContext('2d');x.fillStyle=YEL;x.fillRect(0,0,900,150);x.strokeStyle=INDIGO;x.lineWidth=10;x.strokeRect(5,5,890,140);
 x.font="700 66px 'Barlow Condensed'";x.fillStyle='#25262B';x.textAlign='center';x.textBaseline='middle';
 let s='SALVADOR SEM CARTÃO-POSTAL';x.letterSpacing='5px';x.fillText(s,450,80);return c}
async function init(box){
 try{await Promise.race([Promise.all([document.fonts.load("190px 'Alfa Slab One'"),document.fonts.load("700 70px 'Barlow Condensed'")]),new Promise(function(r){setTimeout(r,2500)})])}catch(e){}
 var W=box.clientWidth,H=box.clientHeight;renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setSize(W,H);renderer.setClearColor(0x000000,0);
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;box.appendChild(renderer.domElement);renderer.domElement.style.cssText='position:absolute;inset:0;width:100%;height:100%';
 scene=new THREE.Scene();
 var asp=W/H;camera=new THREE.PerspectiveCamera(2*Math.atan(3.2/asp/18)*180/Math.PI,asp,.1,100);
 scene.add(new THREE.HemisphereLight(0xffffff,0xb8c4ee,.95));
 dl=new THREE.DirectionalLight(0xffffff,1.15);dl.position.set(-5,9,12);dl.castShadow=true;dl.shadow.mapSize.set(1024,1024);
 Object.assign(dl.shadow.camera,{left:-9,right:9,top:12,bottom:-12,near:1,far:40});dl.shadow.bias=-.0004;scene.add(dl);
 // wall
 const sets=[[CARD,INDIGO,COBALT],[COBALT,CARD,YEL],[SKY,INDIGO,COBALT],[INDIGO,SKY,YEL]].map(a=>tex(tileCanvas(...a)));
 const side=new THREE.MeshStandardMaterial({color:'#16205a',roughness:.6});
 const geo=new THREE.BoxGeometry(1,1,.22);
 const cols=7,rows=16,s=1.0;
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
  const k=R(),ti=k<.34?0:k<.6?1:k<.84?2:3;
  const m=new THREE.MeshStandardMaterial({map:sets[ti],roughness:.45,metalness:.02});
  const mesh=new THREE.Mesh(geo,[side,side,side,side,m,side]);mesh.castShadow=true;mesh.receiveShadow=true;
  const fx=(c-(cols-1)/2)*s*1.04,fy=(r-(rows-1)/2)*s*1.04;
  const a=R()*Math.PI*2,d=9+R()*10;
  mesh.userData={fx,fy,sx:fx+Math.cos(a)*d,sy:fy+Math.sin(a)*d,sz:-6+R()*26,rx:(R()-.5)*9,ry:(R()-.5)*9,rz:(R()-.5)*9,
    dl:R()*.7+Math.hypot(fx,fy)*.045,du:.95+R()*.35,r:Math.hypot(fx,fy)};
  scene.add(mesh);wall.push(mesh)}
 // hero tile
 const ht=new THREE.MeshStandardMaterial({map:tex(heroCanvas()),roughness:.35,metalness:.05});
 const hs=new THREE.MeshStandardMaterial({color:'#101a55',roughness:.5});
 hero=new THREE.Mesh(new THREE.BoxGeometry(3.5,3.5,.42),[hs,hs,hs,hs,ht,hs]);hero.castShadow=true;hero.receiveShadow=true;scene.add(hero);
 // plate + wordmark
 plate=new THREE.Group();
 const pm=new THREE.MeshBasicMaterial({map:tex(plateCanvas())});
 const pb=new THREE.Mesh(new THREE.BoxGeometry(5.7,1.7,.3),[hs,hs,hs,hs,pm,hs]);pb.castShadow=true;pb.receiveShadow=true;plate.add(pb);
 const wc=wordCanvases(),wf=tex(wc.front.c),ws=tex(wc.side.c);
 const pw=5.2,ph=pw*360/1400;
 for(let i=0;i<10;i++){const front=i===9;const m=new THREE.MeshBasicMaterial({map:front?wf:ws,transparent:true,alphaTest:.3});
  const p=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph),m);p.position.set(0,0,.16+i*.022-(front?0:0));plate.add(p)}
 // front layer shifted for hard-shadow offset look: layers go toward bottom-right
 plate.children.slice(1).forEach((p,i)=>{p.position.x=.011*(9-i-1);p.position.y=-.011*(9-i-1)});
 const u=pw/1400,cx=(1400/2);
 const dx=((wc.front.x0+wc.front.wd+wc.front.gap/2)-cx)*u;
 diamond=new THREE.Mesh(new THREE.BoxGeometry(.2,.2,.2),new THREE.MeshBasicMaterial({color:YEL}));diamond.castShadow=true;
 diamond.userData.dx=dx;diamond.userData.dy=-.17;plate.add(diamond);
 scene.add(plate);
 const tm=new THREE.MeshBasicMaterial({map:tex(tagCanvas())});
 tag=new THREE.Mesh(new THREE.BoxGeometry(4.4,.73,.16),[hs,hs,hs,hs,tm,hs]);tag.castShadow=true;scene.add(tag);
 // particles
 const pg=new THREE.BoxGeometry(.16,.16,.16);
 for(let i=0;i<46;i++){const m=new THREE.Mesh(pg,new THREE.MeshStandardMaterial({color:[YEL,CARD,SKY,COBALT][i%4]}));const a=R()*Math.PI*2;
  m.userData={vx:Math.cos(a)*(2.5+R()*4.5),vy:Math.sin(a)*(2.5+R()*4.5)+1.5,vz:2+R()*5,sp:(R()-.5)*14};parts.push(m);scene.add(m)}
 ready=true}
const TS=2.25; // slam time
function hp(t){ // hero pose
 const d=seg(t,1.55,TS);let y,z,rz,sc=1;
 if(t<TS){const e=ez.in3(d);y=1.9+(1-e)*11;z=.55+(1-e)*14;rz=-.55*(1-e)-.07;sc=1}
 else{const k=t-TS;z=.55+.35*Math.exp(-k*6)*Math.cos(k*22)*1+0;y=1.9;rz=-.07;sc=1+.07*Math.exp(-k*7)*Math.cos(k*20)}
 return{y,z,rz,sc}}
function render(t){
 // camera
 const dolly=18-seg(t,0,6)*1.4,k=Math.max(0,t-TS),shake=.16*Math.exp(-k*7)*Math.sin(k*45);
 camera.position.set(Math.sin(t*.5)*.25+shake,shake*.8+Math.cos(t*.45)*.12,dolly);camera.lookAt(0,-.35,0);
 // wall tiles
 wall.forEach(m=>{const u=m.userData,e=ez.out3(seg(t,u.dl,u.dl+u.du)),i=1-e;
  m.position.set(u.fx+(u.sx-u.fx)*i,u.fy+(u.sy-u.fy)*i,(u.sz)*i);
  m.rotation.set(u.rx*i,u.ry*i,u.rz*i);
  const w=t-TS-u.r*.1;if(w>0){m.position.z-=.45*Math.exp(-w*3.2)*Math.sin(w*14)*Math.min(1,w*10);m.rotation.z+=.05*Math.exp(-w*3)*Math.sin(w*12+u.r)}});
 // hero
 const h=hp(t);hero.position.set(0,h.y,h.z);hero.rotation.set(0,Math.sin(Math.max(0,t-2.7)*1.5)*.2*seg(t,2.7,3.2),h.rz);hero.scale.setScalar(h.sc);hero.visible=t>1.5;
 // plate
 const pa=seg(t,2.75,3.35),pe=ez.back(pa);plate.position.set(0,-2.15-(1-pe)*7,.4+(1-pe)*1.5);plate.rotation.z=.03*(1-pe)-.012;plate.visible=pa>0;
 const da=seg(t,3.2,4.0);diamond.position.set(diamond.userData.dx,diamond.userData.dy,.38);diamond.rotation.set(da*Math.PI*2,da*Math.PI*2*1.0,Math.PI/4+da*Math.PI*2);diamond.scale.setScalar(.2+ez.back(seg(t,3.15,3.7))*.8);
 // tag
 const ta=ez.back(seg(t,3.6,4.1));tag.position.set(.15,-3.95,.45);tag.rotation.z=-.03;tag.scale.setScalar(Math.max(.001,ta));tag.visible=ta>0;
 // particles
 parts.forEach(m=>{const u=m.userData,q=t-TS;if(q<0||q>1.3){m.visible=false;return}m.visible=true;
  m.position.set(u.vx*q,1.9+u.vy*q-5.5*q*q,.9+u.vz*q);m.rotation.set(q*u.sp,q*u.sp*.7,0);m.scale.setScalar(Math.max(.001,1-q/1.3))});
 if(t>4.3&&renderer.shadowMap.autoUpdate){renderer.shadowMap.needsUpdate=true;renderer.shadowMap.autoUpdate=false}
 renderer.render(scene,camera)}
window.DesvioIntro=function(box,onEnd){var raf,t0=0,fin=false;
 function end(){if(fin)return;fin=true;cancelAnimationFrame(raf);onEnd()}
 return init(box).then(function(){
  function loop(now){if(!t0)t0=now;var t=(now-t0)/1000;render(Math.min(t,6.0));if(t>=6.0)end();else raf=requestAnimationFrame(loop)}
  raf=requestAnimationFrame(loop)})};
