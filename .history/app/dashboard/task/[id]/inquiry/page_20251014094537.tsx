"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// 模拟的问题数据（后续会从后端获取）
const mockQuestions = [
  {
    id: 1,
    question: "你的目标受众是谁？他们的年龄段、职业背景、兴趣爱好是什么？",
    placeholder: "例如：25-35岁的程序员，对新技术感兴趣，经常刷技术博客...",
    required: true
  },
  {
    id: 2,
    question: "你之前在这个领域发布过类似内容吗？效果如何？",
    placeholder: "例如：发过3期AI相关视频，播放量在5-10万之间...",
    required: true
  },
  {
    id: 3,
    question: "你希望通过这次内容达到什么目标？",
    placeholder: "例如：涨粉、变现、建立个人品牌...",
    required: false
  },
  {
    id: 4,
    question: "你的内容创作周期是怎样的？有哪些资源限制？",
    placeholder: "例如：每周更新2次，主要是时间有限...",
    required: false
  }
]

export default function InquiryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [currentStep, setCurrentStep] = useState(0)

  const totalQuestions = mockQuestions.length
  const progress = ((currentStep + 1) / totalQuestions) * 100

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

const handleNext = () => {
  const currentQuestion = mockQuestions[currentStep]
  
  // 必填题必须回答
  if (currentQuestion.required && !answers[currentQuestion.id]?.trim()) {
    alert("请回答此问题后继续")
    return
  }
  
  // 选填题未回答时，提示用户
  if (!currentQuestion.required && !answers[currentQuestion.id]?.trim()) {
    const confirmSkip = window.confirm(
      "💡 提示：你给出的信息越丰富，我们为你提供的决策分析质量越高。\n\n确定要跳过这个问题吗？"
    )
    if (!confirmSkip) {
      return // 用户选择不跳过，停留在当前问题
    }
  }
  
  if (currentStep < totalQuestions - 1) {
    setCurrentStep(prev => prev + 1)
  }
    
    if (unansweredRequired.length > 0) {
      alert("请回答所有必填问题")
      return
    }

    // 后续会提交到后端，现在先跳转到进度页面
    console.log("提交的答案：", answers)
    router.push(`/dashboard/task/${params.id}/progress`)
  }

  const currentQuestion = mockQuestions[currentStep]
  const canSubmit = currentStep === totalQuestions - 1

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              J
            </div>
            <span className="text-xl font-bold">JexAgent</span>
          </Link>
          
          <div className="text-sm text-gray-600">
            任务ID: {params.id}
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* 进度指示器 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              问题 {currentStep + 1} / {totalQuestions}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% 完成
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 提示信息 */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
          <div className="text-xl">💡</div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">为什么要问这些问题？</h3>
            <p className="text-sm text-blue-800">
              AI需要了解更多背景信息，才能给出精准的建议。这些问题由元认知AI分析你的需求后动态生成，只问最关键的信息。
            </p>
          </div>
        </div>

        {/* 问题卡片 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border-2 border-gray-100">
          {/* 问题编号和必填标记 */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
              {currentStep + 1}
            </div>
            {currentQuestion.required && (
              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
                必填
              </span>
            )}
          </div>

          {/* 问题标题 */}
          <h2 className="text-2xl font-bold mb-6 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* 回答输入框 */}
          <textarea
            value={answers[currentQuestion.id] || ""}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            placeholder={currentQuestion.placeholder}
            rows={8}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
          />

          <div className="mt-2 text-sm text-gray-500">
            字数：{answers[currentQuestion.id]?.length || 0} 
            {currentQuestion.required && " / 建议至少50字"}
          </div>
        </div>

        {/* 问题列表导航 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            {mockQuestions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentStep(idx)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  idx === currentStep
                    ? "bg-blue-600 text-white"
                    : answers[q.id]?.trim()
                    ? "bg-green-100 text-green-700 border-2 border-green-200"
                    : "bg-gray-100 text-gray-600 border-2 border-gray-200"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            点击数字可以直接跳转到对应问题
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-3 border-2 border-gray-200 rounded-xl font-medium hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            上一题
          </button>

          <div className="flex-1" />

          {!canSubmit ? (
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <span>下一题</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>提交答案，开始协作</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          )}
        </div>

        {/* 底部提示 */}
        <div className="mt-8 p-4 bg-gray-100 rounded-xl text-sm text-gray-600 text-center">
          💡 提示：回答越详细，AI的建议越精准。选填问题可以跳过，但建议尽量填写。
        </div>
      </div>
    </div>
  )
}