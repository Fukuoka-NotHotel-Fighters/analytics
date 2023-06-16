const testId = 'test1'; // テストIDによってテストを特定します

function fetchTestInfo() {
  return fetch(`/get-test-info?testId=${testId}`).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });
}

function updateDOM(html) {
  // ここにDOMを更新するためのコードを書いてください
  // 例：document.body.innerHTML = html;
}

function trackEvent(eventData) {
  return fetch('/track-event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });
}

function handleEvent(eventType, elementId) {
  trackEvent({
    timestamp: new Date().toISOString(),
    version: selectedVersion,
    userAgent: navigator.userAgent,
    eventType: eventType,
    eventData: {
      elementId: elementId,
    },
  });
}

let selectedVersion;

fetchTestInfo().then(testInfo => {
  if (testInfo && testInfo.abTestStatus === 'running') {
    const randomNum = Math.random(); // 0と1の間のランダムな数字を生成します

    if (randomNum < 0.5) {
      selectedVersion = 'A';
      // A案（デフォルト）を選択した場合、何もしないでください
    } else {
      selectedVersion = 'B';
      // B案を選択した場合、DOMを更新します
      updateDOM(testInfo.versionBHTML);
    }

    // ログをFlaskアプリケーション経由で送信します
    trackEvent({
      timestamp: new Date().toISOString(),
      version: selectedVersion,
      userAgent: navigator.userAgent,
      eventType: 'pageView',
      eventData: { /* ここにイベントデータを追加します */ }
    }).then(() => console.log('Event tracked successfully'))
      .catch(error => console.error('Error tracking event:', error));

    // すべての要素についてイベントリスナーを設定します
    const elements = document.querySelectorAll('[id]');
    elements.forEach(element => {
      element.addEventListener('click', () => handleEvent('click', element.id));
      element.addEventListener('mouseover', () => handleEvent('mouseover', element.id));
      // 表示イベントのトラッキング
      if (element.offsetParent !== null) { // offsetParent is null when the element is not visible
        handleEvent('view', element.id);
      }
    });
  }
});
