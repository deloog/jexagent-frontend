"use client"

import { useState, useEffect, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { taskAPI } from "@/lib/api"
import { useSocket } from "@/lib/useSocket"

interface InquiryQuestion {
  id: number
  question: string
  placeholder: string
  required: boolean
}

export default function InquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: taskId } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [questions, setQuestions] = useState<InquiryQuestion[]>([])
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [intermediateState, setIntermediateState] = useState<unknown>(null)
  const [infoSufficiency, setInfoSufficiency] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>("")
  const [isSkipped, setIsSkipped] = useState(false)

  // 提前建立WebSocket连接，确保后端推送进度时前端已经连接
  useSocket(taskId)

  useEffect(() => {
    // 从URL参数中获取问询数据
    const dataParam = searchParams.get('data')
    if (dataParam) {
      try {
        const data = JSON.parse(decodeURIComponent(dataParam))
        setQuestions(data.inquiry_details || [])
        setIntermediateState(data.intermediate_state)
        setInfoSufficiency(data.info_sufficiency || 0)
      } catch (err) {
        console.error('Failed to parse inquiry data:', err)
        setError("数据解析失败")
      }
    }
  }, [searchParams])

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 如果不是跳过问询，验证必填项
    if (!isSkipped) {
      const unansweredRequired = questions.filter(
        q => q.required && !answers[q.id]?.trim()
      )
      
      if (unansweredRequired.length > 0) {
        setError("请回答所有必填问题")
        return
      }
    }

    setIsSubmitting(true)
    setError("")

    try {
      // 发送数据到后端（无论是否跳过）
      await taskAPI.submitAnswers(taskId, {
        answers: isSkipped ? {} : answers,
        intermediate_state: intermediateState
      });

      // 只有在数据发送成功后跳转
      router.push(`/dashboard/task/${taskId}/progress`);
    } catch (err) {
      console.error('Task execution failed:', err);
      setError("提交失败，请重试");
      setIsSubmitting(false);
    }
  }

  const handleSkip = () => {
    // 跳过问询，使用现有信息继续
    if (confirm("跳过问询可能导致建议不够精准，确定要跳过吗？")) {
      setIsSkipped(true);
      // 不立即跳转，等待用户点击"开始AI协作"
    }
  }

  if (!questions.length && !error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              J
            </div>
            <span className="text-xl font-bold">JexAgent</span>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* 进度指示 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              信息充足度：{Math.round(infoSufficiency * 100)}%
            </span>
            <span className="text-sm text-gray-500">
              步骤 1/3
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${infoSufficiency * 100}%` }}
            />
          </div>
        </div>

        {/* 标题区域 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🤔</div>
            <div>
              <h1 className="text-3xl font-bold mb-2">AI需要了解更多信息</h1>
              <p className="text-lg text-gray-700">
                为了给你更精准的建议，请回答以下{questions.length}个问题
              </p>
              <p className="text-sm text-gray-600 mt-2">
                💡 提示：问题都很简单，通常只需1-2句话就能回答
              </p>
            </div>
          </div>
        </div>

        {/* 问题列表 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question, index) => (
            <div 
              key={question.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <label className="block text-lg font-semibold mb-2">
                    {question.question}
                    {question.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <textarea
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder={question.placeholder}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    {answers[question.id]?.length || 0} 字
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* 错误提示 */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
              {error}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleSkip}
              className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-gray-300 transition-all"
            >
              跳过问询
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>提交中...</span>
                </>
              ) : (
                <>
                  <span>提交答案，开始AI协作</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* 提示信息 */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⏱️</div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">提交后会发生什么？</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• AI会根据你的回答制定协作策略</li>
                  <li>• 多个AI将从不同视角深度分析</li>
                  <li>• 你可以实时看到每个AI的思考过程</li>
                  <li>• 约30-90秒后，你会得到完整的综合建议</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
