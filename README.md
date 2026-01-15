# Pixel Quiz Game (Retro Style)

這是一個使用 React + Vite 開發的像素風格問答遊戲。遊戲結合 Google Sheets 作為後端資料庫（題目來源與成績記錄）。

## 🚀 快速開始 (Quick Start)

### 1. 複製專案
因為本專案的 `.env` 檔案包含個人設定，已被忽略。你需要手動建立它。

```bash
# 複製範例設定檔
cp .env.example .env
```

請編輯 `.env` 檔案，填入你的 **Google Apps Script Web App URL**（見下方 GAS 設定指南）。

### 2. 安裝與執行
確保你已安裝 Node.js。

```bash
# 安裝套件
npm install

# 啟動開發伺服器
npm run dev
```

開啟瀏覽器並訪問終端機顯示的網址（通常是 `http://localhost:5173`）。

---

## 🌍 部署到 GitHub Pages

本專案已設定 GitHub Actions，可自動部署到 GitHub Pages。

### 1. 設定 GitHub Secrets
為了讓部署後的網站能連到你的 Google Sheets，你需要將 `.env` 中的機密設定到 GitHub：

1. 進入你的 GitHub Repository > **Settings** > **Secrets and variables** > **Actions**。
2. 點選 **New repository secret**。
3. 建立以下 Secret：
    - Name: `VITE_GOOGLE_APP_SCRIPT_URL`
    - Value: (你的 Google Apps Script 網址)

### 2. 開啟 GitHub Pages
1. 進入 **Settings** > **Pages**。
2. 在 **Build and deployment** > **Source** 選擇 **GitHub Actions**。

只要你將程式碼推送到 `main` 分支，GitHub 就會自動部署。

---

## 📅 Google Sheets & Apps Script 設定指南

### 步驟 1：建立 Google Sheets
建立一個新的 Google Sheet，並重新命名為 `PixelGameDB`（名稱可自訂）。
建立以下兩個工作表 (Tabs)：

#### 工作表 1: `Questions` (題目)
請依照以下順序設定第一列 (Header)：
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| **ID** | **Question** | **OptionA** | **OptionB** | **OptionC** | **OptionD** | **Answer** |

#### 工作表 2: `Results` (成績)
請依照以下順序設定第一列 (Header)：
| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| **UserID** | **TotalPlays** | **TotalScore** | **HighScore** | **FirstClearScore** | **AttemptsToClear** | **LastPlayed** |

### 步驟 2：設定 Google Apps Script
1. 在 Google Sheets 中，點選上方選單 **「擴充功能 (Extensions)」 > 「Apps Script」**。
2. 刪除預設程式碼，並貼上以下程式碼：

```javascript
// 建議程式碼：包含錯誤處理與 TEXT MIME Type
function doGet(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    const params = e.parameter;
    const action = params.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action === "getQuestions") {
      const sheet = ss.getSheetByName("Questions");
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({error: "No 'Questions' sheet found"}))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      const dataRange = sheet.getDataRange();
      const values = dataRange.getValues();
      values.shift(); // 移除標題
      
      const questions = values.map((row) => ({
        id: row[0],
        question: row[1],
        options: [row[2], row[3], row[4], row[5]],
        answer: row[6]
      }));
      
      const count = parseInt(params.count) || 5;
      const shuffled = questions.sort(() => 0.5 - Math.random()).slice(0, count);
      
      // 使用 TEXT MimeType 避免部分瀏覽器嚴格的 JSON 檢查
      return ContentService.createTextOutput(JSON.stringify(shuffled))
        .setMimeType(ContentService.MimeType.TEXT);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({error: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Results");
    
    // 簡單範例：記錄成績
    sheet.appendRow([data.userId, 1, data.score, data.score, data.passed ? data.score : 0, 1, new Date()]);
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: err.toString()}))
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
```

### 步驟 3：部署
1. 點選右上角 **「部署 (Deploy)」 > 「新增部署 (New deployment)」**。
2. 點選齒輪圖示，選擇 **「網頁應用程式 (Web app)」**。
3. 設定如下：
    - **執行身份 (Execute as)**: `我 (Me)`
    - **誰可以存取 (Who has access)**: `任何人 (Anyone)` **(重要！)**
4. 點選 **「部署 (Deploy)」**。
5. 複製產生的 **網頁應用程式網址 (Web App URL)**。
6. 將此網址貼回專案的 `.env` 檔案中。

---

## 📝 測試題庫 (生成式 AI 基礎知識)

你可以直接複製以下內容到 Google Sheets 的 **`Questions`** 工作表進行測試：

| ID | Question | OptionA | OptionB | OptionC | OptionD | Answer |
|----|----------|---------|---------|---------|---------|--------|
| 1 | 生成式 AI (Generative AI) 的主要特徵是什麼？ | 只能分析現有數據 | 能夠創造新的內容 | 只能回答是非題 | 專門用於計算數學 | 能夠創造新的內容 |
| 2 | 以下哪個不是常見的生成式 AI 模型？ | GPT-4 | Midjourney | Stable Diffusion | Excel Macro | Excel Macro |
| 3 | ChatGPT 是由哪家公司開發的？ | Google | Meta | OpenAI | Microsoft | OpenAI |
| 4 | 「幻覺 (Hallucination)」在 AI 領域是指什麼？ | AI 看到鬼 | AI 產生自信但錯誤的資訊 | AI 變得有自我意識 | AI 拒絕回答問題 | AI 產生自信但錯誤的資訊 |
| 5 | 下列何者是文字生成圖片 (Text-to-Image) 的工具？ | ChatGPT | Midjourney | GitHub Copilot | Google Translate | Midjourney |
| 6 | 大型語言模型 (LLM) 中的 "Large" 通常指什麼？ | 參數數量龐大 | 佔用硬碟空間大 | 價格昂貴 | 開發團隊人數多 | 參數數量龐大 |
| 7 | 在 Prompt Engineering 中，「Few-shot prompting」是指？ | 不給任何範例 | 給予少量範例引導 AI | 責罵 AI | 只問 AI 幾個問題 | 給予少量範例引導 AI |
| 8 | Transformer 架構最初是為了解決什麼問題而提出的？ | 圖像識別 | 機器翻譯 | 音樂生成 | 股票預測 | 機器翻譯 |
| 9 | 下列哪個不是生成式 AI 的應用風險？ | 版權爭議 | 生成虛假新聞 | 提高生產力 | 偏見與歧視 | 提高生產力 |
| 10 | 什麼是 RAG (Retrieval-Augmented Generation)？ | 一種跳舞生成模型 | 檢索增強生成 | 隨機自動生成 | 遞歸演算法生成 | 檢索增強生成 |
