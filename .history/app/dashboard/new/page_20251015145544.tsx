"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { taskAPI } from "@/lib/api"

export default function NewTaskPage() {
  const router = useRouter()
  const [selectedScene, setSelectedScene] = useState<string>("")
  const [userInput, setUserInput] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>("")

  const scenes = [
    {
      id: "topic-analysis",
      title: "选题分析",
      icon: "🎯",
      description: "分析热点价值、受众兴趣、差异化空间",
      examples: ["这个热点值得追吗？", "如何找到差异化角度？"]
    },
    {
      id: "content-creation",
      title: "内容创作",
      icon: "✍️",
      description: "多AI协作生成、交叉审查优化",
      examples: ["帮我写一篇关于...的文章", "优化这段内容的表达"]
    },
    {
      id: "risk-assessment",
      title: "风险评估",
      icon: "⚖️",
      description: "法律合规检查、舆论风险预判",
      examples: ["这个内容有法律风险吗？", "可能引发什么舆论问题？"]
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedScene || !userInput.trim()) {
      setError("请选择场景并输入需求描述")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const result = await taskAPI.create({
        scene: selectedScene,
        user_input: userInput
      })

      // 根据返回结果跳转
      if (result.need_inquiry) {
        // 需要问询，跳转到问询页面
        router.push(`/dashboard/task/${result.task_id}/inquiry?data=${encodeURIComponent(JSON.stringify(result))}`)
      } else {
        // 信息充足，直接进入进度页面
        router.push(`/dashboard/task/${result.task_id}/progress`)
      }
      
    } catch (err: any) {
      console.error('Task creation failed:', err)
      setError(err.response?.data?.detail || "任务创建失败，请重试")
      setIsSubmitting(false)
    }
  }

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
          
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
              返回工作台
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
              <span>剩余额度：</span>
              <span className="font-bold">3/3</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">创建新任务</h1>
          <p className="text-lg text-gray-600">
            告诉我你的需求，AI团队将协作为你分析
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 场景选择 */}
          <div>
            <label className="block text-lg font-semibold mb-4">
              1. 选择应用场景
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              {scenes.map((scene) => (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setSelectedScene(scene.id)}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    selectedScene === scene.id
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <div className="text-3xl mb-3">{scene.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{scene.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{scene.description}</p>
                  <div className="space-y-1">
                    {scene.examples.map((example, idx) => (
                      <div key={idx} className="text-xs text-gray-500">
                        例：{example}
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 需求描述 */}
          <div>
            <label className="block text-lg font-semibold mb-4">
              2. 描述你的需求
              {selectedScene && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  （尽可能详细，AI会根据需要向你提问）
                </span>
              )}
            </label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={
                selectedScene === "topic-analysis"
                  ? "例如：最近\"AI Agent\"这个概念很火，我想做一期视频，但不确定切入角度。我的账号主要做技术科普，粉丝以程序员为主..."
                  : selectedScene === "content-creation"
                  ? "例如：帮我写一篇关于AI Agent的科普文章，面向非技术人员，要通俗易懂，举例子..."
                  : selectedScene === "risk-assessment"
                  ? "例如：我想做一期关于某公司AI产品的测评视频，会涉及一些负面体验，需要评估法律和舆论风险..."
                  : "请先选择一个应用场景..."
              }
              rows={8}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
              disabled={!selectedScene}
            />
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-gray-500">
                字数：{userInput.length} / 建议200字以上
              </span>
              {userInput.length > 0 && userInput.length < 50 && (
                <span className="text-orange-600">
                  💡 提示：描述越详细，AI的建议越精准
                </span>
              )}
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
              {error}
            </div>
          )}

          {/* 提交按钮 */}
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-gray-300 transition-all"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={!selectedScene || !userInput.trim() || isSubmitting}
              className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>处理中...</span>
                </>
              ) : !selectedScene || !userInput.trim() ? (
                "请完成上述步骤"
              ) : (
                <>
                  <span>开始AI协作分析</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* 提示信息 */}
          {selectedScene && userInput.trim() && !isSubmitting && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💡</div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">接下来会发生什么？</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• AI会快速评估信息是否充足</li>
                    <li>• 如需补充，会向你提出3-5个核心问题</li>
                    <li>• 多个AI将从不同视角协作分析</li>
                    <li>• 约30-60秒后，你会得到完整建议</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}