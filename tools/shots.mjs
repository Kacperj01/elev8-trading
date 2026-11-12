import pw from '/opt/node22/lib/node_modules/playwright/index.js'; const {chromium}=pw;
const R=process.argv[2]; const b=await chromium.launch();
let p=await b.newPage({viewport:{width:1200,height:630}}); await p.goto('file://'+R+'/tools/og.html'); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(200);
await p.screenshot({path:R+'/docs/assets/og.png'});
for(const [n,w,h] of [['d',1440,900],['m',390,844]]){
 p=await b.newPage({viewport:{width:w,height:h}}); const errs=[]; p.on('console',m=>{if(m.type()==='error')errs.push(m.text())}); p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/'); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);
 console.log(n,'scrollW',await p.evaluate(()=>document.documentElement.scrollWidth),'H',await p.evaluate(()=>document.documentElement.scrollHeight),errs);
 await p.screenshot({path:`${R}/tools/full-${n}.png`,fullPage:true});
}
// form validation check
p=await b.newPage({viewport:{width:1440,height:900}}); await p.goto('http://localhost:8765/'); await p.click('#applyBtn'); console.log('err:',await p.textContent('#applyErr'));
await b.close();
