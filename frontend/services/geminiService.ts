import { GoogleGenAI, Type } from '@google/genai';
import { TimeBlock, DailyLog, SubjectWeakness } from '../types';

// Safely get user's custom Gemini API Key from localStorage
const getAiClient = (customKey?: string) => {
  const savedKey = typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : '';
  const apiKey = (customKey || savedKey || '').trim();
  
  return {
    client: apiKey ? new GoogleGenAI({ apiKey, vertexai: true }) : null,
    hasKey: Boolean(apiKey)
  };
};

/**
 * Generate a smart dynamic study schedule using Gemini
 */
export async function generateSmartSchedule(params: {
  examName: string;
  daysLeft: number;
  dailyHours: number;
  subjectLevels: { subject: string; level: number }[];
  weakTopics: string;
}): Promise<TimeBlock[]> {
  try {
    const { client, hasKey } = getAiClient();
    if (!hasKey || !client) {
      alert('請先點擊左上角 LOGO 開啟「設定 > AI 引擎設定」並輸入您的 Gemini API Key！');
      return [];
    }

    const prompt = `你是一個專業的高中升學輔導 AI 顧問。
請根據學生目前的狀態產生一份今晚/明日的讀書計畫。
考試名稱: ${params.examName} (倒數 ${params.daysLeft} 天)
每日可讀書時間: ${params.dailyHours} 小時
各科程度: ${JSON.stringify(params.subjectLevels)}
特別想加強的弱點: ${params.weakTopics}

規則:
1. 時間分配需合理，安排 10 分鐘適度休息。
2. 成績較弱或倒數急迫的科目需優先安排 (Priority: High)。
3. 請輸出 JSON 格式陣列。`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              timeRange: { type: Type.STRING, description: '例如: 18:00 ~ 19:00' },
              subject: { type: Type.STRING, description: '必須為高中標準科目名稱' },
              topic: { type: Type.STRING, description: '具體讀書單元與任務' },
              priority: { type: Type.STRING, description: 'High, Medium, 或 Low' },
              completed: { type: Type.BOOLEAN },
              notes: { type: Type.STRING, description: 'AI 提醒重點' }
            },
            required: ['id', 'timeRange', 'subject', 'topic', 'priority', 'completed']
          }
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text.trim());
      return parsed.map((item: any, index: number) => ({
        ...item,
        id: `gen-${Date.now()}-${index}`,
        subject: item.subject || '數學A/B',
        completed: false
      }));
    }
  } catch (error: any) {
    console.error('Failed to generate smart schedule:', error);
    alert('AI 排程運算失敗：' + (error?.message || '請檢查您的 Gemini API Key 是否正確'));
  }

  return [];
}

/**
 * AI Weakness Diagnosis
 */
export async function analyzeSubjectWeakness(
  subject: string,
  testScores: string
): Promise<SubjectWeakness> {
  try {
    const { client, hasKey } = getAiClient();
    if (!hasKey || !client) {
      alert('請先點擊左上角 LOGO 開啟「設定 > AI 引擎設定」並輸入您的 Gemini API Key！');
      return {
        subject,
        overallScore: 70,
        subtopics: [
          { name: '請先配置 API Key', mastery: 0, status: 'Needs Work', suggestedAction: '前往設定頁面填寫免費 Gemini API Key' }
        ]
      };
    }

    const prompt = `請分析高中學生在【${subject}】的考試表現，給出細項單元的掌握度分析與改善建議。
學生輸入的考試紀錄/錯誤題型:
${testScores}`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            overallScore: { type: Type.INTEGER, description: '預估整體掌握分度 0-100' },
            subtopics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: '單元名稱' },
                  mastery: { type: Type.INTEGER, description: '掌握度百分比 0-100' },
                  status: { type: Type.STRING, description: 'Needs Work, Moderate, 或 Mastered' },
                  suggestedAction: { type: Type.STRING, description: '具體改善建議' }
                },
                required: ['name', 'mastery', 'status', 'suggestedAction']
              }
            }
          },
          required: ['subject', 'overallScore', 'subtopics']
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text.trim());
      return {
        ...parsed,
        subject
      };
    }
  } catch (error: any) {
    console.error('Weakness analysis error:', error);
    alert('弱點診斷失敗：' + (error?.message || '請確認 API Key 有效性'));
  }

  return {
    subject,
    overallScore: 70,
    subtopics: [
      { name: '核心觀念理解', mastery: 65, status: 'Needs Work', suggestedAction: '再複習課本基本定義與範例' }
    ]
  };
}

/**
 * AI Tutor QA with step-by-step resolution & exercise generator
 */
export async function askAiTutor(
  question: string,
  subject: string
): Promise<{ explanation: string; example: string; practiceQuestion: string; answerKey: string }> {
  try {
    const { client, hasKey } = getAiClient();
    if (!hasKey || !client) {
      return {
        explanation: '⚠️ 尚未配置 Gemini API Key。請點擊畫面左上角 LOGO 開啟「設定 > AI 引擎設定」，輸入您的 Gemini API Key 即可開啟即時 AI 導師解題！',
        example: '💡 提示：前往 Google AI Studio (https://aistudio.google.com/app/apikey) 即可免費申請 API 金鑰。',
        practiceQuestion: '請至設定頁面完成 API Key 配置。',
        answerKey: '於設定頁面儲存 API Key 後即可開始隨時提問。'
      };
    }

    const prompt = `你是一位熱心且極富耐心的高中優良導師。學生正在發問有關【${subject}】的問題：
"${question}"

請依照以下結構回答：
1. 概念解釋：簡明易懂的學理說明，搭配日常生活譬喻。
2. 經典示範例題：一題標準範例與詳細解題步驟。
3. 隨堂練習題：出一題同類型題目讓學生親自計算/回答。
4. 解答與解析：給出練習題的正確答案與步驟。`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.STRING },
            example: { type: Type.STRING },
            practiceQuestion: { type: Type.STRING },
            answerKey: { type: Type.STRING }
          },
          required: ['explanation', 'example', 'practiceQuestion', 'answerKey']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
  } catch (error: any) {
    console.error('AI Tutor request failed:', error);
  }

  return {
    explanation: '連線出錯或 API Key 無效。請檢查您的 Gemini API Key 是否具有存取權限。',
    example: '範例：F = ma，當質量 m 為 2kg，加速度 a 為 3m/s² 時，作用力 F = 6N。',
    practiceQuestion: '練習：若作用力改為 12N，質量不變，加速度為何？',
    answerKey: '解答：a = F / m = 12 / 2 = 6 m/s²。'
  };
}

/**
 * Summarize daily study entries into a formatted Learning Portfolio (學習歷程檔案)
 */
export async function generatePortfolioPDFContent(logs: DailyLog[]): Promise<string> {
  try {
    const { client, hasKey } = getAiClient();
    if (!hasKey || !client) {
      alert('請先於設定中配置 Gemini API Key，即可一鍵生成教育部標準學習歷程檔案 Markdown 報告！');
      return '⚠️ 請先於設定中配置 Gemini API Key';
    }

    const prompt = `請根據以下學生最近的每日讀書紀錄，整理並生成一份符合教育部標準格式的【高中學習歷程檔案 - 自主學習心得與成果總結】 markdown 文件：

學習紀錄列表:
${JSON.stringify(logs)}

請包含以下章節：
# 1. 學習動機與規劃目標
# 2. 學習過程與執行方法 (提及具體科目與時間投入)
# 3. 遇到之困難與解決策略
# 4. 學習成果與反思心得
# 5. 未來展望與進階規劃`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    return response.text || '無法生成歷程總結';
  } catch (error) {
    console.error('Portfolio export error:', error);
    return '生成失敗，請確認 API Key 設定。';
  }
}

/**
 * AI Historical Day Synthesis & Recovery Review (往日復盤)
 */
export async function generateHistoricalReview(
  date: string,
  tasks: TimeBlock[],
  focusMinutes: number,
  reflection?: string,
  mood?: string
): Promise<string> {
  try {
    const { client, hasKey } = getAiClient();
    if (!hasKey || !client) {
      return '⚠️ 尚未配置 Gemini API Key。請前往「設定 > AI 引擎設定」填寫金鑰即可解鎖歷史 AI 復盤診斷！';
    }

    const prompt = `你是一位溫暖且專業的高中導師與學習分析師。
請對學生在【${date}】這天的學習歷史紀錄進行精準復盤與溫馨反思講評：

當日數據:
- 累積專注時間: ${focusMinutes} 分鐘
- 當日學習情緒: ${mood || '😊'}
- 完成讀書任務列表: ${JSON.stringify(tasks.map(t => ({ subject: t.subject, topic: t.topic, priority: t.priority, completed: t.completed })))}
- 學生當日個人心得: ${reflection || '無特殊紀錄'}

請寫一段 100-150 字的【AI 學習復盤診斷與給予學生的溫心勉勵】（繁體中文），語氣鼓勵、務實且具建設性：`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    return response.text?.trim() || '當天讀書執行力良好！保持專注，維持規律複習，學測必定能獲得理想成績。';
  } catch (error) {
    console.error('Historical review generation error:', error);
    return '🎯【AI 復盤評價】您在這天付出了踏實的努力！維持好讀書節奏，繼續朝目標向前邁進。';
  }
}

/**
 * Generate AI Daily Advice & Efficiency Insights
 */
export async function getDailyInsight(
  completionRate: number,
  recentMood: string,
  focusTimeMinutes: number
): Promise<{ quote: string; advice: string; efficiencyTip: string }> {
  try {
    const { client, hasKey } = getAiClient();
    if (!hasKey || !client) {
      return {
        quote: '歡迎使用 StudyPilot AI！請點擊左上角 LOGO 配置您的 Gemini API Key。',
        advice: '前往 Google AI Studio 免費申請 API Key，即刻開啟智慧進度規劃。',
        efficiencyTip: '可以在「設定 > AI 引擎設定」中隨時輸入或變更金鑰。'
      };
    }

    const prompt = `你是 StudyPilot AI 學習領航員。
學生今天完成率：${completionRate}%
近期心情表情：${recentMood}
今天累積專注：${focusTimeMinutes} 分鐘

請給予短巧精準的每日溫馨建議與學習效率提醒（繁體中文）：`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              quote: { type: Type.STRING, description: '一句金句勵志語' },
              advice: { type: Type.STRING, description: '給予學生的學習建議' },
              efficiencyTip: { type: Type.STRING, description: '讀書效率小撇步' }
            }
          }
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text.trim());
      return parsed[0] || parsed;
    }
  } catch (error) {
    console.error('Daily advice request failed:', error);
  }

  return {
    quote: '堅持不是因為有希望才堅持，而是堅持了才能看到希望。',
    advice: '今天完成度很棒，建議稍作休息後，趁記憶猶新快速複習今天的弱點題庫！',
    efficiencyTip: '晚上 8:00 - 9:30 是大腦邏輯思考的高峰期，最適合演算數學與理化題目。'
  };
}
