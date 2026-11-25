const presentBtn=document.getElementById("presentBtn");
const teacherInfoBtn=document.getElementById("teacherInfoBtn");
const teacherPanel=document.getElementById("teacherPanel");
const closeTeacherInfo=document.getElementById("closeTeacherInfo");

presentBtn.addEventListener("click",async()=>{
  document.body.classList.toggle("presentation");
  if(document.body.classList.contains("presentation")){
    presentBtn.textContent="Exit Present Mode";
    try{await document.documentElement.requestFullscreen?.();}catch(e){}
  }else{
    presentBtn.textContent="Present Mode";
    if(document.fullscreenElement){await document.exitFullscreen?.();}
  }
});
teacherInfoBtn.addEventListener("click",()=>teacherPanel.hidden=false);
closeTeacherInfo.addEventListener("click",()=>teacherPanel.hidden=true);
teacherPanel.addEventListener("click",e=>{if(e.target===teacherPanel)teacherPanel.hidden=true});
document.addEventListener("fullscreenchange",()=>{
  if(!document.fullscreenElement&&document.body.classList.contains("presentation")){
    document.body.classList.remove("presentation");
    presentBtn.textContent="Present Mode";
  }
});