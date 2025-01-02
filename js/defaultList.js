"use strict";

function loadDefaultList() {
  // デフォルトのアイテムをセッションストレージに追加
  const selfItems = JSON.parse(sessionStorage.getItem("self-list")) || [];

  if (selfItems.length === 0) {
    const storedItems = [
      {
        icon: "cook",
        text: "好きなご飯を作ってもらいたいな",
      },
      {
        icon: "communication",
        text: "1日1つ以上誉め言葉をかけてほしいな",
      },
      {
        icon: "action",
        text: "疲れている時にマッサージしてほしいな",
      },
      {
        icon: "communication",
        text: "1日1回以上は感謝の気持ちを伝えてもらえると嬉しいな",
      },
    ];
    sessionStorage.setItem("self-list", JSON.stringify(storedItems));
  }

  const partnerItems = JSON.parse(sessionStorage.getItem("partner-list")) || [];

  if (partnerItems.length === 0) {
    const storedItems = [
      {
        icon: "cook",
        text: "好きなご飯を作ってもらいたいな",
      },
      {
        icon: "communication",
        text: "1日1つ以上誉め言葉をかけてほしいな",
      },
      { icon: "action", text: "疲れている時にマッサージしてほしいな" },
      {
        icon: "communication",
        text: "1日1回以上は感謝の気持ちを伝えてもらえると嬉しいな",
      },
      {
        icon: "shopping",
        text: "買い物を手伝ってもらえると助かるな",
      },
    ];
    sessionStorage.setItem("partner-list", JSON.stringify(storedItems));
  }

  const historyItems = JSON.parse(sessionStorage.getItem("history-list")) || [];

  if (historyItems.length === 0) {
    const storedItems = [
      {
        type: "登録",
        action: "アプリの利用開始",
        date: "2024/10/24 14:40",
      },
      {
        type: "登録",
        action: "パートナーにグループURLを共有",
        date: "2024/10/25 14:40",
      },
    ];

    const selfItems = JSON.parse(sessionStorage.getItem("self-list")).reverse();

    let d = 26;
    for (let item of selfItems) {
      storedItems.push({
        type: "登録",
        action: `私のしてほしいことリストに「${item.text}」を登録`,
        date: `2024/10/${d} 0:00`,
      });
      d += 1;
    }

    sessionStorage.setItem("history-list", JSON.stringify(storedItems));
  }
}
