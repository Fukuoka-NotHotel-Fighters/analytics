function fetchSiteData() {
  const siteUrl = window.location.href; // 現在のページのURLを取得
  return fetch(`https://fukuokanothotel.azurewebsites.net/get-site-data?siteUrl=${encodeURIComponent(siteUrl)}`).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });
}

function updateDOM(html) {
  document.documentElement.innerHTML = html;
}

fetchSiteData().then(siteData => {
  const randomNum = Math.random(); // 0と1の間のランダムな数字を生成します
  let selectedHTML;

  if (randomNum < 0.5) {
    selectedHTML = siteData.siteA; // siteAを選択
  } else {
    selectedHTML = siteData.siteB; // siteBを選択
    // メタタグを追加する
    selectedHTML = selectedHTML.replace('<head>', '<head>\n<meta name="ABtest" content="B">');
  }

  updateDOM(selectedHTML); // DOMを更新します
});
