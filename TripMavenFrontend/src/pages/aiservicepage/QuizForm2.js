import React, { useState, useEffect } from 'react';
import styles from '../../styles/aiservicepage/Quiz.module.css';
import { fetchData, submitAnswer } from '../../utils/Quiz';
import { useNavigate } from 'react-router-dom';
import QuizResult from './FinishQuiz';

const QuizForm = () => {
  const [data, setData] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [usedQuiz, setUsedQuiz] = useState([]);
  const [score, setScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const fetchedData = await fetchData();
        // 10개의 문제만 랜덤하게 선택
        const selectedQuizzes = getRandomQuizzes(fetchedData, 10);
        setData(selectedQuizzes);
        randomQuiz(selectedQuizzes, []);
      } catch (error) {
        console.error('에러났당', error);
      }
    };

    getData();
  }, []);
  
  // 10개의 랜덤 문제를 선택하는 함수
  const getRandomQuizzes = (quizList, numberOfQuizzes) => {
    const shuffledQuizzes = quizList.sort(() => Math.random() - 0.5);  // 퀴즈 리스트를 섞음
    return shuffledQuizzes.slice(0, numberOfQuizzes);  // 첫 10개의 문제만 반환
  };

  const randomQuiz = (quizList, usedQuiz) => {
    const availableQuiz = quizList.filter(quiz => !usedQuiz.includes(quiz.id));

    if (availableQuiz.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableQuiz.length);
      const selectQuiz = availableQuiz[randomIndex];
      setCurrentQuiz(selectQuiz);
      setUsedQuiz([...usedQuiz, selectQuiz.id]);
    } else {
      alert("모든 퀴즈를 다 풀었습니다");
      setCurrentQuiz(null);
      setIsModalOpen(true);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);  // 사용자가 옵션을 클릭할 때 선택된 옵션을 상태로 설정
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/FinishQuiz');
  };

  const handleSubmit = async () => {
    if (currentQuiz && selectedOption) {
      try {
        const isCorrect = selectedOption === currentQuiz.answer;
        await submitAnswer(currentQuiz.id, selectedOption);
        if (isCorrect) {
          setScore(prevScore => {
            const newScore = prevScore + 10;
            console.log('총점', newScore);
            return newScore;
          });
        }
        randomQuiz(data, usedQuiz);
        setSelectedOption(null);
      } catch (error) {
        console.error('에러 났당 ', error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>퀴즈 맞추기</h2>
      {currentQuiz && (
        <>
          <p className={styles.question}> {usedQuiz.length}. {currentQuiz.question}</p>
          <ul className={styles.options}>
            <li>
              <button
                className={`${styles.listItemButton} ${selectedOption === currentQuiz.options1 ? styles.selected : ''}`}
                onClick={() => handleOptionClick(currentQuiz.options1)}
              >
                {currentQuiz.options1}
              </button>
            </li>
            <li>
              <button
                className={`${styles.listItemButton} ${selectedOption === currentQuiz.options2 ? styles.selected : ''}`}
                onClick={() => handleOptionClick(currentQuiz.options2)}
              >
                {currentQuiz.options2}
              </button>
            </li>
            <li>
              <button
                className={`${styles.listItemButton} ${selectedOption === currentQuiz.options3 ? styles.selected : ''}`}
                onClick={() => handleOptionClick(currentQuiz.options3)}
              >
                {currentQuiz.options3}
              </button>
            </li>
            <li>
              <button
                className={`${styles.listItemButton} ${selectedOption === currentQuiz.options4 ? styles.selected : ''}`}
                onClick={() => handleOptionClick(currentQuiz.options4)}
              >
                {currentQuiz.options4}
              </button>
            </li>
          </ul>
          <button className={styles.submitButton} onClick={handleSubmit} disabled={!selectedOption}>
            다음
          </button>
        </>
      )}
      <QuizResult isOpen={isModalOpen} onClose={handleCloseModal} newScore={score} />
    </div>
  );
};

export default QuizForm;