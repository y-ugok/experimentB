"use strict";

let firestore;
async function loadFirebase() {
  const module = await import("./firebase.js");
  firestore = new module.Firebase();
  await firestore.loadDefaultList();
  //Promiseが解決するまで処理を一時停止して解決後にその結果を返す
  loadList();
}
loadFirebase();

const open =
  document.getElementById("open") || document.getElementById("open-disabled");
const register = document.querySelector("#register-dialog");
const registerButton = document.getElementById("register-item-btn");
const registerCloseButton = document.getElementById("register-close");
const edit = document.getElementById("edit-dialog");
const updateButton = document.getElementById("update-item-btn");
const deleteButton = document.getElementById("del-item-btn");
const editCloseButton = document.getElementById("edit-close");
const iconType = document.getElementById("icon-type");
const listText = document.getElementById("item-content");
const newIconType = document.getElementById("new-icon-type");
const newListText = document.getElementById("new-item-content");

let editTargetItem = null; // 編集対象のアイテムを保存するための変数
// ページに応じてlistKeyを決定
function getListKey() {
  if (window.location.pathname.includes("self.html")) {
    return "self-list"; // self.html の場合は self-list を使う
  } else {
    return "partner-list"; // index.html の場合は partner-list を使う
  }
}

// ダイアログを開く・閉じる
open.addEventListener("click", () => {
  // モーダル表示前にクラスを付与
  register.classList.add("show-from");
  newListText.value = "";
  register.showModal();
  requestAnimationFrame(() => {
    // モーダル表示後にクラスを削除してアニメーションを開始
    register.classList.remove("show-from");
  });
});

function show(dialog) {
  dialog.classList.add("show-from");
  dialog.showModal();

  requestAnimationFrame(() => {
    // モーダル表示後にクラスを削除してアニメーションを開始
    dialog.classList.remove("show-from");
  });
}
function close(dialog) {
  // モーダル非表示前にクラスを付与してアニメーションを開始
  dialog.classList.add("hide-to");

  dialog.addEventListener(
    "transitionend",
    () => {
      // アニメーション終了後にクラスを削除し、モーダルを閉じる
      dialog.classList.remove("hide-to");
      dialog.close();
    },
    {
      once: true,
    }
  );
}

registerCloseButton.addEventListener("click", () => {
  close(register);
});

register.addEventListener("click", (event) => {
  if (event.target === register) {
    register.close();
  }
});
editCloseButton.addEventListener("click", () => {
  edit.close();
});

// セッションストレージにアイテムを保存
async function saveToSessionStorage(item) {
  const listKey = getListKey(); // 現在のページに基づいてlistKeyを取得

  // Firestoreに追加
  const docID = await firestore.addData(listKey, item);
  // console.log(docID);
  item.docID = docID;

  // セッションストレージに保存
  let storedItems = JSON.parse(sessionStorage.getItem(listKey)) || [];
  storedItems.unshift(item);
  sessionStorage.setItem(listKey, JSON.stringify(storedItems));

  // 履歴を更新（in history.js）
  registerHistory(item.text);
  loadList();
}

// セッションストレージからアイテムを削除;
async function removeFromSessionStorage(itemText) {
  const listKey = getListKey(); // 現在のページに基づいてlistKeyを取得
  let storedItems = JSON.parse(sessionStorage.getItem(listKey)) || [];

  // テキストに基づいてアイテムを削除
  storedItems = storedItems.filter((item) => item.text !== itemText);
  sessionStorage.setItem(listKey, JSON.stringify(storedItems));
}

// 初期データの読み込みと表示
function loadList() {
  const listKey = getListKey(); // 現在のページに基づいてlistKeyを取得
  let storedItems = JSON.parse(sessionStorage.getItem(listKey)) || [];
  storedItems.sort((a, b) => (a.date.seconds < b.date.seconds ? 1 : -1));
  //最新(データが大きい方が)1になって前にくるように並び替える
  const ul = document.getElementById("list");
  ul.textContent = ""; // 二重に表示されないようにする

  storedItems.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add(item.icon);
    if (listKey === "self-list") {
      li.innerHTML = `
         <div class="wrapper">
         <div class="rectangle">
          <img src="./img/${item.icon}.png" alt="${item.icon}" />
          </div>
        </div>
      <span class="list-flex">
          <span class="text">${item.text}</span>
          <img src="./img/dots.png">
      </span>
    `;
    } else {
      li.innerHTML = `
      <div class="wrapper">
      <div class="rectangle">
       <img src="./img/${item.icon}.png" alt="${item.icon}" />
       </div>
     </div>
   <span class="list-flex">
       <span class="text">${item.text}</span>
   </span>
   <button class="complete-btn" onclick="completeTask()"><img src="./img/check-icon.png" /></button>
 `;
    }
    ul.appendChild(li);
  });

  // アイテム削除ボタンのクリックイベントを追加
  const completeButtons = document.querySelectorAll(".complete-btn");
  completeButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const li = event.target.closest("li");
      const itemText = li.querySelector(".text").textContent;
      let storedItems =
        JSON.parse(sessionStorage.getItem("partner-list")) || [];
      const compItem = storedItems.find((item) => item.text == itemText);

      if (!compItem) {
        console.log("completed item is " + compItem);
        return false;
      }

      // firebaseから削除
      await firestore.deleteData(listKey, compItem.docID);

      // 履歴に記録（in history.js）
      await completeHistory(compItem);

      // セッションストレージから削除
      removeFromSessionStorage(itemText);

      // DOMから削除
      li.remove();
      adjustDialogPosition(register);
    });
  });
  addDotsFunctionality(); // リストを読み込んだ後に追加
}

function addDotsFunctionality() {
  const dotIcons = document.querySelectorAll(".list-flex>img");
  dotIcons.forEach((dotIcon) => {
    dotIcon.addEventListener("click", (event) => {
      const itemElement = event.target.closest("li");
      editTargetItem = itemElement; // 編集対象のリストアイテムを保持

      // ダイアログに既存のリストアイテムの内容をセット
      const itemText = itemElement.querySelector(".text").textContent;
      const itemIcon = itemElement.classList.contains("cook")
        ? "cook"
        : itemElement.classList.contains("cleaning")
        ? "cleaning"
        : itemElement.classList.contains("communication")
        ? "communication"
        : itemElement.classList.contains("action")
        ? "action"
        : itemElement.classList.contains("shopping")
        ? "shopping"
        : itemElement.classList.contains("education")
        ? "education"
        : "other";
      iconType.value = itemIcon; // アイコンタイプを設定
      listText.value = itemText; // リストの内容を設定

      deleteButton.addEventListener("click", () => {
        itemElement.remove();
      });
      // == モーダルを表示する==//
      edit.classList.add("show-from");
      edit.showModal();

      // モーダルとフッターの位置を調整
      adjustDialogPosition(edit);
      requestAnimationFrame(() => {
        // モーダル表示後にクラスを削除してアニメーションを開始
        edit.classList.remove("show-from");
      });
    });
  });
}
/* 背景をクリックした時に編集ダイアログを閉じる */
edit.addEventListener("click", (event) => {
  // 背景がクリックされた場合は閉じる。
  // ダイアログの見た目のスタイルは .inner に設定しているので、
  // コンテンツ部分がクリックされた場合、target は必ず .inner かその子孫要素になる。
  // したがって、target === dialog の時は背景がクリックされたとみなせる。
  if (event.target === edit) {
    edit.close();
  }
});

// 削除ボタンのクリックイベント
deleteButton.addEventListener("click", async () => {
  let storedItems = JSON.parse(sessionStorage.getItem("self-list")) || [];
  const delItem = storedItems.find((item) => item.text == listText.value);

  // firebaseから削除
  await firestore.deleteData("self-list", delItem.docID);

  // セッションストレージから削除
  removeFromSessionStorage(listText.value);

  // 履歴を更新（in history.js）
  removeHistory(listText.value);
  // listText.remove(); // DOMから削除
  edit.close();
});

// アイテム更新ボタンの処理
updateButton.addEventListener("click", () => {
  // バリデーション: リストアイテムの内容が空の場合は追加を許可しない
  if (!listText.value.trim()) {
    alert("リストアイテムの内容を入力してください。");
    return; // 関数を終了する
  }
  const now = Math.trunc(Date.now() / 1000);
  const newItem = {
    icon: iconType.value,
    text: listText.value,
    date: {
      seconds: now,
    },
  };

  // 編集モードの場合、リストアイテムを更新する
  const oldText = editTargetItem.querySelector(".text").textContent;
  const oldIcon = editTargetItem.classList.value;
  if (oldText === listText.value && oldIcon === newItem.icon) {
    alert("アイコンの種類とリストアイテム内容が同じです");
    return; // 関数を終了する
  }

  updateSessionStorageItem(oldText, newItem); // セッションストレージのアイテムを更新
  editTargetItem.querySelector(".text").textContent = newItem.text; // リストのテキストを更新
  editTargetItem.className = newItem.icon; // アイコンのクラスを更新

  edit.close(); // ダイアログを閉じる
  editTargetItem = null; // 編集対象のアイテムをリセット
  loadList();
});

const MAX_LIST_ITEMS = 5;
// アイテム追加ボタンの処理
registerButton.addEventListener("click", () => {
  const listKey = "self-list"; // 現在のページに基づいてlistKeyを取得
  let storedItems = JSON.parse(sessionStorage.getItem(listKey)) || [];

  // リストの数が5個以上の場合、エラーメッセージを表示して処理を終了
  if (storedItems.length >= MAX_LIST_ITEMS) {
    alert("登録できるリストアイテム数は5つまでとなっています");
    return; // 処理を終了する
  }

  // バリデーション: リストアイテムの内容が空の場合は追加を許可しない
  if (!newListText.value.trim()) {
    alert("リストアイテムの内容を入力してください。");
    return; // 処理を終了する
  }
  const now = Math.trunc(Date.now() / 1000);
  const newItem = {
    icon: newIconType.value,
    text: newListText.value,
    date: {
      seconds: now,
    },
  };

  // 新規追加処理
  saveToSessionStorage(newItem);
  register.close(); // ダイアログを閉じる
  loadList(); //リストを表示
});

// セッションストレージのアイテムを更新する関数
function updateSessionStorageItem(oldText, newItem) {
  const listKey = getListKey(); // 現在のページに基づいてlistKeyを取得
  let storedItems = JSON.parse(sessionStorage.getItem(listKey)) || [];

  // 古いアイテムを探して更新
  storedItems = storedItems.map((item) => {
    if (item.text === oldText) {
      // 履歴を更新（in history.js）
      updateHistory(oldText, newItem.text);

      // Firestoreに保存
      saveToFirestore(listKey, newItem);

      return newItem; // アイテムを新しい内容で更新
    }
    return item;
  });

  sessionStorage.setItem(listKey, JSON.stringify(storedItems));
}

// Firestoreにデータを保存する関数
function saveToFirestore(listKey, item) {
  import("./firebase.js").then((module) => {
    const db = new module.Firebase();
    db.addData(listKey, item);
  });
}

window.onload = () => {
  loadList();
  addDotsFunctionality(); // dots.png の機能を追加
  updatePlantImage();
};

// === 植物成長の画像変化用のコード === //
let completedTasks = parseInt(localStorage.getItem("completedTasks")) || 0;

function completeTask() {
  completedTasks++;
  localStorage.setItem("completedTasks", completedTasks); // completedTasksをlocalStorageに保存
  updatePlantImage();
}

// 植物の画像を更新する関数
function updatePlantImage() {
  const plantImage = document.getElementById("plantImage");
  // list.jsの時にsrcエラーの回避
  if (!plantImage) return;
  if (completedTasks >= 0 && completedTasks < 4) {
    plantImage.src = "./img/plant1.png";
  } else if (completedTasks >= 4 && completedTasks < 8) {
    plantImage.src = "./img/plant2.png";
  } else if (completedTasks >= 8 && completedTasks < 12) {
    plantImage.src = "./img/plant3.png";
  } else if (completedTasks >= 12 && completedTasks < 16) {
    plantImage.src = "./img/plant4.png";
  } else {
    plantImage.src = "./img/plant5.png";
  }
}
// フッター位置の調整
function adjustDialogPosition(dialog) {
  if (window.innerWidth >= 1025) {
    // 画面幅が1025px以上の場合にのみ調整を行う
    const footerRect = footer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const footerOffset = viewportHeight - footerRect.bottom;
    dialog.style.bottom = `${footerOffset}px`;
    dialog.style.width = `250px`;
  } else {
    // 画面幅が狭い場合はデフォルト位置に戻す
    dialog.style.width = `100%`;
    dialog.style.bottom = 0;
  }
}
