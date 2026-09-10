// CollegePast content/data. Replace university names here when the official names are ready.
const universities = [
  {id:"university-1", name:"University 1", icon:"🏛️"},
  {id:"university-2", name:"University 2", icon:"🎓"},
  {id:"university-3", name:"University 3", icon:"🏫"},
  {id:"university-4", name:"University 4", icon:"📘"},
  {id:"university-5", name:"University 5", icon:"🎓"},
  {id:"university-6", name:"University 6", icon:"🏛️"}
];

const courses = [
  {id:"foundations-of-education", name:"Foundations of Education", code:"FOE", category:"Education Studies", levels:["100","200","300","400"]},
  {id:"educational-psychology", name:"Educational Psychology", code:"EPS", category:"Education Studies", levels:["100","200","300"]},
  {id:"sociology-of-education", name:"Sociology of Education", code:"SOE", category:"Education Studies", levels:["100","200","300"]},
  {id:"curriculum-studies", name:"Curriculum Studies", code:"CUR", category:"Curriculum Studies", levels:["200","300","400"]},
  {id:"assessment", name:"Assessment", code:"ASS", category:"Curriculum Studies", levels:["200","300","400"]},
  {id:"teaching-methods", name:"Teaching Methods", code:"TME", category:"Curriculum Studies", levels:["200","300","400"]},
  {id:"english", name:"English", code:"ENG", category:"General/Core Courses", levels:["100","200","300","400"]},
  {id:"mathematics", name:"Mathematics", code:"MATH", category:"General/Core Courses", levels:["100","200","300","400"]},
  {id:"ict", name:"ICT", code:"ICT", category:"General/Core Courses", levels:["100","200","300","400"]},
  {id:"science", name:"Science", code:"SCI", category:"General/Core Courses", levels:["100","200","300","400"]},
  {id:"social-studies", name:"Social Studies", code:"SST", category:"General/Core Courses", levels:["100","200","300","400"]},
  {id:"computing", name:"Computing", code:"CMP", category:"Specialization Courses", levels:["200","300","400"]}
];

const years = ["2025/2026","2024/2025","2023/2024","2022/2023"];
const semesters = ["First Semester","Second Semester"];

// Add/remove entries here as PDF files are added to /questions/.
const questions = [
  {level:"200", course:"ict", year:"2025/2026", semester:"First Semester", university:"university-1", available:true},
  {level:"200", course:"ict", year:"2025/2026", semester:"First Semester", university:"university-2", available:true},
  {level:"200", course:"ict", year:"2025/2026", semester:"First Semester", university:"university-3", available:false},
  {level:"200", course:"ict", year:"2025/2026", semester:"First Semester", university:"university-4", available:true},
  {level:"100", course:"mathematics", year:"2025/2026", semester:"Second Semester", university:"university-1", available:true},
  {level:"300", course:"educational-psychology", year:"2024/2025", semester:"First Semester", university:"university-2", available:true},
  {level:"200", course:"curriculum-studies", year:"2024/2025", semester:"Second Semester", university:"university-5", available:true},
  {level:"400", course:"computing", year:"2023/2024", semester:"First Semester", university:"university-6", available:true}
];

function slugYear(year){ return year.replace("/", "-"); }
function pdfPath(q){
  return `questions/level-${q.level}/${q.course}/${slugYear(q.year)}/${q.semester.toLowerCase().replaceAll(" ","-")}/${q.university}.pdf`;
}
function getCourse(id){ return courses.find(c=>c.id===id); }
function getUniversity(id){ return universities.find(u=>u.id===id); }
function courseCount(id){ return questions.filter(q=>q.course===id && q.available).length; }
