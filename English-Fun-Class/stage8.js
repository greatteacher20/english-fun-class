
(() => {
  const isModule = location.pathname.includes('/modules/');
  const isHome = !isModule;

  /* ---------------- Homepage teaching-ready block ---------------- */
  if(isHome){
    const topics = document.getElementById('topics');
    if(topics && !document.querySelector('.classroom-ready')){
      const section = document.createElement('section');
      section.className = 'classroom-ready';
      section.innerHTML = `
        <div>
          <span class="ready-badge">✓ CLASSROOM READY</span>
          <h3>Ready for teaching practice</h3>
          <p>
            Use one topic at a time. Start with the learning goal, model the language,
            involve students in listening and speaking, continue with a game or pair activity,
            then finish with a quick check and reflection.
          </p>
        </div>
        <div class="demo-box">
          <strong>Recommended demo: My Body</strong>
          <p>Strong for TPR, Classroom English, student movement, game-based learning, quick assessment, and reflection.</p>
          <a class="demo-launch" href="modules/mybody.html">Open My Body →</a>
        </div>
      `;
      topics.insertAdjacentElement('beforebegin', section);
    }
  }

  if(!isModule) return;

  const stepBtns = [...document.querySelectorAll('.step-btn')];
  if(!stepBtns.length) return;

  let timerSeconds = 15 * 60;
  let timerHandle = null;

  const formatTime = sec => {
    const m = Math.floor(sec / 60).toString().padStart(2,'0');
    const s = (sec % 60).toString().padStart(2,'0');
    return `${m}:${s}`;
  };

  const currentActivity = () => {
    const idx = stepBtns.findIndex(btn => btn.classList.contains('active'));
    return idx < 0 ? 0 : idx;
  };

  const activityName = idx => stepBtns[idx]?.textContent?.replace(/^\d+\.\s*/, '') || 'Learn';

  const toolsBtn = document.createElement('button');
  toolsBtn.className = 'class-tools-btn';
  toolsBtn.type = 'button';
  toolsBtn.textContent = '⏱ Teaching Tools';
  document.body.appendChild(toolsBtn);

  const modal = document.createElement('section');
  modal.className = 'class-tools-modal';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="class-tools-card">
      <button class="class-tools-close" type="button">×</button>
      <h3>Teaching Practice Tools</h3>
      <p>Use these tools while preparing or demonstrating the lesson.</p>

      <div class="teacher-tools-grid">
        <div class="tool-panel">
          <h4>15-Minute Teaching Timer</h4>
          <div class="lesson-timer" id="stage8Timer">15:00</div>
          <div class="timer-actions">
            <button id="stage8StartTimer" type="button">Start / Pause</button>
            <button id="stage8ResetTimer" class="timer-reset" type="button">Reset</button>
          </div>

          <div class="activity-strip">
            <small>Current activity</small>
            <strong id="stage8CurrentActivity">Learn</strong>
            <div class="activity-actions">
              <button id="stage8PrevActivity" class="activity-control" type="button">← Previous</button>
              <button id="stage8NextActivity" class="activity-control next" type="button">Next →</button>
            </div>
          </div>
          <div class="shortcut-note">
            Keyboard shortcut during teaching: <strong>←</strong> previous activity,
            <strong>→</strong> next activity.
          </div>
        </div>

        <div class="tool-panel">
          <h4>Suggested 15-Minute Demo Flow</h4>
          <ol class="demo-flow">
            <li><strong>0–2 min:</strong> Hook and learning goals.</li>
            <li><strong>2–5 min:</strong> Learn vocabulary and model pronunciation.</li>
            <li><strong>5–8 min:</strong> Listen and respond.</li>
            <li><strong>8–11 min:</strong> Speak, pair work, or game.</li>
            <li><strong>11–14 min:</strong> Quick formative check.</li>
            <li><strong>14–15 min:</strong> Reflection and positive closing.</li>
          </ol>
          <div class="shortcut-note">
            Keep the website as a learning trigger. Ask students to speak, move, point,
            answer, or work with a partner instead of only watching the screen.
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const timerEl = modal.querySelector('#stage8Timer');
  const currentEl = modal.querySelector('#stage8CurrentActivity');

  const updateTimer = () => {
    timerEl.textContent = formatTime(timerSeconds);
    if(timerSeconds <= 60){
      timerEl.style.color = '#b33b32';
    }else{
      timerEl.style.color = '#143d73';
    }
  };

  const updateActivityLabel = () => {
    currentEl.textContent = activityName(currentActivity());
  };

  const goActivity = direction => {
    let idx = currentActivity() + direction;
    idx = Math.max(0, Math.min(stepBtns.length - 1, idx));
    stepBtns[idx].click();
    updateActivityLabel();
  };

  toolsBtn.addEventListener('click', () => {
    modal.hidden = false;
    updateActivityLabel();
  });

  modal.querySelector('.class-tools-close').addEventListener('click', () => {
    modal.hidden = true;
  });

  modal.addEventListener('click', e => {
    if(e.target === modal) modal.hidden = true;
  });

  modal.querySelector('#stage8StartTimer').addEventListener('click', () => {
    if(timerHandle){
      clearInterval(timerHandle);
      timerHandle = null;
      return;
    }
    timerHandle = setInterval(() => {
      if(timerSeconds <= 0){
        clearInterval(timerHandle);
        timerHandle = null;
        timerSeconds = 0;
        updateTimer();
        return;
      }
      timerSeconds--;
      updateTimer();
    }, 1000);
  });

  modal.querySelector('#stage8ResetTimer').addEventListener('click', () => {
    if(timerHandle){
      clearInterval(timerHandle);
      timerHandle = null;
    }
    timerSeconds = 15 * 60;
    updateTimer();
  });

  modal.querySelector('#stage8PrevActivity').addEventListener('click', () => goActivity(-1));
  modal.querySelector('#stage8NextActivity').addEventListener('click', () => goActivity(1));

  stepBtns.forEach(btn => btn.addEventListener('click', updateActivityLabel));

  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    if(tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if(!modal.hidden && e.key === 'Escape'){
      modal.hidden = true;
      return;
    }
    if(e.key === 'ArrowRight'){
      goActivity(1);
    }else if(e.key === 'ArrowLeft'){
      goActivity(-1);
    }
  });

  updateTimer();
  updateActivityLabel();
})();
