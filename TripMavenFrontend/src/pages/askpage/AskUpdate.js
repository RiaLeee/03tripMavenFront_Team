import styles from '../../styles/askpage/AskPost.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { csGet, csPut } from '../../utils/csData';
import Loading from '../../components/LoadingPage';

const AskUpdate = () => {

    const { id } = useParams();
    const [inquiry, setInquiry] = useState(null);
    const navigate = useNavigate();
    const titleRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
      const getinquiryData = async () => {
         try {
           const fetchedData = await csGet(id); 
           console.log(fetchedData);
          setInquiry(fetchedData);

        } catch (error) {
           console.error('에러났당', error);
        }
      };
      
      getinquiryData();
    }, [id]); 

    if (!inquiry) {
        return <Loading />;  {/* 이코드 지우면 inquery.id 가져올때 오류발생할수도있음 */}
    }

    const newTitle = async () =>{
      setInquiry({...inquiry,title:titleRef.current.value})
    };
    const newContent = async () =>{
      setInquiry({...inquiry,content:contentRef.current.value})
    };


    const handleData = async() => {
        try {
            const updatedData = { title:titleRef.current.value,
                                  content:contentRef.current.value}
            await csPut(id, updatedData);
            navigate('/mypage/askall');

        } catch (error) {
            console.error('Error updating answer:', error);
        }  
    };

 
    return <>
        <div className={styles.container}>
            <h2 className={styles.title}>문의 하기(수정)</h2>

            <div className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="title" className={styles.label}>제목을 입력하세요</label>
                    <input 
                        type="text" 
                        id="title"
                        className={styles.input}
                        onChange={newTitle}
                        value={inquiry.title}
                        ref={titleRef}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="content" className={styles.label}>내용을 입력하세요</label>
                    <textarea 
                        id="content" 
                        className={styles.textarea}
                        onChange={newContent}
                        value={inquiry.content}
                        ref={contentRef}
                        />    
                </div>

                <button
                  className={styles.submitButton}
                  onClick={handleData}>수정 하기
                </button>
            </div>
        </div>
    </>
};

export default AskUpdate;
