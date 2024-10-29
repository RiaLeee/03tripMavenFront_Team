import React, { useEffect, useState } from 'react';
import styles from '../../styles/report/ComplaintModal.module.css';
import { reportPost } from '../../utils/reportData';
import Loading from '../../components/LoadingPage';

const ComplaintModal = ({ onClose, isReport, post, where }) => {
  // 평가항목 state
  const [attitude, setAttitude] = useState(null);
  const [information, setInformation] = useState(null);
  const [disgust, setDisgust] = useState(null);
  const [offensive, setOffensive] = useState(null);
  const [noShow, setNoShow] = useState(null);
  const [additionalComments, setAdditionalComments] = useState('');
  const [reportData, setReportData] = useState(null);
  const membersId = localStorage.getItem('membersId');

  console.log(isReport)
  console.log(where)

  useEffect(() => {

    if (!where && isReport[0]) {
      const data = Object.values(isReport[1]).filter(item => item.member.id == membersId)[0];
      setReportData(data);
      setAttitude(data.attitude || null);
      setInformation(data.information || null);
      setDisgust(data.disgust || null);
      setOffensive(data.offensive || null);
      setNoShow(data.noShow || null);
      setAdditionalComments(data.etc || '');
    }
    if (where == 'report') {
      setReportData(isReport[1])
      setAttitude(isReport[1].attitude || null);
      setInformation(isReport[1].information || null);
      setDisgust(isReport[1].disgust || null);
      setOffensive(isReport[1].offensive || null);
      setNoShow(isReport[1].noShow || null);
      setAdditionalComments(isReport[1].etc || '');
    }
  })

  console.log(reportData)
  const handleReasonChange = (event) => {
    const { value } = event.target;
    switch (value) {
      case '불친절한 태도':
        setAttitude((prev) => (prev === null ? value : null));
        break;
      case '부정확한 정보':
        setInformation((prev) => (prev === null ? value : null));
        break;
      case '혐오 발언':
        setDisgust((prev) => (prev === null ? value : null));
        break;
      case '공격적인 언어 사용':
        setOffensive((prev) => (prev === null ? value : null));
        break;
      case '예약 불이행':
        setNoShow((prev) => (prev === null ? value : null));
        break;
      default:
        break;
    }
  };

  const handleCommentsChange = (event) => {
    setAdditionalComments(event.target.value);
  };

  // 신고하기
  const handleSubmit = async () => {
    if(!localStorage.getItem('token')){
      alert('로그인 후 이용해주세요.')
      return;
    }
    const confirmed = window.confirm('정말 신고하시겠습니까?');
    if (confirmed) {
      // Using the value for selected reasons, null for unselected
      const complaintData = {
        member_id: membersId,
        productboard_id: post.id, // Use complaintId here
        attitude: attitude,
        information: information,
        disgust: disgust,
        offensive: offensive,
        noShow: noShow,
        etc: additionalComments,
      };

      await reportPost(complaintData);

      window.alert('신고가 완료되었습니다.');
      onClose();
    } else {
      onClose();
    }
  };

  if (!post || !post.member) {
    return <Loading />
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Complaint</h2>
        <p className={styles.subtitle}>
          {reportData ? (
            <>
              <strong>{post.member.name}</strong> 신고내역
            </>
          ) : (
            <>
              <strong>{post.member.name}</strong> 님을 신고하시겠습니까?
            </>
          )}
        </p>
        <div className={styles.checkboxContainer}>
          <label>
            <input type="checkbox" name="reason" value="불친절한 태도"
              onChange={handleReasonChange}
              checked={attitude !== null} />
            불친절한 태도
          </label>
          <label>
            <input type="checkbox" name="reason" value="부정확한 정보"
              onChange={handleReasonChange}
              checked={information !== null} />
            부정확한 정보
          </label>
          <label>
            <input type="checkbox" name="reason" value="혐오 발언"
              onChange={handleReasonChange}
              checked={disgust !== null} />
            혐오 발언
          </label>
          <label>
            <input type="checkbox" name="reason" value="공격적인 언어 사용"
              onChange={handleReasonChange}
              checked={offensive !== null} />
            공격적인 언어 사용
          </label>
          <label>
            <input type="checkbox" name="reason" value="예약 불이행"
              onChange={handleReasonChange}
              checked={noShow !== null} />
            예약 불이행
          </label>
        </div>
        <textarea
          className={styles.comments}
          placeholder="추가 의견을 입력하세요"
          value={additionalComments}
          onChange={handleCommentsChange}
        />
        {!reportData &&
          <button className={styles.submitButton} onClick={handleSubmit}>
            신고하기
          </button>}
        <button className={styles.closeButton} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default ComplaintModal;
