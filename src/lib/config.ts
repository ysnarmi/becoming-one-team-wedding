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
      { bank: "신한은행", number: "110-534-778367", holder: "곡원성" },
      { bank: "농협은행", number: "302-1449-6672-31", holder: "김우영" },
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
    hour: 11,
    minute: 0,
    dayName: "토요일",
    displayTime: "오전 11시",
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
        content:
          "서울 5호선 강동역 하차 - 3번출구 바로 앞\n※토,일요일 결혼식은 지하철 5호선 강동역을 이용해주세요.",
      },
      {
        icon: "bus",
        title: "버스 (강동역 하차)",
        content:
          "간선버스(파랑): 130, 341, 342, 370\n지선버스(초록): 3214, 3316\n직행버스(빨강): 1113, 1113-1\n일반버스(초록): 1-4, 30-3, 112-1, 112-5\n공항버스: 6200 (길동사거리 하차)",
      },
      {
        icon: "car",
        title: "자가용",
        content:
          "주차장 안내: 건물내(지하 1층~지하 3층), 옥외 주차장 및 지하철 환승 주차장 이용\n네비게이션: \"KDW웨딩\" 또는 \"서울시 강동구 천호대로 1102\" 입력",
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
    "/images/gallery/5.jpg",
    "/images/gallery/6.jpg",
    "/images/gallery/7.jpg",
    "/images/gallery/2.jpg",
    "/images/gallery/3.jpg",
    "/images/gallery/4.jpg",
    "/images/gallery/8.jpg",
    "/images/gallery/9.jpg",
    "/images/gallery/10.jpg",
    "/images/gallery/11.jpg",
    "/images/gallery/12.jpg",
    "/images/gallery/13.jpg",
    "/images/gallery/14.jpg",
    "/images/gallery/15.jpg",
    "/images/gallery/16.jpg",
  ],
};
