(() => {
  const audio = document.getElementById('bgm');
  const audioButton = document.getElementById('bgm-toggle');
  const audioStatus = document.getElementById('bgm-status');

  // Keep playback opt-in: browsers only allow reliable audio playback after a user gesture.
  fetch('assets/bgm.mp3', { method: 'HEAD' }).then((response) => {
    if (!response.ok) throw new Error('BGM file is not installed.');
    audio.src = 'assets/bgm.mp3';
    audioButton.disabled = false;
    audioStatus.textContent = '再生ボタンを押すとBGMが流れます。';
  }).catch(() => {
    audioStatus.textContent = 'assets/bgm.mp3 が未設定です。READMEの手順で音源を追加してください。';
  });

  audioButton.addEventListener('click', async () => {
    if (audio.paused) {
      try {
        await audio.play();
        audioButton.textContent = 'BGMを一時停止';
        audioButton.setAttribute('aria-pressed', 'true');
        audioStatus.textContent = '再生中';
      } catch {
        audioStatus.textContent = '音源を再生できませんでした。音源ファイルをご確認ください。';
      }
    } else {
      audio.pause();
      audioButton.textContent = 'BGMを再生';
      audioButton.setAttribute('aria-pressed', 'false');
      audioStatus.textContent = '一時停止中';
    }
  });

  audio.addEventListener('ended', () => {
    audioButton.textContent = 'BGMを再生';
    audioButton.setAttribute('aria-pressed', 'false');
  });

  const visitorCount = document.getElementById('visitor-count');
  const todayCount = document.getElementById('today-count');
  const namespace = 'higan-no-koi-6aeb1b8e';
  const endpoint = (key) => `https://counterapi.com/api/${namespace}/view/${encodeURIComponent(key)}`;

  function japanDateKey() {
    const parts = new Intl.DateTimeFormat('en', {
      timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date());
    const value = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    return `${value.year}${value.month}${value.day}`;
  }

  async function loadCounts() {
    try {
      const [visitorsResponse, todayResponse] = await Promise.all([
        fetch(`${endpoint('unique-visitors')}?unique=true`),
        fetch(endpoint(`visits-${japanDateKey()}`))
      ]);
      if (!visitorsResponse.ok || !todayResponse.ok) throw new Error('Counter API request failed.');
      const [visitors, today] = await Promise.all([visitorsResponse.json(), todayResponse.json()]);
      visitorCount.textContent = Number(visitors.value).toLocaleString('ja-JP');
      todayCount.textContent = Number(today.value).toLocaleString('ja-JP');
    } catch {
      visitorCount.textContent = '取得できません';
      todayCount.textContent = '取得できません';
    }
  }

  loadCounts();
  const petalLayer = document.querySelector('.falling-petals');
  if (petalLayer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (let index = 0; index < 14; index += 1) {
      const petal = document.createElement('span');
      petal.className = 'falling-petal';
      petal.style.setProperty('--x', `${Math.random() * 100}%`);
      petal.style.setProperty('--size', `${8 + Math.random() * 10}px`);
      petal.style.setProperty('--duration', `${14 + Math.random() * 16}s`);
      petal.style.setProperty('--delay', `${-Math.random() * 24}s`);
      petal.style.setProperty('--drift', `${Math.round(Math.random() * 140 - 70)}px`);
      petal.style.setProperty('--spin', `${Math.round(Math.random() * 720 + 360)}deg`);
      petalLayer.appendChild(petal);
    }
  }
})();

