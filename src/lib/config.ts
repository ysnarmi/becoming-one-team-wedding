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
    father: "곡공의",
    mother: "김우영",
    accounts: [
      { bank: "은행명", number: "000-000-000000", holder: "아버지이름" },
      { bank: "은행명", number: "000-000-000000", holder: "곡원성" },
    ] as Account[],
  },
  bride: {
    name: "승연",
    fullName: "이승연",
    lastName: "이",
    father: "이강현",
    mother: "이진아",
    accounts: [
      { bank: "토스뱅크", number: "1000-0810-8791", holder: "이승연" },
      { bank: "국민은행", number: "682401-01-200466", holder: "이진아" },
      { bank: "국민은행", number: "303-21-1201-370", holder: "이강현" },
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
    name: "KDW웨딩예식장",
    hall: "",
    address: "서울 강동구 천호대로 1102 3층 (05381)",
    naverMapUrl: "https://map.naver.com/p/search/KDW웨딩예식장",
    kakaoMapUrl: "https://map.kakao.com/?q=KDW웨딩예식장",
    tmapUrl: "https://www.tmap.co.kr",
    directions: [
      {
        icon: "subway",
        title: "지하철",
        content: "5호선 강동역 3번 출구 도보 2분(110m)",
      },
      {
        icon: "bus",
        title: "버스",
        content: "버스 정류장 이름\n버스 번호",
      },
      {
        icon: "car",
        title: "주차안내",
        content: "건물 내 400대, 건너편 200대\n총 600대 동시 주차 가능",
      },
    ],
  },
  invitation: {
    title: "소중한 분들을 초대합니다",
    message:
      "살랑이는 바람결에\n사랑이 묻어나는 계절입니다.\n\n여기 두 사람이 사랑을 맺어\n인생의 반려자가 되려 합니다.\n\n새 인생을 시작하는 이 자리에 오셔서\n축복해 주시면 감사하겠습니다.",
  },
  share: {
    kakaoJsKey: "e5ec23024e576e40f0b3735b48c6bd8b",
  },
  photos: [
    "/images/gallery/1.jpg",
    "/images/gallery/2.jpg",
    "/images/gallery/3.jpg",
    "/images/gallery/4.jpg",
    "/images/gallery/5.jpg",
    "/images/gallery/6.jpg",
    "/images/gallery/7.jpg",
    "https://picsum.photos/seed/w8/600/600",
    "https://picsum.photos/seed/w9/600/600",
    "https://picsum.photos/seed/w10/600/600",
    "https://picsum.photos/seed/w11/600/600",
    "https://picsum.photos/seed/w12/600/600",
  ],
};
