import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Template.module.css";
import Chat from "./chat/Chat";
import { useEffect, useState } from "react";
import { TemplateContext } from "../context/TemplateContext";
import { fetchData, fetchedData } from "../utils/memberData";
import Loading from "../components/LoadingPage";
import mqtt from "mqtt";
import { chattingListMyData, getChattingRoom } from "../utils/chatData";
import { getNotifications, postNotification, readNotification } from "../utils/NotificationData";


//레이아웃용 컴포넌트
export default function Template() {
    //개발 편의성을 위해 하드코딩한 것임. 나중에는 로그인한 회원 role로 넣기
    const [role, setRole] = useState('');
    
    //로그인한 사용자 정보
    const [memberInfo, setMemberInfo] = useState({});

    const [isLoading, setIsLoading] = useState(true);

    const [mqttClientList, setMqttClientList] = useState([]); //mqtt 객체 리스트 상태
    const [notifications, setNotifications] = useState([]); //알림 리스트 상태
    const [waitingNotification, setWaitingNotification] = useState({}); //받은 메세지
    const location = useLocation();

    //채팅방 알림을 위한 함수
    //채팅방 알림을 위해서 상위 컴포넌트에서 채팅방 연결 관리
    const getChattingList = async () => {
        if (localStorage.getItem('token')) {
            //채팅방 리스트 불러오기
            const chattingList = await chattingListMyData(localStorage.getItem('membersId'));
            //console.log(chattingList);

            //mqtt 연결 객체 리스트
            let mqttClients = [];

            for (let joinChatting of chattingList) {
                //mqtt 연결 객체 생성, 각 객체는 각각의 채팅방 연결이 된다.
                const mqttClient = mqtt.connect('ws://121.133.84.38:1884');

                //연결 성공
                mqttClient.on('connect', () => {
                    //console.log('Connected to MQTT broker:', joinChatting.chattingRoom.id);
                });

                //연결 실패시
                mqttClient.on('error', (err) => {
                    //console.error('Connection error:', err);
                });

                //채팅방 subscribe, 즉 토픽(채팅방) 정하기
                mqttClient.subscribe(`${joinChatting.chattingRoom.id}`, (err) => {
                    if (!err) { console.log('Subscribed to topic', joinChatting.chattingRoom.id); }
                    else { console.error('Subscription error:', err); }
                });

                //메시지 수신시 아래 코드 실행
                mqttClient.on('message', async (topic, message) => {
                    console.log('Received message:', message.toString());
                    try {
                        const parsedMessage = JSON.parse(message.toString());
                        const { text, sender, timestamp } = parsedMessage;
                        
                        //자신 메세지 제외
                        if (sender == localStorage.getItem('membersId')) return;

                        //상품아이디 얻기용
                        const chattingRoom = await getChattingRoom(topic);
                        console.log(chattingRoom);

                        console.log('템플릿에서 메시지 받기:');

                        //알림 리스트에 올라가기 전에 잠깐 저장용
                        setWaitingNotification({
                            'memberId': localStorage.getItem('membersId'),
                            'content': text,
                            'createAt': timestamp,
                            'type': 'chat',
                            'link': `/bigchat/${topic}`,
                            'senderId': `${sender}`,
                            'productId':`${chattingRoom.productBoard.id}`
                        });
                    }
                    catch (error) { console.error('Error parsing message:', error); }
                });
            }
            return mqttClients; //각 채팅방 mqtt 연결객체 리스트를 반환
        }
    };

    //실제 알림나타내는 리스트를 만드는 함수임. 이게 진짜
    const getNoti = async (type) => {
        const notificationList = await getNotifications(localStorage.getItem('membersId'));
        const notiStateList = []; //새로운 리스트 만들기
        for (let noti of notificationList) { //불러온거
            if (noti.type == 'chat') { //타입이 채팅이면
                //console.log('알림 저장')
                if (notiStateList.find(ele => ele.senderId == noti.senderId && ele.link == noti.link )) { 
                    //이미 새로운리스트에 있다면 + 상품리스트까지 같아야함
                    notiStateList.forEach(ele => {
                        if (ele.senderId == noti.senderId && ele.link == noti.link) {
                            ele.content.push(noti);
                            ele.timestamp = noti.timestamp;
                        }
                    });
                }
                else {
                    notiStateList.push({ ...noti, content: [noti] });
                }
            }

        }
        type && setNotifications(notiStateList);
        return notiStateList;
    };

    //url 체크해서 추가하거나 안하거나
    const urlCheck = async ()=>{
        if(waitingNotification.link){
            if (location.pathname.includes('bigchat') && 
                location.pathname === waitingNotification.link) return;
            else {
                //console.log('알림 디비에 저장')
                const postedData = await postNotification(waitingNotification); //알림테이블(DB)에 추가하기
                //받은 메세지 알림 리스트 상태에 추가(dto 그대로 받기)
                const notiList = await getNoti(); //알림 테이블 불러오기
                setNotifications(notiList);
            }
        }
    };

    useEffect(()=>{
        const getMember = async ()=>{
            if(localStorage.getItem('token')){
                const memberData = await fetchedData(localStorage.getItem('membersId'));
                setMemberInfo(memberData);
                setRole(memberData.role);
            }
            setIsLoading(false);
        };
        getMember();

        if (localStorage.getItem('token')) {
            if (mqttClientList.length == 0) { //mqtt연결 리스트가 비어있을 경우에만(마운트시)
                const chatList = getChattingList();
                setMqttClientList(chatList); //mqtt연결 리스트 상태
                getNoti(1); //알림 상태
            }
        }

        //채팅방 들어갔을때 알림 제거용(알림 눌러서 아님)
        if (location.pathname.includes('bigchat')) {
            //채팅방 url이랑 알림 링크랑 비교해서 들어왓으면 알림 제거
            for (let noti of notifications) {
                if (noti.link == location.pathname) {
                    setNotifications(prevNotifications =>
                        prevNotifications.filter(notification => notification.link !== location.pathname)
                    );
                    readNotification(noti.content[0]);
                }
            }
        }        
    },[isLoading, location.pathname]);

    useEffect(()=>{
        //console.log('왜 url체크 함수 안됨?');
        urlCheck();
    },[waitingNotification])

    const getNotiCount = () => {
        let count = 0;
        notifications.forEach(noti => {
            if (noti.type == "chat") count = count + noti.content.length;
            else count = count + 1;
        });
        return count;
    };

    //알림 개수
    const notificationCount = getNotiCount();

    if (isLoading) {
        // 로딩 중일 때 보여줄 UI를 여기에 작성
        return <Loading />;
    }
    
    return <>
        <TemplateContext.Provider value={{ role, setRole, memberInfo, setMemberInfo, notifications, setNotifications, notificationCount}}>
            <div className={styles.body}>
                <Header />  
                <div className={styles.layout}>
                    <div className={styles.container}>
                        <Outlet />
                    </div>
                    <Chat />
                </div>
                <Footer />
            </div>
        </TemplateContext.Provider>
    </>
}
