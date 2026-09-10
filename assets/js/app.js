document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  const page = document.body.dataset.page;
  if(page === "home") initHome();
  if(page === "browse") initBrowse();
  if(page === "courses") initCourses();
  if(page === "search") initSearch();
  if(page === "question") initQuestion();
  if(page === "viewer") initViewer();
});

function setupMenu(){
  const toggle=document.querySelector(".menu-toggle"), links=document.querySelector(".nav-links");
  if(!toggle || !links) return;
  toggle.addEventListener("click",()=>{const open=links.classList.toggle("open"); toggle.setAttribute("aria-expanded",open)});
}

function questionCard(q, compact=false){
  const c=getCourse(q.course), u=getUniversity(q.university);
  const path=pdfPath(q);
  return `<article class="question-card">
    <div class="pdf-icon">PDF</div><div class="question-info">
      <span class="tag">${c?.code || "PAPER"}</span><h3>${c?.name || q.course}</h3>
      <p>Level ${q.level} · ${q.year} · ${q.semester}</p><strong>${u?.name || q.university}</strong>
    </div>
    <div class="card-actions"><a class="btn btn-secondary btn-small" href="viewer.html?${queryFor(q)}">View PDF</a>${q.available ? `<a class="btn btn-primary btn-small" href="${path}" download>Download</a>` : ""}</div>
  </article>`;
}
function queryFor(q){return new URLSearchParams({level:q.level,course:q.course,year:q.year,semester:q.semester,university:q.university}).toString()}

function initHome(){
  document.getElementById("latestQuestions").innerHTML=questions.filter(q=>q.available).slice(0,4).map(q=>questionCard(q)).join("");
  document.getElementById("homeUniversities").innerHTML=universities.map(u=>{
    const count=questions.filter(q=>q.university===u.id&&q.available).length;
    return `<article class="university-card"><div class="uni-icon">${u.icon}</div><div><h3>${u.name}</h3><p>${count} available paper${count===1?"":"s"}</p></div><a href="search.html?university=${u.id}" class="icon-button">→</a></article>`
  }).join("");
}

function initBrowse(){
  document.getElementById("levels").innerHTML=["100","200","300","400"].map(l=>`<button class="option-card" data-level="${l}"><span>Level</span><strong>${l}</strong><em>Browse papers →</em></button>`).join("");
  document.querySelectorAll("[data-level]").forEach(b=>b.onclick=()=>selectLevel(b.dataset.level));
}
function selectLevel(level){
  const wrap=document.getElementById("browseCourses");
  wrap.innerHTML=courses.filter(c=>c.levels.includes(level)).map(c=>`<article class="course-card"><div class="course-code">${c.code}</div><div><h3>${c.name}</h3><p>${courseCount(c.id)} available past question${courseCount(c.id)===1?"":"s"}</p></div><button class="btn btn-secondary btn-small" data-course="${c.id}">View Questions</button></article>`).join("");
  show("courseStep");
  document.querySelectorAll("[data-course]").forEach(b=>b.onclick=()=>selectCourse(level,b.dataset.course));
  scrollToId("courseStep");
}
function selectCourse(level,course){
  show("yearStep");
  document.getElementById("years").innerHTML=years.map(y=>`<button class="option-card year" data-year="${y}"><strong>${y}</strong><em>Select year →</em></button>`).join("");
  document.querySelectorAll("[data-year]").forEach(b=>b.onclick=()=>selectYear(level,course,b.dataset.year));
  scrollToId("yearStep");
}
function selectYear(level,course,year){
  show("semesterStep");
  document.getElementById("semesters").innerHTML=semesters.map(s=>`<button class="option-card" data-semester="${s}"><strong>${s}</strong><em>Select semester →</em></button>`).join("");
  document.querySelectorAll("[data-semester]").forEach(b=>b.onclick=()=>selectSemester(level,course,year,b.dataset.semester));
  scrollToId("semesterStep");
}
function selectSemester(level,course,year,semester){
  show("universityStep");
  document.getElementById("browseUniversities").innerHTML=universities.map(u=>{
    const count=questions.filter(q=>q.level===level&&q.course===course&&q.year===year&&q.semester===semester&&q.university===u.id&&q.available).length;
    return `<article class="university-card selectable"><div class="uni-icon">${u.icon}</div><div><h3>${u.name}</h3><p>${count} available paper${count===1?"":"s"}</p></div><a class="btn btn-primary btn-small" href="question.html?${queryFor({level,course,year,semester,university:u.id})}">View Questions</a></article>`
  }).join("");
  scrollToId("universityStep");
}
function show(id){document.getElementById(id).classList.remove("hidden")}
function scrollToId(id){setTimeout(()=>document.getElementById(id).scrollIntoView({behavior:"smooth",block:"start"}),80)}

function initCourses(){
  const container=document.getElementById("courseDirectory");
  const cats=[...new Set(courses.map(c=>c.category))];
  container.innerHTML=cats.map(cat=>`<section class="course-category"><div class="section-heading"><div><span class="eyebrow">${cat}</span><h2>${cat}</h2></div></div><div class="cards-grid">${courses.filter(c=>c.category===cat).map(c=>`<article class="course-card directory"><div class="course-code">${c.code}</div><div class="grow"><h3>${c.name}</h3><p>Levels ${c.levels.join(", ")} · ${courseCount(c.id)} past question${courseCount(c.id)===1?"":"s"}</p></div><a class="btn btn-secondary btn-small" href="search.html?course=${c.id}">View Questions</a></article>`).join("")}</div></section>`).join("");
}

function initSearch(){
  const courseFilter=document.getElementById("filterCourse");
  courseFilter.innerHTML+=courses.map(c=>`<option value="${c.id}">${c.name}</option>`).join("");
  const params=new URLSearchParams(location.search);
  if(params.get("q")) document.getElementById("searchInput").value=params.get("q");
  if(params.get("university")) document.getElementById("filterUniversity").value=getUniversity(params.get("university"))?.name || "";
  if(params.get("course")) courseFilter.value=params.get("course");
  renderSearch();
  document.getElementById("searchForm").onsubmit=e=>{e.preventDefault();renderSearch()};
  ["filterLevel","filterCourse","filterYear","filterSemester","filterUniversity"].forEach(id=>document.getElementById(id).onchange=renderSearch);
}
function renderSearch(){
  const text=document.getElementById("searchInput").value.trim().toLowerCase();
  const level=document.getElementById("filterLevel").value, course=document.getElementById("filterCourse").value, year=document.getElementById("filterYear").value, sem=document.getElementById("filterSemester").value, uni=document.getElementById("filterUniversity").value;
  const result=questions.filter(q=>{
    const c=getCourse(q.course), u=getUniversity(q.university);
    const hay=[c?.name,c?.code,q.year,q.level,q.semester,u?.name,q.course].join(" ").toLowerCase();
    return (!text||hay.includes(text))&&(!level||q.level===level)&&(!course||q.course===course)&&(!year||q.year===year)&&(!sem||q.semester===sem)&&(!uni||u?.name===uni);
  });
  document.getElementById("searchResults").innerHTML=result.length?result.map(q=>questionCard(q)).join(""):`<div class="empty-state"><div class="empty-icon">⌕</div><h2>No matching questions</h2><p>Try another course, year, level or university filter.</p><a class="btn btn-primary" href="browse.html">Browse Past Questions</a></div>`;
}

function getQueryQuestion(){
  const p=new URLSearchParams(location.search);
  return {level:p.get("level"),course:p.get("course"),year:p.get("year"),semester:p.get("semester"),university:p.get("university")};
}
function initQuestion(){
  const q=getQueryQuestion(), c=getCourse(q.course), u=getUniversity(q.university);
  const found=questions.find(x=>x.level===q.level&&x.course===q.course&&x.year===q.year&&x.semester===q.semester&&x.university===q.university);
  const el=document.getElementById("questionPage");
  if(!q.course){el.innerHTML=`<div class="empty-state"><h2>Question not specified</h2><a class="btn btn-primary" href="browse.html">Browse Past Questions</a></div>`;return}
  el.innerHTML=`<div class="breadcrumbs">Home → Level ${q.level} → ${c?.name||q.course} → ${q.year} → ${q.semester} → ${u?.name||q.university}</div>
  <div class="question-header"><div><span class="eyebrow">Past Questions</span><h1>${c?.name||q.course} Past Questions — ${u?.name||q.university}</h1><p>Find the examination paper for your selected level, year and semester.</p></div><a href="browse.html" class="btn btn-secondary">← Change selection</a></div>
  <div class="details-grid"><div><span>Level</span><strong>${q.level}</strong></div><div><span>Course</span><strong>${c?.name||q.course}</strong></div><div><span>Academic Year</span><strong>${q.year}</strong></div><div><span>Semester</span><strong>${q.semester}</strong></div><div><span>Mentoring University</span><strong>${u?.name||q.university}</strong></div></div>
  ${found?.available?`<article class="pdf-list-card"><div class="pdf-icon large">PDF</div><div class="grow"><span class="tag">${c?.code||"PAPER"}</span><h2>${c?.name||q.course} — ${q.year}</h2><p>${q.semester} · ${u?.name||q.university}</p></div><div class="card-actions"><a class="btn btn-secondary" href="viewer.html?${queryFor(q)}">View PDF</a><a class="btn btn-primary" href="${pdfPath(q)}" download>Download PDF</a></div></article>`:
  `<div class="empty-state"><div class="empty-icon">📄</div><h2>Past Question Not Available</h2><p>This question has not been added for ${u?.name||q.university} yet.</p><a class="btn btn-primary" href="browse.html">Browse Other Questions</a></div>`}`;
}
function initViewer(){
  const q=getQueryQuestion(), c=getCourse(q.course), u=getUniversity(q.university), path=pdfPath(q);
  document.getElementById("viewerPage").innerHTML=`<div class="breadcrumbs">Home → Level ${q.level} → ${c?.name||q.course} → ${q.year} → ${q.semester} → ${u?.name||q.university}</div>
  <div class="viewer-heading"><div><span class="eyebrow">PDF Viewer</span><h1>${c?.name||q.course} Past Questions</h1><p>${u?.name||q.university}</p></div><div class="card-actions"><a class="btn btn-primary" href="${path}" download>Download PDF</a><a class="btn btn-secondary" href="question.html?${queryFor(q)}">Back to Questions</a></div></div>
  <div class="details-grid viewer-details"><div><span>Level</span><strong>${q.level}</strong></div><div><span>Course/Paper</span><strong>${c?.name||q.course}</strong></div><div><span>Academic Year</span><strong>${q.year}</strong></div><div><span>Semester</span><strong>${q.semester}</strong></div><div><span>University</span><strong>${u?.name||q.university}</strong></div></div>
  <div class="pdf-viewer"><iframe src="${path}" title="PDF viewer"></iframe><div class="viewer-placeholder"><div class="pdf-icon large">PDF</div><h2>PDF Viewer</h2><p>Add the matching PDF file to the <code>questions/</code> folder to display it here.</p><a class="btn btn-primary" href="${path}" target="_blank">Open PDF file</a></div></div>`;
}
