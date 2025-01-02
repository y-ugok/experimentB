// ページ読み込み時に保存されたテーマカラーを適用
window.addEventListener("load", () => {
  let savedColor = localStorage.getItem("themeColor");

  if (!savedColor) {
    savedColor = "#FFC3B7";
  }
  applyThemeColor(savedColor);

  //リストアイテムを追加して更新すると色がデフォルトに戻る問題の解消
  const updateButton = document.getElementById("update-item-btn");
  const registerButton = document.getElementById("register-item-btn");
  if (updateButton) {
    updateButton.addEventListener("click", () => applyThemeColor(savedColor));
  }
  if (registerButton) {
    registerButton.addEventListener("click", () => applyThemeColor(savedColor));
  }
});

// == テーマカラーの適用 == //
function applyThemeColor(color) {
  document.querySelector("header").style.backgroundColor = color;

  const registerItemBtn = document.getElementById("register-item-btn");
  if (registerItemBtn) {
    registerItemBtn.style.backgroundColor = color;
  }

  const delItemBtn = document.getElementById("del-item-btn");
  if (delItemBtn) {
    delItemBtn.style.color = color;
  }

  const updateButton = document.getElementById("update-item-btn");
  if (updateButton) {
    updateButton.style.backgroundColor = color;
  }

  const completeButtons = document.getElementsByClassName("complete-btn");
  Array.from(completeButtons).forEach((btn) => {
    btn.style.backgroundColor = color;
  });

  const rectangles = document.querySelectorAll(".rectangle");
  rectangles.forEach((rect) => {
    rect.style.backgroundColor = color;
  });

  const removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach((btn) => {
    btn.style.backgroundColor = color;
  });

  const addStyleElements = document.querySelectorAll(".addStyle");
  addStyleElements.forEach((elem) => {
    elem.style.borderBottomColor = color; // 下線の色をテーマカラーに設定
  });
  // console.log(color); // 取得したテーマカラーを確認

  const confirmReset = document.getElementById("confirm-reset");
  if (confirmReset) {
    confirmReset.style.backgroundColor = color;
  }
  const open = document.getElementById("open");
  if (open) {
    open.style.backgroundColor = color;
  }
}

// モーダル表示のレスポンシブ化
const openButton = document.getElementById("open");
const registerDialog = document.getElementById("register-dialog");
const editDialog = document.getElementById("edit-dialog");
const dotsImg = document.querySelectorAll(".text+img");
const colorDialog = document.getElementById("colorModal");
const footer = document.querySelector("footer");
const color = document.getElementById("colorButton");
const clearDialog = document.getElementById("clear-dialog");

function updateDialogPosition(dialog) {
  const viewportHeight = window.innerHeight; // ビューポートの高さ
  const footerRect = footer.getBoundingClientRect(); // フッターの位置
  const footerOffset = viewportHeight - footerRect.bottom; // フッターまでの距離

  // ウィンドウサイズに応じたモーダルの幅と位置を変更
  if (window.matchMedia("(max-width: 1024px)").matches) {
    // 1024px未満の場合、モーダル幅を100%にし、下端がページ下端に合わせる
    dialog.style.width = "100%";
    dialog.style.height = "70vh"; // 高さを80vhに設定
    dialog.style.bottom = "0px"; // モーダルの下端をページ下端に合わせる
  } else {
    // 1024px以上の場合、モーダル幅を250pxに設定し、フッターと下端が揃うように調整
    dialog.style.width = "250px";
    dialog.style.height = "70vh"; // 高さを80vhに設定
    dialog.style.bottom = `${footerOffset}px`; // フッターの下端に合わせる
  }
  dialog.showModal(); // モーダルを表示
}

// モーダルの表示イベントリスナー
if (openButton) {
  openButton.addEventListener("click", () => {
    updateDialogPosition(registerDialog);
  });
}
if (color) {
  color.addEventListener("click", () => updateDialogPosition(colorDialog));
}

dotsImg.forEach((el) => {
  el.addEventListener("click", () => {
    updateDialogPosition(editDialog);
  });
});
// Array.from(completeButtons).forEach((btn) => {
//   btn.addEventListener("click", () => {
//     updateDialogPosition(clearDialog);
//   });
// });

// リサイズ時にもモーダル位置を更新
window.addEventListener("resize", () => {
  // モーダルが表示されている場合に、再計算を実行
  const dialogs = [clearDialog, registerDialog, editDialog, colorDialog];
  dialogs.forEach((dialog) => {
    if (dialog && dialog.open) {
      // モーダルが表示中の場合にのみ処理
      updateDialogPosition(dialog);
    }
  });
});
