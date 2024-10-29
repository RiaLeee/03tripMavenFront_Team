import React from 'react';
import styles from '../../styles/infopage/TermsService.module.css';

const TermsOfService = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>이용약관</h1>

      <div className={styles.section}>
        <h2 className={styles.subheading}>개인정보처리방침</h2>

        <h3 className={styles.subheading}>개인정보처리방침의 의의</h3>
        <p className={styles.paragraph}>
          트립메이븐은 본 개인정보처리방침은 개인정보보호법을 기준으로 작성하되, 트립메이븐 내에서의 이용자 개인정보 처리 현황을 최대한 알기 쉽고 상세하게 설명하기 위해 노력하였습니다.
        </p>
        <ul className={styles.list}>
          <p className={styles.listParagraph}>개인정보처리방침은 다음과 같은 중요한 의미를 가지고 있습니다.</p>
          <li className={styles.listItem}>
            트립메이븐이 어떤 정보를 수집하고, 수집한 정보를 어떻게 사용하며, 필요에 따라 누구와 이를 공유('위탁 또는 제공')하며, 이용 목적을 달성한 정보를 언제 어떻게 파기하는지 등 정보를 투명하게 제공합니다.
          </li>
          <li className={styles.listItem}>
            정보주체로서 이용자는 자신의 개인정보에 대해 어떤 권리를 가지고 있으며, 이를 어떤 방법과 절차로 행사할 수 있는지를 알려드립니다.
          </li>
          <li className={styles.listItem}>
            개인정보 침해사고가 발생하는 경우, 추가적인 피해를 예방하고 이미 발생한 피해를 복구하기 위해 누구에게 연락하여 어떤 도움을 받을 수 있는지 알려드립니다.
          </li>
        </ul>

        <h3 className={styles.subheading}>수집하는 개인정보</h3>
        <p className={styles.paragraph}>
          이용자는 회원가입을 하지 않아도 정보 검색, 지역 뉴스 등 트립메이븐 서비스를 회원과 동일하게 이용할 수 있습니다.
        </p>
        <p className={`${styles.paragraph} ${styles.bold}`}>
          회원가입 시점에 트립메이븐이 이용자로부터 수집하는 개인정보는 아래와 같습니다.
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            회원 가입 시 필수 항목으로 이메일, 이름, 비밀번호, 휴대전화번호를 수집합니다.
          </li>
          <li className={styles.listItem}>
            필수 항목이 아닌 경우 마이프로필에서 입력 및 수정이 가능합니다.
          </li>
          <p className={`${styles.listParagraph} ${styles.bold}`}>
            서비스 이용 과정에서 이용자로부터 수집하는 개인정보는 아래와 같습니다.
          </p>
          <li className={styles.listItem}>
            회원정보 또는 개별 서비스에서 프로필 정보(닉네임, 프로필 사진)을 설정할 수 있습니다.
          </li>
          <p className={`${styles.listParagraph} ${styles.bold}`}>
            트립메이븐은 아래의 방법을 통해 개인정보를 수집합니다.
          </p>
          <li className={styles.listItem}>
            회원가입 및 서비스 이용 과정에서 이용자가 개인정보 수집에 대해 동의를 하고 직접 정보를 입력하는 경우, 해당 개인정보를 수집합니다.
          </li>
          <li className={styles.listItem}>
            고객센터를 통한 상담 과정에서 메일, 전화 등을 통해 이용자의 개인정보가 수집될 수 있습니다.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h3 className={styles.subheading}>수집한 개인정보의 이용</h3>
        <p className={styles.paragraph}>
          일반 고객 및 가이드 관련 서비스의 회원 관리, 서비스 개발, 제공 및 향상, 안전한 이용 환경 구축 등 아래의 목적으로만 개인정보를 이용합니다.
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            유료 서비스 제공에 따르는 본인인증, 구매 및 요금 결제, 상품 및 서비스의 배송을 위하여 개인정보를 이용합니다.
          </li>
          <li className={styles.listItem}>
            회원 가입 의사의 확인, 이용자 식별, 회원탈퇴 의사의 확인 등 회원 관리를 위하여 개인정보를 이용합니다.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h3 className={styles.subheading}>개인정보의 파기</h3>
        <p className={styles.paragraph}>
          트립메이븐은 원칙적으로 이용자의 개인정보를 회원 탈퇴 또는 이용 목적 달성 시 지체없이 파기하고 있습니다.
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            단, 이용자에게 개인정보 보관기간에 대해 별도의 동의를 얻은 경우, 또는 법령에서 일정 기간 정보보관 의무를 부과하는 경우에는 해당 기간 동안 개인정보를 안전하게 보관합니다.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TermsOfService;
