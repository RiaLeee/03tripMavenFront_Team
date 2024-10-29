import { Outlet } from "react-router-dom";
import styles from '../../styles/csboard/CSBoard.module.css';
import { useState } from "react";

//레이아웃용 컴포넌트
export default function CSBoard(){

    const [open, setOpen] = useState(Array(5).fill(false));    
    const toggleFAQ = (index) => {
        const newOpen = [...open];
        newOpen[index] = !newOpen[index];
        setOpen(newOpen);
    };

    return <>
        <div className={styles.container}>
            <Outlet/>
            <h1>FAQ <span>자주 묻는 질문</span></h1>
            <div className={styles.faq}>
                <h1>FAQ <span>자주 묻는 질문</span></h1>
                <div className={styles.faqCategories}>
                    <span>서비스 소개</span>
                    <span>이용 방법</span>
                    <span>결제</span>
                    <span>서비스 소개</span>
                    <span>서비스 소개</span>
                </div>
                <div className={styles.faqList}>
                    {open.map((isOpen, index) => (
                        <div className={styles.faqItem} key={index}>
                            <div className={styles.faqQuestion} onClick={() => toggleFAQ(index)}>
                                이용 방법이 궁금한가요?
                                <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
                            </div>
                            {isOpen && (
                                <div className={styles.faqAnswer}>
                                    여기에 답변 내용이 들어갑니다.
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <button className={styles.inquiryButton}>문의 하기</button>
            </div>
        </div>
    </>
}
