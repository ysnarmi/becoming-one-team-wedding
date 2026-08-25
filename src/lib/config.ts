export type Account = {
  bank: string;
  number: string;
  holder: string;
  kakaoPayUrl?: string;
};

export const WEDDING = {
  groom: {
    name: "원성",
    fullName: "곡원성",
    lastName: "곡",
    father: "아버지이름",
    mother: "어머니이름",
    accounts: [
      { bank: "은행명", number: "000-000-000000", holder: "아버지이름" },
      { bank: "은행명", number: "000-000-000000", holder: "곡원성" },
    ] as Account[],
  },
  bride: {
    name: "승연",
    fullName: "이승연",
    lastName: "이",
    father: "아버지이름",
    mother: "어머니이름",
    accounts: [
      { bank: "은행명", number: "000-000-000000", holder: "이승연", kakaoPayUrl: "" },
      { bank: "은행명", number: "000-000-000000", holder: "아버지이름" },
    ] as Account[],
  },
  date: {
    year: 2026,
    month: 12,
    day: 5,
    hour: 13,
    minute: 30,
    dayName: "토요일",
    displayTime: "오후 1시 30분",
  },
  venue: {
    name: "예식장 이름",
    hall: "홀 이름",
    address: "주소를 입력해 주세요",
    naverMapUrl: "https://map.naver.com",
    kakaoMapUrl: "https://map.kakao.com",
    tmapUrl: "https://www.tmap.co.kr",
    directions: [
      {
        icon: "subway",
        title: "지하철",
        content: "[호선] 역이름역 n번 출구 도보 n분",
      },
      {
        icon: "bus",
        title: "버스",
        content: "버스 정류장 이름\n버스 번호",
      },
      {
        icon: "car",
        title: "주차안내",
        content: "주차 안내 내용",
      },
    ],
  },
  invitation: {
    title: "소중한 분들을 초대합니다",
    message:
      "살랑이는 바람결에\n사랑이 묻어나는 계절입니다.\n\n여기 두 사람이 사랑을 맺어\n인생의 반려자가 되려 합니다.\n\n새 인생을 시작하는 이 자리에 오셔서\n축복해 주시면 감사하겠습니다.",
  },
  photos: [
    "/images/gallery/1.jpg",
    "https://picsum.photos/seed/w2/600/600",
    "https://picsum.photos/seed/w3/600/600",
    "https://picsum.photos/seed/w4/600/600",
    "https://picsum.photos/seed/w5/600/600",
    "https://picsum.photos/seed/w6/600/600",
    "https://picsum.photos/seed/w7/600/600",
    "https://picsum.photos/seed/w8/600/600",
    "https://picsum.photos/seed/w9/600/600",
    "https://picsum.photos/seed/w10/600/600",
    "https://picsum.photos/seed/w11/600/600",
    "https://picsum.photos/seed/w12/600/600",
  ],
};
