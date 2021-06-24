const popup = (() => {
    const $memoPopup = document.querySelector('.memo-popup');
    const $descriptionPopup = document.querySelector('.description-popup');
    const $overlay = document.querySelector('.overlay');
  
    return {
      open() {
        $memoPopup.classList.remove('deactive');
        $memoPopup.classList.add('active');
        $memoPopup.style.display = 'block';
        $overlay.style.display = 'block';
      },
      close() {
        $memoPopup.classList.add('deactive');
        $memoPopup.classList.remove('active');
        setTimeout(() => {
          $memoPopup.style.display = 'none';
          $overlay.style.display = 'none';
        }, 1000);
      },
      openDescriptionModal() {
        $descriptionPopup.classList.remove('deactive');
        $descriptionPopup.classList.add('active');
        $descriptionPopup.style.display = 'block';
        $overlay.style.display = 'block';
      },
      closeDescriptionModal() {
        $descriptionPopup.classList.add('deactive');
        $descriptionPopup.classList.remove('active');
        setTimeout(() => {
          $descriptionPopup.style.display = 'none';
          $overlay.style.display = 'none';
        }, 1000);
      }
    };
  })();
  
  const $overlay = document.querySelector('.overlay');
  
  $overlay.addEventListener('click', popup.closeDescriptionModal);
  $overlay.addEventListener('click', popup.close);
  
  document.querySelector('.btn.close').onclick = popup.close;
  
  document.querySelector('.description-egg-btn').onclick =
    popup.openDescriptionModal;
  document.querySelector('.btn.memo-toggle-popup').onclick = popup.open;
  
  const descriptions = (() => {
    const $descriptionContents = document.querySelector('.description-contents');
    const $descriptionModal = document.querySelector('.description-modal');
  
    let nations = [];
  
    const render = ({ capital, population, currency, gdp, egg }) => {
      $descriptionContents.innerHTML = `<tr>
        <th>수도</th>
        <td>${capital}</td>
      </tr>
      <tr>
        <th>인구</th>
        <td>${(+population).toLocaleString('ko-KR')} 명</td>
      </tr>
      <tr>
        <th>통화</th>
        <td>${currency}</td>
      </tr>
      <tr>
        <th>GDP</th>
        <td>${gdp}</td>
      </tr>`;
  
      $descriptionModal.innerHTML = `<p>알고 계셨나요?</p><p>${egg}</p>`;
    };
  
    // 받아온 데이터를 나라 정보에 입력한다. 설명은 고정적으로 보여줄 내용이기 때문에 render 해 줄 필요가 없다.
    const setNations = _nations => {
      nations = _nations;
    };
  
    const fetchNations = () => {
      setNations([
        {
          id: 2,
          code: 'KR',
          nation: 'Korea',
          capital: 'Seoul',
          population: '51710000',
          currency: 'Won',
          gdp: '1.647 조',
          egg: '한국에서는 절대로 빨간색으로 이름을 써서는 안 됩니다. 수양 대군이 반정을 일으킬 때 궁중 행사의 방명록에 반대파의 이름을 빨간색으로 적었는데 이때 이름이 적힌 조정 관료들은 모두 숙청되었다고 합니다. 이 때문에 빨간색으로 이름을 적으면 죽는다는 설이 나왔다고 하네요.'
        },
        {
          id: 1,
          code: 'US',
          nation: 'U.S.A',
          capital: `Georgia`,
          population: '328200000',
          currency: 'Dollar',
          gdp: '21.43 조',
          egg: '헷갈리셨을 수도 있지만, 사실 미국의 수도는 조지아 입니다... 조지아의 대표적인 위인으로는 한국인 출신 윤동건씨가 있다고 하네요.'
        },
        {
          id: 0,
          code: 'JP',
          nation: 'Japan',
          capital: 'Tokyo',
          population: '126300000',
          currency: 'Yen',
          gdp: '5.082 조',
          egg: `세계에서 가장 오래된 기업은 일본의 "곤고구미" 입니다. 무려 578 년에 백제의 유명한 건축 장인들과 함께 설립되었다고 하네요.`
        }
      ]);
    };
  
    window.addEventListener('DOMContentLoaded', fetchNations);
  
    return {
      getDescription(code) {
        render(nations.filter(nation => nation.code === code)[0]);
      }
    };
  })();
  
  descriptions.getDescription('KR');
  
  // document.querySelector('.description-egg-btn').onclick = () => {
  //   descriptions.getDescription('KR');
  //   popup.openDescriptionModal();
  // };
  
  // Todos
  const todos = (() => {
    const $todos = document.querySelector('.todos');
    const $inputTodo = document.querySelector('.input-todo');
  
    let todos = [];
  
    const render = () => {
      $todos.innerHTML = todos.reduce((html, { id, content, completed }) => {
        html += `
          <li id="${id}" class="todo-item">
            <input id="ck-${id}" class="checkbox" type="checkbox" ${
          completed ? 'checked' : ''
        }>
            <label for="ck-${id}">${content}</label>
            <i class="remove-todo far fa-times-circle"></i>
          </li>`;
        return html;
      }, '');
    };
  
    const setTodos = _todos => {
      todos = _todos;
  
      if (todos.length < 5) {
        $inputTodo.disabled = false;
        $inputTodo.placeholder = '';
      } else {
        $inputTodo.disabled = true;
        $inputTodo.placeholder = '아직은 5개까지만 등록할 수 있어요!';
      }
  
      render();
    };
  
    const generateNextId = () => Math.max(...todos.map(todo => todo.id), 0) + 1;
  
    const fetchTodos = () => {
      setTodos(
        [
          { id: 1, content: '동건이네 집 벨튀하기', completed: false },
          { id: 2, content: '동건이네 집에 총기 난사하기', completed: true },
          { id: 3, content: '동건이 피살시키기', completed: false }
        ].sort((todo1, todo2) => todo2.id - todo1.id)
      );
    };
  
    window.addEventListener('DOMContentLoaded', fetchTodos);
  
    return {
      addTodo(content) {
        setTodos([{ id: generateNextId(), content, completed: false }, ...todos]);
      },
      toggleTodo(id) {
        setTodos(
          todos.map(todo =>
            todo.id === +id ? { ...todo, completed: !todo.completed } : todo
          )
        );
      },
      removeTodo(id) {
        setTodos(todos.filter(todo => todo.id !== +id));
      }
    };
  })();
  
  const $inputTodo = document.querySelector('.input-todo');
  const $todos = document.querySelector('.todos');
  const $form = document.querySelector('.memo-form');
  
  $form.onsubmit = e => {
    e.preventDefault();
    const content = $inputTodo.value.trim();
    if (!content) return;
  
    todos.addTodo(content);
    $inputTodo.value = '';
  };
  
  $todos.onchange = e => {
    todos.toggleTodo(e.target.parentNode.id);
  };
  
  $todos.onclick = e => {
    if (!e.target.matches('.todos > li > .remove-todo')) return;
    todos.removeTodo(e.target.parentNode.id);
  };
  
  // // overlay galaxy
  // const canvas = document.getElementById('canvas');
  // const ctx = canvas.getContext('2d');
  // const w = (canvas.width = window.innerWidth);
  // const h = (canvas.height = window.innerHeight);
  // const hue = 217;
  // const stars = [];
  // let count = 0;
  // const maxStars = 1400;
  
  // // Thanks @jackrugile for the performance tip! https://codepen.io/jackrugile/pen/BjBGoM
  // // Cache gradient
  // const canvas2 = document.createElement('canvas');
  // const ctx2 = canvas2.getContext('2d');
  // canvas2.width = 100;
  // canvas2.height = 100;
  // const half = canvas2.width / 2;
  // const gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
  // gradient2.addColorStop(0.025, '#fff');
  // gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
  // gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
  // gradient2.addColorStop(1, 'transparent');
  
  // ctx2.fillStyle = gradient2;
  // ctx2.beginPath();
  // ctx2.arc(half, half, half, 0, Math.PI * 2);
  // ctx2.fill();
  
  // // End cache
  
  // function random(min, max) {
  //   if (arguments.length < 2) {
  //     max = min;
  //     min = 0;
  //   }
  
  //   if (min > max) {
  //     const hold = max;
  //     max = min;
  //     min = hold;
  //   }
  
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // }
  
  // function maxOrbit(x, y) {
  //   const max = Math.max(x, y);
  //   const diameter = Math.round(Math.sqrt(max * max + max * max));
  //   return diameter / 2;
  // }
  
  // const Star = function () {
  //   this.orbitRadius = random(maxOrbit(w, h));
  //   this.radius = random(60, this.orbitRadius) / 12;
  //   this.orbitX = w / 2;
  //   this.orbitY = h / 2;
  //   this.timePassed = random(0, maxStars);
  //   this.speed = random(this.orbitRadius) / 50000;
  //   this.alpha = random(2, 10) / 10;
  
  //   count++;
  //   stars[count] = this;
  // };
  
  // Star.prototype.draw = function () {
  //   const x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX;
  //   const y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY;
  //   const twinkle = random(10);
  
  //   if (twinkle === 1 && this.alpha > 0) {
  //     this.alpha -= 0.05;
  //   } else if (twinkle === 2 && this.alpha < 1) {
  //     this.alpha += 0.05;
  //   }
  
  //   ctx.globalAlpha = this.alpha;
  //   ctx.drawImage(
  //     canvas2,
  //     x - this.radius / 2,
  //     y - this.radius / 2,
  //     this.radius,
  //     this.radius
  //   );
  //   this.timePassed += this.speed;
  // };
  
  // for (let i = 0; i < maxStars; i++) {
  //   new Star();
  // }
  
  // function animation() {
  //   ctx.globalCompositeOperation = 'source-over';
  //   ctx.globalAlpha = 0.8;
  //   ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 1)';
  //   ctx.fillRect(0, 0, w, h);
  
  //   ctx.globalCompositeOperation = 'lighter';
  //   for (let i = 1, l = stars.length; i < l; i++) {
  //     stars[i].draw();
  //   }
  
  //   window.requestAnimationFrame(animation);
  // }
  
  // animation();