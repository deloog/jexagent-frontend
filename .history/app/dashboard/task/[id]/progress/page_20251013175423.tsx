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
    <div className="min-h-screen bg-gray-