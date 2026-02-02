// gate-simulator/src/app/components/GateSimulator.js

"use client";
import React, { useState, useEffect } from 'react';
import PreExamViews from './PreExamViews';
import ExamInterface from './ExamInterface';

// Firebase will be handled conditionally
let firebaseInitialized = false;
let db = null;

try {
  // Only initialize if keys are provided
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""
  };

  // Check if any real config is provided
  const hasValidConfig = firebaseConfig.apiKey && 
                       firebaseConfig.apiKey !== "" && 
                       firebaseConfig.projectId !== "";

  if (hasValidConfig && typeof window !== 'undefined') {
    const { initializeApp } = require('firebase/app');
    const { getAuth, signInAnonymously } = require('firebase/auth');
    const { getFirestore } = require('firebase/firestore');
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    db = getFirestore(app);
    signInAnonymously(auth).catch(() => console.log("Auth skipped"));
    firebaseInitialized = true;
    console.log("Firebase initialized successfully");
  } else {
    console.log("Firebase not configured. Running in offline mode.");
  }
} catch (e) {
  console.log("Firebase initialization failed. Running in offline mode:", e.message);
}

export default function GateSimulator() {
  const [view, setView] = useState('login'); 
  const [user, setUser] = useState(null);
  
  const [config, setConfig] = useState({
    examName: 'GATE',
    year: new Date().getFullYear(),
    subject: 'Computer Science',
    set: '1',
    duration: 180
  });
  const [questions, setQuestions] = useState([]);
  const [answerKey, setAnswerKey] = useState({});
  const [resultData, setResultData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generate year options from 1987 to current year
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 1987; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  // Initialize with sample questions
  useEffect(() => {
    if (questions.length === 0) {
      const sampleQuestions = [
        { 
          id: 1, 
          section: "General Aptitude", 
          question: "What is the result of 2 + 2?", 
          type: "MCQ", 
          marks: 1, 
          options: ["3", "4", "5", "6"] 
        },
        { 
          id: 2, 
          section: "General Aptitude", 
          question: "What is the capital of France?", 
          type: "MCQ", 
          marks: 2, 
          options: ["London", "Berlin", "Paris", "Madrid"] 
        },
        { 
          id: 3, 
          section: "Technical", 
          question: "Which are programming languages? (Select all that apply)", 
          type: "MSQ", 
          marks: 2,
          options: ["HTML", "Python", "CSS", "JavaScript"] 
        },
        { 
          id: 4, 
          section: "Technical", 
          question: "Solve for x: x² = 9", 
          type: "NAT", 
          marks: 1 
        },
        { 
          id: 5, 
          section: "Technical", 
          question: "What is 5 × 5?", 
          type: "NAT", 
          marks: 2 
        }
      ];
      const sampleAnswerKey = { 
        1: "1", // B (index 1 = "4")
        2: "2", // C (index 2 = "Paris")
        3: "1,3", // B and D (Python, JavaScript)
        4: "3", // 3
        5: "25" // 25
      };
      setQuestions(sampleQuestions);
      setAnswerKey(sampleAnswerKey);
    }
  }, []);

  // Clear timer state when leaving exam
  useEffect(() => {
    return () => {
      localStorage.removeItem('gate-exam-timer');
    };
  }, []);

  // ACTIONS
  const handleLogin = (pass) => {
    setIsLoading(true);
    setTimeout(() => {
      const PASSWORDS = { "rs": "RS", "mkm": "MKM" };
      const normalizedPass = pass.trim().toLowerCase();
      
      if (PASSWORDS[normalizedPass]) {
        setUser({ name: PASSWORDS[normalizedPass] });
        setView('setup');
      } else {
        alert("Invalid Password. Please try again.");
      }
      setIsLoading(false);
    }, 100);
  };

  const handleStartExam = () => {
    if (questions.length === 0) {
      alert("Please upload questions first!");
      return;
    }
    setView('instructions');
  };

  const handleBeginTest = () => {
    setView('exam');
  };

  const handleExamSubmit = async (answers, timeTaken, qStatus) => {
    setIsLoading(true);
    
    // Calculate Score with detailed breakdown
    let totalScore = 0;
    let attempted = 0;
    let correct = 0;
    let wrong = 0;
    let oneMarkWrong = 0;
    let twoMarkWrong = 0;
    let negativeMarks = 0;
    let totalPossibleScore = 0;
    let markedForReview = 0;
    let answeredAndMarked = 0;
    
    const questionWiseResults = [];
    
    questions.forEach(q => {
      totalPossibleScore += q.marks;
      
      // Check if marked for review
      const status = qStatus[q.id];
      if (status === 3) markedForReview++;
      if (status === 4) answeredAndMarked++;
      
      const userAns = answers[q.id];
      const key = answerKey[q.id];
      
      let result = {
        id: q.id,
        section: q.section,
        type: q.type,
        marks: q.marks,
        question: q.question,
        userAnswer: userAns,
        correctAnswer: key,
        isCorrect: false,
        marksObtained: 0,
        status: 'not_attempted'
      };
      
      if (userAns !== undefined && userAns !== "" && userAns !== null) {
        attempted++;
        result.status = 'attempted';
        
        if (key !== undefined) {
          let isCorrect = false;
          
          // For MCQ
          if (q.type === 'MCQ') {
            const userAnsStr = String(userAns).trim();
            const keyStr = String(key).trim();
            const optionLetters = ['A', 'B', 'C', 'D'];
            const userLetter = optionLetters[userAns];
            
            if (userLetter === keyStr || userAnsStr === keyStr || String(parseInt(userAns) + 1) === keyStr) {
              isCorrect = true;
            }
            
            if (isCorrect) {
              totalScore += q.marks;
              correct++;
              result.isCorrect = true;
              result.marksObtained = q.marks;
              result.status = 'correct';
            } else {
              wrong++;
              if (q.marks === 1) {
                oneMarkWrong++;
                negativeMarks += 1/3;
                totalScore -= 1/3;
                result.marksObtained = -1/3;
              } else if (q.marks === 2) {
                twoMarkWrong++;
                negativeMarks += 2/3;
                totalScore -= 2/3;
                result.marksObtained = -2/3;
              }
              result.status = 'wrong';
            }
          }
          // For MSQ
          else if (q.type === 'MSQ') {
            const correctIndices = key.split(',').map(k => k.trim()).filter(k => k !== '');
            const userIndices = Array.isArray(userAns) ? userAns : [userAns];
            
            const allCorrectSelected = correctIndices.every(idx => 
              userIndices.includes(parseInt(idx))
            );
            const noIncorrectSelected = userIndices.every(idx => 
              correctIndices.includes(String(idx))
            );
            
            isCorrect = allCorrectSelected && noIncorrectSelected;
            
            if (isCorrect) {
              totalScore += q.marks;
              correct++;
              result.isCorrect = true;
              result.marksObtained = q.marks;
              result.status = 'correct';
            } else {
              wrong++;
              result.status = 'wrong';
            }
          }
          // For NAT
          else if (q.type === 'NAT') {
            const userAnsStr = String(userAns).trim();
            const keyStr = String(key).trim();
            
            if (userAnsStr === keyStr) {
              isCorrect = true;
              totalScore += q.marks;
              correct++;
              result.isCorrect = true;
              result.marksObtained = q.marks;
              result.status = 'correct';
            } else {
              wrong++;
              result.status = 'wrong';
            }
          }
        }
      }
      
      questionWiseResults.push(result);
    });
    
    // Ensure score is not negative
    totalScore = Math.max(0, totalScore);
    
    const finalResult = { 
      score: totalScore.toFixed(2),
      totalPossibleScore,
      attempted, 
      correct, 
      wrong,
      oneMarkWrong,
      twoMarkWrong,
      negativeMarks: negativeMarks.toFixed(2),
      totalQuestions: questions.length,
      percentage: ((totalScore / totalPossibleScore) * 100).toFixed(2),
      timeTaken,
      markedForReview,
      answeredAndMarked,
      questionWiseResults,
      sections: [...new Set(questions.map(q => q.section))].map(section => {
        const sectionQuestions = questions.filter(q => q.section === section);
        const sectionResults = questionWiseResults.filter(r => r.section === section);
        const sectionScore = sectionResults.reduce((sum, r) => sum + (r.marksObtained > 0 ? r.marksObtained : 0), 0);
        const sectionPossible = sectionQuestions.reduce((sum, q) => sum + q.marks, 0);
        
        return {
          name: section,
          score: sectionScore.toFixed(2),
          possible: sectionPossible,
          percentage: ((sectionScore / sectionPossible) * 100).toFixed(2),
          attempted: sectionResults.filter(r => r.status !== 'not_attempted').length,
          correct: sectionResults.filter(r => r.status === 'correct').length,
          wrong: sectionResults.filter(r => r.status === 'wrong').length
        };
      })
    };
    
    setResultData(finalResult);

    // Try to save to Firebase if available
    if (firebaseInitialized && db && user) {
      try {
        const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
        await addDoc(collection(db, "exam_results"), {
          userName: user.name,
          examDetails: config,
          result: finalResult,
          timeTaken,
          timestamp: serverTimestamp()
        });
        console.log("Results saved to Firebase");
      } catch(e) { 
        console.log("Firebase save failed:", e.message);
      }
    }

    // Switch to result view
    setView('result');
    setIsLoading(false);
  };

  // RENDER
  if (view === 'exam') {
    return (
      <ExamInterface 
        user={user} 
        config={config} 
        questions={questions} 
        onSubmit={handleExamSubmit} 
      />
    );
  }

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
      <PreExamViews 
        view={view} 
        setView={setView} 
        user={user}
        config={config}
        setConfig={setConfig}
        setQuestions={setQuestions}
        setAnswerKey={setAnswerKey}
        questionsLoaded={questions.length > 0}
        onLogin={handleLogin}
        onStart={handleStartExam}
        onBegin={handleBeginTest}
        resultData={resultData}
        isLoading={isLoading}
        yearOptions={generateYearOptions()}
      />
    </>
  );
}