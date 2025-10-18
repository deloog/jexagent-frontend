"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AuditTrailEntry {
  id: string
  phase: string
  timestamp: string
  action: string
  details: string
  status: "success" | "warning" | "error"
}

interface TaskResult {
  id: string
  title: string
  status: "completed" | "failed" | "in_progress"
  executive_summary: string
  certain_advice: string[]
  hypothetical_advice: string[]
  divergences: string[]
  hooks: string[]
  audit_summary: string
  audit_trail: AuditTrailEntry[]
  created_at: string
  updated_at: string
}

export default function ResultPageExample() {
  const [result, setResult] = useState<TaskResult | null>(null)
  const [loading, setLoading] = useState(true)

  // 安全过滤和兜底处理
  const safeAuditTrail = result?.audit_trail?.filter(Boolean) ?? []
  const safeCertainAdvice = result?.certain_advice?.filter(Boolean) ?? []
  const safeHypotheticalAdvice = result?.hypothetical_advice?.filter(Boolean) ?? []
  const safeDivergences = result?.divergences?.filter(Boolean) ?? []
  const safeHooks = result?.hooks?.filter(Boolean) ?? []

  // 日志告警
  useEffect(() => {
    if (result?.audit_trail?.some(item => !item || !item.phase)) {
      console.warn('[ResultPage] 存在空项或缺失 phase，已兜底处理', result.audit_trail)
    }
  }, [result])

  // 模拟数据加载
  useEffect(() => {
    const mockResult: TaskResult = {
      id: "1",
      title: "市场分析报告",
      status: "completed",
      executive_summary: "这是一个详细的市场分析报告，涵盖了当前市场趋势和未来预测。",
      certain_advice: [
        "建议增加数字营销预算",
        "优化产品定价策略",
        "加强客户关系管理"
      ],
      hypothetical_advice: [
        "如果竞争对手降价，考虑推出促销活动",
        "如果经济衰退，优先保护核心业务"
      ],
      divergences: [
        "不同分析师对市场增长率预测存在分歧",
        "部分数据源显示矛盾信息"
      ],
      hooks: [
        "需要进一步验证用户行为数据",
        "建议进行A/B测试验证假设"
      ],
      audit_summary: "任务执行过程完整，所有阶段均成功完成",
      audit_trail: [
        {
          id: "1",
          phase: "数据收集",
          timestamp: "2024-01-15T10:00:00Z",
          action: "收集市场数据",
          details: "从多个数据源收集了市场趋势数据",
          status: "success"
        },
        {
          id: "2",
          phase: "分析处理",
          timestamp: "2024-01-15T11:00:00Z",
          action: "数据分析",
          details: "对收集的数据进行了深度分析",
          status: "success"
        },
        {
          id: "3",
          phase: "报告生成",
          timestamp: "2024-01-15T12:00:00Z",
          action: "生成报告",
          details: "基于分析结果生成了最终报告",
          status: "success"
        }
      ],
      created_at: "2024-01-15T09:00:00Z",
      updated_at: "2024-01-15T12:30:00Z"
    }

    setTimeout(() => {
      setResult(mockResult)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">加载中...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">未找到结果</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-100 text-green-800"
      case "warning": return "bg-yellow-100 text-yellow-800"
      case "error": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 标题和状态 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{result.title}</CardTitle>
              <CardDescription>
                任务ID: {result.id} | 创建时间: {new Date(result.created_at).toLocaleString()}
              </CardDescription>
            </div>
            <Badge variant={result.status === "completed" ? "default" : "secondary"}>
              {result.status === "completed" ? "已完成" : "进行中"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* 分隔线 */}
      <div className="border-t border-gray-200 my-6"></div>

      {/* 执行摘要 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📋 执行摘要
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{result.executive_summary}</p>
        </CardContent>
      </Card>

      {/* 分隔线 */}
      <div className="border-t border-gray-200 my-6"></div>

      {/* 建议和洞察 */}
      <div className="space-y-6">
        {/* 确定性建议 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ✅ 确定性建议 ({safeCertainAdvice.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {safeCertainAdvice.map((advice, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 假设性建议 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🤔 假设性建议 ({safeHypotheticalAdvice.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {safeHypotheticalAdvice.map((advice, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 分歧点 */}
        {safeDivergences.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚠️ 分歧点 ({safeDivergences.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {safeDivergences.map((divergence, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>{divergence}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* 后续钩子 */}
        {safeHooks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔗 后续钩子 ({safeHooks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {safeHooks.map((hook, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>{hook}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* 审计轨迹 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 执行轨迹 ({safeAuditTrail.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {safeAuditTrail.map((entry) => (
                <Card key={entry.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(entry.status)}>
                          {entry.status === "success" ? "成功" : 
                           entry.status === "warning" ? "警告" : "错误"}
                        </Badge>
                        <span className="font-medium">{entry.phase ?? '未知阶段'}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">{entry.action}</p>
                      <p className="text-gray-600 text-sm">{entry.details}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 审计摘要 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📝 审计摘要
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{result.audit_summary}</p>
        </CardContent>
      </Card>
    </div>
  )
}
