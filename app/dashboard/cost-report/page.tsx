'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { taskAPI } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CostReport {
  period: {
    start_date: string
    end_date: string
  }
  summary: {
    total_cost: number
    total_tasks: number
    avg_cost_per_task: number
    today_cost: number
    month_cost: number
  }
  by_scene: {
    [key: string]: {
      count: number
      total_cost: number
      avg_cost: number
    }
  }
  trend: Array<{
    date: string
    cost: number
  }>
}

// 数字格式化工具函数
const formatCurrency = (n: number) => n.toLocaleString('zh-CN', { 
  minimumFractionDigits: 4, 
  maximumFractionDigits: 4 
})

// 安全日期格式化
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
  } catch {
    return dateString.slice(5) // 回退到原来的逻辑
  }
}

export default function CostReportPage() {
  const [report, setReport] = useState<CostReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReport = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await taskAPI.getCostReport()
      setReport(data)
    } catch (err) {
      console.error('获取成本报表失败:', err)
      setError('获取成本报表失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [])

  // ========== 所有Hooks必须在条件返回之前 ==========
  const sceneNames: { [key: string]: string } = {
    'topic-analysis': '选题分析',
    'content-creation': '内容创作',
    'risk-assessment': '风险评估'
  }

  // 趋势数据处理 - 使用可选链安全访问
  const trendData = useMemo(() => {
    // 临界数据防线：零成本数据早退
    const rawTrend = report?.trend?.slice(-14) ?? []
    
    // 过滤负成本和NaN脏数据
    const cleanTrend = rawTrend.filter(item => 
      item && 
      typeof item.cost === 'number' && 
      !isNaN(item.cost) && 
      item.cost >= 0
    )
    
    // 如果所有成本都是0，显示提示信息
    const allZero = cleanTrend.length > 0 && cleanTrend.every(item => item.cost === 0)
    if (allZero) {
      return { trend: [], allZero: true }
    }
    
    return { trend: cleanTrend, allZero: false }
  }, [report?.trend])
  
  const { trend, allZero } = trendData
  
  // 计算最大成本（防除零）
  const maxCost = useMemo(() => {
    return Math.max(...trend.map(item => item.cost), 0.001) // 最小0.001防止除零
  }, [trend])
  // =================================

  // 条件返回必须在所有Hooks之后
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-700">加载中...</h2>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-auto">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">加载失败</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchReport}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 顶部导航 */}
        <div className="mb-6">
          <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block">
            ← 返回工作台
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">成本报表</h1>
          <p className="text-gray-600 mt-2">
            统计周期：{report.period.start_date} 至 {report.period.end_date}
          </p>
        </div>

        {/* 汇总卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* 今日消费 */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-sm text-gray-600 mb-1">今日消费</div>
            <div className="text-3xl font-bold text-blue-600">
              ¥{formatCurrency(report.summary.today_cost)}
            </div>
          </Card>

          {/* 本月消费 */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
            <div className="text-sm text-gray-600 mb-1">本月消费</div>
            <div className="text-3xl font-bold text-green-600">
              ¥{formatCurrency(report.summary.month_cost)}
            </div>
          </Card>

          {/* 总消费 */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="text-sm text-gray-600 mb-1">总消费（30天）</div>
            <div className="text-3xl font-bold text-purple-600">
              ¥{formatCurrency(report.summary.total_cost)}
            </div>
          </Card>

          {/* 平均成本 */}
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="text-sm text-gray-600 mb-1">平均成本/任务</div>
            <div className="text-3xl font-bold text-orange-600">
              ¥{formatCurrency(report.summary.avg_cost_per_task)}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              共 {report.summary.total_tasks} 个任务
            </div>
          </Card>
        </div>

        {/* 按场景分组 */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">按场景统计</h2>
          <div className="space-y-4">
            {Object.entries(report.by_scene).map(([scene, data]) => (
              <div key={scene} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="text-sm">
                    {sceneNames[scene] || scene || '未知场景'}
                  </Badge>
                  <div className="text-sm text-gray-600">
                    {data.count} 次任务
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    ¥{formatCurrency(data.total_cost)}
                  </div>
                  <div className="text-xs text-gray-600">
                    平均 ¥{formatCurrency(data.avg_cost)}/次
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 成本趋势 */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">成本趋势（近30天）</h2>
          
          {/* 金刚不坏的趋势图 */}
          {allZero ? (
            <div className="text-center py-8 bg-yellow-50 rounded-lg">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-yellow-800 font-medium">暂无成本数据</p>
              <p className="text-yellow-600 text-sm mt-1">当前时间段内所有任务成本均为0</p>
            </div>
          ) : trend.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无数据
            </div>
          ) : (
            <div className="space-y-2">
              {trend.map((item) => {
                const width = maxCost > 0 ? (item.cost / maxCost) * 100 : 0
                
                return (
                  <div key={item.date} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-gray-600 flex-shrink-0">
                      {formatDate(item.date)}
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${width}%` }}
                      />
                      <div className="absolute inset-0 flex items-center px-3 text-sm font-semibold text-gray-700">
                        ¥{formatCurrency(item.cost)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* 底部提示 */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">成本优化建议：</p>
              <ul className="list-disc list-inside space-y-1">
                <li>选题分析成本最低（¥0.01-0.05），适合频繁使用</li>
                <li>内容创作成本较高（¥0.05-0.15），建议确保信息充足后再使用</li>
                <li>深度定制会增加50%成本，请谨慎使用</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
