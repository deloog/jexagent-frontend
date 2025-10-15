"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// 模拟的AI协作消息
const mockMessages = [
  { phase: "评估", actor: "元认知AI", content: "正在分析用户需求和已提供的信息...", delay: 1000 },
  { phase: "评估", actor: "元认知AI", content: "信息充足度评估完成。用户提供了目标受众、历史数据、创作目标等关键信息。", delay: 2000 },
  { phase: "规划", actor: "元认知AI", content: "任务类型：选题分析｜协作模式：辩论模式｜参与AI：Kimi（深度分析）+ Qwen（流量视角）", delay: 3000 },
  { phase: "协作", actor: "Kimi", content: "从内容深度角度分析：这个选题具有较强的专业性，适合深度解读。建议从技术原理切入，结合实际应用案例...", delay: 5000 },
  { phase: "协作", actor: "Qwen", content: "从流量和传播角度分析：当前热度较高，但竞争激烈。建议找准差异化角度，比如聚焦某个垂直应用场景...", delay: 7000 },
  { phase: "协作", actor: "元认知AI", content: "检测到观点差异，启动深度辩论...", delay: 8000 },
  { phase: "协作", actor: "Kimi", content: "针对流量考虑：虽然竞争激烈，但深度内容反而更容易建立差异化。追求短期流量可能导致内容同质化...", delay: 9500 },
  { phase: "协作", actor: "Qwen", content: "针对深度考虑：同意深度重要，但也要考虑受众接受度。建议在保持深度的同时，用更通俗的方式呈现...", delay: 11000 },
  { phase: "协作", actor: "元认知AI", content: "双方观点趋于一致，无新增信息，终止辩论。", delay: 12000 },
  { phase: "整合", actor: "元认知AI", content: "正在整合多AI观点，生成综合建议...", delay: 13000 },
  { phase: "完成", actor: "系统", content: "分析完成！正在生成报告...", delay: 14000 }
]

export default function ProgressPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [messages, setMessages] = useState<typeof mockMessages>([])
  const [currentPhase, setCurrentPhase] = useState("评估")
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // 模拟消息逐条出现
    mockMessages.forEach((msg, index) => {
      setTimeout(() => {
        setMessages(prev => [...prev, msg])
        setCurrentPhase(msg.phase)
        setProgress(((index + 1) / mockMessages.length) * 100)
        
        // 最后一条消息时标记完成
        if (index === mockMessages.length - 1) {
          setTimeout(() => {
            setIsComplete(true)
            // 2秒后跳转到结果页
            setTimeout(() => {
              router.push(`/dashboard/task/${params.id}/result`)
            }, 2000)
          }, 500)
        }
      }, msg.delay)
    })
  }, [params.id, router])

  const phaseColors = {
    "评估": "bg-blue-100 text-blue-700 border-blue-200",
    "规划": "bg-purple-100 text-purple-700 border-purple-200",
    "协作": "bg-green-100 text-green-700 border-green-200",
    "整合": "bg-orange-100 text-orange-700 border-orange-200",
    "完成": "bg-gray-100 text-gray-700 border-gray-200"
  }

  const actorColors = {
    "元认知AI": "bg-blue-500",
    "Kimi": "bg-purple-500",
    "Qwen": "bg-green-500",
    "系统": "bg-gray-500"
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
          
          <div className="text-sm text-gray-600">
            任务ID: {params.id}
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* 标题和阶段指示 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">AI协作分析中</h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 border-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className={`text-sm font-medium px-3 py-1 rounded-full border ${phaseColors[currentPhase as keyof typeof phaseColors]}`}>
              当前阶段：{currentPhase}
            </span>
          </div>
        </div>

        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">整体进度</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 提示信息 */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
          <div className="text-xl">💡</div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">AI协作流程</h3>
            <p className="text-sm text-blue-800">
              多个AI正在从不同视角分析你的需求。你可以看到完整的思考和讨论过程，确保透明可信。
            </p>
          </div>
        </div>

        {/* AI对话消息流 */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 min-h-[400px] max-h-[600px] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-3 animate-fadeIn"
              >
                {/* AI头像 */}
                <div className={`w-10 h-10 ${actorColors[msg.actor as keyof typeof actorColors]} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {msg.actor === "元认知AI" ? "M" : msg.actor === "Kimi" ? "K" : msg.actor === "Qwen" ? "Q" : "S"}
                </div>
                
                {/* 消息内容 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{msg.actor}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${phaseColors[msg.phase as keyof typeof phaseColors]}`}>
                      {msg.phase}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-700 leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}

            {/* 加载中指示器 */}
            {!isComplete && (
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                </div>
                <div className="text-sm">AI正在思考...</div>
              </div>
            )}
          </div>
        </div>

        {/* 完成提示 */}
        {isComplete && (
          <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-xl text-center animate-fadeIn">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-xl font-bold text-green-900 mb-2">分析完成！</h3>
            <p className="text-green-800 mb-4">正在为你生成综合报告...</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {/* 底部说明 */}
        <div className="mt-8 p-4 bg-gray-100 rounded-xl text-sm text-gray-600 text-center">
          🔒 所有对话过程都会保存在审计轨迹中，你随时可以查看完整记录
        </div>
      </div>

      {/* CSS动画 */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}