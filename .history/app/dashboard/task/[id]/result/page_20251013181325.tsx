"use client"

import { useState } from "react"
import Link from "next/link"

// 模拟的分析结果数据（后续会从后端获取）
const mockResult = {
  taskId: "task-1234567890",
  scene: "选题分析",
  userInput: "最近\"AI Agent\"这个概念很火，我想做一期视频，但不确定切入角度...",
  cost: 0.039,
  duration: 45,
  createdAt: "2025-01-15 14:30:00",
  
  // 执行摘要
  summary: {
    tldr: "建议从\"实战应用场景\"切入，聚焦垂直领域的AI Agent实际落地案例，避免泛泛而谈技术原理。",
    keyActions: [
      "选择1-2个具体应用场景（如客服、数据分析）深度剖析",
      "采访已落地的团队，获取第一手实践经验",
      "对比传统方案与AI Agent方案的效果差异"
    ]
  },
  
  // 确定性建议
  certainAdvice: {
    title: "基于你的情况，我们的建议是：",
    content: `根据你的目标受众（程序员为主）和历史数据（技术科普类视频播放量5-10万），这个选题具有以下优势：

**1. 受众契合度高**
你的粉丝对新技术敏感度高，AI Agent作为当前热点话题，天然具有吸引力。从历史数据看，技术深度内容在你的频道表现良好。

**2. 差异化空间明确**
当前市面上大多数内容停留在概念介绍层面，缺少实战落地案例。如果你能深入某个垂直场景，将形成显著差异化。

**3. 内容延展性强**
AI Agent是一个系列话题，可以拆解为多期内容：技术原理、应用场景、工具对比、实战教程等，有利于长期内容规划。

**核心建议：**
选择"电商客服AI Agent实战"或"数据分析AI Agent实战"作为首期切入点，用真实案例展示从0到1的搭建过程。`,
    risks: [
      "⚠️ 避免过度强调技术细节，保持内容的可理解性",
      "⚠️ 注意版权问题，演示案例需获得授权或使用开源项目"
    ]
  },
  
  // 假设性建议
  hypotheticalAdvice: [
    {
      condition: "如果你的时间和资源有限",
      suggestion: "建议先做一期"AI Agent工具横评"，对比市面上3-5个主流工具的优劣，这类内容制作周期短、信息密度高，容易获得传播。"
    },
    {
      condition: "如果你想追求更高播放量",
      suggestion: "考虑加入"踩坑记录"元素，比如《我花3天搭建AI Agent，结果...》这类带有悬念和情绪的标题，更容易引发点击。"
    },
    {
      condition: "如果你希望建立长期影响力",
      suggestion: "建议做成系列专题，每期聚焦一个应用场景，形成"AI Agent实战手册"IP，有利于沉淀粉丝和建立专业形象。"
    }
  ],
  
  // AI分歧点
  divergences: [
    {
      issue: "内容深度 vs 传播广度",
      aiA: {
        name: "Kimi",
        view: "应该保持技术深度，详细讲解AI Agent的工作原理和实现细节。你的受众是程序员，他们期待深度内容，浅尝辄止会降低信任度。",
        reason: "从长期价值看，深度内容更容易建立专业形象，即使短期播放量略低，但粉丝粘性和转化率会更高。"
      },
      aiB: {
        name: "Qwen",
        view: "建议在保持一定深度的基础上，更注重通俗化表达和视觉呈现。用动画、图表等方式降低理解门槛，扩大受众范围。",
        reason: "当前内容竞争激烈，过于硬核的内容传播受限。适当的通俗化不等于降低质量，而是提升可达性。"
      },
      ourSuggestion: "我们建议采用"分层设计"：主线内容通俗易懂，针对核心粉丝提供"技术细节补充"（如文章、GitHub链接），兼顾传播与深度。"
    }
  ],
  
  // 审计轨迹（完整AI对话）
  auditTrail: [
    { phase: "评估", actor: "元认知AI", content: "用户提供了目标受众、历史数据、创作目标等关键信息，信息充足度：85%", timestamp: "14:30:05" },
    { phase: "规划", actor: "元认知AI", content: "任务类型：选题分析｜协作模式：辩论模式｜AI-A角色：深度分析视角｜AI-B角色：流量传播视角", timestamp: "14:30:08" },
    { phase: "协作", actor: "Kimi", content: "从内容深度角度分析：这个选题具有较强的专业性，适合深度解读...", timestamp: "14:30:15" },
    { phase: "协作", actor: "Qwen", content: "从流量和传播角度分析：当前热度较高，但竞争激烈...", timestamp: "14:30:22" },
    { phase: "协作", actor: "元认知AI", content: "检测到观点差异（内容深度策略），启动辩论...", timestamp: "14:30:28" },
    { phase: "协作", actor: "Kimi", content: "针对流量考虑的回应：虽然竞争激烈，但深度内容反而更容易建立差异化...", timestamp: "14:30:35" },
    { phase: "协作", actor: "Qwen", content: "针对深度考虑的回应：同意深度重要，但也要考虑受众接受度...", timestamp: "14:30:42" },
    { phase: "整合", actor: "元认知AI", content: "双方观点趋于一致，采用"分层设计"方案整合建议", timestamp: "14:30:48" }
  ]
}

export default function ResultPage({ params }: { params: { id: string } }) {
  const [showAuditTrail, setShowAuditTrail] = useState(false)
  const [showDeepCustomize, setShowDeepCustomize] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="border-b bg-white sticky top-0 z-50">
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
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* 顶部成功提示 */}
        <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-2xl flex items-start gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0">
            ✓
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-green-900 mb-2">分析完成！</h2>
            <div className="flex items-center gap-4 text-sm text-green-800">
              <span>📊 场景：{mockResult.scene}</span>
              <span>⏱️ 耗时：{mockResult.duration}秒</span>
              <span>💰 成本：¥{mockResult.cost.toFixed(3)}</span>
            </div>
          </div>
        </div>

        {/* 执行摘要 - TL;DR */}
        <div className="mb-8 p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⚡</span>
            <h3 className="text-lg font-bold">核心结论（TL;DR）</h3>
          </div>
          <p className="text-lg mb-4 leading-relaxed">{mockResult.summary.tldr}</p>
          <div className="space-y-2">
            <div className="font-semibold text-sm">立即行动：</div>
            {mockResult.summary.keyActions.map((action, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm bg-white/10 rounded-lg px-3 py-2">
                <span className="font-bold">{idx + 1}.</span>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 确定性建议 */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🎯</span>
            <h3 className="text-2xl font-bold">{mockResult.certainAdvice.title}</h3>
          </div>
          <div className="prose prose-lg max-w-none">
            {mockResult.certainAdvice.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4 text-gray-700 leading-relaxed whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
          {mockResult.certainAdvice.risks.length > 0 && (
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="font-semibold text-orange-900 mb-2">⚠️ 风险提示</div>
              <ul className="space-y-1 text-sm text-orange-800">
                {mockResult.certainAdvice.risks.map((risk, idx) => (
                  <li key={idx}>{risk}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 假设性建议 */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🔀</span>
            <h3 className="text-2xl font-bold">其他可能的方向</h3>
          </div>
          <p className="text-gray-600 mb-6">根据不同情况，你也可以考虑以下方案：</p>
          <div className="space-y-4">
            {mockResult.hypotheticalAdvice.map((item, idx) => (
              <div key={idx} className="p-4 border-2 border-blue-100 bg-blue-50 rounded-xl">
                <div className="font-semibold text-blue-900 mb-2">
                  {item.condition}
                </div>
                <div className="text-sm text-blue-800">
                  {item.suggestion}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI分歧点 */}
        {mockResult.divergences.length > 0 && (
          <div className="mb-8 bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⚖️</span>
              <h3 className="text-2xl font-bold">AI的不同观点</h3>
            </div>
            <p className="text-gray-600 mb-6">在分析过程中，不同AI从各自视角提出了不同看法：</p>
            {mockResult.divergences.map((div, idx) => (
              <div key={idx} className="mb-6 last:mb-0">
                <h4 className="font-bold text-lg mb-4">议题：{div.issue}</h4>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 border-2 border-purple-200 bg-purple-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {div.aiA.name[0]}
                      </div>
                      <span className="font-bold text-purple-900">{div.aiA.name}的观点</span>
                    </div>
                    <p className="text-sm text-purple-800 mb-2">{div.aiA.view}</p>
                    <p className="text-xs text-purple-600">理由：{div.aiA.reason}</p>
                  </div>
                  <div className="p-4 border-2 border-green-200 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {div.aiB.name[0]}
                      </div>
                      <span className="font-bold text-green-900">{div.aiB.name}的观点</span>
                    </div>
                    <p className="text-sm text-green-800 mb-2">{div.aiB.view}</p>
                    <p className="text-xs text-green-600">理由：{div.aiB.reason}</p>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <div className="font-semibold text-blue-900 mb-2">💡 我们的建议</div>
                  <p className="text-sm text-blue-800">{div.ourSuggestion}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 审计轨迹 */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
          <button
            onClick={() => setShowAuditTrail(!showAuditTrail)}
            className="w-full flex items-center justify-between hover:bg-gray-50 -m-8 p-8 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">📜</span>
              <h3 className="text-2xl font-bold">完整审计轨迹</h3>
            </div>
            <svg 
              className={`w-6 h-6 transition-transform ${showAuditTrail ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showAuditTrail && (
            <div className="mt-6 space-y-3 max-h-96 overflow-y-auto">
              {mockResult.auditTrail.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm">
                  <span className="text-gray-400 font-mono text-xs mt-1">{item.timestamp}</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                    {item.phase}
                  </span>
                  <span className="font-semibold text-gray-700">{item.actor}:</span>
                  <span className="text-gray-600 flex-1">{item.content}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 深度定制入口 */}
        <div className="mb-8 p-6 border-2 border-dashed border-blue-300 bg-blue-50 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🎨</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">需要更精准的建议？</h3>
              <p className="text-gray-600 mb-4">
                如果以上建议不够满足你的需求，或者你有新的信息要补充，可以进入深度定制模式，我们会基于新信息重新协作分析。
              </p>
              {!showDeepCustomize ? (
                <button
                  onClick={() => setShowDeepCustomize(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  开启深度定制
                </button>
              ) : (
                <div className="space-y-3">
                  <textarea
                    placeholder="请补充新的信息或指出需要调整的地方..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                  />
                  <div className="flex gap-3">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                      提交并重新分析
                    </button>
                    <button 
                      onClick={() => setShowDeepCustomize(false)}
                      className="px-6 py-2 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl font-medium text-center hover:border-gray-300 transition-colors"
          >
            返回工作台
          </Link>
          <Link
            href="/dashboard/new"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium text-center hover:bg-blue-700 transition-colors"
          >
            创建新任务
          </Link>
        </div>
      </div>
    </div>
  )
}
