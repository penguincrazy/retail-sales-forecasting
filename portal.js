const $=id=>document.getElementById(id),fmt=(x,n=3)=>Number(x).toFixed(n),money=x=>Number(x).toLocaleString("en-US",{maximumFractionDigits:2});
async function readJSON(file){const root=document.body.dataset.base||"data";const r=await fetch(root+"/"+file);if(!r.ok)throw new Error(file+" unavailable");return r.json()}
function barChart(target,rows,labelKey,valueKey,precision=3){const el=$(target);if(!el)return;const max=Math.max(...rows.map(x=>Number(x[valueKey])))*1.08||1;el.innerHTML=rows.map((r,i)=>'<div class="bar-row '+(i===0?"best":"")+'"><span class="bar-label" title="'+r[labelKey]+'">'+r[labelKey]+'</span><div class="bar-track"><div class="bar-fill" style="width:'+(Number(r[valueKey])/max*100)+'%"></div></div><span class="bar-value">'+fmt(r[valueKey],precision)+'</span></div>').join("")}
function header(){const b=$("menuToggle"),n=$("navLinks");if(b&&n)b.addEventListener("click",()=>n.classList.toggle("open"))}
function initOverview(d){const best=d.holdout.find(x=>x.model==="LightGBM"),cv=d.rolling_summary.find(x=>x.model==="LightGBM");if($("homeRmsle"))$("homeRmsle").textContent=fmt(best.RMSLE,5);if($("homeMae"))$("homeMae").textContent=fmt(best.MAE,2);if($("homeCv"))$("homeCv").textContent=fmt(cv.RMSLE_mean,5);if($("homeFamilies"))$("homeFamilies").textContent=d.family_errors.length; if($("homeModelBars"))barChart("homeModelBars",d.holdout.slice().sort((a,b)=>a.RMSLE-b.RMSLE),"model","RMSLE",4);if($("homeModelTable"))$("homeModelTable").innerHTML=d.holdout.slice().sort((a,b)=>a.RMSLE-b.RMSLE).map((r,i)=>'<tr class="'+(i===0?"best-row":"")+'"><td>'+(i+1)+'</td><td>'+r.model+'</td><td class="num">'+fmt(r.RMSLE,5)+'</td><td class="num">'+fmt(r.MAE,2)+'</td></tr>').join("")}
function initStudio(d,ins){const rows=d.family_errors.slice().sort((a,b)=>b.RMSLE-a.RMSLE),sel=$("familySelect"),store=$("storeSelect");if(!sel)return;sel.innerHTML=rows.map(x=>'<option value="'+x.family+'">'+x.family+'</option>').join("");if(store){const nums=[...new Set(ins.rows.map(r=>r[1]))].sort((a,b)=>a-b);store.innerHTML='<option value="all">All sampled stores</option>'+nums.map(x=>'<option>'+x+'</option>').join("")}
function update(){const x=rows.find(x=>x.family===sel.value);const sorted=rows.slice().sort((a,b)=>b.RMSLE-a.RMSLE);const position=sorted.findIndex(a=>a.family===x.family)+1;if($("studioRmsle"))$("studioRmsle").textContent=fmt(x.RMSLE,5);if($("studioMae"))$("studioMae").textContent=money(x.MAE);if($("studioN"))$("studioN").textContent=Number(x.n).toLocaleString();if($("studioRank"))$("studioRank").textContent=position+" / 33";let pts=ins.rows.filter(r=>r[2]===x.family);if(store&&store.value!=="all")pts=pts.filter(r=>String(r[1])===store.value);if($("studioSamples"))$("studioSamples").innerHTML=pts.length?pts.map(r=>'<tr><td>'+r[0]+'</td><td class="num">'+r[1]+'</td><td class="num">'+money(r[3])+'</td><td class="num">'+money(r[4])+'</td><td class="num">'+money(r[3]-r[4])+'</td></tr>').join(""):'<tr><td colspan="5">No rows for this store in the stratified preview.</td></tr>';if($("studioSampleCount"))$("studioSampleCount").textContent=pts.length+" preview rows";}sel.addEventListener("change",update);if(store)store.addEventListener("change",update);const exportBtn=$("downloadFamilyCsv");if(exportBtn)exportBtn.addEventListener("click",()=>{const sorted=rows.slice().sort((a,b)=>b.RMSLE-a.RMSLE);const matrix=[["family","holdout_rows","RMSLE","MAE_sales_units","RMSLE_rank"],...sorted.map((r,i)=>[r.family,r.n,r.RMSLE,r.MAE,i+1])];const csv=matrix.map(row=>row.map(v=>"\""+String(v).replace(/"/g,'""')+"\"").join(",")).join("\r\n");const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="family_holdout_error_analysis.csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url)});sel.value="SCHOOL AND OFFICE SUPPLIES";barChart("familyBars",rows,"family","RMSLE",3);update();if($("familyTable"))$("familyTable").innerHTML=rows.map((r,i)=>'<tr><td>'+(i+1)+'</td><td>'+r.family+'</td><td class="num">'+fmt(r.RMSLE,5)+'</td><td class="num">'+money(r.MAE)+'</td><td class="num">'+Number(r.n).toLocaleString()+'</td></tr>').join("")}
function initPredictor(d,ins){
 const fam=$("predFamily"),store=$("predStore"),date=$("predDate"),record=$("predRecord");
 const chartMode=$("predChartMode"),scale=$("predScale"),sort=$("predSort"),svg=$("predViz");
 if(!fam||!store||!date||!record||!svg)return;
 const rows=ins.rows.map((r,idx)=>({date:r[0],store:Number(r[1]),family:r[2],actual:Number(r[3]),pred:Number(r[4]),idx:idx}));
 const families=[...new Set(rows.map(x=>x.family))].sort();
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 if(!families.length)throw new Error("No product-family records were found in the forecast preview.");
 fam.innerHTML=families.map(x=>'<option value="'+esc(x)+'">'+esc(x)+'</option>').join("");
 const signed=x=>(x>0?"+":"")+money(x);
 const scaled=x=>scale.value==="log"?Math.log1p(Math.max(0,x)):x;
 const signedScaled=x=>scale.value==="log"?Math.sign(x)*Math.log1p(Math.abs(x)):x;
 const familyRows=()=>rows.filter(x=>x.family===fam.value);
 const visibleRows=()=>familyRows().filter(x=>store.value==="all"||String(x.store)===store.value);
 function refreshStores(){
  const stores=[...new Set(familyRows().map(x=>x.store))].sort((a,b)=>a-b);
  store.innerHTML='<option value="all">All sampled stores</option>'+stores.map(x=>'<option value="'+x+'">Store '+x+'</option>').join("");
  refreshDates();
 }
 function refreshDates(){
  const dates=[...new Set(visibleRows().map(x=>x.date))].sort();
  date.innerHTML=dates.length?dates.map(x=>'<option value="'+x+'">'+x+'</option>').join(""):'<option value="">No dates available</option>';
  refreshRecords();
 }
 function refreshRecords(){
  const matches=visibleRows().filter(x=>x.date===date.value);
  record.innerHTML=matches.length?matches.map(x=>'<option value="'+x.idx+'">Store '+x.store+' · '+x.date+'</option>').join(""):'<option value="">No records available</option>';
  if(matches.length)record.value=String(matches[0].idx);
  showRecord();
 }
 function showRecord(){
  const x=rows.find(r=>r.idx===Number(record.value)&&r.family===fam.value&&(store.value==="all"||String(r.store)===store.value)&&r.date===date.value);
  if(!x){$("predStatus").textContent="No matching observation";$("predContext").textContent="No sampled record matches these filters.";return;}
  const err=x.actual-x.pred,ae=Math.abs(err),logErr=Math.abs(Math.log1p(x.actual)-Math.log1p(x.pred));
  $("predActual").textContent=money(x.actual);$("predValue").textContent=money(x.pred);
  $("predAbs").textContent=money(ae);$("predLog").textContent=fmt(logErr,4);
  $("predGap").textContent=signed(err);$("predContext").textContent="Store "+x.store+" · "+x.family+" · "+x.date;
  $("predStatus").textContent=err>0?"Underprediction":err<0?"Overprediction":"Exact prediction";
  $("predStatus").className="status "+(err<0?"warn":"");
  $("predInsight").textContent=err>0?"The model predicted below observed sales by "+money(ae)+" units.":err<0?"The model predicted above observed sales by "+money(ae)+" units.":"The prediction matches the observed sales for this row.";
  renderDiagnostics();
 }
 function orderedPoints(){
  const pts=visibleRows().slice(),mode=sort.value;
  if(mode==="absolute")pts.sort((a,b)=>Math.abs(b.actual-b.pred)-Math.abs(a.actual-a.pred));
  else if(mode==="under")pts.sort((a,b)=>(b.actual-b.pred)-(a.actual-a.pred));
  else if(mode==="over")pts.sort((a,b)=>(a.actual-a.pred)-(b.actual-b.pred));
  else pts.sort((a,b)=>a.date.localeCompare(b.date)||a.store-b.store);
  return pts;
 }
 function pointAttrs(x,cls,selected){
  return 'class="forecast-point '+cls+(selected?' selected':'')+'" tabindex="0" role="button" data-point="'+x.idx+'" aria-label="Select store '+x.store+', '+x.date+'"';
 }
 function drawScatter(pts){
  const W=860,H=380,L=76,R=28,T=26,B=62,w=W-L-R,h=H-T-B;
  const max=Math.max(1,...pts.flatMap(x=>[x.actual,x.pred]))*1.12,domain=scaled(max);
  const X=v=>L+(scaled(v)/domain)*w,Y=v=>T+h-(scaled(v)/domain)*h;
  let s='<defs><linearGradient id="plotWash" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#edf4fc"/><stop offset="1" stop-color="#fbf6ef"/></linearGradient></defs><rect x="'+L+'" y="'+T+'" width="'+w+'" height="'+h+'" rx="12" fill="url(#plotWash)"/>';
  for(let i=0;i<=4;i++){
   const raw=max*i/4,px=L+scaled(raw)/domain*w,py=T+h-scaled(raw)/domain*h;
   s+='<line x1="'+px+'" y1="'+T+'" x2="'+px+'" y2="'+(T+h)+'" stroke="#dbe4ee" stroke-dasharray="3 5"/><line x1="'+L+'" y1="'+py+'" x2="'+(L+w)+'" y2="'+py+'" stroke="#dbe4ee" stroke-dasharray="3 5"/>';
   s+='<text x="'+px+'" y="'+(T+h+22)+'" text-anchor="middle" class="axis-label">'+money(raw)+'</text><text x="'+(L-12)+'" y="'+(py+4)+'" text-anchor="end" class="axis-label">'+money(raw)+'</text>';
  }
  s+='<line x1="'+X(0)+'" y1="'+Y(0)+'" x2="'+X(max)+'" y2="'+Y(max)+'" stroke="#d99b5d" stroke-width="2" stroke-dasharray="7 6"/>';
  s+='<text x="'+(L+w/2)+'" y="'+(H-12)+'" text-anchor="middle" class="axis-title">'+(scale.value==="log"?"LOG1P(ACTUAL SALES)":"ACTUAL SALES · UNITS")+'</text><text transform="translate(19 '+(T+h/2)+') rotate(-90)" text-anchor="middle" class="axis-title">'+(scale.value==="log"?"LOG1P(PREDICTED SALES)":"PREDICTED SALES · UNITS")+'</text>';
  pts.forEach(x=>{
   const err=x.actual-x.pred,cls=err>0?"under":err<0?"over":"exact",selected=String(x.idx)===record.value;
   s+='<g '+pointAttrs(x,cls,selected)+'><circle cx="'+X(x.actual)+'" cy="'+Y(x.pred)+'" r="'+(selected?10:7)+'" class="point-halo"/><circle cx="'+X(x.actual)+'" cy="'+Y(x.pred)+'" r="'+(selected?6:4.5)+'" class="point-core"/><title>Store '+x.store+' · '+x.date+' | Actual '+money(x.actual)+' | Predicted '+money(x.pred)+' | Error '+signed(err)+'</title></g>';
  });
  return s;
 }
 function drawErrors(pts){
  const W=860,H=Math.max(310,pts.length*66+88),L=245,R=42,T=28,B=54,w=W-L-R;
  const vals=pts.map(x=>signedScaled(x.actual-x.pred)),max=Math.max(1,...vals.map(Math.abs))*1.18,zero=L+w/2,X=v=>zero+(v/max)*(w/2);
  let s='<rect x="'+L+'" y="'+T+'" width="'+w+'" height="'+(H-T-B)+'" rx="12" fill="#f4f7fa"/>';
  for(let i=-2;i<=2;i++){
   const v=max*i/2,px=X(v);
   s+='<line x1="'+px+'" y1="'+T+'" x2="'+px+'" y2="'+(H-B)+'" stroke="'+(i===0?"#8a9aac":"#dfe6ed")+'" stroke-width="'+(i===0?2:1)+'" stroke-dasharray="'+(i===0?"":"3 5")+'"/><text x="'+px+'" y="'+(H-24)+'" text-anchor="middle" class="axis-label">'+(scale.value==="log"?signed(v):money(v))+'</text>';
  }
  pts.forEach((x,i)=>{
   const e=x.actual-x.pred,v=signedScaled(e),y=T+32+i*66,bx=Math.min(zero,X(v)),bw=Math.max(2,Math.abs(X(v)-zero)),cls=e>0?"under":e<0?"over":"exact",selected=String(x.idx)===record.value;
   s+='<text x="'+(L-14)+'" y="'+(y+5)+'" text-anchor="end" class="row-label">'+x.date+' · Store '+x.store+'</text><g '+pointAttrs(x,cls,selected)+'><rect x="'+bx+'" y="'+(y-13)+'" width="'+bw+'" height="26" rx="5" class="error-bar"/><circle cx="'+X(v)+'" cy="'+y+'" r="5" class="point-core"/><title>Store '+x.store+' · '+x.date+' | Actual − predicted: '+signed(e)+'</title></g>';
  });
  s+='<text x="'+(L+w/2)+'" y="'+(H-5)+'" text-anchor="middle" class="axis-title">'+(scale.value==="log"?"SIGNED LOG1P ERROR":"SIGNED ERROR · SALES UNITS")+'</text>';
  return s;
 }
 function drawCompare(pts){
  const W=860,H=Math.max(310,pts.length*76+92),L=245,R=42,T=28,B=54,w=W-L-R;
  const max=Math.max(1,...pts.flatMap(x=>[x.actual,x.pred]))*1.12,domain=scaled(max),X=v=>L+(scaled(v)/domain)*w;
  let s='<rect x="'+L+'" y="'+T+'" width="'+w+'" height="'+(H-T-B)+'" rx="12" fill="#f4f7fa"/>';
  for(let i=0;i<=4;i++){
   const raw=max*i/4,px=X(raw);
   s+='<line x1="'+px+'" y1="'+T+'" x2="'+px+'" y2="'+(H-B)+'" stroke="#dfe6ed" stroke-dasharray="3 5"/><text x="'+px+'" y="'+(H-24)+'" text-anchor="middle" class="axis-label">'+money(raw)+'</text>';
  }
  pts.forEach((x,i)=>{
   const y=T+30+i*76,selected=String(x.idx)===record.value;
   s+='<text x="'+(L-14)+'" y="'+(y+17)+'" text-anchor="end" class="row-label">'+x.date+' · Store '+x.store+'</text><g '+pointAttrs(x,"",selected)+'><rect x="'+L+'" y="'+(y-9)+'" width="'+Math.max(2,X(x.actual)-L)+'" height="18" rx="4" class="actual-bar"/><rect x="'+L+'" y="'+(y+14)+'" width="'+Math.max(2,X(x.pred)-L)+'" height="18" rx="4" class="pred-bar"/><title>Actual '+money(x.actual)+' · Predicted '+money(x.pred)+' · Store '+x.store+' · '+x.date+'</title></g>';
   s+='<text x="'+Math.min(W-20,X(x.actual)+7)+'" y="'+(y+5)+'" class="bar-value">A</text><text x="'+Math.min(W-20,X(x.pred)+7)+'" y="'+(y+28)+'" class="bar-value">P</text>';
  });
  s+='<text x="'+(L+w/2)+'" y="'+(H-5)+'" text-anchor="middle" class="axis-title">'+(scale.value==="log"?"LOG1P SALES":"SALES · UNITS")+'</text>';
  return s;
 }
 function selectObservation(idx){
  const x=rows.find(r=>r.idx===idx);if(!x)return;
  date.value=x.date;
  const matches=visibleRows().filter(r=>r.date===x.date);
  record.innerHTML=matches.map(r=>'<option value="'+r.idx+'">Store '+r.store+' · '+r.date+'</option>').join("");
  record.value=String(idx);
  showRecord();
 }
 function drawChart(pts){
  if(chartMode.value==="errors"){
   $("predChartTitle").textContent="Signed error by observation";$("predChartEyebrow").textContent="UNDERPREDICTION VS OVERPREDICTION";
   $("predChartLegend").innerHTML='<span><i class="legend-dot under"></i>Underprediction · positive</span><span><i class="legend-dot over"></i>Overprediction · negative</span>';
   svg.setAttribute("viewBox","0 0 860 "+Math.max(310,pts.length*66+88));svg.innerHTML=drawErrors(pts);
  }else if(chartMode.value==="compare"){
   $("predChartTitle").textContent="Actual and predicted sales by observation";$("predChartEyebrow").textContent="PAIRED RECORD COMPARISON";
   $("predChartLegend").innerHTML='<span><i class="legend-dot under"></i>Actual</span><span><i class="legend-dot over"></i>Predicted</span>';
   svg.setAttribute("viewBox","0 0 860 "+Math.max(310,pts.length*76+92));svg.innerHTML=drawCompare(pts);
  }else{
   $("predChartTitle").textContent="Actual vs predicted sales";$("predChartEyebrow").textContent="DISTANCE FROM THE PERFECT-FORECAST LINE";
   $("predChartLegend").innerHTML='<span><i class="legend-dot under"></i>Underprediction</span><span><i class="legend-dot over"></i>Overprediction</span><span><i class="legend-line"></i>Perfect prediction</span>';
   svg.setAttribute("viewBox","0 0 860 380");svg.innerHTML=drawScatter(pts);
  }
  svg.querySelectorAll("[data-point]").forEach(el=>{
   const choose=()=>selectObservation(Number(el.getAttribute("data-point")));
   el.addEventListener("click",choose);
   el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();choose();}});
  });
 }
 function renderDiagnostics(){
  const pts=orderedPoints(),n=pts.length,abs=pts.map(x=>Math.abs(x.actual-x.pred));
  const bias=pts.reduce((a,x)=>a+x.actual-x.pred,0)/(n||1),mae=abs.reduce((a,x)=>a+x,0)/(n||1);
  const rmsle=Math.sqrt(pts.reduce((a,x)=>a+Math.pow(Math.log1p(x.actual)-Math.log1p(x.pred),2),0)/(n||1));
  const under=pts.filter(x=>x.actual>x.pred).length,over=pts.filter(x=>x.actual<x.pred).length;
  $("predSampleN").textContent=n;$("predSampleMae").textContent=n?money(mae):"—";
  $("predSampleBias").textContent=n?signed(bias):"—";$("predSampleRmsle").textContent=n?fmt(rmsle,4):"—";
  $("predTableCount").textContent=n+" preview rows";
  $("predObservationRows").innerHTML=pts.map(x=>{
   const err=x.actual-x.pred;
   return '<tr class="forecast-observation '+(String(x.idx)===record.value?"active":"")+'" tabindex="0" data-row="'+x.idx+'"><td>'+esc(x.date)+'</td><td>'+x.store+'</td><td class="num">'+money(x.actual)+'</td><td class="num">'+money(x.pred)+'</td><td class="num '+(err>0?"positive":err<0?"negative":"")+'">'+signed(err)+'</td><td class="num">'+money(Math.abs(err))+'</td><td><span class="direction-tag '+(err>0?"under":err<0?"over":"exact")+'">'+(err>0?"Under":err<0?"Over":"Exact")+'</span></td></tr>';
  }).join("")||'<tr><td colspan="7">No observations for this selection.</td></tr>';
  $("predObservationRows").querySelectorAll("[data-row]").forEach(el=>{
   const choose=()=>selectObservation(Number(el.getAttribute("data-row")));
   el.addEventListener("click",choose);
   el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();choose();}});
  });
  const worst=pts.slice().sort((a,b)=>Math.abs(b.actual-b.pred)-Math.abs(a.actual-a.pred))[0];
  const insight=worst?"Largest sample miss: Store "+worst.store+" on "+worst.date+", "+money(Math.abs(worst.actual-worst.pred))+" sales units ("+(worst.actual>worst.pred?"underprediction":"overprediction")+").":"No sample rows.";
  $("predChartInsight").textContent=n?n+" preview observation"+(n===1?"":"s")+" · "+under+" underpredicted · "+over+" overpredicted · "+insight+" These are sample-only diagnostics.":"No preview records match the selected filters.";
  drawChart(pts);
 }
 function downloadSample(){
  const header=["date","store_nbr","family","actual_sales","lightgbm_prediction","signed_error_actual_minus_prediction","absolute_error","absolute_log_error"];
  const lines=[header,...orderedPoints().map(x=>[x.date,x.store,x.family,x.actual,x.pred,x.actual-x.pred,Math.abs(x.actual-x.pred),Math.abs(Math.log1p(x.actual)-Math.log1p(x.pred))])];
  const csv=lines.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(",")).join("\r\n");
  const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"})),a=document.createElement("a");
  a.href=url;a.download="forecast_explorer_filtered_sample.csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
 }
 fam.addEventListener("change",refreshStores);store.addEventListener("change",refreshDates);
 date.addEventListener("change",refreshRecords);record.addEventListener("change",showRecord);
 chartMode.addEventListener("change",renderDiagnostics);scale.addEventListener("change",renderDiagnostics);sort.addEventListener("change",renderDiagnostics);
 $("downloadPreviewCsv").addEventListener("click",downloadSample);
 fam.value=families.includes("BEVERAGES")?"BEVERAGES":families[0];
 if(!$("predChartMode").value)$("predChartMode").value="scatter";
 if(!$("predScale").value)$("predScale").value="linear";
 if(!$("predSort").value)$("predSort").value="date";
 refreshStores();
}
function initQna(){const search=$("qnaSearch");if(!search)return;search.addEventListener("input",()=>{const q=search.value.toLowerCase();document.querySelectorAll(".qa").forEach(el=>{el.classList.toggle("hidden",!el.textContent.toLowerCase().includes(q))})})}
(async()=>{header();const page=document.body.dataset.page;try{if(page==="predictor"){const embedded=$("predictorData");if(!embedded)throw new Error("The embedded forecast sample is missing.");const i=JSON.parse(embedded.textContent);if(!Array.isArray(i.rows)||!i.rows.length)throw new Error("The embedded forecast sample contains no records.");initPredictor({},i);return;}const d=await readJSON("results.json");if(page==="home")initOverview(d);if(page==="studio"){const i=await readJSON("prediction_inspector.json");initStudio(d,i)}if(page==="qna")initQna()}catch(e){console.error("Retail Demand Lab initialization:",e);const status=$("predLoadError");if(status)status.textContent="The forecast filters could not be initialized: "+e.message;document.querySelectorAll("[data-error]").forEach(el=>el.textContent="The project data could not be loaded. Please refresh the page.")}})();