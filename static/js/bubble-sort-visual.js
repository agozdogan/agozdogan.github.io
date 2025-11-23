/* Bubble Sort Visualization
   Basit bir adım-listesi (compare/swap/done) üreterek DOM üzerinde oynatma yapar.
*/
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const container = document.getElementById('bubble-visual');
    const startBtn = document.getElementById('bs-start');
    const shuffleBtn = document.getElementById('bs-shuffle');
    const speedRange = document.getElementById('bs-speed');
    let arr = generateArray(12);
    let timers = [];

    function generateArray(n){
      return Array.from({length:n}, ()=>Math.floor(Math.random()*90)+10);
    }

    function renderArray(a){
      container.innerHTML = '';
      a.forEach((v,i)=>{
        const bar = document.createElement('div');
        bar.className = 'bs-bar';
        bar.style.height = v + '%';
        bar.setAttribute('data-i', i);
        container.appendChild(bar);
      });
    }

    function collectSteps(a){
      const A = a.slice();
      const steps = [];
      const n = A.length;
      for(let i=0;i<n-1;i++){
        for(let j=0;j<n-1-i;j++){
          steps.push({type:'compare', i:j, j:j+1});
          if(A[j] > A[j+1]){
            steps.push({type:'swap', i:j, j:j+1});
            const tmp = A[j]; A[j] = A[j+1]; A[j+1] = tmp;
          }
        }
        steps.push({type:'doneAt', index: n-1-i});
      }
      steps.push({type:'doneAll'});
      return steps;
    }

    function getBars(){ return Array.from(container.children); }

    function clearTimers(){ timers.forEach(id=>clearTimeout(id)); timers = []; }

    function playSteps(steps){
      clearTimers();
      const speed = Number(speedRange.value);
      let t = 0;
      steps.forEach(s=>{
        t += speed;
        if(s.type === 'compare'){
          timers.push(setTimeout(()=>{
            const b = getBars();
            b[s.i] && b[s.i].classList.add('bs-compare');
            b[s.j] && b[s.j].classList.add('bs-compare');
          }, t));
          timers.push(setTimeout(()=>{
            const b = getBars();
            b[s.i] && b[s.i].classList.remove('bs-compare');
            b[s.j] && b[s.j].classList.remove('bs-compare');
          }, t + Math.floor(speed*0.6)));
        } else if(s.type === 'swap'){
          timers.push(setTimeout(()=>{
            const b = getBars();
            if(!b[s.i] || !b[s.j]) return;
            const hi = b[s.i].style.height;
            b[s.i].style.height = b[s.j].style.height;
            b[s.j].style.height = hi;
            b[s.i].classList.add('bs-swap');
            b[s.j].classList.add('bs-swap');
          }, t));
          timers.push(setTimeout(()=>{
            const b = getBars();
            b[s.i] && b[s.i].classList.remove('bs-swap');
            b[s.j] && b[s.j].classList.remove('bs-swap');
          }, t + Math.floor(speed*0.6)));
        } else if(s.type === 'doneAt'){
          timers.push(setTimeout(()=>{
            const b = getBars();
            b[s.index] && b[s.index].classList.add('bs-done');
          }, t));
        }
      });
      // re-enable buttons after animation
      timers.push(setTimeout(()=>{
        startBtn.disabled = false;
        shuffleBtn.disabled = false;
      }, t + speed));
    }

    startBtn.addEventListener('click', function(){
      if(startBtn.disabled) return;
      startBtn.disabled = true; shuffleBtn.disabled = true;
      const steps = collectSteps(arr);
      playSteps(steps);
    });

    shuffleBtn.addEventListener('click', function(){
      if(startBtn.disabled) return; // don't allow shuffle while running
      arr = generateArray(12);
      renderArray(arr);
    });

    // initial render
    renderArray(arr);
  });
})();
