// constant
const serviceCountry = ['KR', 'JP', 'US'];
const countryName = { KR: 'KOREA', JP: 'JAPAN', US: 'U.S.A' };

// WHITEOUT
const showAndHideWhiteout = (() => {
  const $whiteout = document.querySelector('.whiteout');

  return () => {
    $whiteout.style.display =
      $whiteout.style.display === 'block' ? 'none' : 'block';
  };
})();

// LOGIN PAGE
(() => {
  const $userId = document.getElementById('userId');
  const $userPassword = document.getElementById('userPW');
  const $userIdError = document.getElementById('userIdError');
  const $userPasswordError = document.getElementById('userPasswordError');
  const $invalidError = document.getElementById('invalidError');
  const $allErrors = document.querySelectorAll('.error-message');
  const userStorage = window.localStorage;

  showAndHideWhiteout();

  document.querySelector('.login-form').onsubmit = e => {
    e.preventDefault();
    $allErrors.forEach(err => {
      err.style.opacity = 0;
    });

    $userIdError.style.opacity = $userId.value ? '0' : '1';
    $userPasswordError.style.opacity = $userPassword.value ? '0' : '1';
    if (!$userId.value || !$userPassword.value) return;

    const userPW = userStorage.getItem($userId.value);
    if (userPW !== $userPassword.value) {
      $invalidError.style.opacity = 1;
      return;
    }

    document.querySelector('.login-wrapper').style.display = 'none';
    showAndHideWhiteout();
  };
})();

// DROPDOWN MENU
const dropdownMenu = (() => {
  const $customSelectWrapper = document.querySelector('.custom-select-wrapper');
  const $customSelect = document.querySelector('.custom-select');
  const $customOptions = document.querySelector('.custom-options');
  const $customSpan = document.querySelector('.custom-select-trigger > span');

  const toggleCustomOptions = $target => {
    [...$customOptions.children].forEach(option => {
      option.classList.toggle('selected', $target === option);
    });
    $customSpan.textContent = $target.textContent;
  };

  const toggleCustomSelect = () => {
    $customSelect.classList.toggle('open');
  };

  $customSelect.onclick = toggleCustomSelect;
  $customSelect.onkeyup = e => {
    if (e.key === 'Enter') toggleCustomSelect();
  };

  $customOptions.onclick = e => {
    if (
      !e.target.matches('.custom-option') &&
      e.target.classList.contains('selected')
    )
      return;

    toggleCustomOptions(e.target);
  };

  $customOptions.onkeyup = e => {
    if (e.key === 'Enter') toggleCustomOptions(e.target);
  };

  return {
    showDropDownMenu() {
      $customSelectWrapper.style.opacity = 1;
      $customSelectWrapper.disabled = false;
    },
    hideDropDownMenu() {
      $customSelectWrapper.style.opacity = 0;
      $customSelectWrapper.disabled = true;
    }
  };
})();

// CLOCK
const worldClock = (() => {
  const HOUR_TO_MIN = 60;
  const MIN_TO_MILISEC = 60000;

  const $clockWrapper = document.querySelector('.clock-wrapper');
  const $worldClock = document.querySelector('.world-clock');
  const timeZone = {
    KR: 9,
    US: -4,
    JP: 9,
    CA: -4,
    CH: 8
  };

  let setIntervalId = -1;

  const formatTime = (() => {
    const format = time => (time < 10 ? '0' + time : time);
    return (h, m, s) => `${format(h)}:${format(m)}:${format(s)}`;
  })();

  return {
    showWorldClock(countryCode) {
      setIntervalId = setInterval(() => {
        const date = new Date();
        const utcTime =
          date.getTime() + date.getTimezoneOffset() * MIN_TO_MILISEC;
        const currTime = new Date(
          utcTime + timeZone[countryCode] * HOUR_TO_MIN * MIN_TO_MILISEC
        );

        const hour = currTime.getHours();
        const minute = currTime.getMinutes();
        const second = currTime.getSeconds();

        $worldClock.textContent = formatTime(hour, minute, second);
      }, 1000);

      $clockWrapper.style.opacity = 1;
    },
    hideWorldClock() {
      clearInterval(setIntervalId);
      $clockWrapper.style.opacity = 0;
      $worldClock.textContent = '';
    }
  };
})();

// DESCRIPTION
const description = (() => {
  const $descriptionBox = document.querySelector('.description-box');
  const $descriptionContents = document.querySelector('.description-contents');
  const $descriptionModalBox = document.querySelector('.description-modal-box');
  const $descriptionModal = document.querySelector('.description-modal');
  const $descriptionEggBtn = document.querySelector('.description-egg-btn');
  const $descriptionModalExitBtn = document.querySelector(
    '.description-modal-exit-btn'
  );

  let countriesInfo = {};

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

  const setCountriesInfo = _countriesInfo => {
    countriesInfo = _countriesInfo.reduce((obj, countryInfo) => {
      obj[countryInfo.code] = countryInfo;
      return obj;
    }, {});
  };

  const toggleDescriptionModalActive = $target => {
    $descriptionModalBox.classList.toggle(
      'active-modal',
      $target === $descriptionEggBtn
    );
    $descriptionModalBox.classList.toggle(
      'deactive-modal',
      $target !== $descriptionEggBtn
    );

    if ($target === $descriptionEggBtn) {
      $descriptionModalBox.style.display = 'block';
      showAndHideWhiteout();
      return;
    }

    setTimeout(() => {
      $descriptionModalBox.style.display = 'none';
      showAndHideWhiteout();
    }, 1000);
  };

  $descriptionEggBtn.onclick = e => {
    toggleDescriptionModalActive(e.target);
    window.onclick = e => {
      if (!e.target.matches('.whiteout')) return;
      toggleDescriptionModalActive(e.target);
      window.onclick = null;
    };
  };

  $descriptionModalExitBtn.onclick = e => {
    toggleDescriptionModalActive(e.target);
    window.onclick = null;
  };

  setCountriesInfo([
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

  return {
    setCountryInfo(countryCode) {
      render(countriesInfo[countryCode]);
    },
    show() {
      $descriptionBox.style.display = 'flex';
    },
    hide() {
      $descriptionBox.style.display = 'none';
    }
  };
})();

// MEMO
const memo = (() => {
  const $memoWrapper = document.querySelector('.memo-wrapper');
  const $memoModal = document.querySelector('.memo-modal');
  const $memoBtn = document.querySelector('.memo-btn');
  const $memoModalCloseBtn = document.querySelector('.memo-modal-close-btn');
  const $memoList = document.querySelector('.memo-list');
  const $memoModalForm = document.querySelector('.memo-modal-form');
  const $memoInput = document.querySelector('.memo-input');

  let memos = [];
  let currentCountryCode = '';

  const generateNextId = () => Math.max(...memos.map(memo => memo.id), 0) + 1;

  const render = () => {
    const currentCodeMemos = [...memos].filter(
      memo => memo.code === currentCountryCode
    );
    $memoInput.disabled = currentCodeMemos.length >= 5;
    $memoInput.placeholder = $memoInput.disabled
      ? '아직은 5개까지만 등록할 수 있어요!'
      : '';

    $memoList.innerHTML = currentCodeMemos.reduce((html, { id, content }) => {
      // eslint-disable-next-line no-param-reassign
      html += `
          <li class="memo-item" id="${id}">
            <span>${content}</span>
            <i class="remove-memo far fa-times-circle"></i>
          </li>
        `;

      return html;
    }, '');
  };

  const setMemos = _memos => {
    memos = _memos;
    render();
  };

  const addMemo = content => {
    setMemos([
      { id: generateNextId(), content, code: currentCountryCode },
      ...memos
    ]);
  };

  const removeMemo = id => {
    setMemos(memos.filter(memo => memo.id !== +id));
  };

  const toggleMemoModalAcitve = $target => {
    $memoModal.classList.toggle('active-modal', $target === $memoBtn);
    $memoModal.classList.toggle('deactive-modal', $target !== $memoBtn);

    if ($target === $memoBtn) {
      $memoModal.style.display = 'block';
      showAndHideWhiteout();
      return;
    }

    setTimeout(() => {
      $memoModal.style.display = 'none';
      showAndHideWhiteout();
    }, 1000);
  };

  // event handlers
  $memoBtn.onclick = e => {
    toggleMemoModalAcitve(e.target);
    window.onclick = e => {
      if (!e.target.matches('.whiteout')) return;
      toggleMemoModalAcitve(e.target);
      window.onclick = null;
    };
  };

  $memoModalCloseBtn.onclick = e => {
    toggleMemoModalAcitve(e.target);
    window.onclick = null;
  };

  $memoModalForm.onsubmit = e => {
    e.preventDefault();

    const content = $memoInput.value.trim();
    if (!content) return;

    addMemo(content);
    $memoInput.value = '';
  };

  $memoList.onclick = e => {
    if (!e.target.matches('.remove-memo')) return;

    removeMemo(e.target.parentNode.id);
  };

  // flow
  (() => {
    memos = [
      {
        id: 1,
        content: '동건이네 집 벨튀하기',
        code: 'KR'
      },
      {
        id: 2,
        content: '동건이네 집에 총기 난사하기',
        code: 'US'
      },
      { id: 3, content: '동건이 피살시키기', code: 'JP', completed: false }
    ].sort((todo1, todo2) => todo2.id - todo1.id);
  })();

  return {
    setCurrentCountryCode(countryCode) {
      currentCountryCode = countryCode;
      render();
    },
    showMemoWrapper() {
      $memoWrapper.style.display = 'block';
    },
    hideMemoWrapper() {
      $memoWrapper.style.display = 'none';
    }
  };
})();

// MAIN PAGE
document.querySelector('.map-obj').onload = () => {
  const mapObj = document.querySelector('.map-obj');
  const positionX = mapObj.offsetLeft;
  const positionY = mapObj.offsetTop;

  const $clockWrapper = document.querySelector('.clock-wrapper');
  $clockWrapper.style.left = `${positionX + 90}px`;
  $clockWrapper.style.top = `${positionY + 70}px`;


  const HALF_MAP_WIDTH = 1009.11 / 2;
  const HALF_MAP_HEIGHT = 665.24 / 2;

  const $mapObj = document.querySelector('.map-obj');
  const $svg = $mapObj.contentDocument.querySelector('svg');
  const $g = $svg.querySelector('g');
  const $backBtn = document.querySelector('.back-btn');
  const $customSelectBtn = document.querySelector('.custom-select-btn');

  const $countries = [...$g.children];
  const $serviceContry = serviceCountry.reduce((obj, key) => {
    obj[key] = $svg.getElementById(key);
    return obj;
  }, {});

  // variables
  let flag = false;

  // functions
  const getCountryCenterPos = $target => {
    const rect = $target.getBoundingClientRect();
    return [rect.width / 2 + rect.x, rect.height / 2 + rect.y];
  };

  const getScaleRatio = $target => {
    const rectWidth = $target.getBoundingClientRect().width;
    return rectWidth < 50 ? 25 : rectWidth < 200 ? 5 : 2;
  };

  const translateAndScaleMap = (x, y, ratio) => {
    if (!$g.style.transition) $g.style.transition = '1s';
    $g.style.transform = `translate3D(${x}px, ${y}px, 0) scale(${ratio})`;
  };

  const showBackBtn = () => {
    $backBtn.style.opacity = 1;
    $backBtn.disabled = false;
  };

  const hideBackBtn = () => {
    $backBtn.style.opacity = 0;
    $backBtn.display = true;
  };

  const showCountries = () => {
    $countries.forEach($country => {
      $country.style.opacity = 1;
    });
  };

  const hideCountryWithoutTarget = $target => {
    $countries.forEach($country => {
      if (!$country.style.transition) $country.style.transition = '1s';
      if ($country !== $target) $country.style.opacity = 0;
    });
  };

  const zoomCountry = $target => {
    const [targetCenterX, targetCenterY] = getCountryCenterPos($target);
    const scaleRatio = getScaleRatio($target);
    const moveX = HALF_MAP_WIDTH - targetCenterX * scaleRatio;
    const moveY = HALF_MAP_HEIGHT - targetCenterY * scaleRatio;

    memo.setCurrentCountryCode($target.id);
    description.setCountryInfo($target.id);

    dropdownMenu.hideDropDownMenu();
    translateAndScaleMap(moveX, moveY, scaleRatio);
    setTimeout(() => {
      hideCountryWithoutTarget($target);
    }, 1000);
    setTimeout(() => {
      worldClock.showWorldClock($target.id);
    }, 1500);
    setTimeout(() => {
      showBackBtn();
      translateAndScaleMap(moveX - 230, moveY + 100, scaleRatio);
    }, 2000);
    setTimeout(() => {
      memo.showMemoWrapper();
      description.show();
    }, 2550);
  };

  // event handlers
  $svg.onclick = e => {
    if (!(e.target.id in $serviceContry) || flag) return;
    flag = true;

    zoomCountry(e.target);
  };

  $backBtn.onclick = () => {
    flag = false;

    showCountries();
    worldClock.hideWorldClock();

    memo.hideMemoWrapper();
    description.hide();
    hideBackBtn();

    setTimeout(() => {
      dropdownMenu.showDropDownMenu();
      translateAndScaleMap(0, 0, 1);
    }, 1000);
  };

  $customSelectBtn.onclick = () => {
    const country = document.querySelector(
      '.custom-select-trigger > span'
    ).textContent;
    zoomCountry($serviceContry[country]);
  };
};
