# "My profile" page: registration details, certificates, course progress, paid access, backup/restore.
# Everything is read from this browser's storage (courses save progress and certificates locally). Exec'd by build.py.

PROFILE_COURSES = [
    # slug, title, storage key, lessons (None = SSC topic store), certificate?
    ("basics-of-statistics", "Basics of Statistics", "bos_progress_v1", 6),
    ("hr-analytics", "HR Analytics", "hra_progress_v1", 8),
    ("prompt-engineering", "Prompt Engineering", "pe_progress_v1", 6),
    ("building-ai-agents", "Building AI Agents", "agt_progress_v1", 6),
    ("product-management", "Product Management", "pmc_progress_v1", 6),
    ("coding-for-non-coders", "Coding for Non-Coders", "cnc_progress_v1", 6),
    ("seo-to-geo", "SEO to GEO", "geo_progress_v1", 6),
    ("ca-foundation-accounting", "CA Foundation: Accounting", "caf_acc_progress_v1", 33),
    ("ca-foundation-business-laws", "CA Foundation: Business Laws", "caf_law_progress_v1", 20),
    ("ca-foundation-quantitative-aptitude", "CA Foundation: Quantitative Aptitude", "caq_progress_v1", 19),
    ("ca-foundation-business-economics", "CA Foundation: Business Economics", "caf_eco_progress_v1", 26),
    ("cseet-business-communication", "CSEET: Business Communication", "cseet_bc_progress_v1", 8),
    ("cseet-fundamentals-of-accounting", "CSEET: Fundamentals of Accounting", "cseet_fa_progress_v1", 25),
    ("cseet-economic-and-business-environment", "CSEET: Economic and Business Environment", "cseet_ebe_progress_v1", 16),
    ("cseet-business-laws-and-management", "CSEET: Business Laws and Management", "cseet_blm_progress_v1", 24),
    ("ssc-cgl", "SSC CGL", "aistudytools-ssc-cgl-v1", 61),
]

def profile_page():
    data = json.dumps([{"slug": s, "title": t, "key": k, "n": n} for s, t, k, n in PROFILE_COURSES])
    return """<style>
.pf{max-width:980px}.pf h1{font-size:clamp(30px,4.5vw,44px)}.pf h2{font-size:24px;margin:34px 0 12px}
.pf .card{padding:22px}.pf dl{display:grid;grid-template-columns:150px 1fr;gap:8px 14px;margin:14px 0 0}.pf dt{font-weight:700;color:var(--muted)}.pf dd{margin:0;word-break:break-word}
@media(max-width:560px){.pf dl{grid-template-columns:1fr;gap:2px}.pf dd{margin-bottom:8px}}
.pf .row{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}
.pf .grid2{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.pf .cert{border-left:6px solid #4F46E5}.pf .cert h3{font-size:19px;margin:8px 0 6px}.pf .cert p{margin:2px 0;color:var(--muted);font-size:15px}
.pf .bar{height:10px;border-radius:999px;background:#EEF0FF;overflow:hidden;margin:10px 0 6px}.pf .bar i{display:block;height:100%;background:#4F46E5;border-radius:999px}
.pf .cp h3{font-size:18px;margin:6px 0 2px}.pf .cp p{margin:0;color:var(--muted);font-size:14.5px}
.pf .empty{color:var(--muted)}.pf .field{margin-top:10px}.pf .field label{display:block;font-weight:700;font-size:14px;margin-bottom:5px}
.pf .field input,.pf .field select{width:100%;box-sizing:border-box;font:inherit;font-size:16px;padding:10px 12px;border:2px solid var(--border);border-radius:12px;background:#fff}
.pf .msg{font-weight:600;margin-top:10px;min-height:20px}.pf .ok{color:#067647}.pf .bad{color:#B42318}
</style>
<section class="white" style="padding-top:40px"><div class="wrap pf">
<span class="tag indigo">My profile</span>
<h1 style="margin-top:10px">Your profile and certificates</h1>
<p class="muted" style="max-width:720px">Your details, the certificates you have earned and your progress in each course. Courses save progress and certificates in this browser, so open this page on the same device and browser you study on.</p>

<h2>Your details</h2>
<div class="card" id="pf-me"></div>

<h2>My certificates</h2>
<div id="pf-certs"></div>

<h2>My courses</h2>
<div id="pf-courses"></div>

<h2 id="pf-paid-h" hidden>Paid course access</h2>
<div id="pf-paid"></div>

<h2>Move to another device</h2>
<div class="card"><p style="margin:0">Download a backup of your profile, progress and certificates, then restore it on another device or browser. Keep the file private. For a paid course, enter your access code again on the new device.</p>
<div class="row"><button class="btn btn-accent" id="pf-dl">Download my backup</button><label class="btn btn-soft" style="cursor:pointer">Restore from a backup<input type="file" id="pf-up" accept="application/json,.json" hidden></label></div>
<div class="msg" id="pf-bmsg" aria-live="polite"></div></div>
</div></section>
<script>
(function(){
var C=""" + data + """;
var PAID={"ca-foundation":["CA Foundation Course","/courses/ca-foundation/"],"cseet":["CSEET Course","/courses/cseet/"],"ssc-cgl":["SSC CGL Course","/courses/ssc-cgl/"]};
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function rd(k){try{return JSON.parse(localStorage.getItem(k)||"null");}catch(e){return null;}}
function day(iso){try{return new Date(iso).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});}catch(e){return iso;}}
function user(){return (window.ASTUser&&window.ASTUser.get())||rd("ast_user");}

function me(edit){
  var u=user(),el=document.getElementById("pf-me");
  if(!u){el.innerHTML='<p class="empty" style="margin:0">You have not registered in this browser yet. Fill in the registration form to see your profile.</p>';return;}
  if(!edit){
    el.innerHTML='<dl><dt>Name</dt><dd>'+esc(u.name)+'</dd><dt>Email</dt><dd>'+esc(u.email)+'</dd><dt>Mobile</dt><dd>'+(u.phone?esc(u.phone):'<span class="empty">Not given</span>')+'</dd><dt>I am a</dt><dd>'+esc(u.role||"")+'</dd><dt>Registered on</dt><dd>'+(u.at?day(u.at):"")+'</dd></dl><div class="row"><button class="btn btn-soft" id="pf-ed">Edit details</button></div>';
    document.getElementById("pf-ed").onclick=function(){me(true);};return;}
  var roles=["Student","Exam aspirant","Faculty / Researcher","Working professional","Other"];
  el.innerHTML='<div class="field"><label for="pe-n">Full name</label><input id="pe-n" value="'+esc(u.name)+'"></div><div class="field"><label for="pe-e">Email</label><input id="pe-e" type="email" value="'+esc(u.email)+'"></div><div class="field"><label for="pe-p">Mobile / WhatsApp (optional)</label><input id="pe-p" type="tel" value="'+esc(u.phone||"")+'"></div><div class="field"><label for="pe-r">I am a</label><select id="pe-r">'+roles.map(function(r){return'<option'+(r===u.role?" selected":"")+'>'+r+'</option>';}).join("")+'</select></div><p class="small muted" style="margin-top:10px">Certificates you have already created keep the name printed on them.</p><div class="row"><button class="btn btn-accent" id="pe-s">Save</button><button class="btn btn-soft" id="pe-c">Cancel</button></div><div class="msg" id="pe-m"></div>';
  document.getElementById("pe-c").onclick=function(){me(false);};
  document.getElementById("pe-s").onclick=function(){
    var n=document.getElementById("pe-n").value.trim(),e=document.getElementById("pe-e").value.trim().toLowerCase(),p=document.getElementById("pe-p").value.trim(),m=document.getElementById("pe-m");
    if(n.length<2){m.className="msg bad";m.textContent="Please enter your full name.";return;}
    if(!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(e)){m.className="msg bad";m.textContent="Please enter a valid email.";return;}
    if(p&&!/^[+()\\d\\s-]{8,18}$/.test(p)){m.className="msg bad";m.textContent="Please check your mobile number.";return;}
    var nu=Object.assign({},u,{name:n,email:e,phone:p,role:document.getElementById("pe-r").value,updated:new Date().toISOString()});
    try{localStorage.setItem("ast_user",JSON.stringify(nu));}catch(x){}
    if(window.ASTUser)window.ASTUser.save(nu);
    if(e!==u.email||n!==u.name||p!==(u.phone||"")){fetch("https://formsubmit.co/ajax/intelliqueresearchschool@gmail.com",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({_subject:"Profile updated: "+n,_template:"table",_captcha:"false",name:n,email:e,whatsapp:p,role:nu.role,previous_email:u.email})}).catch(function(){});}
    me(false);};
}

function courses(){
  var certs=[],rows=[];
  C.forEach(function(c){
    var s=rd(c.key);if(!s)return;
    var done=0,best=null,cert=null;
    if(c.slug==="ssc-cgl"){var t=s.t||{};done=Object.keys(t).filter(function(k){var p=t[k];return p&&(p.watch||p.slides||p.try||p.practice||p.test);}).length;}
    else{done=Object.keys(s.done||{}).filter(function(k){return s.done[k];}).length;best=s.test&&(s.test.passScore||s.test.best);cert=s.cert;}
    if(!done&&!best&&!cert)return;
    if(cert)certs.push({c:c,cert:cert});
    rows.push({c:c,done:Math.min(done,c.n),best:best,passed:!!(s.test&&s.test.passed),cert:cert});
  });
  var ce=document.getElementById("pf-certs");
  ce.innerHTML=certs.length?'<div class="grid2">'+certs.map(function(x){var k=x.cert;return'<div class="card cert"><span class="tag mint">Certificate of Completion</span><h3>'+esc(x.c.title)+'</h3><p>Awarded to <b>'+esc(k.name)+'</b>'+(k.inst?', '+esc(k.inst):'')+'</p><p>Certificate ID: <b>'+esc(k.id)+'</b></p><p>Issued: '+esc(k.date)+(k.score?' · Score '+esc(k.score)+'%':'')+'</p><div class="row"><a class="btn btn-accent btn-sm" href="/courses/'+x.c.slug+'/#/certificate">View and download PDF</a></div></div>';}).join("")+'</div>'
    :'<div class="card"><p class="empty" style="margin:0">No certificates in this browser yet. Finish a course and pass its final test (70%) to earn one. <a href="/courses/">Browse courses</a>.</p></div>';
  var co=document.getElementById("pf-courses");
  co.innerHTML=rows.length?'<div class="grid2">'+rows.map(function(r){var pct=Math.round(r.done/r.c.n*100),unit=r.c.slug==="ssc-cgl"?"topics started":"lessons complete";
    var st=r.cert?'<span class="tag mint">Certificate earned</span>':r.passed?'<span class="tag mint">Test passed</span>':'<span class="tag indigo">In progress</span>';
    return'<div class="card cp">'+st+'<h3>'+esc(r.c.title)+'</h3><div class="bar" role="img" aria-label="'+pct+'% complete"><i style="width:'+pct+'%"></i></div><p>'+r.done+' of '+r.c.n+' '+unit+(r.best!=null?' · Best test score '+esc(r.best)+'%':'')+'</p><div class="row" style="margin-top:12px"><a class="btn btn-soft btn-sm" href="/courses/'+r.c.slug+'/">'+(r.cert?"Open course":"Continue")+'</a></div></div>';}).join("")+'</div>'
    :'<div class="card"><p class="empty" style="margin:0">You have not started a course in this browser yet. <a href="/courses/">See all courses</a>.</p></div>';
  var pd=[];Object.keys(PAID).forEach(function(g){var u=rd("ast_unlock_"+g);if(u&&u.until)pd.push([g,u]);});
  document.getElementById("pf-paid-h").hidden=!pd.length;
  document.getElementById("pf-paid").innerHTML=pd.length?'<div class="grid2">'+pd.map(function(x){var live=new Date(x[1].until)>new Date();return'<div class="card cp"><span class="tag '+(live?"mint":"")+'">'+(live?"Active":"Expired")+'</span><h3>'+esc(PAID[x[0]][0])+'</h3><p>'+(live?"Access until ":"Ended on ")+day(x[1].until)+'</p><div class="row" style="margin-top:12px"><a class="btn btn-soft btn-sm" href="'+PAID[x[0]][1]+'">Open course</a></div></div>';}).join("")+'</div>':"";
}

function keys(){var out=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k==="ast_user"||/_progress_v\\d+$/.test(k)||k==="aistudytools-ssc-cgl-v1")out.push(k);}return out;}
document.getElementById("pf-dl").onclick=function(){
  var d={app:"AIStudyTools",version:1,saved:new Date().toISOString(),data:{}};
  try{keys().forEach(function(k){d.data[k]=localStorage.getItem(k);});}catch(e){}
  var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(d,null,1)],{type:"application/json"}));a.download="aistudytools-backup-"+new Date().toISOString().slice(0,10)+".json";document.body.appendChild(a);a.click();a.remove();
  var m=document.getElementById("pf-bmsg");m.className="msg ok";m.textContent="Backup downloaded ("+Object.keys(d.data).length+" items).";};
document.getElementById("pf-up").onchange=function(){
  var f=this.files[0],m=document.getElementById("pf-bmsg");if(!f)return;
  var r=new FileReader();r.onload=function(){try{var d=JSON.parse(r.result);if(d.app!=="AIStudyTools"||!d.data)throw 0;var n=0;
    Object.keys(d.data).forEach(function(k){if(k==="ast_user"||/_progress_v\\d+$/.test(k)||k==="aistudytools-ssc-cgl-v1"){localStorage.setItem(k,d.data[k]);n++;}});
    m.className="msg ok";m.textContent="Restored "+n+" items.";me(false);courses();}catch(e){m.className="msg bad";m.textContent="That file is not an AIStudyTools backup.";}};r.readAsText(f);this.value="";};

me(false);courses();
if(window.ASTUser)window.ASTUser.ready(function(){me(false);});
})();
</script>"""

_pp = head("My profile and certificates | AIStudyTools", "Your AIStudyTools profile, certificates and course progress.", "/profile/") + header("profile")
_pp = _pp.replace("</head>", '<meta name="robots" content="noindex"></head>', 1)
REG_PAGES.add("/profile/")
write("/profile/", _pp + profile_page() + FOOT)
