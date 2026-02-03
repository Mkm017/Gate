"use client";
import React, { useState, useEffect } from "react";
import PreExamViews from "./PreExamViews";
import ExamInterface from "./ExamInterface";

export default function GateSimulator() {
  const [view, setView] = useState("login");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [config, setConfig] = useState({
    examName: "GATE",
    year: new Date().getFullYear(),
    subject: "Computer Science",
    set: "1",
    duration: 180
  });

  const [questions, setQuestions] = useState([]);
  const [answerKey, setAnswerKey] = useState({});
  const [resultData, setResultData] = useState(null);

  /* -------------------- HELPERS -------------------- */

  const optionLetters = ["A", "B", "C", "D"];

  const normalizeKey = (qid) => {
    const raw = answerKey[qid];
    if (raw === undefined) return null;

    // MCQ: "A"
    if (typeof raw === "string" && optionLetters.includes(raw)) {
      return { type: "MCQ", value: optionLetters.indexOf(raw) };
    }

    // MSQ: ["B","D"]
    if (Array.isArray(raw) && raw.every(v => optionLetters.includes(v))) {
      return {
        type: "MSQ",
        values: raw.map(v => optionLetters.indexOf(v))
      };
    }

    // NAT range: ["-2.1 to -1.9"]
    if (Array.isArray(raw) && raw.length === 1 && raw[0].includes("to")) {
      const [min, max] = raw[0].split("to").map(Number);
      return { type: "NAT_RANGE", min, max };
    }

    // NAT set: ["10","11"]
    if (Array.isArray(raw)) {
      return { type: "NAT_SET", values: raw.map(String) };
    }

    // NAT single
    return { type: "NAT_SINGLE", value: String(raw) };
  };

  /* -------------------- LOGIN -------------------- */

  const USERS = [
    { password: "rs", name: "RS" },
    { password: "mkm", name: "MKM" },
    { password: "ij", name: "IJ" }
  ];

  const handleLogin = ({ password }) => {
    setIsLoading(true);
    const found = USERS.find(u => u.password === password);
    setTimeout(() => {
      if (!found) {
        alert("Invalid password");
      } else {
        setUser({ name: found.name });
        setView("setup");
      }
      setIsLoading(false);
    }, 100);
  };

  /* -------------------- EXAM FLOW -------------------- */

  const handleStartExam = () => setView("instructions");
  const handleBeginTest = () => setView("exam");

  const handleExamSubmit = (answers, timeTaken, qStatus = {}) => {
    setIsLoading(true);

    let attempted = 0;
    let correct = 0;
    let wrong = 0;
    let totalScore = 0;
    let oneMarkWrong = 0;
    let twoMarkWrong = 0;
    let negativeMarks = 0;

    const questionWiseResults = [];

    questions.forEach(q => {
      const key = normalizeKey(q.id);
      const userAns = answers[q.id];

      let status = "not_attempted";
      let marksObtained = 0;
      let isCorrect = false;

      if (userAns !== undefined && userAns !== null && userAns !== "") {
        attempted++;

        /* ---------- MCQ ---------- */
        if (q.type === "MCQ" && key?.type === "MCQ") {
          if (Number(userAns) === key.value) {
            isCorrect = true;
            marksObtained = q.marks;
            totalScore += q.marks;
            correct++;
            status = "correct";
          } else {
            wrong++;
            status = "wrong";
            if (q.marks === 1) {
              oneMarkWrong++;
              negativeMarks += 1 / 3;
              totalScore -= 1 / 3;
              marksObtained = -1 / 3;
            } else {
              twoMarkWrong++;
              negativeMarks += 2 / 3;
              totalScore -= 2 / 3;
              marksObtained = -2 / 3;
            }
          }
        }

        /* ---------- MSQ ---------- */
        else if (q.type === "MSQ" && key?.type === "MSQ") {
          const userSet = Array.isArray(userAns) ? userAns : [];
          const correctSet = key.values;

          const exact =
            userSet.length === correctSet.length &&
            userSet.every(v => correctSet.includes(v));

          if (exact) {
            isCorrect = true;
            marksObtained = q.marks;
            totalScore += q.marks;
            correct++;
            status = "correct";
          } else {
            wrong++;
            status = "wrong";
          }
        }

        /* ---------- NAT ---------- */
        else if (q.type === "NAT") {
          const ua = Number(userAns);

          if (key?.type === "NAT_SINGLE" && String(userAns) === key.value) {
            isCorrect = true;
          }
          if (key?.type === "NAT_SET" && key.values.includes(String(userAns))) {
            isCorrect = true;
          }
          if (
            key?.type === "NAT_RANGE" &&
            ua >= key.min &&
            ua <= key.max
          ) {
            isCorrect = true;
          }

          if (isCorrect) {
            marksObtained = q.marks;
            totalScore += q.marks;
            correct++;
            status = "correct";
          } else {
            wrong++;
            status = "wrong";
          }
        }
      }

      questionWiseResults.push({
        id: q.id,
        section: q.section,
        type: q.type,
        marks: q.marks,
        question: q.question,
        options: Array.isArray(q.options) ? q.options : [],
        userAnswer: userAns,
        correctAnswer:
          key?.type === "MCQ"
            ? key.value
            : key?.type === "MSQ"
            ? key.values.join(",")
            : key?.type === "NAT_RANGE"
            ? `${key.min} to ${key.max}`
            : key?.type === "NAT_SET"
            ? key.values.join(", ")
            : key?.value ?? null,
        isCorrect,
        marksObtained,
        status
      });
    });

    totalScore = Math.max(0, totalScore);

    const totalQuestions = questions.length;
    const totalPossibleScore = questions.reduce((s, q) => s + q.marks, 0);

    setResultData({
      score: totalScore.toFixed(2),
      attempted,
      correct,
      wrong,
      totalQuestions,
      totalPossibleScore,
      percentage:
        totalPossibleScore > 0
          ? ((totalScore / totalPossibleScore) * 100).toFixed(2)
          : "0.00",
      oneMarkWrong,
      twoMarkWrong,
      negativeMarks: negativeMarks.toFixed(2),
      markedForReview: 0,
      answeredAndMarked: 0,
      timeTaken,
      questionWiseResults
    });

    setView("result");
    setIsLoading(false);
  };

  /* -------------------- RENDER -------------------- */

  if (view === "exam") {
    return (
      <ExamInterface
        user={user}
        config={config}
        questions={questions}
        answerKey={answerKey}
        onSubmit={handleExamSubmit}
      />
    );
  }

  return (
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
      yearOptions={Array.from(
        { length: new Date().getFullYear() - 1986 },
        (_, i) => 1987 + i
      )}
    />
  );
}
