import React, { useState } from 'react';
import { Bot, Send, Sparkles, BookOpen, HelpCircle, RefreshCw } from 'lucide-react';
import { askAiTutor } from '../services/geminiService';

interface AiTutorChatProps {
  subjects: string[];
}

export const AiTutorChat: React.FC<AiTutorChatProps> = ({ subjects }) => {
  const [subject, setSubject] = useState<string>(subjects[0] || '物理');
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    {
      userQ: string;
      aiResponse: { explanation: string; example: string; practiceQuestion: string; answerKey: string };
    }[]
  >([
    {
      userQ: '我不懂牛頓第二運動定律',
      aiResponse: {
        explanation:
          '牛頓第二運動定律 (F = ma) 說明「物體受到的淨外力 F，會使物體產生與外力同方向的加速度 a」。質量 m 越大，越難改變其運動狀態（慣性大）。以打棒球比喻：用相同的力氣揮棒，打羽球 (質量小) 比打保齡球 (質量大) 能飛得快得多。',
        example:
          '【範例題】質量為 4 kg 的物體在水平光滑無摩擦面上，受到 20 N 向東的水平推力，求物體的加速度？\n解：根據 F = ma，20 = 4 × a ➔ a = 5 m/s² (向東)。',
        practiceQuestion:
          '【隨堂練】若改在有摩擦力的地面上推動同一個 4 kg 物體，動摩擦力為 4 N，若依然施加 20 N 向東的推力，此時物體的加速度為多少？',
        answerKey:
          '【解答解析】合力 ΣF = 20 (推力) - 4 (摩擦力) = 16 N (向東)。\n由 F = ma ➔ 16 = 4 × a ➔ a = 4 m/s² (向東)。'
      }
    }
  ]);

  const handleSendQuestion = async () => {
    if (!question.trim()) return;
    const currentQ = question;
    setQuestion('');
    setIsLoading(true);

    const result = await askAiTutor(currentQ, subject);
    setChatHistory((prev) => [
      ...prev,
      {
        userQ: currentQ,
        aiResponse: result
      }
    ]);
    setIsLoading(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-[2.5rem] shadow-sm flex flex-col h-[680px] overflow-hidden transition-colors duration-300">
      
      {/* Header */}
      <div className="p-6 bg-slate-950 dark:bg-slate-950 text-white flex items-center justify-between border-b dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white text-slate-950 flex items-center justify-center font-black">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-white">AI 專屬問答助教</h2>
            <p className="text-xs text-slate-400">觀念拆解 + 範例示範 + 隨堂練習</p>
          </div>
        </div>

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="bg-slate-900 dark:bg-slate-800 border border-slate-800 text-white rounded-full px-4 py-2 text-xs font-black focus:outline-none"
        >
          {subjects.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f4f6fb] dark:bg-slate-950">
        {chatHistory.map((item, index) => (
          <div key={index} className="space-y-4">
            <div className="flex justify-end">
              <div className="bg-slate-950 dark:bg-indigo-600 text-white font-semibold p-4 rounded-2xl rounded-tr-none max-w-lg text-xs shadow-sm">
                {item.userQ}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-amber-300 text-slate-950 flex items-center justify-center font-black shrink-0 mt-1">
                <Sparkles className="w-4 h-4 fill-slate-950" />
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl rounded-tl-none max-w-2xl space-y-4 text-xs text-slate-800 dark:text-slate-200 shadow-sm">
                
                <div className="space-y-1">
                  <span className="font-black text-slate-950 dark:text-white flex items-center space-x-1 text-sm">
                    <BookOpen className="w-4 h-4" />
                    <span>核心觀念說明</span>
                  </span>
                  <p className="leading-relaxed text-slate-700 dark:text-slate-300 font-semibold">{item.aiResponse.explanation}</p>
                </div>

                <div className="bg-[#f4f6fb] dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-slate-950 dark:text-amber-300 whitespace-pre-line font-bold">
                  {item.aiResponse.example}
                </div>

                <div className="bg-amber-50 dark:bg-amber-400/10 p-4 rounded-xl border border-amber-200 dark:border-amber-400/20 space-y-2">
                  <span className="font-black text-amber-900 dark:text-amber-300 flex items-center space-x-1">
                    <HelpCircle className="w-4 h-4" />
                    <span>隨堂自我小測驗</span>
                  </span>
                  <p className="text-amber-950 dark:text-slate-100 font-bold">{item.aiResponse.practiceQuestion}</p>

                  <details className="mt-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                    <summary className="font-extrabold hover:text-slate-950 dark:hover:text-white transition">
                      👉 點擊解開標準答案與解析
                    </summary>
                    <p className="mt-2 text-emerald-800 dark:text-emerald-400 font-bold whitespace-pre-line font-mono bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                      {item.aiResponse.answerKey}
                    </p>
                  </details>
                </div>

              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-950 dark:bg-indigo-600 text-white flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950 dark:text-indigo-400" />
              <span>AI 正在演算觀念與範例...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendQuestion()}
          placeholder={`對【${subject}】有不懂的概念？隨時發問！`}
          className="flex-1 bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full px-5 py-3 text-xs font-semibold text-slate-950 dark:text-white focus:outline-none focus:border-slate-950 dark:focus:border-indigo-500"
        />
        <button
          onClick={handleSendQuestion}
          disabled={isLoading || !question.trim()}
          className="p-3 bg-slate-950 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white rounded-full transition disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
