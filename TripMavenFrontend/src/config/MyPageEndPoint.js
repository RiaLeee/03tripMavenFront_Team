export const menuData = {
    ADMIN: [
        { name: "내 정보 관리", path: `/mypage/${localStorage.getItem('membersId')}`},
        { name: "회원 목록", path: "/mypage/admin/memberlist" },
        { name: "1:1문의 내역", path: "/mypage/askall" },
        { name: "신고 내역", path: "/mypage/admin/report" }
    ],
    GUIDE: [
        { name: "내 정보 관리", path: `/mypage/${localStorage.getItem('membersId')}` },
        { name: "내 게시물 관리", path: "/mypage/guide/post" },
        { name: "1:1문의 내역", path: "/mypage/askall" },
        { name: "채팅방", path: "/bigchat/0" },
        { name: "AI 서비스", path: "/mypage/guide/aiservice" },
    ],
    USER: [
        { name: "내 정보 관리", path: `/mypage/${localStorage.getItem('membersId')}` },
        { name: "이용후기", path: "/userreview" },
        { name: "1:1문의 내역", path: "/mypage/askall" },
        { name: "찜 목록", path: "/userlike" },
        { name: "채팅방", path: "/bigchat/0" },
    ]
};
