# 참석 의사(RSVP) 구글 시트 연결

청첩장의 참석 의사 폼이 보낸 내용을 구글 시트에 한 줄씩 쌓는 방법입니다.
한 번만 설정해두면 이후에는 시트를 열어보기만 하면 됩니다.

## 1. 구글 시트 만들기

[sheets.new](https://sheets.new) 로 새 스프레드시트를 만들고 이름을 정합니다
(예: `결혼식 참석 명단`).

## 2. Apps Script 에 코드 붙여넣기

시트 상단 메뉴에서 **확장 프로그램 → Apps Script** 를 엽니다.
기본으로 들어있는 `function myFunction() {}` 를 모두 지우고 아래 코드를 붙여넣은 뒤
저장(💾)합니다.

```javascript
const SHEET_NAME = '참석의사';

function doPost(e) {
  // 동시에 여러 명이 제출해도 줄이 섞이지 않도록 잠금
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const data = JSON.parse(e.postData.contents);
    getSheet().appendRow([
      new Date(),
      data.side || '',
      data.name || '',
      data.count || '',
      data.companions || '',
      data.meal || '',
    ]);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['전달시각', '구분', '성함', '참석인원', '동행인', '식사여부']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. 웹 앱으로 배포

오른쪽 위 **배포 → 새 배포** 를 누르고:

| 항목 | 선택 |
|---|---|
| 유형 (톱니바퀴 아이콘) | **웹 앱** |
| 실행 계정 | **나** |
| 액세스 권한이 있는 사용자 | **모든 사용자** |

**배포**를 누르면 권한 승인 창이 뜹니다. 본인 계정을 고르고,
"Google에서 확인하지 않은 앱" 경고가 나오면
**고급 → (프로젝트 이름)(으)로 이동 → 허용** 을 눌러주세요.
본인이 만든 스크립트라 안전합니다.

## 4. 주소 복사해서 넣기

배포가 끝나면 나오는 **웹 앱 URL** 을 복사합니다. 이런 모양입니다:

```
https://script.google.com/macros/s/AKfycb.................../exec
```

이 주소를 `src/lib/config.ts` 의 `rsvp.endpoint` 에 넣으면 연결 완료입니다.

```ts
rsvp: {
  endpoint: "https://script.google.com/macros/s/..../exec",
  ...
}
```

## 참고

- **코드를 고친 뒤에는 반드시 다시 배포해야 반영됩니다.**
  배포 → 배포 관리 → 연필 아이콘 → 버전을 **새 버전**으로 → 배포.
- 주소는 청첩장 화면 코드에 포함되므로 외부에 노출됩니다. 주소를 알아낸 사람이
  장난으로 줄을 추가할 수는 있지만, 시트를 읽거나 고칠 수는 없습니다.
  결혼식이 끝나면 **배포 관리 → 보관처리**로 막아두면 됩니다.
- 응답이 들어오는지 확인하려면 청첩장에서 한 번 제출해보고 시트를 새로고침하세요.
