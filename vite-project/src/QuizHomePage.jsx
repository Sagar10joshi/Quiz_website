import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './App.css';
import questions from './Questions.jsx';

function QuizHomePage() {
  const [startQuiz, setStartQuiz] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user has already taken the quiz
    const quizTaken = sessionStorage.getItem('quizTaken');
    if (quizTaken) {
      alert('You have already completed the quiz.');
      navigate('/results'); // Redirect to results page or any other page
    }
  }, [navigate]);

  const handleStartQuiz = () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert("Please log in to start the quiz.");
      navigate('/login');
      return;
    }
    setStartQuiz(true);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="quiz-container">
      {!startQuiz ? (
        <>
          <div id='btncon'>
            <button onClick={handleLogin} id='btn'>Login</button>
            <button onClick={handleRegister} id='btn2'>Register</button>
          </div>

          <header className="quiz-header">
            <h1>Welcome to the Quiz Challenge!</h1>
          </header>
          <section className="quiz-instructions">
            <h2>Instructions</h2>
            <ul>
              <li>This quiz consists of {questions.length} questions.</li>
              <li>You have 15 minutes to complete the quiz.</li>
              <li>Each question has 4 options, but only one is correct.</li>
              <li>For each correct answer, you earn 10 points.</li>
              <li>No negative marking for incorrect answers.</li>
            </ul>
          </section>
          <button className="start-button" onClick={handleStartQuiz}>
            Start Quiz
          </button>
        </>
      ) : (
        <Quiz questions={questions} />
      )}
    </div>
  );
}

function Quiz({ questions }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [intervalId, setIntervalId] = useState(null);
  const [quizEnded, setQuizEnded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimer(30); // Reset timer
    startTimer();
  }, [currentQuestionIndex]);

  const startTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }

    const id = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime === 1) {
          clearInterval(id);
          handleAnswer(""); // Automatically skip the question when timer reaches 0
          return 30; // Reset timer for the next question
        }
        return prevTime - 1;
      });
    }, 1000);

    setIntervalId(id);
  };

  const handleAnswer = (selectedOption) => {
    if (selectedOption === questions[currentQuestionIndex].answer) {
      setScore(score + 10);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleEndTest = async () => {
    try {

      const token = sessionStorage.getItem('token'); // Fetch the token
      // POST the score to your backend
      const response = await fetch('http://localhost:5000/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token
        },
        body: JSON.stringify({ score }),
      });

      if (!response.ok) {
        throw new Error('Failed to save score');
      }

      // Set the quizTaken flag in sessionStorage to prevent multiple attempts
      sessionStorage.setItem('quizTaken', 'true');

      // Handle successful POST request
      const result = await response.json(); // You can handle the result if needed
      alert(`Test Ended! Check mail for final score`);

      // Navigate to the results page with the score (optional, can be in query params or state)
      navigate('/results', { state: { score } });

      setQuizEnded(true);
    } catch (error) {
      console.error('Error saving score:', error);
      alert('An error occurred while saving your score. Please try again.');
    }
  };

  return (
    <div className="quiz">
      <h2>{questions[currentQuestionIndex].question}</h2>
      <p>Time Remaining: {timer}s</p>
      <ul>
        {questions[currentQuestionIndex].options.map((option, index) => (
          <li key={index} onClick={() => handleAnswer(option)}>{option}</li>
        ))}
      </ul>
      <div className="navigation-buttons">
        {currentQuestionIndex === questions.length - 1 ? (
          <button onClick={handleEndTest} disabled={quizEnded}>End Test</button>
        ) : (
          <button onClick={() => handleAnswer("")}>Next</button>
        )}
      </div>
    </div>
  );
}

export default QuizHomePage;
































// import { useNavigate } from 'react-router-dom';
// import React, { useState, useEffect } from 'react';
// import './App.css';
// import questions from './Questions.jsx';

// function QuizHomePage() {
//   const [startQuiz, setStartQuiz] = useState(false);
//   const navigate = useNavigate();

//   const handleStartQuiz = () => {
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       alert("Please log in to start the quiz.");
//       navigate('/login');
//       return;
//     }
//     setStartQuiz(true);
//   };

//   const handleLogin = () => {
//     navigate('/login');
//   };

//   const handleRegister = () => {
//     navigate('/register');
//   };

//   return (
//     <div className="quiz-container">
//       {!startQuiz ? (
//         <>
//           <div id='btncon'>
//             <button onClick={handleLogin} id='btn'>Login</button>
//             <button onClick={handleRegister} id='btn2'>Register</button>
//           </div>

//           <header className="quiz-header">
//             <h1>Welcome to the Quiz Challenge!</h1>
//           </header>
//           <section className="quiz-instructions">
//             <h2>Instructions</h2>
//             <ul>
//               <li>This quiz consists of {questions.length} questions.</li>
//               <li>You have 15 minutes to complete the quiz.</li>
//               <li>Each question has 4 options, but only one is correct.</li>
//               <li>For each correct answer, you earn 10 points.</li>
//               <li>No negative marking for incorrect answers.</li>
//             </ul>
//           </section>
//           <button className="start-button" onClick={handleStartQuiz}>
//             Start Quiz
//           </button>
//         </>
//       ) : (
//         <Quiz questions={questions} />
//       )}
//     </div>
//   );
// }

// function Quiz({ questions }) {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [score, setScore] = useState(0);
//   const [timer, setTimer] = useState(30); // Timer state
//   const [intervalId, setIntervalId] = useState(null); // Track the interval ID for cleanup
//   const [quizEnded, setQuizEnded] = useState(false); // Track if the quiz is finished

//   // Reset the timer every time the question changes
//   useEffect(() => {
//     setTimer(30); // Reset the timer for the new question
//     startTimer(); // Start the timer for the new question
//   }, [currentQuestionIndex]);

//   const startTimer = () => {
//     // Clear any previous interval
//     if (intervalId) {
//       clearInterval(intervalId);
//     }

//     const id = setInterval(() => {
//       setTimer((prevTime) => {
//         if (prevTime === 1) {
//           clearInterval(id); // Stop the timer when it reaches 0
//           handleAnswer(""); // Automatically skip the question
//           return 30; // Reset the timer for the next question
//         }
//         return prevTime - 1;
//       });
//     }, 1000);

//     setIntervalId(id); // Store the interval ID for cleanup
//   };

//   const handleAnswer = (selectedOption) => {
//     if (selectedOption === questions[currentQuestionIndex].answer) {
//       setScore(score + 10);
//     }

//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1); // Move to the next question
//     }
//     // Do not change currentQuestionIndex if it's the last question; wait for "End Test"
//   };

//     // We are applying timer in each question that is why we are removing the previous button
//     // const handlePrevious = () => {
//     //   if (currentQuestionIndex > 0) {
//     //     setCurrentQuestionIndex(currentQuestionIndex - 1);
//     //   }
//     // };

//     const handleEndTest = async () => {
//       try {
//         // POST the score to your backend
//         const response = await fetch('/api/save-score', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ score }), // Send score as JSON payload
//         });
  
//         if (!response.ok) {
//           throw new Error('Failed to save score');
//         }
  
//         // Handle successful POST request
//         const result = await response.json(); // You can handle the result if needed
//         alert(`Test Ended! Your final score is: ${score}`);
  
//         // Navigate to the results page with the score (optional, can be in query params or state)
//         navigate('/results', { state: { score } });
  
//         setQuizEnded(true); // Mark the quiz as ended
//       } catch (error) {
//         console.error('Error saving score:', error);
//         alert('An error occurred while saving your score. Please try again.');
//       }
//     };

//   return (
//     <div className="quiz">
//       <h2>{questions[currentQuestionIndex].question}</h2>
//       <p>Time Remaining: {timer}s</p> {/* Display the timer */}
//       <ul>
//         {questions[currentQuestionIndex].options.map((option, index) => (
//           <li key={index} onClick={() => handleAnswer(option)}>{option}</li>
//         ))}
//       </ul>
//       <div className="navigation-buttons">
//         {/* <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>Previous</button> */}
//         {currentQuestionIndex === questions.length - 1 ? (
//           <button onClick={handleEndTest} disabled={quizEnded}>End Test</button>
//         ) : (
//           <button onClick={() => handleAnswer("")}>Next</button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default QuizHomePage;















































































// import { useNavigate } from 'react-router-dom';
// import React, { useState, useEffect } from 'react';
// import './App.css';
// import questions from './Questions.jsx';

// function QuizHomePage() {
//   const [startQuiz, setStartQuiz] = useState(false);
//   const navigate = useNavigate();

//   const handleStartQuiz = () => {
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       alert("Please log in to start the quiz.");
//       navigate('/login');
//       return;
//     }
//     setStartQuiz(true);
//   };

//   const handleLogin = () => {
//     navigate('/login');
//   };

//   const handleRegister = () => {
//     navigate('/register');
//   };

//   return (
//     <div className="quiz-container">
//       {!startQuiz ? (
//         <>
//           <div id='btncon'>
//             <button onClick={handleLogin} id='btn'>Login</button>
//             <button onClick={handleRegister} id='btn2'>Register</button>
//           </div>

//           <header className="quiz-header">
//             <h1>Welcome to the Quiz Challenge!</h1>
//           </header>
//           <section className="quiz-instructions">
//             <h2>Instructions</h2>
//             <ul>
//               <li>This quiz consists of {questions.length} questions.</li>
//               <li>You have 15 minutes to complete the quiz.</li>
//               <li>Each question has 4 options, but only one is correct.</li>
//               <li>For each correct answer, you earn 10 points.</li>
//               <li>No negative marking for incorrect answers.</li>
//             </ul>
//           </section>
//           <button className="start-button" onClick={handleStartQuiz}>
//             Start Quiz
//           </button>
//         </>
//       ) : (
//         <Quiz questions={questions} />
//       )}
//     </div>
//   );
// }

// function Quiz({ questions }) {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [score, setScore] = useState(0);
//   const [timer, setTimer] = useState(30); // Timer state
//   const [intervalId, setIntervalId] = useState(null); // Track the interval ID for cleanup

//   // Reset the timer every time the question changes
//   useEffect(() => {
//     setTimer(30); // Reset the timer for the new question
//     startTimer(); // Start the timer for the new question
//   }, [currentQuestionIndex]);

//   const startTimer = () => {
//     // Clear any previous interval
//     if (intervalId) {
//       clearInterval(intervalId);
//     }

//     const id = setInterval(() => {
//       setTimer((prevTime) => {
//         if (prevTime === 1) {
//           clearInterval(id); // Stop the timer when it reaches 0
//           handleAnswer(""); // Automatically skip the question
//           return 30; // Reset the timer for the next question
//         }
//         return prevTime - 1;
//       });
//     }, 1000);

//     setIntervalId(id); // Store the interval ID for cleanup
//   };

//   const handleAnswer = (selectedOption) => {
//     if (selectedOption === questions[currentQuestionIndex].answer) {
//       setScore(score + 10);
//     }

//     const nextQuestion = currentQuestionIndex + 1;
//     if (nextQuestion < questions.length) {
//       setCurrentQuestionIndex(nextQuestion); // Move to the next question
//     } else {
//       alert(`Quiz finished! Your final score is: ${score + (selectedOption === questions[currentQuestionIndex].answer ? 10 : 0)}`);
//       setCurrentQuestionIndex(0);
//       setScore(0);
//     }
//   };


//   // We are applying timer in each question that is why we are removing the previous button
//   // const handlePrevious = () => {
//   //   if (currentQuestionIndex > 0) {
//   //     setCurrentQuestionIndex(currentQuestionIndex - 1);
//   //   }
//   // };

//   const handleEndTest = () => {
//     alert(`Test Ended! Your final score is: ${score}`);
//     setCurrentQuestionIndex(0);
//     setScore(0);
//   };

//   return (
//     <div className="quiz">
//       <h2>{questions[currentQuestionIndex].question}</h2>
//       <p>Time Remaining: {timer}s</p> {/* Display the timer */}
//       <ul>
//         {questions[currentQuestionIndex].options.map((option, index) => (
//           <li key={index} onClick={() => handleAnswer(option)}>{option}</li>
//         ))}
//       </ul>
//       <div className="navigation-buttons">
//         {/* <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>Previous</button> */}
//         {currentQuestionIndex === questions.length - 1 ? (
//           <button onClick={handleEndTest}>End Test</button>
//         ) : (
//           <button onClick={() => handleAnswer("")}>Next</button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default QuizHomePage;


































































































































































// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import React, { useState, useEffect } from 'react';
// import './App.css'// Import styles for styling
// import LoginPage from './Login'; 
// const questions = [
//     {
//         question: "1 : What is the capital of France?",
//         options: ["Berlin", "Madrid", "Paris", "Lisbon"],
//         answer: "Paris"
//     },
//     {
//         question: "2 : Which planet is known as the Red Planet?",
//         options: ["Earth", "Mars", "Jupiter", "Saturn"],
//         answer: "Mars"
//     },
//     {
//         question: "3 : Who wrote 'Hamlet'?",
//         options: ["Charles Dickens", "Mark Twain", "William Shakespeare", "J.K. Rowling"],
//         answer: "William Shakespeare"
//     }
//     // Add more questions as needed
// ];

// function QuizHomePage() {
//     const [startQuiz, setStartQuiz] = useState(false);
//     const navigate = useNavigate(); // Correctly defined here

//     // useEffect(() => {
//     //     const token = sessionStorage.getItem('token');
//     //     if (!token) {
//     //         alert("Please log in to start the quiz.");
//     //         navigate('/login'); // Redirect to login if not authenticated
//     //     }
//     // }, [navigate]);

//     const handleStartQuiz = () => {
//         const token = sessionStorage.getItem('token'); // Check for token
//         if (!token) {
//             alert("Please log in to start the quiz."); // Alert if not logged in
//             navigate('/login'); // Redirect to login
//             return; // Exit the function
//         }
//         setStartQuiz(true); // Start the quiz only if logged in
//     };

//     const handleLogin = () => {
//         navigate('/login'); // Navigate to login page
//     };

//     const handleRegister = () => {
//         navigate('/register'); // Navigate to register page
//     };

//     return (
//         <div className="quiz-container">
//             {!startQuiz ? (
//                  <>
//                       <div id='btncon'>
//                          <button onClick={handleLogin} id='btn'>Login</button>
//                          <button onClick={handleRegister} id='btn2'>Register</button>
//                     </div> 

//                     <header className="quiz-header">
//                         <h1>Welcome to the Quiz Challenge!</h1>
                        
//                     </header>
//                     <section className="quiz-instructions">
//                         <h2>Instructions</h2>
//                         <ul>
//                             <li>This quiz consists of {questions.length} questions.</li>
//                             <li>You have 15 minutes to complete the quiz.</li>
//                             <li>Each question has 4 options, but only one is correct.</li>
//                             <li>For each correct answer, you earn 10 points.</li>
//                             <li>No negative marking for incorrect answers.</li>
//                         </ul>
//                     </section>
//                     <button className="start-button" onClick={handleStartQuiz}>
//                         Start Quiz
//                     </button>
//                 </>
//             ) : (
//                 <Quiz questions={questions} />
//             )}
//         </div>
//     );
// }

// function Quiz({ questions }) {
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [score, setScore] = useState(0);

//     const handleAnswer = (selectedOption) => {
//         if (selectedOption === questions[currentQuestionIndex].answer) {
//             setScore(score + 10);
//         }
//         const nextQuestion = currentQuestionIndex + 1;
//         if (nextQuestion < questions.length) {
//             setCurrentQuestionIndex(nextQuestion);
//         } else {
//             //
//             alert(`Quiz finished! Your final score is: ${score + (selectedOption === questions[currentQuestionIndex].answer ? 10 : 0)}`);
//             // Optionally reset the quiz or redirect to a different page
//             setCurrentQuestionIndex(0); // Reset index for the next attempt
//             setScore(0); // Reset score for the next attempt
//         }
//     };

//     const handlePrevious = () => {
//         if (currentQuestionIndex > 0) {
//             setCurrentQuestionIndex(currentQuestionIndex - 1);
//         }
//     };

//     return (
//         <div className="quiz">
//             <h2>{questions[currentQuestionIndex].question}</h2>
//             <ul>
//                 {questions[currentQuestionIndex].options.map((option, index) => (
//                     <li key={index} onClick={() => handleAnswer(option)}>{option}</li>
//                 ))}
//             </ul>
//             <div className="navigation-buttons">
//                 <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>Previous</button>
//                 <button onClick={() => handleAnswer("")}>Next</button>
//             </div>
//         </div>
//     );
// }

// export default QuizHomePage;














// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const QuizPage = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         // Check if the user is logged in (e.g., check session or token)
//         const token = sessionStorage.getItem('token');
//         if (!token) {
//             navigate('/login'); // Redirect to login if not authenticated
//         } else {
//             setIsLoggedIn(true);
//         }
//     }, [navigate]);

//     return (
//         <div>
//             {isLoggedIn ? (
//                 <h1>Welcome to the Quiz</h1>
//             ) : (
//                 <h1>Please log in to access the quiz.</h1>
//             )}
//         </div>
//     );
// };

// export default QuizPage;
