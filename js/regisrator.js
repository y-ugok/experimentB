'use strict';

// タブ切り替え機能
document.getElementById('tab-your').addEventListener('click', function () {
  showHistory('your');
});

document.getElementById('tab-partner').addEventListener('click', function () {
  showHistory('partner');
});

function showHistory(tab) {
  document.getElementById('history-your').classList.add('hidden');
  document.getElementById('history-partner').classList.add('hidden');
  document.getElementById('tab-your').classList.remove('active');
  document.getElementById('tab-partner').classList.remove('active');

  if (tab === 'your') {
    document.getElementById('history-your').classList.remove('hidden');
    document.getElementById('tab-your').classList.add('active');
  } else {
    document.getElementById('history-partner').classList.remove('hidden');
    document.getElementById('tab-partner').classList.add('active');
  }
}

// データの読み込みと表示
function loadHistory() {
  const selfKey = 'self-list';
  const partnerKey = 'partner-list';
  const historyKey = 'history-list';

  let selfItems = JSON.parse(sessionStorage.getItem(selfKey)) || [];
  let partnerItems = JSON.parse(sessionStorage.getItem(partnerKey)) || [];
  let historyItems = JSON.parse(sessionStorage.getItem(historyKey)) || [];

  const ul = document.getElementById('list');
}

// 履歴の表示関数
function displayHistory() {
  const yourHistoryContainer = document.getElementById('history-your');
  const partnerHistoryContainer = document.getElementById('history-partner');

  yourHistory.forEach((item) => {
    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item');
    historyItem.innerHTML = `<p>${item.action}</p><p class="date-time">${item.date}</p>`;
    yourHistoryContainer.appendChild(historyItem);
  });

  partnerHistory.forEach((item) => {
    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item');
    historyItem.innerHTML = `<p>${item.action}</p><p class="date-time">${item.date}</p>`;
    partnerHistoryContainer.appendChild(historyItem);
  });
}

// ページが読み込まれた時に履歴を表示
document.addEventListener('DOMContentLoaded', displayHistory);
