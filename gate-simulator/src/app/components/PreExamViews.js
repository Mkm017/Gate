// gate-simulator/src/app/components/PreExamViews.js
import React, { useState } from 'react';
import { Check, Upload, FileText, X, CheckCircle, Loader2, Award, BarChart3, Clock, Calendar, User, BookOpen, Target, Percent, Trophy, Download, Printer } from 'lucide-react';

const LoginView = ({ onLogin, isLoading }) => {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting || isLoading) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin({ password: password.trim() });
      setIsSubmitting(false);
    }, 50);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <div className="w-40 h-40 flex items-center justify-center mx-auto mb-4">
            <img src="/icon.png" alt="GATE Simulator" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">GATE Simulator</h1>
          <p className="text-gray-600 mt-2">Practice like the real exam</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="Enter password"
              autoFocus
            />
          </div>
          
          <button 
            type="submit"
            disabled={isSubmitting || isLoading}
            className={`w-full ${isSubmitting || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'} text-white py-3.5 rounded-lg font-semibold shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center`}
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Logging in...
              </>
            ) : (
              'Start Practice Session'
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
            <div className="flex items-center">
              <Check size={14} className="text-green-500 mr-2" />
              <span>Real Exam Interface</span>
            </div>
            <div className="flex items-center">
              <Clock size={14} className="text-blue-500 mr-2" />
              <span>Live Timer</span>
            </div>
            <div className="flex items-center">
              <Target size={14} className="text-red-500 mr-2" />
              <span>GATE Pattern</span>
            </div>
            <div className="flex items-center">
              <Percent size={14} className="text-purple-500 mr-2" />
              <span>Detailed Analysis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SetupView = ({ config, setConfig, setQuestions, setAnswerKey, questionsLoaded, onStart, isLoading, yearOptions }) => {
  const [qStatus, setQStatus] = useState(null);
  const [aStatus, setAStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target.result);
        if (type === 'q') {
          if (!Array.isArray(json)) throw new Error("Questions must be an array");
          setQuestions(json);
          setQStatus({ name: file.name, count: json.length });
        } else {
          setAnswerKey(json);
          setAStatus({ name: file.name, count: Object.keys(json).length });
        }
        setIsProcessing(false);
      } catch (err) { 
        alert("Invalid JSON Format: " + err.message);
        setIsProcessing(false);
      }
    };
    reader.readAsText(file);
  };

  const handleStartClick = () => {
    if (isProcessing || isLoading) return;
    onStart();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center py-10 px-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Exam Configuration</h2>
          <p className="text-gray-600">Configure your practice session</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Year</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={config.year} 
                onChange={e => setConfig({...config, year: e.target.value})}
              >
                {yearOptions.slice().reverse().map(y => 
                  <option key={y} value={y}>{y}</option>
                )}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (Minutes)</label>
              <input 
                type="number" 
                value={config.duration} 
                onChange={e => setConfig({...config, duration: parseInt(e.target.value) || 180})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                min="1"
                max="360"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={config.subject} 
                onChange={e => setConfig({...config, subject: e.target.value})}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Set</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={config.set} 
                onChange={e => setConfig({...config, set: e.target.value})}
              >
                <option value="1">Set 1</option>
                <option value="2">Set 2</option>
                <option value="3">Set 3</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6 border-t pt-8">
          <div className="border-2 border-dashed border-blue-200 p-6 rounded-xl bg-blue-50">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">Upload Questions (JSON)</h3>
                <p className="text-sm text-gray-600">Upload your question paper in JSON format</p>
              </div>
              {qStatus && (
                <span className="text-sm text-green-700 bg-green-100 px-3 py-1.5 rounded-full flex items-center font-semibold">
                  <CheckCircle size={16} className="mr-2"/> {qStatus.count} Questions
                </span>
              )}
            </div>
            <input 
              type="file" 
              accept=".json" 
              onChange={e => handleFile(e, 'q')}
              disabled={isProcessing}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-600 file:to-indigo-600 file:text-white hover:file:from-blue-700 hover:file:to-indigo-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="border-2 border-dashed border-gray-200 p-6 rounded-xl bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">Upload Answer Key (Optional)</h3>
                <p className="text-sm text-gray-600">For automatic evaluation and detailed analysis</p>
              </div>
              {aStatus && (
                <span className="text-sm text-green-700 bg-green-100 px-3 py-1.5 rounded-full flex items-center font-semibold">
                  <CheckCircle size={16} className="mr-2"/> {aStatus.count} Answers
                </span>
              )}
            </div>
            <input 
              type="file" 
              accept=".json" 
              onChange={e => handleFile(e, 'a')}
              disabled={isProcessing}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <button 
            onClick={handleStartClick}
            disabled={!questionsLoaded || isProcessing || isLoading}
            className={`px-10 py-3.5 rounded-lg font-semibold text-white shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center ${
              questionsLoaded && !isProcessing && !isLoading 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isProcessing || isLoading ? (
              <>
                <Loader2 className="animate-spin mr-3" size={20} />
                Loading Questions...
              </>
            ) : (
              <>
                Start Instructions
                <ChevronRight size={20} className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const InstructionsView = ({ config, onBegin, isLoading }) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleBeginClick = () => {
    if (isStarting || isLoading) return;
    setIsStarting(true);
    setTimeout(() => {
      onBegin();
      setIsStarting(false);
    }, 50);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col font-sans">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">GATE {config.year} - {config.subject}</h1>
          <p className="text-blue-100 mt-1">Instructions for Practice Session</p>
        </div>
      </header>
      
      <div className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={40} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Important Instructions</h2>
            <p className="text-gray-600">Read carefully before starting the exam</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock size={20} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Time Limit</h4>
                  <p className="text-gray-600 mt-1">Total duration: <span className="font-bold">{config.duration} minutes</span>. The timer will start as soon as you begin.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target size={20} className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Question Types</h4>
                  <p className="text-gray-600 mt-1">MCQ (with negative marking), MSQ, and NAT questions as per GATE pattern.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Percent size={20} className="text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Marking Scheme</h4>
                  <p className="text-gray-600 mt-1">• MCQ: +1/-0.33 for 1-mark, +2/-0.66 for 2-mark<br/>• MSQ: Full marks for correct, no negative<br/>• NAT: Full marks for correct, no negative</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={20} className="text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Navigation</h4>
                  <p className="text-gray-600 mt-1">Use question palette to jump between questions. Mark questions for review to return later.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Submission</h4>
                  <p className="text-gray-600 mt-1">Once submitted, you cannot return. Time&apos;s up will auto-submit.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Evaluation</h4>
                  <p className="text-gray-600 mt-1">Detailed analysis with section-wise scores and performance metrics.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-3">Question Status Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3"><div className="w-8 h-8 bg-green-500 rounded-lg"></div><span className="text-sm font-medium">Answered</span></div>
              <div className="flex items-center space-x-3"><div className="w-8 h-8 bg-red-500 rounded-lg"></div><span className="text-sm font-medium">Not Answered</span></div>
              <div className="flex items-center space-x-3"><div className="w-8 h-8 bg-purple-500 rounded-full"></div><span className="text-sm font-medium">Marked</span></div>
              <div className="flex items-center space-x-3"><div className="w-8 h-8 bg-gray-300 border border-gray-400 rounded-lg"></div><span className="text-sm font-medium">Not Visited</span></div>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={handleBeginClick}
              disabled={isStarting || isLoading}
              className={`px-16 py-4 rounded-xl font-bold text-white shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center mx-auto text-lg ${
                isStarting || isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
              }`}
            >
              {isStarting || isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-3" size={24} />
                  Loading Exam...
                </>
              ) : (
                'START EXAM NOW'
              )}
            </button>
            <p className="text-gray-500 mt-4 text-sm">Click to begin your {config.duration}-minute practice session</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultView = ({ resultData, setView, config, user }) => {
  const r = resultData || { 
    score: 0, 
    attempted: 0, 
    correct: 0, 
    wrong: 0, 
    totalQuestions: 0, 
    percentage: 0,
    oneMarkWrong: 0,
    twoMarkWrong: 0,
    negativeMarks: 0,
    markedForReview: 0,
    answeredAndMarked: 0,
    sections: [],
    totalPossibleScore: 65,
    questionWiseResults: []
  };
  
  const [isExiting, setIsExiting] = useState(false);
  const [showQuestionDetails, setShowQuestionDetails] = useState(false);
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      setView('login');
      setIsExiting(false);
    }, 100);
  };

  // Download attempted paper with questions, options, and answers
  const downloadAttemptedPaper = () => {
    const paperData = {
      examDetails: {
        exam: 'GATE',
        year: config.year,
        subject: config.subject,
        duration: config.duration,
        set: config.set,
        date: new Date().toISOString().split('T')[0]
      },
      user: {
        name: user?.name || 'Anonymous',
        resultSummary: {
          score: r.score,
          totalPossibleScore: r.totalPossibleScore,
          attempted: r.attempted,
          correct: r.correct,
          wrong: r.wrong,
          accuracy: r.attempted > 0 ? ((r.correct / r.attempted) * 100).toFixed(1) : 0,
          negativeMarks: r.negativeMarks,
          timeTaken: r.timeTaken
        }
      },
      questions: r.questionWiseResults.map(q => {
        const questionData = {
          id: q.id,
          section: q.section,
          type: q.type,
          marks: q.marks,
          question: q.question,
          userAnswer: q.userAnswer,
          correctAnswer: q.correctAnswer || 'Not Provided',
          status: q.status,
          marksObtained: q.marksObtained,
          isCorrect: q.status === 'correct'
        };
        
        // Format answers for display
        if (q.type === 'MCQ' && q.userAnswer !== undefined && q.userAnswer !== null) {
          const options = ['A', 'B', 'C', 'D'];
          questionData.userAnswerFormatted = `Option ${options[q.userAnswer]} (${q.userAnswer})`;
          if (q.correctAnswer) {
            questionData.correctAnswerFormatted = `Option ${options[parseInt(q.correctAnswer)] || q.correctAnswer}`;
          }
        } else if (q.type === 'MSQ' && Array.isArray(q.userAnswer)) {
          const options = ['A', 'B', 'C', 'D'];
          questionData.userAnswerFormatted = q.userAnswer.map(a => `Option ${options[a]}`).join(', ');
          if (q.correctAnswer) {
            const correctIndices = q.correctAnswer.split(',').map(idx => parseInt(idx.trim()));
            questionData.correctAnswerFormatted = correctIndices.map(idx => `Option ${options[idx]}`).join(', ');
          }
        } else if (q.type === 'NAT') {
          questionData.userAnswerFormatted = q.userAnswer || 'Not Attempted';
          questionData.correctAnswerFormatted = q.correctAnswer || 'N/A';
        }
        
        return questionData;
      }),
      timestamp: new Date().toISOString(),
      summary: {
        overallScore: `${r.score}/${r.totalPossibleScore}`,
        percentage: ((parseFloat(r.score) / r.totalPossibleScore) * 100).toFixed(1) + '%',
        accuracy: r.attempted > 0 ? ((r.correct / r.attempted) * 100).toFixed(1) + '%' : '0%',
        totalQuestions: r.totalQuestions,
        attempted: r.attempted,
        correct: r.correct,
        wrong: r.wrong
      }
    };

    const dataStr = JSON.stringify(paperData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GATE_${config.year}_${config.subject}_Attempted_Paper_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate HTML/PDF for attempted paper with visual formatting
  const generateFormattedPaper = (action = 'view') => {
    const optionsMap = ['A', 'B', 'C', 'D'];
    const hasValue = (v) => v !== null && v !== undefined;

    const formatAnswerByType = (value, type) => {
      if (value === null || value === undefined || value === '') return 'Not Attempted';
      if (type === 'NAT') return String(value);

      const arr = Array.isArray(value)
        ? value
        : String(value).split(',').map(v => Number(v.trim()));
      return arr.map(i => `Option ${optionsMap[i]}`).join(', ');
    };

    const correct1MMCQ = r.questionWiseResults.filter(q => q.status === 'correct' && q.type === 'MCQ' && q.marks === 1).length;
    const correct2MMCQ = r.questionWiseResults.filter(q => q.status === 'correct' && q.type === 'MCQ' && q.marks === 2).length;
    const correct1MMSQ = r.questionWiseResults.filter(q => q.status === 'correct' && q.type === 'MSQ' && q.marks === 1).length;
    const correct2MMSQ = r.questionWiseResults.filter(q => q.status === 'correct' && q.type === 'MSQ' && q.marks === 2).length;
    const correct1MNAT = r.questionWiseResults.filter(q => q.status === 'correct' && q.type === 'NAT' && q.marks === 1).length;
    const correct2MNAT = r.questionWiseResults.filter(q => q.status === 'correct' && q.type === 'NAT' && q.marks === 2).length;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GATE ${config.year} - ${config.subject}</title>

<style>
/* Base Styles */
* {
  box-sizing: border-box;
}

body { 
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
  margin: 20px; 
  color: #333;
  line-height: 1.6;
  font-size: 16px;
}

.header { 
  text-align: center; 
  border-bottom: 2px solid #003366; 
  padding-bottom: 15px; 
  margin-bottom: 25px; 
  word-wrap: break-word;
}

.header h1 { 
  margin: 0 0 10px 0; 
  color: #003366;
  font-size: clamp(24px, 4vw, 32px);
}

.subtitle { 
  font-size: clamp(12px, 2vw, 14px); 
  color: #666;
  margin: 5px 0;
}

.user-info { 
  background: #f5f5f5; 
  padding: 15px; 
  border-radius: 6px; 
  margin-bottom: 25px;
  overflow-wrap: break-word;
}

.user-info strong {
  display: block;
  margin-bottom: 8px;
  font-size: clamp(14px, 2vw, 16px);
}

.section-header { 
  background: #003366; 
  color: white; 
  padding: 12px; 
  border-radius: 4px; 
  margin: 30px 0 15px;
  font-size: clamp(16px, 2.5vw, 18px);
  font-weight: bold;
}

.question { 
  border: 1px solid #ddd; 
  border-radius: 6px; 
  padding: 15px; 
  margin-bottom: 20px;
  overflow-wrap: break-word;
}

.question-header { 
  display: flex; 
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

@media (min-width: 768px) {
  .question-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

.question-number { 
  font-weight: bold; 
  color: #003366;
  font-size: clamp(16px, 2vw, 18px);
}

.question-status { 
  font-size: clamp(11px, 1.5vw, 12px); 
  padding: 6px 12px; 
  border-radius: 4px; 
  font-weight: bold;
  display: inline-block;
  text-align: center;
  min-width: 120px;
}

.status-correct { 
  background: #a5d6a7; 
  color: #0d3c0f; 
  border: 2px solid #2e7d32;
  font-weight: 800;
}
.status-wrong { 
  background: #ffcdd2; 
  color: #5c0000; 
  border: 2px solid #d32f2f;
  font-weight: 800;
}
.status-not-attempted { 
  background: #e0e0e0; 
  color: #212121; 
  font-weight: bold;
}
.question > div:not(.question-header):not(.options):not(.answer-section) {
  margin-bottom: 15px;
  font-size: clamp(14px, 2vw, 16px);
}

.options { 
  margin-top: 15px;
}

.option { 
  padding: 10px 12px; 
  margin: 8px 0; 
  border-radius: 4px; 
  border-left: 4px solid #ccc; 
  background: #f9f9f9;
  font-size: clamp(14px, 2vw, 15px);
  word-break: break-word;
}

.option-correct { background: #e8f5e9; border-left-color: #4caf50; font-weight: bold; }
.option-user-correct { background: #e8f5e9; border-left-color: #4caf50; font-weight: bold; }
.option-user-wrong { background: #fdecea; border-left-color: #f44336; font-weight: bold; }
.option-user-neutral { background: #e3f2fd; border-left-color: #2196f3; }

.answer-section { 
  margin-top: 15px; 
  background: #f9f9f9; 
  padding: 12px; 
  border-radius: 4px;
  font-size: clamp(14px, 2vw, 15px);
}

.answer-label { 
  font-weight: bold; 
  display: inline-block;
  min-width: 120px;
}

@media (max-width: 480px) {
  .answer-label {
    display: block;
    margin-bottom: 5px;
    min-width: auto;
  }
}

.footer { 
  text-align: center; 
  margin-top: 40px; 
  font-size: clamp(11px, 1.5vw, 12px); 
  color: #666; 
  border-top: 1px solid #ddd; 
  padding-top: 15px; 
}

/* Responsive adjustments */
@media (max-width: 768px) {
  body {
    margin: 15px;
    font-size: 15px;
  }
  
  .user-info {
    padding: 12px;
  }
  
  .question {
    padding: 12px;
  }
  
  .header h1 {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  body {
    margin: 10px;
    font-size: 14px;
  }
  
  .header {
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  
  .header h1 {
    font-size: 24px;
  }
  
  .question-header {
    gap: 8px;
  }
  
  .question-status {
    min-width: 110px;
    padding: 5px 8px;
  }
  
  .option {
    padding: 8px 10px;
    margin: 6px 0;
  }
  
  .answer-section {
    padding: 10px;
  }
}

@media (max-width: 320px) {
  body {
    margin: 8px;
    font-size: 13px;
  }
  
  .header h1 {
    font-size: 20px;
  }
  
  .question-status {
    min-width: 100px;
    font-size: 10px;
  }
  
  .answer-label {
    font-size: 13px;
  }
}

/* Print styles */
@media print {
  body {
    margin: 0;
    font-size: 12pt;
    color: #000;
  }
  
  .header {
    border-bottom: 2pt solid #003366;
  }
  
  .question {
    break-inside: avoid;
    border: 1pt solid #000;
  }
  
  .user-info {
    background: #fff;
    border: 1pt solid #000;
  }
  
  .footer {
    display: none;
  }
}
</style>
</head>

<body>

<div class="header">
  <h1>GATE ${config.year} - ${config.subject}</h1>
  <div class="subtitle">Attempted Question Paper with Answers</div>
  <div class="subtitle">Candidate: ${user?.name || 'Anonymous'} | ${new Date().toLocaleDateString()}</div>
</div>

<div class="user-info">
<strong>Performance Summary:</strong><br>
Score: ${r.score}/${r.totalPossibleScore}
(${((parseFloat(r.score)/r.totalPossibleScore)*100).toFixed(1)}%)<br>
Accuracy: ${r.attempted ? ((r.correct/r.attempted)*100).toFixed(1) : '0.0'}%<br>
Questions: ${r.correct} Correct, ${r.wrong} Wrong, ${r.totalQuestions - r.attempted} Not Attempted<br>
Time Taken: ${r.timeTaken ? Math.floor(r.timeTaken/60)+':'+String(r.timeTaken%60).padStart(2,'0') : 'N/A'}<br><br>

<strong>Detailed Breakdown:</strong><br>
Total Correct Marks Earned:
${r.questionWiseResults.filter(q=>q.status==='correct').reduce((s,q)=>s+q.marks,0)}<br>
Total Negative Marks: ${r.negativeMarks}<br>
1-Mark Questions:
${r.questionWiseResults.filter(q=>q.marks===1 && q.status==='correct').length}
correct, ${r.oneMarkWrong} wrong<br>
2-Mark Questions:
${r.questionWiseResults.filter(q=>q.marks===2 && q.status==='correct').length}
correct, ${r.twoMarkWrong} wrong<br>
MSQ Questions:
${r.questionWiseResults.filter(q=>q.type==='MSQ' && q.status==='correct').length}
correct, ${r.questionWiseResults.filter(q=>q.type==='MSQ' && q.status==='wrong').length}
wrong<br>
NAT Questions:
${r.questionWiseResults.filter(q=>q.type==='NAT' && q.status==='correct').length}
correct, ${r.questionWiseResults.filter(q=>q.type==='NAT' && q.status==='wrong').length}
wrong<br>
Marked for Review: ${r.markedForReview},
Answered and Marked: ${r.answeredAndMarked}<br><br>

<strong>Correct Questions by Type:</strong><br>
1M MCQ: ${correct1MMCQ}, 2M MCQ: ${correct2MMCQ},
1M MSQ: ${correct1MMSQ}, 2M MSQ: ${correct2MMSQ},
1M NAT: ${correct1MNAT}, 2M NAT: ${correct2MNAT}
</div>

${Object.entries(
  r.questionWiseResults.reduce((a,q)=>{a[q.section]=a[q.section]||[];a[q.section].push(q);return a;},{})
).map(([section,qs])=>`
<div class="section-header">${section}</div>
${qs.map(q=>{
  const cIdx = q.type!=='NAT' && hasValue(q.correctAnswer) ? String(q.correctAnswer).split(',').map(Number) : [];
  const uIdx = q.type!=='NAT' && hasValue(q.userAnswer) ? (Array.isArray(q.userAnswer)?q.userAnswer.map(Number):String(q.userAnswer).split(',').map(Number)) : [];

  return `
<div class="question">
<div class="question-header">
  <div class="question-number">Q${q.id}</div>
  <div class="question-status ${
    q.status==='correct'?'status-correct':q.status==='wrong'?'status-wrong':'status-not-attempted'
  }">
    ${q.status==='correct'?'✓ Correct':q.status==='wrong'?'✗ Wrong':'○ Not Attempted'}
    (${q.marksObtained>0?'+':''}${q.marksObtained})
  </div>
</div>

<div>${q.question}</div>

${q.type!=='NAT'?`
<div class="options">
${q.options.map((opt,i)=>{
  let cls='option';
  
  // Check if this option is correct
  const isCorrect = cIdx.includes(i);
  // Check if user selected this option
  const isUserSelected = uIdx.includes(i);
  
  // Apply appropriate classes based on status
  if (isCorrect && isUserSelected) {
    cls += ' option-user-correct';
  } else if (isCorrect && !isUserSelected) {
    cls += ' option-correct';
  } else if (!isCorrect && isUserSelected) {
    cls += ' option-user-wrong';
  } else if (isUserSelected) {
    cls += ' option-user-neutral';
  }
  
  return `<div class="${cls}">${optionsMap[i]}. ${opt}</div>`;
}).join('')}
</div>`:''}

<div class="answer-section">
<div><span class="answer-label">Your Answer:</span> ${formatAnswerByType(q.userAnswer,q.type)}</div>
<div><span class="answer-label">Correct Answer:</span> ${formatAnswerByType(q.correctAnswer,q.type)}</div>
</div>
</div>`;
}).join('')}
`).join('')}

<div class="footer">Generated by GATE Simulator • ${new Date().toLocaleString()}</div>

</body>
</html>`;

    // Create blob from HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    if (action === 'download') {
      // Download the file
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `GATE_${config.year}_${config.subject}_Formatted_Report_${user?.name || 'Anonymous'}_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // View in new window (default)
      window.open(URL.createObjectURL(blob), '_blank');
    }
  };

  const viewFormattedPaper = () => generateFormattedPaper('view');
  const downloadFormattedPaper = () => generateFormattedPaper('download');

  // Calculate performance metrics
  const accuracy = r.attempted > 0 ? ((r.correct / r.attempted) * 100).toFixed(1) : 0;
  const netScore = parseFloat(r.score);
  const totalMarks = r.totalPossibleScore || (r.totalQuestions * 2);
  const scorePercentage = ((netScore / totalMarks) * 100).toFixed(1);
  
  // Performance indicators
  const getPerformanceLevel = () => {
    if (scorePercentage >= 70) return { level: "Excellent", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
    if (scorePercentage >= 50) return { level: "Good", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" };
    if (scorePercentage >= 30) return { level: "Average", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" };
    return { level: "Needs Improvement", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
  };

  const performance = getPerformanceLevel();

  // Calculate correct counts by type and marks
  const correct1MMCQ = r.questionWiseResults.filter(q => q.status === 'correct' && q.type === 'MCQ' && q.marks === 1).length;
  const correct2MMCQ = r.questionWiseResults.filter(q => q.status === 'correct' && q.type === 'MCQ' && q.marks === 2).length;
  const correct1MMSQ = r.questionWiseResults.filter(q => q.status === 'correct' && q.type === 'MSQ' && q.marks === 1).length;
  const correct2MMSQ = r.questionWiseResults.filter(q => q.status === 'correct' && q.type === 'MSQ' && q.marks === 2).length;
  const correct1MNAT = r.questionWiseResults.filter(q => q.status === 'correct' && q.type === 'NAT' && q.marks === 1).length;
  const correct2MNAT = r.questionWiseResults.filter(q => q.status === 'correct' && q.type === 'NAT' && q.marks === 2).length;

  // Get unique sections from question-wise results
  const sections = r.questionWiseResults ? 
    [...new Set(r.questionWiseResults.map(q => q.section))] : [];

  // Filter questions by section
  const filteredQuestions = r.questionWiseResults ? 
    (selectedSection === 'all' ? 
      r.questionWiseResults : 
      r.questionWiseResults.filter(q => q.section === selectedSection)) : 
    [];

  // Count question types
  const correctQuestions = filteredQuestions.filter(q => q.status === 'correct');
  const wrongQuestions = filteredQuestions.filter(q => q.status === 'wrong');
  const notAttemptedQuestions = filteredQuestions.filter(q => q.status === 'not_attempted');

  // Format answer for display
  const formatAnswer = (answer, question) => {
    if (answer === undefined || answer === null || answer === '') return 'Not Attempted';
    
    const options = ['A', 'B', 'C', 'D'];
    
    if (question.type === 'MCQ') {
      const answerNum = parseInt(answer);
      if (!isNaN(answerNum)) {
        return `Option ${options[answerNum]} (${answer})`;
      }
      return answer;
    }
    
    if (question.type === 'MSQ') {
      if (Array.isArray(answer)) {
        return answer.map(a => {
          const num = parseInt(a);
          return !isNaN(num) ? `Option ${options[num] || a}` : a;
        }).join(', ');
      }
      
      // Handle string format like "1,3"
      if (typeof answer === 'string' && answer.includes(',')) {
        return answer.split(',').map(idx => {
          const numIdx = parseInt(idx.trim());
          return !isNaN(numIdx) ? `Option ${options[numIdx] || idx}` : idx;
        }).join(', ');
      }
      
      return answer.toString();
    }
    
    return answer.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-2 sm:p-4 font-sans">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl max-w-6xl w-full border border-gray-200 overflow-hidden print:shadow-none print:border-none mx-2 sm:mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-6 md:p-8 text-white print:bg-white print:text-black">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Exam Results</h1>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-blue-100 print:text-gray-600 text-sm sm:text-base">
                <div className="flex items-center">
                  <Award size={16} className="mr-2 flex-shrink-0" />
                  <span>Practice Session Completed</span>
                </div>
                {r.timeTaken && (
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2 flex-shrink-0" />
                    <span>Time: {Math.floor(r.timeTaken / 60)}:{String(r.timeTaken % 60).padStart(2, '0')}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{netScore.toFixed(2)}</div>
              <div className="text-blue-200 print:text-gray-600 text-sm sm:text-base">Total Score</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* Result Summary */}
          <div className="mb-6 sm:mb-8 md:mb-10 text-center">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">Exam Result Summary</h2>
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-1 sm:mb-2">{netScore.toFixed(2)} / {totalMarks}</div>
              <div className="text-base sm:text-lg md:text-xl mb-3 sm:mb-4">{scorePercentage}% Score</div>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 text-sm sm:text-base md:text-lg">
                <div>
                  <div className="font-bold">{r.correct}</div>
                  <div className="text-green-200 text-xs sm:text-sm">Correct</div>
                </div>
                <div>
                  <div className="font-bold">{r.wrong}</div>
                  <div className="text-red-200 text-xs sm:text-sm">Wrong</div>
                </div>
                <div>
                  <div className="font-bold">{r.totalQuestions - r.attempted}</div>
                  <div className="text-gray-300 text-xs sm:text-sm">Not Attempted</div>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base">
                <span className="font-semibold">Accuracy:</span> {accuracy}% | 
                <span className="font-semibold ml-2 sm:ml-4">Negative Marks:</span> {r.negativeMarks}
              </div>
              <div className="mt-3 sm:mt-4 text-xs sm:text-sm">
                <div className="font-semibold mb-1 sm:mb-2">Correct Questions by Type:</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 text-xs">
                  <div>1M MCQ: {correct1MMCQ}</div>
                  <div>2M MCQ: {correct2MMCQ}</div>
                  <div>1M MSQ: {correct1MMSQ}</div>
                  <div>2M MSQ: {correct2MMSQ}</div>
                  <div>1M NAT: {correct1MNAT}</div>
                  <div>2M NAT: {correct2MNAT}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="mb-6 sm:mb-8 md:mb-10">
            <div className={`p-4 sm:p-6 rounded-lg sm:rounded-xl ${performance.bg} ${performance.border} border-2`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Performance Summary</h3>
                  <p className={`text-base sm:text-lg font-semibold mt-1 ${performance.color}`}>
                    {performance.level} Performance • {scorePercentage}% Score
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">{r.correct}/{r.attempted}</div>
                  <div className="text-gray-600 text-sm">Correct/Attempted</div>
                </div>
              </div>
              
              {/* Performance by Question Type */}
              <div className="mt-4 sm:mt-6">
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Performance by Question Type</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                    <div className="text-xs sm:text-sm font-semibold text-blue-800">1-Mark MCQ</div>
                    <div className="text-xl sm:text-2xl font-bold text-blue-700">{correct1MMCQ}</div>
                    <div className="text-xs text-blue-600">Correct</div>
                  </div>
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                    <div className="text-xs sm:text-sm font-semibold text-blue-800">2-Mark MCQ</div>
                    <div className="text-xl sm:text-2xl font-bold text-blue-700">{correct2MMCQ}</div>
                    <div className="text-xs text-blue-600">Correct</div>
                  </div>
                  <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200">
                    <div className="text-xs sm:text-sm font-semibold text-purple-800">1-Mark MSQ</div>
                    <div className="text-xl sm:text-2xl font-bold text-purple-700">{correct1MMSQ}</div>
                    <div className="text-xs text-purple-600">Correct</div>
                  </div>
                  <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200">
                    <div className="text-xs sm:text-sm font-semibold text-purple-800">2-Mark MSQ</div>
                    <div className="text-xl sm:text-2xl font-bold text-purple-700">{correct2MMSQ}</div>
                    <div className="text-xs text-purple-600">Correct</div>
                  </div>
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
                    <div className="text-xs sm:text-sm font-semibold text-green-800">1-Mark NAT</div>
                    <div className="text-xl sm:text-2xl font-bold text-green-700">{correct1MNAT}</div>
                    <div className="text-xs text-green-600">Correct</div>
                  </div>
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
                    <div className="text-xs sm:text-sm font-semibold text-green-800">2-Mark NAT</div>
                    <div className="text-xl sm:text-2xl font-bold text-green-700">{correct2MNAT}</div>
                    <div className="text-xs text-green-600">Correct</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6">
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 sm:h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${scorePercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-2">
                  <span>0%</span>
                  <span>Score: {scorePercentage}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-blue-200">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700 mb-1 sm:mb-2">{r.attempted}/{r.totalQuestions}</div>
              <div className="text-xs sm:text-sm text-gray-700 font-semibold">Questions Attempted</div>
              <div className="text-xs text-gray-500 mt-1">{((r.attempted / r.totalQuestions) * 100).toFixed(0)}% of total</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-green-200">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 mb-1 sm:mb-2">{r.correct}</div>
              <div className="text-xs sm:text-sm text-gray-700 font-semibold">Correct Answers</div>
              <div className="text-xs text-gray-500 mt-1">{accuracy}% accuracy</div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-red-200">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-700 mb-1 sm:mb-2">{r.wrong}</div>
              <div className="text-xs sm:text-sm text-gray-700 font-semibold">Wrong Answers</div>
              <div className="text-xs text-gray-500 mt-1">{r.oneMarkWrong} × 1M, {r.twoMarkWrong} × 2M</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-purple-200">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-700 mb-1 sm:mb-2">-{r.negativeMarks}</div>
              <div className="text-xs sm:text-sm text-gray-700 font-semibold">Negative Marks</div>
              <div className="text-xs text-gray-500 mt-1">Deducted for wrong MCQs</div>
            </div>
          </div>

          {/* Question-wise Breakdown */}
          <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Question-wise Analysis</h3>
                <p className="text-gray-600 text-sm">Detailed breakdown of each question attempt</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setShowQuestionDetails(!showQuestionDetails)}
                  className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all flex items-center text-sm"
                >
                  <BarChart3 size={16} className="mr-2" />
                  {showQuestionDetails ? 'Hide Questions' : 'Show All Questions'}
                </button>
                <button 
                  onClick={viewFormattedPaper}
                  className="px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all flex items-center text-sm"
                >
                  <Printer size={16} className="mr-2" />
                  View Paper
                </button>
                <button 
                  onClick={downloadFormattedPaper}
                  className="px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all flex items-center text-sm"
                >
                  <Download size={16} className="mr-2" />
                  Download Paper
                </button>
              </div>
            </div>

            {showQuestionDetails && r.questionWiseResults && (
              <>
                {/* Section Filter */}
                {sections.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-3 sm:mb-4">
                      <span className="text-gray-700 font-medium text-sm">Filter by Section:</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedSection('all')}
                          className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${selectedSection === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                          All ({r.questionWiseResults.length})
                        </button>
                        {sections.map((section, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedSection(section)}
                            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${selectedSection === section ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                          >
                            {section} ({r.questionWiseResults.filter(q => q.section === section).length})
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Question Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
                    <div className="text-base sm:text-lg font-bold text-green-700">{correctQuestions.length}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Correct Questions</div>
                  </div>
                  <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200">
                    <div className="text-base sm:text-lg font-bold text-red-700">{wrongQuestions.length}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Wrong Questions</div>
                  </div>
                  <div className="bg-gray-100 p-3 sm:p-4 rounded-lg border border-gray-300">
                    <div className="text-base sm:text-lg font-bold text-gray-700">{notAttemptedQuestions.length}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Not Attempted</div>
                  </div>
                </div>

                {/* Questions Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-300 mb-4 sm:mb-6">
                  <div className="min-w-[800px]">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Q.No</th>
                          <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Section</th>
                          <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                          <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Marks</th>
                          <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Your Answer</th>
                          <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Correct Answer</th>
                          <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Marks</th>
                          <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Details</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredQuestions.map((question, idx) => (
                          <tr 
                            key={idx} 
                            className={`hover:bg-gray-50 ${question.status === 'correct' ? 'bg-green-50' : question.status === 'wrong' ? 'bg-red-50' : 'bg-gray-50'}`}
                          >
                            <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                              <div className="font-bold text-gray-900 text-sm">Q{question.id}</div>
                            </td>
                            <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                              <span className="text-xs sm:text-sm text-gray-600">{question.section}</span>
                            </td>
                            <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${question.type === 'MCQ' ? 'bg-blue-100 text-blue-800' : question.type === 'MSQ' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                {question.type}
                              </span>
                            </td>
                            <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                              <span className="font-medium text-gray-900 text-sm">{question.marks}</span>
                            </td>
                            <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                              <div className="text-xs sm:text-sm font-medium text-gray-900">
                                {formatAnswer(question.userAnswer, question)}
                              </div>
                            </td>
                            <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                              <div className="text-xs sm:text-sm font-medium text-green-700">
                                {(() => {
                                  if (!question.correctAnswer && question.correctAnswer !== 0) return 'N/A';
                                  const options = ['A', 'B', 'C', 'D'];
                                  
                                  if (question.type === 'MCQ') {
                                    const answer = question.correctAnswer;
                                    if (typeof answer === 'number') {
                                      return `Option ${options[answer] || answer}`;
                                    }
                                    
                                    const answerStr = String(answer);
                                    const num = parseInt(answerStr);
                                    if (!isNaN(num)) {
                                      return `Option ${options[num] || answerStr}`;
                                    }
                                    
                                    if (options.includes(answerStr.toUpperCase())) {
                                      return `Option ${answerStr.toUpperCase()}`;
                                    }
                                    
                                    return answerStr;
                                  }
                                  
                                  if (question.type === 'MSQ') {
                                    const answer = question.correctAnswer;
                                    
                                    if (Array.isArray(answer)) {
                                      return answer.map(a => {
                                        if (typeof a === 'number') {
                                          return `Option ${options[a] || a}`;
                                        }
                                        const num = parseInt(a);
                                        return !isNaN(num) ? `Option ${options[num] || a}` : a;
                                      }).join(', ');
                                    }
                                    
                                    const answerStr = String(answer);
                                    if (answerStr.includes(',')) {
                                      return answerStr.split(',').map(idx => {
                                        const numIdx = parseInt(idx.trim());
                                        return !isNaN(numIdx) ? `Option ${options[numIdx] || idx}` : idx;
                                      }).join(', ');
                                    }
                                    
                                    const num = parseInt(answerStr);
                                    if (!isNaN(num)) {
                                      return `Option ${options[num] || answerStr}`;
                                    }
                                    
                                    return answerStr;
                                  }
                                  
                                  return String(question.correctAnswer);
                                })()}
                              </div>
                            </td>
                            <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${question.status === 'correct' ? 'bg-green-100 text-green-800' : question.status === 'wrong' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                {question.status === 'correct' ? 'Correct' : 
                                 question.status === 'wrong' ? 'Wrong' : 
                                 'Not Attempted'}
                              </span>
                            </td>
                            <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                              <div className={`font-bold text-sm ${question.marksObtained > 0 ? 'text-green-700' : question.marksObtained < 0 ? 'text-red-700' : 'text-gray-700'}`}>
                                {question.marksObtained > 0 ? `+${question.marksObtained}` : question.marksObtained}
                              </div>
                            </td>
                            <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                              <button 
                                onClick={() => setSelectedQuestion(question)}
                                className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs sm:text-sm hover:bg-blue-200 transition-colors"
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Wrong Questions Summary */}
                {wrongQuestions.length > 0 && (
                  <div className="mt-6 sm:mt-8">
                    <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Wrong Questions Analysis</h4>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="font-semibold text-red-800 mb-2 text-sm">1-Mark Questions Wrong:</div>
                          <div className="flex flex-wrap gap-2">
                            {wrongQuestions
                              .filter(q => q.marks === 1)
                              .map((q, idx) => (
                                <span key={idx} className="px-2 sm:px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                  Q{q.id} (-0.33)
                                </span>
                              ))}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-red-800 mb-2 text-sm">2-Mark Questions Wrong:</div>
                          <div className="flex flex-wrap gap-2">
                            {wrongQuestions
                              .filter(q => q.marks === 2)
                              .map((q, idx) => (
                                <span key={idx} className="px-2 sm:px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                  Q{q.id} (-0.66)
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 text-xs sm:text-sm text-red-700">
                        Total negative marks from wrong answers: {r.negativeMarks}
                      </div>
                    </div>
                  </div>
                )}

                {/* Correct Questions Summary */}
                {correctQuestions.length > 0 && (
                  <div className="mt-6 sm:mt-8">
                    <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Correct Questions</h4>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex flex-wrap gap-2">
                        {correctQuestions.map((q, idx) => (
                          <span key={idx} className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Q{q.id} (+{q.marks})
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 text-xs sm:text-sm text-green-700">
                        Total marks earned from correct answers: {correctQuestions.reduce((sum, q) => sum + q.marks, 0)}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
              <div className="text-center p-3 sm:p-4 bg-white rounded-lg border">
                <div className="text-base sm:text-lg font-bold text-gray-800">{scorePercentage}%</div>
                <div className="text-xs text-gray-600">Overall Score %</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-white rounded-lg border">
                <div className="text-base sm:text-lg font-bold text-gray-800">{accuracy}%</div>
                <div className="text-xs text-gray-600">Accuracy Rate</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-white rounded-lg border">
                <div className="text-base sm:text-lg font-bold text-gray-800">{r.totalQuestions}</div>
                <div className="text-xs text-gray-600">Total Questions</div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-blue-200">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Performance Insights</h3>
            <div className="space-y-3">
              {r.oneMarkWrong > 5 && (
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle size={12} className="text-red-600" />
                  </div>
                  <p className="text-gray-700 text-sm">High number of 1-mark questions wrong ({r.oneMarkWrong}). Focus on accuracy in easy questions.</p>
                </div>
              )}
              {r.twoMarkWrong > 3 && (
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle size={12} className="text-red-600" />
                  </div>
                  <p className="text-gray-700 text-sm">Several 2-mark questions incorrect ({r.twoMarkWrong}). These carry higher negative impact.</p>
                </div>
              )}
              {r.attempted < r.totalQuestions * 0.8 && (
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle size={12} className="text-yellow-600" />
                  </div>
                  <p className="text-gray-700 text-sm">You attempted only {r.attempted} out of {r.totalQuestions} questions. Try to attempt more questions.</p>
                </div>
              )}
              {accuracy > 70 && (
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={12} className="text-green-600" />
                  </div>
                  <p className="text-gray-700 text-sm">Great accuracy rate of {accuracy}%! Keep up the good work on question selection.</p>
                </div>
              )}
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Target size={12} className="text-blue-600" />
                </div>
                <p className="text-gray-700 text-sm">Review your wrong answers to understand mistakes and avoid similar errors in future attempts.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button 
              onClick={handleExit}
              disabled={isExiting}
              className={`flex-1 py-3 sm:py-3.5 rounded-lg font-semibold transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center text-sm sm:text-base ${
                isExiting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
              }`}
            >
              {isExiting ? 'Exiting...' : 'Practice Again'}
            </button>
            
            <button 
              onClick={() => window.close()}
              className="flex-1 py-3 sm:py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center text-sm sm:text-base"
            >
              <CheckCircle size={16} className="mr-2" />
              Hogya Aaj Ka
            </button>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-xs sm:text-sm">
              This is a practice session. For best results, review your wrong answers and understand the concepts.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Score: {netScore.toFixed(2)} / {totalMarks} • Accuracy: {accuracy}% • Negative Marks: {r.negativeMarks}
            </p>
          </div>
        </div>
      </div>

      {/* Question Details Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto m-2 sm:m-4">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Question {selectedQuestion.id} Details</h3>
                <button 
                  onClick={() => setSelectedQuestion(null)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>
              
              <div className="mb-3 sm:mb-4">
                <p className="text-gray-900 font-medium mb-1 sm:mb-2 text-sm sm:text-base">{selectedQuestion.question}</p>
                {selectedQuestion.options && selectedQuestion.options.length > 0 && (
                  <div className="space-y-2">
                    {selectedQuestion.options.map((option, idx) => {
                      // Parse correct answers
                      const correctAnswers = String(selectedQuestion.correctAnswer).split(',').map(k => k.trim());
                      const isCorrect = correctAnswers.includes(String(idx));
                      
                      // Check user answers
                      let isUserAnswer = false;
                      if (selectedQuestion.type === 'MSQ') {
                        const userIndices = Array.isArray(selectedQuestion.userAnswer) ? selectedQuestion.userAnswer : [selectedQuestion.userAnswer];
                        isUserAnswer = userIndices.includes(idx);
                      } else {
                        isUserAnswer = selectedQuestion.userAnswer == idx;
                      }
                      
                      return (
                        <div 
                          key={idx} 
                          className={`p-2 rounded border text-sm sm:text-base ${
                            isCorrect ? 'bg-green-50 border-green-200' : 
                            isUserAnswer && !isCorrect ? 'bg-red-50 border-red-200' : 
                            'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {option}
                          {isCorrect && <span className="ml-2 text-green-600 font-bold text-xs sm:text-sm">✓ Correct</span>}
                          {isUserAnswer && !isCorrect && <span className="ml-2 text-red-600 font-bold text-xs sm:text-sm">✗ Your Answer</span>}
                          {isUserAnswer && isCorrect && <span className="ml-2 text-green-600 font-bold text-xs sm:text-sm">✓ Your Answer</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <span className="font-medium">Your Answer:</span> {formatAnswer(selectedQuestion.userAnswer, selectedQuestion)}
                </div>
                <div>
                  <span className="font-medium">Correct Answer:</span> {formatAnswer(selectedQuestion.correctAnswer, selectedQuestion)}
                </div>
                <div>
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-1 px-2 py-1 text-xs rounded-full ${selectedQuestion.status === 'correct' ? 'bg-green-100 text-green-800' : selectedQuestion.status === 'wrong' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                    {selectedQuestion.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Marks Obtained:</span> {selectedQuestion.marksObtained}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper components
const ChevronRight = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const AlertCircle = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Main PreExamViews Component
export default function PreExamViews({ 
  view, setView, user, config, setConfig, 
  setQuestions, setAnswerKey, questionsLoaded, 
  onLogin, onStart, onBegin, resultData,
  isLoading = false,
  yearOptions = []
}) {
  switch(view) {
    case 'login': 
      return <LoginView onLogin={onLogin} isLoading={isLoading} />;
    case 'setup': 
      return <SetupView 
        config={config} 
        setConfig={setConfig} 
        setQuestions={setQuestions} 
        setAnswerKey={setAnswerKey} 
        questionsLoaded={questionsLoaded} 
        onStart={onStart}
        isLoading={isLoading}
        yearOptions={yearOptions}
      />;
    case 'instructions': 
      return <InstructionsView config={config} onBegin={onBegin} isLoading={isLoading} />;
    case 'result': 
      return <ResultView resultData={resultData} setView={setView} config={config} user={user} />;
    default: 
      return null;
  }
}