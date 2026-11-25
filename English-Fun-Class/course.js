
(() => {
  const MODULES = [
    {id:'greetings', file:'greetings.html', title:'Greetings & Partings', icon:'👋'},
    {id:'myself', file:'myself.html', title:'My Self', icon:'🙋'},
    {id:'myfamily', file:'myfamily.html', title:'My Family', icon:'👨‍👩‍👧'},
    {id:'mybody', file:'mybody.html', title:'My Body', icon:'🧍'},
    {id:'myhobby', file:'myhobby.html', title:'My Hobby', icon:'⚽'},
    {id:'animals-plants', file:'animals-plants.html', title:'My Animals & Plants', icon:'🐾🌱'}
  ];

  const completedKey = 'englishFunClassCompleted';
  const visitedKey = 'englishFunClassVisited';

  const readList = key => {
    try {
      const data = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(data) ? data : [];
    } catch(e) {
      return [];
    }
  };

  const writeList = (key, list) => {
    localStorage.setItem(key, JSON.stringify([...new Set(list)]));
  };

  const completed = () => readList(completedKey);
  const visited = () => readList(visitedKey);

  const markVisited = id => {
    const list = visited();
    if(!list.includes(id)){
      list.push(id);
      writeList(visitedKey, list);
    }
  };

  const setCompleted = (id, isComplete) => {
    let list = completed();
    if(isComplete && !list.includes(id)) list.push(id);
    if(!isComplete) list = list.filter(x => x !== id);
    writeList(completedKey, list);
  };

  const filename = location.pathname.split('/').pop() || 'index.html';
  const currentIndex = MODULES.findIndex(m => m.file === filename);
  const isHome = currentIndex === -1;

  function renderHomeProgress(){
    const learningPath = document.querySelector('.learning-path');
    if(!learningPath) return;

    const done = completed();
    const wrap = document.createElement('section');
    wrap.className = 'course-progress-wrap';
    wrap.innerHTML = `
      <div class="course-progress-head">
        <strong>Your Learning Journey</strong>
        <span id="homeProgressText">${done.length} of ${MODULES.length} topics completed</span>
      </div>
      <div class="course-track"><div class="course-fill" id="homeProgressFill"></div></div>
      <button class="course-reset" id="resetCourseProgress" type="button">Reset learning progress</button>
    `;
    learningPath.insertAdjacentElement('afterend', wrap);
    document.getElementById('homeProgressFill').style.width = `${done.length / MODULES.length * 100}%`;

    const visitedList = visited();
    document.querySelectorAll('.topic-card').forEach(card => {
      const id = card.dataset.module;
      if(!id) return;

      const badge = document.createElement('span');
      badge.className = 'topic-status';

      if(done.includes(id)){
        badge.textContent = '✓ COMPLETED';
        badge.classList.add('completed');
      }else if(visitedList.includes(id)){
        badge.textContent = 'CONTINUE';
        badge.classList.add('progress');
      }else{
        badge.textContent = 'NEW TOPIC';
      }

      const start = card.querySelector('.start-link');
      if(start) start.insertAdjacentElement('beforebegin', badge);

      card.addEventListener('click', () => markVisited(id));
    });

    document.getElementById('resetCourseProgress')?.addEventListener('click', () => {
      if(confirm('Reset all learning progress?')){
        localStorage.removeItem(completedKey);
        localStorage.removeItem(visitedKey);
        location.reload();
      }
    });
  }

  function renderModuleNavigation(){
    const current = MODULES[currentIndex];
    markVisited(current.id);

    const main = document.querySelector('main');
    if(!main) return;

    const prev = MODULES[currentIndex - 1];
    const next = MODULES[currentIndex + 1];
    const doneNow = completed().includes(current.id);

    const shell = document.createElement('section');
    shell.className = 'course-nav-shell';
    shell.innerHTML = `
      <div class="course-nav-top">
        <div>
          <h3>${current.icon} Topic ${currentIndex + 1} of ${MODULES.length}: ${current.title}</h3>
          <p>Finish the learning activities, then mark this topic complete.</p>
        </div>
        <button id="completeTopicBtn" class="complete-topic-btn ${doneNow ? 'completed' : ''}" type="button">
          ${doneNow ? '✓ Topic Completed' : 'Mark Topic Complete'}
        </button>
      </div>

      <div class="course-topic-track">
        <div class="course-topic-fill" style="width:${(currentIndex + 1) / MODULES.length * 100}%"></div>
      </div>
      <div class="course-mini-label">
        <span>Course position</span>
        <span>${currentIndex + 1}/${MODULES.length}</span>
      </div>

      <nav class="course-nav-links" aria-label="Course navigation">
        <a class="course-nav-link ${prev ? '' : 'disabled'}" href="${prev ? prev.file : '#'}">
          ${prev ? '← ' + prev.title : 'Previous'}
        </a>
        <a class="course-nav-link home" href="../index.html">⌂ Home</a>
        <a class="course-nav-link next ${next ? '' : 'disabled'}" href="${next ? next.file : '#'}">
          ${next ? next.title + ' →' : 'Next'}
        </a>
      </nav>
    `;
    main.insertAdjacentElement('afterend', shell);

    const btn = document.getElementById('completeTopicBtn');
    btn?.addEventListener('click', () => {
      const isCompleted = completed().includes(current.id);
      setCompleted(current.id, !isCompleted);
      const nowCompleted = !isCompleted;
      btn.classList.toggle('completed', nowCompleted);
      btn.textContent = nowCompleted ? '✓ Topic Completed' : 'Mark Topic Complete';
    });
  }

  if(isHome) renderHomeProgress();
  else renderModuleNavigation();
})();
