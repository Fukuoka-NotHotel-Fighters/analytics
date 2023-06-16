function getSelectedVersion() {
  // ページのメタデータからABテストのバージョンを取得します
  const abTestMetaTag = document.querySelector('meta[name="ABtest"]');
  if (abTestMetaTag && abTestMetaTag.content === 'B') {
    return 'B';
  }
  // メタデータが存在しないか、contentが'B'でない場合はデフォルトの'A'を返します
  return 'A';
}

function trackEvent(eventData) {
  return fetch('https://fukuokanothotel.azurewebsites.net/track-event', {
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
  const selectedVersion = getSelectedVersion();
  trackEvent({
    timestamp: new Date().toISOString(),
    version: selectedVersion,
    userAgent: navigator.userAgent,
    eventType: eventType,
    url: window.location.href,
    eventData: {
      elementId: elementId,
    },
  });
}

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
