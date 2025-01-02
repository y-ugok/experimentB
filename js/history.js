'use strict';

function loadHistory() {
  let storedItems = JSON.parse(sessionStorage.getItem('history-list')) || [];
  storedItems.sort((a, b) => a.date.seconds < b.date.seconds ? 1 : -1)
  console.log(storedItems);

  const ul = document.getElementById('list');
  ul.textContent = '';

  storedItems.forEach((item) => {
    const dateString = new Date(item.date.seconds * 1000).toLocaleString('ja-JP')
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="list-flex">
        <div class="list-content"><span class="text">${item.text}</span>         
        </div>
        <span class="time">${dateString}</span>
      </div>
    `;
    ul.appendChild(li);
  });
}

function registerHistory(item) {
  const historyItems = JSON.parse(sessionStorage.getItem('history-list')) || [];
  const now = Math.trunc(Date.now() / 1000);
  const newItem = {
    text: `私のしてほしいことリストに「${item}」を登録`,
    date: {
      seconds: now
    }
  };
  historyItems.push(newItem);
  sessionStorage.setItem('history-list', JSON.stringify(historyItems));
  import('./firebase.js').then((module) => {
    const db = new module.Firebase();
    db.addData('history-list', newItem);
  });
}

function updateHistory(oldItem, newItem) {
  const historyItems = JSON.parse(sessionStorage.getItem('history-list')) || [];
  const now = Math.trunc(Date.now() / 1000);
  const updItem = {
    text: `私のしてほしいことリストの「${oldItem}」を「${newItem}」に更新`,
    date: {
      seconds: now
    }
  }
  historyItems.push(updItem);
  sessionStorage.setItem('history-list', JSON.stringify(historyItems));
  import('./firebase.js').then((module) => {
    const db = new module.Firebase();
    db.addData('history-list', updItem);
  });
}

function removeHistory(item) {
  const historyItems = JSON.parse(sessionStorage.getItem('history-list')) || [];
  const now = Math.trunc(Date.now() / 1000);
  const delItem = {
    text: `私のしてほしいことリストの「${item}」を削除`,
    date: {
      seconds: now
    }
  };
  historyItems.push(delItem);
  sessionStorage.setItem('history-list', JSON.stringify(historyItems));
  import('./firebase.js').then((module) => {
    const db = new module.Firebase();
    db.addData('history-list', delItem);
  });
}

function completeHistory(item) {
  const historyItems = JSON.parse(sessionStorage.getItem('history-list')) || [];
  // const now = new Date().toLocaleString('ja-JP');
  const now = Math.trunc(Date.now() / 1000);
  const compItem = {
    text: `パートナーのしてほしいことリストの「${item.text}」を完了`,
    date: {
      seconds: now
    }
  };
  historyItems.push(compItem);
  sessionStorage.setItem('history-list', JSON.stringify(historyItems));
  import('./firebase.js').then((module) => {
    const db = new module.Firebase();
    db.addData('history-list', compItem);
  });
}
