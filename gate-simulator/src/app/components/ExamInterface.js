// gate-simulator/src/app/components/ExamInterface.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  User, FileText, Check, X, ChevronLeft, ChevronRight, Menu, 
  Clock, BookOpen, AlertCircle, Info, Award, BarChart3,
  Pause, Play, Download, Printer
} from 'lucide-react';

const STATUS = {
  NOT_VISITED: 0,
  NOT_ANSWERED: 1,
  ANSWERED: 2,
  MARKED_FOR_REVIEW: 3,
  ANS_MARKED_FOR_REVIEW: 4
};

// Custom Notification Component
const Notification = ({ message, type = 'info', onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose(), 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  }[type];

  const iconColor = {
    info: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  }[type];

  const Icon = {
    info: Info,
    success: Check,
    warning: AlertCircle,
    error: X
  }[type];

  if (!visible) return null;

  return (
    <div className={`fixed top-4 right-4 z-[100] p-3 rounded-lg border ${bgColor} shadow-lg transition-all duration-200 animate-slideIn max-w-sm`}>
      <div className="flex items-start space-x-3">
        <Icon size={20} className={`${iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button 
          onClick={() => { setVisible(false); onClose(); }} 
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Custom Confirm Modal Component
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = 'info' }) => {
  if (!isOpen) return null;
  
  const iconColor = {
    info: 'text-blue-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    success: 'text-green-600'
  }[type];

  const Icon = {
    info: Info,
    warning: AlertCircle,
    danger: X,
    success: Check
  }[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all duration-150 scale-100">
        <div className="flex items-start space-x-4 mb-4">
          <div className={`${iconColor} flex-shrink-0`}>
            <Icon size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <div className="text-gray-600 whitespace-pre-line">{message}</div>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-medium transition-colors active:scale-95"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 font-medium rounded transition-colors active:scale-95 ${
              type === 'danger' 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : type === 'success'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Question Paper Modal Component
const QuestionPaperModal = ({ isOpen, onClose, questions, answers, qStatus, user, config }) => {
  const sections = [...new Set(questions.map(q => q.section))];
  const [selectedSection, setSelectedSection] = useState(sections[0] || '');

  if (!isOpen) return null;

  const sectionQuestions = questions.filter(q => q.section === selectedSection);

  const getStatusIcon = (status) => {
    switch(status) {
      case STATUS.ANSWERED: return <div className="w-3 h-3 bg-green-500 rounded-sm"></div>;
      case STATUS.NOT_ANSWERED: return <div className="w-3 h-3 bg-red-500 rounded-sm"></div>;
      case STATUS.MARKED_FOR_REVIEW: return <div className="w-3 h-3 bg-purple-500 rounded-full"></div>;
      case STATUS.ANS_MARKED_FOR_REVIEW: return <div className="relative w-3 h-3 bg-purple-500 rounded-full"><div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white"></div></div>;
      default: return <div className="w-3 h-3 bg-gray-300 border border-gray-400 rounded-sm"></div>;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const paperData = {
      examDetails: config,
      user: user.name,
      timestamp: new Date().toISOString(),
      questions: questions.map(q => ({
        id: q.id,
        section: q.section,
        question: q.question,
        type: q.type,
        marks: q.marks,
        options: q.options,
        userAnswer: answers[q.id],
        status: qStatus[q.id],
        correctAnswer: ''
      }))
    };

    const dataStr = JSON.stringify(paperData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GATE_${config.year}_${config.subject}_Attempted_Paper.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-fadeIn print:bg-white print:p-0">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[80vh] flex flex-col print:h-auto print:shadow-none print:rounded-none">
        <div className="flex items-center justify-between p-4 border-b print:block print:text-center">
          <div className="print:hidden">
            <h3 className="text-xl font-bold text-gray-900">Question Paper</h3>
            <p className="text-sm text-gray-600">GATE {config.year} - {config.subject}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleDownload}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded flex items-center space-x-1 transition-colors"
            >
              <Download size={14} />
              <span>Download</span>
            </button>
            <button 
              onClick={handlePrint}
              className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded flex items-center space-x-1 transition-colors"
            >
              <Printer size={14} />
              <span>Print</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors print:hidden"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="flex border-b print:hidden">
          {sections.map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-6 py-3 font-medium text-sm transition-colors ${selectedSection === sec ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {sec}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {/* Print Header */}
          <div className="hidden print:block mb-6 text-center border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-900">GATE {config.year} - {config.subject}</h1>
            <p className="text-gray-600">Question Paper with Attempted Answers</p>
            <p className="text-sm text-gray-500">Candidate: {user.name} | Date: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sectionQuestions.map((q, idx) => {
              const status = qStatus[q.id] || STATUS.NOT_VISITED;
              const userAnswer = answers[q.id];
              const globalIdx = questions.findIndex(qq => qq.id === q.id) + 1;
              
              return (
                <div key={q.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow print:break-inside-avoid">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="font-bold text-lg text-blue-700">Q{globalIdx}</div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(status)}
                        <span className="text-xs font-medium text-gray-600">
                          {status === STATUS.ANSWERED ? 'Answered' : 
                           status === STATUS.NOT_ANSWERED ? 'Not Answered' : 
                           status === STATUS.MARKED_FOR_REVIEW ? 'Marked' : 
                           status === STATUS.ANS_MARKED_FOR_REVIEW ? 'Answered & Marked' : 
                           'Not Visited'}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs font-semibold px-2 py-1 rounded bg-gray-100">
                      {q.type} • {q.marks} Mark{q.marks > 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <p className="text-gray-800 mb-3 line-clamp-3">{q.question}</p>
                  
                  {q.type === 'MCQ' && q.options && (
                    <div className="space-y-2 text-sm">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className={`flex items-center space-x-2 p-2 rounded ${userAnswer === optIdx ? 'bg-blue-50 border border-blue-200' : ''}`}>
                          <div className={`w-4 h-4 rounded border ${userAnswer === optIdx ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}></div>
                          <span className="text-gray-700">{opt}</span>
                          {userAnswer === optIdx && (
                            <span className="ml-auto text-xs font-medium text-blue-600">Your Answer</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {q.type === 'NAT' && userAnswer !== undefined && (
                    <div className="text-sm">
                      <div className="font-medium text-gray-600">Your Answer:</div>
                      <div className="font-mono text-lg text-blue-700">{userAnswer}</div>
                    </div>
                  )}

                  {q.type === 'MSQ' && q.options && (
                    <div className="space-y-2 text-sm">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className={`flex items-center space-x-2 p-2 rounded ${Array.isArray(userAnswer) && userAnswer.includes(optIdx) ? 'bg-blue-50 border border-blue-200' : ''}`}>
                          <div className={`w-4 h-4 rounded border ${Array.isArray(userAnswer) && userAnswer.includes(optIdx) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}></div>
                          <span className="text-gray-700">{opt}</span>
                          {Array.isArray(userAnswer) && userAnswer.includes(optIdx) && (
                            <span className="ml-auto text-xs font-medium text-blue-600">Selected</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50 print:hidden">
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-green-500 rounded-sm"></div><span>Answered</span></div>
            <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-red-500 rounded-sm"></div><span>Not Answered</span></div>
            <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-purple-500 rounded-full"></div><span>Marked for Review</span></div>
            <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-gray-300 border border-gray-400 rounded-sm"></div><span>Not Visited</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format time
const formatTime = (s) => {
  const h = Math.floor(s/3600);
  const m = Math.floor((s%3600)/60);
  const sec = s%60;
  return `${h}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
};

// Main Exam Interface Component
export default function ExamInterface({ user, config, questions = [], onSubmit }) {
  // Derive sections
  const sections = [...new Set(questions.map(q => q.section))];
  const initialSection = sections.includes("General Aptitude") ? "General Aptitude" : sections[0];

  // State - Initialize with restored values if available
  const [currentSection, setCurrentSection] = useState(initialSection);
  const [currentQIndex, setCurrentQIndex] = useState(0); 
  const [answers, setAnswers] = useState({});
  
  // Initialize timeLeft with config value first, then update from localStorage
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedState = localStorage.getItem('gate-exam-timer');
    if (savedState) {
      const { timeLeft: savedTime, timestamp } = JSON.parse(savedState);
      const timePassed = Math.floor((Date.now() - timestamp) / 1000);
      return Math.max(0, savedTime - timePassed);
    }
    return config.duration * 60;
  });
  
  const [isTimerPaused, setIsTimerPaused] = useState(() => {
    const savedState = localStorage.getItem('gate-exam-timer');
    if (savedState) {
      const { isPaused } = JSON.parse(savedState);
      return isPaused;
    }
    return false;
  });
  
  const [showSidebar, setShowSidebar] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSectionConfirm, setShowSectionConfirm] = useState(false);
  const [showQuestionPaper, setShowQuestionPaper] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Refs for performance and timer persistence
  const answersRef = useRef({});
  const timerRef = useRef(null);
  const lastUpdateRef = useRef(null);

  // Initialize ref after component mounts
  useEffect(() => {
    lastUpdateRef.current = Date.now();
  }, []);

  // Save timer state periodically
  useEffect(() => {
    const saveTimerState = () => {
      const state = {
        timeLeft,
        isPaused: isTimerPaused,
        timestamp: Date.now()
      };
      localStorage.setItem('gate-exam-timer', JSON.stringify(state));
    };

    const interval = setInterval(saveTimerState, 30000); // Save every 30 seconds
    return () => clearInterval(interval);
  }, [timeLeft, isTimerPaused]);

  // Clear timer state on submit
  const clearTimerState = () => {
    localStorage.removeItem('gate-exam-timer');
  };

  // Update refs
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // Initialize status
  const [qStatus, setQStatus] = useState(() => {
    const init = {};
    questions.forEach(q => init[q.id] = STATUS.NOT_VISITED);
    const firstQ = questions.find(q => q.section === initialSection);
    if (firstQ) init[firstQ.id] = STATUS.NOT_ANSWERED;
    return init;
  });

  const sectionQuestions = questions.filter(q => q.section === currentSection);
  const currentQ = sectionQuestions[currentQIndex];

  // Show notification
  const showNotification = useCallback((message, type = 'info') => {
    // Don't show notifications for normal navigation (keep old behavior)
    if (message.includes('marked') || message.includes('cleared') || 
        message.includes('saved') || message.includes('Response') ||
        message.includes('Timer')) {
      setNotification({ message, type });
    }
  }, []);

  // Clear notification
  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // Timer control functions
  const toggleTimer = useCallback(() => {
    setIsTimerPaused(prev => !prev);
    showNotification(
      isTimerPaused ? 'Timer resumed' : 'Timer paused',
      isTimerPaused ? 'success' : 'warning'
    );
  }, [isTimerPaused, showNotification]);

  // NAVIGATION HELPER
  const changeQuestion = useCallback((index, section) => {
    const targetSection = section || currentSection;
    const targetQuestions = questions.filter(q => q.section === targetSection);
    const targetQ = targetQuestions[index];

    if (!targetQ) return;

    setQStatus(prev => {
        if (prev[targetQ.id] === STATUS.NOT_VISITED) {
            return { ...prev, [targetQ.id]: STATUS.NOT_ANSWERED };
        }
        return prev;
    });

    if (targetSection !== currentSection) {
      setCurrentSection(targetSection);
    }
    setCurrentQIndex(index);
    setShowSidebar(false);
  }, [currentSection, questions]);

  // HANDLERS
  const handleSubmit = useCallback((force = false) => {
    if (!force) {
      // Calculate statistics for confirmation modal
      const totalQuestions = questions.length;
      const answered = Object.keys(answersRef.current).filter(id => answersRef.current[id] !== '' && answersRef.current[id] !== undefined).length;
      const markedForReview = Object.keys(qStatus).filter(id => 
        qStatus[id] === STATUS.MARKED_FOR_REVIEW || qStatus[id] === STATUS.ANS_MARKED_FOR_REVIEW
      ).length;
      const notAnswered = totalQuestions - answered;
      
      setPendingAction(() => () => {
        const timeTaken = (config.duration * 60) - timeLeft;
        clearTimerState(); // Clear timer state
        onSubmit(answersRef.current, timeTaken, qStatus);
      });
      setShowConfirmModal({
        type: 'submit',
        title: 'Confirm Submission',
        message: `Are you sure you want to submit the exam?\n\n` +
                `• Total Questions: ${totalQuestions}\n` +
                `• Answered: ${answered}\n` +
                `• Marked for Review: ${markedForReview}\n` +
                `• Not Answered: ${notAnswered}\n` +
                `\n⏱️ Time Remaining: ${formatTime(timeLeft)}\n` +
                `\nOnce submitted, you cannot return to the exam.`,
        confirmText: 'Submit Exam',
        modalType: 'warning'
      });
      return;
    }
    const timeTaken = (config.duration * 60) - timeLeft;
    clearTimerState(); // Clear timer state
    onSubmit(answersRef.current, timeTaken, qStatus);
  }, [config.duration, timeLeft, onSubmit, questions.length, qStatus]);

  const handleNext = useCallback(() => {
    if (currentQIndex < sectionQuestions.length - 1) {
      changeQuestion(currentQIndex + 1);
    } else {
      const currSecIdx = sections.indexOf(currentSection);
      if (currSecIdx < sections.length - 1) {
        setPendingAction(() => () => changeQuestion(0, sections[currSecIdx + 1]));
        setShowSectionConfirm({
          title: 'Next Section',
          message: 'End of section. Do you want to proceed to the next section?',
          confirmText: 'Continue',
          modalType: 'info'
        });
      }
    }
  }, [currentQIndex, sectionQuestions.length, sections, currentSection, changeQuestion]);

  const handlePrevious = useCallback(() => {
    if (currentQIndex > 0) {
      changeQuestion(currentQIndex - 1);
    }
  }, [currentQIndex, changeQuestion]);

  const saveAndNext = useCallback(() => {
    const ans = answers[currentQ.id];
    const hasAns = ans !== undefined && ans !== "";
    setQStatus(prev => ({...prev, [currentQ.id]: hasAns ? STATUS.ANSWERED : STATUS.NOT_ANSWERED}));
    handleNext();
  }, [currentQ.id, answers, handleNext]);

  const markForReview = useCallback(() => {
    const ans = answers[currentQ.id];
    const hasAns = ans !== undefined && ans !== "";
    setQStatus(prev => ({...prev, [currentQ.id]: hasAns ? STATUS.ANS_MARKED_FOR_REVIEW : STATUS.MARKED_FOR_REVIEW}));
    showNotification('Question marked for review', 'info');
    handleNext();
  }, [currentQ.id, answers, handleNext, showNotification]);

  const unmarkReview = useCallback(() => {
    const ans = answers[currentQ.id];
    const hasAns = ans !== undefined && ans !== "";
    setQStatus(prev => ({...prev, [currentQ.id]: hasAns ? STATUS.ANSWERED : STATUS.NOT_ANSWERED}));
    showNotification('Review removed', 'info');
  }, [currentQ.id, answers, showNotification]);

  const clearResponse = useCallback(() => {
      const newAnswers = {...answers};
      delete newAnswers[currentQ.id];
      setAnswers(newAnswers);
      setQStatus(prev => ({...prev, [currentQ.id]: STATUS.NOT_ANSWERED}));
      showNotification('Response cleared', 'info');
  }, [currentQ.id, answers, showNotification]);

  // TIMER with pause functionality
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }

    if (isTimerPaused) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
      if (lastUpdateRef.current) {
        lastUpdateRef.current = Date.now();
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, isTimerPaused, handleSubmit]);

  const getPaletteStyles = (status) => {
    let base = "relative flex items-center justify-center text-sm font-bold cursor-pointer transition-all shadow-sm ";
    if (status === STATUS.ANSWERED) return { className: base + "w-9 h-8 bg-[#4CAF50] text-white clip-pentagon-up" };
    if (status === STATUS.NOT_ANSWERED) return { className: base + "w-9 h-8 bg-[#FF5252] text-white clip-pentagon-down" };
    if (status === STATUS.MARKED_FOR_REVIEW || status === STATUS.ANS_MARKED_FOR_REVIEW) return { className: base + "w-9 h-9 rounded-full bg-[#7E57C2] text-white" };
    return { className: base + "w-9 h-8 bg-[#E0E0E0] border border-gray-400 text-black rounded-sm" };
  };

  // Calculate global question number
  const getGlobalQuestionNumber = (questionId) => {
    return questions.findIndex(q => q.id === questionId) + 1;
  };

  // Calculate statistics
  const calculateStats = () => {
    const total = questions.length;
    const answered = Object.keys(answers).filter(id => answers[id] !== '' && answers[id] !== undefined).length;
    const notAnswered = total - answered;
    const marked = Object.keys(qStatus).filter(id => 
      qStatus[id] === STATUS.MARKED_FOR_REVIEW || qStatus[id] === STATUS.ANS_MARKED_FOR_REVIEW
    ).length;
    const notVisited = Object.keys(qStatus).filter(id => qStatus[id] === STATUS.NOT_VISITED).length;
    
    return { total, answered, notAnswered, marked, notVisited };
  };

  const stats = calculateStats();

  // Handle visibility change (tab switch)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isTimerPaused) {
        // Tab switched away - auto-pause timer if not already paused
        setIsTimerPaused(true);
        showNotification('Timer paused - switched to another tab', 'warning');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isTimerPaused, showNotification]);

  return (
    <div className="flex flex-col h-screen bg-white font-sans select-none overflow-hidden text-gray-900">
      {/* Notification */}
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={clearNotification} 
        />
      )}

      {/* Submit Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal && showConfirmModal.type === 'submit'}
        onClose={() => setShowConfirmModal(null)}
        onConfirm={() => {
          if (pendingAction) pendingAction();
          setPendingAction(null);
        }}
        title={showConfirmModal?.title || 'Confirm Submission'}
        message={showConfirmModal?.message || 'Are you sure you want to submit the exam?'}
        confirmText={showConfirmModal?.confirmText || 'Submit Exam'}
        type={showConfirmModal?.modalType || 'warning'}
      />

      {/* Section Confirm Modal */}
      <ConfirmModal
        isOpen={showSectionConfirm}
        onClose={() => setShowSectionConfirm(false)}
        onConfirm={() => {
          if (pendingAction) pendingAction();
          setPendingAction(null);
        }}
        title={showSectionConfirm?.title || 'Next Section'}
        message={showSectionConfirm?.message || 'End of section. Do you want to proceed to the next section?'}
        confirmText={showSectionConfirm?.confirmText || 'Continue'}
        type={showSectionConfirm?.modalType || 'info'}
      />

      {/* Question Paper Modal */}
      <QuestionPaperModal
        isOpen={showQuestionPaper}
        onClose={() => setShowQuestionPaper(false)}
        questions={questions}
        answers={answers}
        qStatus={qStatus}
        user={user}
        config={config}
      />

      {/* HEADER */}
      <header className="h-16 flex justify-between items-center px-4 md:px-6 bg-white shrink-0 border-b border-gray-300">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSidebar(!showSidebar)} 
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded transition-colors active:scale-95"
          >
            <Menu size={24} />
          </button>
          <div className="font-bold text-lg md:text-xl text-gray-800 tracking-wide truncate">
            GATE {config.year} - {config.subject}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 text-green-600">
              <Check size={16} />
              <span>{stats.answered}</span>
            </div>
            <div className="flex items-center space-x-2 text-red-600">
              <X size={16} />
              <span>{stats.notAnswered}</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-600">
              <AlertCircle size={16} />
              <span>{stats.marked}</span>
            </div>
          </div>
          <button
            onClick={toggleTimer}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors active:scale-95 flex items-center space-x-1 ${
              isTimerPaused 
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' 
                : 'bg-blue-100 text-blue-700 border border-blue-300'
            }`}
          >
            {isTimerPaused ? <Play size={14} /> : <Pause size={14} />}
            <span>{isTimerPaused ? 'Resume' : 'Pause'}</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300 overflow-hidden">
              <User size={24} className="text-gray-500" />
            </div>
            <div className="hidden md:block text-sm font-bold text-gray-700 truncate max-w-[120px]">{user?.name}</div>
          </div>
        </div>
      </header>

      {/* SUB HEADER */}
      <div className="h-12 bg-white flex justify-between items-center px-4 shrink-0 shadow-sm relative z-10 border-b border-gray-200 overflow-x-auto">
        <div className="flex space-x-1">
          {sections.map(sec => (
            <button 
              key={sec}
              onClick={() => changeQuestion(0, sec)}
              className={`px-4 py-2 text-xs font-bold rounded-t-md border-t border-l border-r whitespace-nowrap transition-colors active:scale-95 ${
                currentSection === sec 
                  ? 'bg-[#003366] text-white border-[#003366]' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2 text-sm ml-4">
          <Clock size={16} className="text-gray-600" />
          <span className="font-bold text-gray-700">Time Left:</span>
          <span className={`px-3 py-1 rounded font-mono font-bold border ${timeLeft < 300 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-[#EFEFEF] text-black border-gray-300'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden bg-gray-100 relative">
        
        {/* LEFT: QUESTION AREA */}
        <main className="flex-1 flex flex-col bg-white m-0 md:m-2 md:mr-0 border border-gray-300 shadow-sm relative z-0 min-w-0">
          {currentQ ? (
            <>
              {/* Q Info Bar */}
              <div className="h-12 border-b border-gray-300 flex items-center justify-between px-4 md:px-6 bg-white flex-shrink-0">
                <div className="flex items-center space-x-4">
                  <div className="font-bold text-base text-[#003366]">Question {getGlobalQuestionNumber(currentQ.id)}</div>
                  <div className="text-xs px-2 py-1 rounded-full bg-gray-100 font-medium">
                    {currentQ.type}
                  </div>
                </div>
                <div className="text-xs font-semibold text-gray-600 text-right">
                  <div className="flex items-center space-x-4">
                    <div className="text-green-600">Marks: {currentQ.marks}</div>
                    {currentQ.type === 'MCQ' && (
                      <div className="text-red-500 hidden md:block">
                        Negative: {currentQ.marks === 2 ? '2/3' : '1/3'}
                      </div>
                    )}
                    {currentQ.type === 'MSQ' && (
                      <div className="text-blue-500 hidden md:block">No Negative</div>
                    )}
                    {currentQ.type === 'NAT' && (
                      <div className="text-blue-500 hidden md:block">No Negative</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Q Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 min-h-0">
                <div className="mb-8 font-serif text-lg text-gray-900 leading-relaxed whitespace-pre-wrap">
                  {currentQ.question}
                </div>

                <div className="flex flex-col md:flex-row items-start gap-10">
                  {currentQ.type === "NAT" ? (
                    <div>
                      <input 
                        type="text" 
                        value={answers[currentQ.id] || ''}
                        onChange={(e) => setAnswers({...answers, [currentQ.id]: e.target.value})}
                        className="border border-gray-400 rounded p-2 w-full md:w-56 h-12 shadow-inner focus:outline-none focus:border-blue-500 text-xl font-mono text-black"
                        placeholder="Enter your answer"
                      />
                      {/* Virtual Keypad */}
                      <div className="border border-gray-400 p-1 bg-white inline-block rounded select-none shadow-sm mt-4">
                        <div className="grid grid-cols-3 gap-1 mb-1">
                          {[1,2,3,4,5,6,7,8,9,0,'.','-'].map(k => (
                            <button 
                              key={k} 
                              onClick={() => setAnswers({...answers, [currentQ.id]: (answers[currentQ.id]||"") + k})} 
                              className="w-12 h-12 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-xl text-gray-700 transition-colors active:scale-95"
                            >
                              {k}
                            </button>
                          ))}
                        </div>
                        <button 
                          onClick={() => setAnswers({...answers, [currentQ.id]: (answers[currentQ.id]||"").slice(0,-1)})} 
                          className="w-full py-2 border border-gray-300 rounded bg-white hover:bg-gray-50 font-semibold text-gray-700 text-sm transition-colors active:scale-95"
                        >
                          Backspace
                        </button>
                      </div>
                    </div>
                  ) : currentQ.type === "MSQ" ? (
                    <div className="flex flex-col space-y-4 w-full max-w-2xl">
                      {currentQ.options?.map((opt, idx) => (
                        <label key={idx} className="flex items-center space-x-4 p-4 border rounded hover:bg-gray-50 cursor-pointer transition-colors active:scale-[0.99]">
                          <input 
                            type="checkbox" 
                            name={`q-${currentQ.id}`} 
                            checked={Array.isArray(answers[currentQ.id]) ? answers[currentQ.id].includes(idx) : false}
                            onChange={(e) => {
                              const current = Array.isArray(answers[currentQ.id]) ? answers[currentQ.id] : [];
                              if (e.target.checked) {
                                setAnswers({...answers, [currentQ.id]: [...current, idx]});
                              } else {
                                setAnswers({...answers, [currentQ.id]: current.filter(i => i !== idx)});
                              }
                            }}
                            className="w-5 h-5 text-blue-600 cursor-pointer rounded"
                          />
                          <span className="text-gray-800 font-medium text-lg">{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-4 w-full max-w-2xl">
                      {currentQ.options?.map((opt, idx) => (
                        <label key={idx} className="flex items-center space-x-4 p-4 border rounded hover:bg-gray-50 cursor-pointer transition-colors active:scale-[0.99]">
                          <input 
                            type="radio" 
                            name={`q-${currentQ.id}`} 
                            checked={answers[currentQ.id] === idx}
                            onChange={() => setAnswers({...answers, [currentQ.id]: idx})}
                            className="w-5 h-5 text-blue-600 cursor-pointer"
                          />
                          <span className="text-gray-800 font-medium text-lg">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Nav Bar */}
              <div className="flex flex-wrap gap-2 justify-between items-center p-3 md:p-4 border-t border-gray-300 bg-white flex-shrink-0">
                <div className="flex flex-wrap gap-2 justify-start">
                  <button 
                    onClick={handlePrevious}
                    className="flex items-center px-3 md:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-medium text-sm transition-colors active:scale-95"
                  >
                    <ChevronLeft size={16} className="mr-1"/> Previous
                  </button>
                  
                  <button 
                    onClick={markForReview}
                    className="px-3 md:px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded font-medium text-sm transition-colors active:scale-95"
                  >
                    Mark for Review
                  </button>
                  
                  <button 
                    onClick={unmarkReview}
                    className="px-3 md:px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 rounded font-medium text-sm transition-colors active:scale-95"
                  >
                    Unmark Review
                  </button>
                  
                  <button 
                    onClick={clearResponse}
                    className="px-3 md:px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded font-medium text-sm transition-colors active:scale-95"
                  >
                    Clear Response
                  </button>
                </div>
                
                <button 
                  onClick={saveAndNext}
                  className="flex items-center px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm transition-colors active:scale-95"
                >
                  Save & Next <ChevronRight size={16} className="ml-1"/>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">End of Section</div>
          )}
        </main>

        {/* RIGHT: PALETTE */}
        <aside className={`
          fixed inset-0 z-50 bg-white md:relative md:z-0 md:flex md:flex-col md:w-80 md:min-w-[320px] md:m-2 md:border md:border-gray-300 md:shadow-sm transition-transform duration-150 ease-out
          ${showSidebar ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:flex'}
        `}>
          <div className="md:hidden p-4 bg-[#003366] text-white flex justify-between items-center">
            <span className="font-bold">Question Palette</span>
            <button 
              onClick={() => setShowSidebar(false)} 
              className="p-1 hover:bg-blue-800 rounded transition-colors active:scale-95"
            >
              <X size={20}/>
            </button>
          </div>

          <div className="hidden md:flex bg-[#E0E0E0] p-3 items-center space-x-3 border-b border-gray-300">
            <div className="w-10 h-10 bg-[#00BCD4] text-white flex items-center justify-center font-bold text-xl rounded-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="font-bold text-sm text-gray-800 truncate">{user?.name}</div>
          </div>
          
          <div className="hidden md:block bg-[#0D47A1] text-white p-2 text-center text-sm font-bold">
            Question Palette
          </div>
          
          {/* Stats Overview */}
          <div className="p-3 border-b bg-gray-50">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-gray-600">Answered</span>
                <span className="font-bold text-green-600">{stats.answered}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-gray-600">Not Answered</span>
                <span className="font-bold text-red-600">{stats.notAnswered}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-gray-600">Marked</span>
                <span className="font-bold text-purple-600">{stats.marked}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-gray-600">Not Visited</span>
                <span className="font-bold text-gray-600">{stats.notVisited}</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-white p-4">
            <div className="grid grid-cols-4 md:grid-cols-4 gap-3 place-items-center">
              {sectionQuestions.map((q, idx) => {
                const status = qStatus[q.id];
                const { className } = getPaletteStyles(status);
                const isCurrent = idx === currentQIndex;
                const globalIndex = getGlobalQuestionNumber(q.id);
                const isMarkedWithAns = status === STATUS.ANS_MARKED_FOR_REVIEW;

                return (
                  <button 
                    key={q.id} 
                    onClick={() => changeQuestion(idx)}
                    className={`${className} ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-1 z-10' : ''} hover:opacity-90 active:scale-95 transition-transform`}
                    title={`Question ${globalIndex}`}
                  >
                    {globalIndex}
                    {isMarkedWithAns && (
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border border-white flex items-center justify-center">
                        <Check size={10} strokeWidth={4} color="white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Legend */}
          <div className="p-3 bg-white border-t border-gray-200 text-[10px] text-gray-700 grid grid-cols-2 gap-2 flex-shrink-0">
            <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-[#4CAF50] clip-pentagon-up"></div><span>Answered</span></div>
            <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-[#FF5252] clip-pentagon-down"></div><span>Not Answered</span></div>
            <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-[#E0E0E0] border border-gray-400 rounded-sm"></div><span>Not Visited</span></div>
            <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-[#7E57C2] rounded-full"></div><span>Marked for Review</span></div>
            <div className="col-span-2 flex items-center space-x-2">
              <div className="relative w-4 h-4 bg-[#7E57C2] rounded-full mr-1">
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
              </div>
              <span>Answered & Marked for Review</span>
            </div>
          </div>

          <div className="p-3 bg-[#E0E0E0] space-y-2 border-t border-gray-300 flex-shrink-0">
            <div className="flex gap-2">
              <button 
                onClick={() => setShowQuestionPaper(true)}
                className="flex-1 py-2 bg-[#FFA000] hover:bg-amber-600 text-white text-xs font-bold rounded shadow-sm flex items-center justify-center transition-colors active:scale-95"
              >
                <BookOpen size={14} className="mr-1"/> Question Paper
              </button>
              <button 
                onClick={() => {
                  setPendingAction(() => () => window.location.reload());
                  setShowConfirmModal({
                    type: 'exit',
                    title: 'Exit Exam',
                    message: 'Are you sure you want to exit the exam? All progress will be lost.',
                    confirmText: 'Exit',
                    modalType: 'danger'
                  });
                }}
                className="flex-1 py-2 bg-[#FF5252] hover:bg-red-600 text-white text-xs font-bold rounded shadow-sm flex items-center justify-center transition-colors active:scale-95"
              >
                <X size={14} className="mr-1"/> Exit Exam
              </button>
            </div>
            <button 
              onClick={() => handleSubmit(false)}
              className="w-full py-2.5 bg-[#4CAF50] hover:bg-green-600 text-white text-sm font-bold rounded shadow-sm transition-colors active:scale-95 flex items-center justify-center"
            >
              <Award size={16} className="mr-2"/> Submit Exam
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}