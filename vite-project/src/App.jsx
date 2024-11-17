// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import QuizHomePage from './QuizHomePage'; // Your quiz component
import LoginPage from './Login'; // Your login component
import RegistrationPage from './Register'
import OTPVerification from './Otp';
import FeedbackPage from './Feedback'
function App() {
    return (
            <Routes>
                <Route path="/" element={<QuizHomePage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/otp" element={<OTPVerification />} />
                <Route path="/results" element={<FeedbackPage />} />
            </Routes>
    );
}

export default App;


// return (
//     <Router>
//         <Routes>
//             <Route path="/" element={<QuizHomePage />} />
//             <Route path="/register" element={<RegistrationPage />} />
//             <Route path="/login" element={<LoginPage />} />
//             <Route path="/otp" element={<OTPVerification />} />
//         </Routes>
//     </Router>
// );









//   //let value = 0

//   let [value , setvalue] = useState(0)

//   const addLike = ()=>{
//     value = value+1
//     setvalue(value)
//   }

//   const decLike = ()=>{
//     value = value-1
//     setvalue(value)
//   }

//   return (
//     <>
//     <h2>Likes : {value}</h2>
//     <button onClick={addLike}>
//       Like 
//     </button>
//     <br />
//     <br />
//     <button onClick={decLike}>
//       Dislike
//     </button>
//     </>
  
//   )
// }


