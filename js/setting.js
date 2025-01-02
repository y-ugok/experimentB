document.addEventListener('DOMContentLoaded', () => {
  let savedColor = localStorage.getItem('themeColor') || '#FFBDB1';
  applyThemeColor(savedColor);
  setButtonState(savedColor);
});

const resetDialog = document.getElementById('reset-dialog');
const resetButton = document.getElementById('reset-btn');
const cancelResetButton = document.getElementById('cancel-reset');
const confirmResetButton = document.getElementById('confirm-reset');

// resetButton.addEventListener('click', () => {
//   resetDialog.showModal();
// });

cancelResetButton.addEventListener('click', () => {
  resetDialog.close();
});

confirmResetButton.addEventListener('click', () => {
  sessionStorage.clear();
  localStorage.clear();
  resetDialog.close();
  alert('データを初期化しました');
  setButtonState('#FFBDB1');
  applyThemeColor('#FFBDB1');
  import('./firebase.js').then((module) => {
    db = new module.Firebase();
    db.loadDefaultList();
  });
});

resetDialog.addEventListener('click', (event) => {
  if (event.target === resetDialog) {
    resetDialog.close();
  }
  //event.targetはクリックされた要素、もし外側をクリックした場合はdialogクラスを選択
});

const colorModal = document.getElementById('colorModal');
const colorButton = document.getElementById('colorButton');
const colorClose = document.getElementById('colorClose');

colorButton.addEventListener('click', show);

function show() {
  colorModal.classList.add('show-from');
  colorModal.showModal();
  requestAnimationFrame(() => {
    colorModal.classList.remove('show-from');
  });
  // アニメーション効果が完了した後にスタイルを戻す
}

colorModal.addEventListener('click', (event) => {
  if (event.target === colorModal) {
    close();
  }
});

colorClose.addEventListener('click', close);

function close() {
  colorModal.classList.add('hide-to');
  colorModal.addEventListener(
    'transitionend',
    // cssのトランジションが完了した時に発火
    () => {
      colorModal.classList.remove('hide-to');
      colorModal.close();
    },
    { once: true }
    // このイベントリスナーが1度だけ実行されてその後自動的に削除
  );
}

function setButtonState(color) {
  const buttons = {
    '#FFBDB1': document.getElementById('red'),
    '#FFEC9B': document.getElementById('yellow'),
    '#BFF0B1': document.getElementById('green'),
    '#B1D4FF': document.getElementById('blue')
  };

  Object.keys(buttons).forEach((key) => {
    //buttons:プロパティが返されるオブジェクト
    if (key === color) {
      buttons[key].textContent = '適用中';
      buttons[key].classList.add('selected-button');
    } else {
      buttons[key].textContent = '適用';
      buttons[key].classList.remove('selected-button');
    }
  });
}

function applyThemeColor(color) {
  document.querySelector('header').style.backgroundColor = color;
  const rectangles = document.querySelectorAll('.rectangle');
  const removeButtons = document.querySelectorAll('.remove-btn');
  rectangles.forEach((rect) => {
    rect.style.backgroundColor = color;
  });
  removeButtons.forEach((btn) => {
    btn.style.backgroundColor = color;
  });
}
let selectedColor;
document.querySelectorAll('.wrapper button').forEach((button) => {
  button.addEventListener('click', (event) => {
    const buttonId = event.target.id;
    switch (buttonId) {
      case 'red':
        selectedColor = '#FFBDB1';
        break;
      case 'yellow':
        selectedColor = '#FFEC9B';
        break;
      case 'green':
        selectedColor = '#BFF0B1';
        break;
      case 'blue':
        selectedColor = '#B1D4FF';
        break;
      default:
        selectedColor = '#FFC3B7';
    }
    localStorage.setItem('themeColor', selectedColor);
    setButtonState(selectedColor);
    applyThemeColor(selectedColor);
    console.log(selectedColor);
  });
});
