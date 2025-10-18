'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { taskAPI } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

// ========== 类型定义 ==========
interface TaskResult {
  id: string
  scene: string
  user_input: string
  cost: number
  duration: number
  created_at: string
  status: string
  output: {
    executive_summary?: {
      tldr: string
      key_actions: string[]
    }
    certain_advice?: {
      title: string
      content: string
      risks: string[]
    }
    hypothetical_advice?: Array<{
      condition: string
      suggestion: string
    }>
    divergences?: Array<{
      issue: string
      ai_a_view: string
      ai_a_reason: string
      ai_b_view: string
      ai_b_reason: string
      our_suggestion: string
    }>
    hooks?: {
      satisfaction_check: string
      missing_info_hint: string[]
    }
    audit_summary?: {
      phases: Array<{
        phase: string
        steps: Array<{
          actor: string
          action: string
          reasoning: string
        }>
      }>
      total_steps: number
    }
  }
}

// ========== 主组件 ==========
export default function ResultPage() {
  const { id: taskId } = useParams<{ id: string }>()
  const router = useRouter()
  
  const [result, setResult] = useState<TaskResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false)
  const [hasEmpty, setHasEmpty] = useState<boolean>(false)

  // ========== 日志可追溯 ==========
  useEffect(() => {
    // ✅ 修复：将条件判断移到useEffect内部，确保Hook始终被调用
    if (!result) {
      setHasEmpty(false)
      return;
    }
    
    const output = result.output;
    
    // 在useEffect内部重新计算安全变量，避免依赖不稳定
    const safeKeyActions = output.executive_summary?.key_actions?.filter(Boolean) ?? []
    const safeHypotheticalAdvice = output.hypothetical_advice?.filter(Boolean) ?? []
    const safeDivergences = output.divergences?.filter(Boolean) ?? []
    const safeAuditPhases = output.audit_summary?.phases?.filter(Boolean) ?? []
    const safeAuditPhasesWithSteps = safeAuditPhases.map(phase => ({
      ...phase,
      steps: phase.steps?.filter(Boolean) ?? []
    }))

    // 检查是否存在空项或缺失关键字段
    const hasEmptyItems = {
      key_actions: output.executive_summary?.key_actions?.some(item => !item),
      hypothetical_advice: output.hypothetical_advice?.some(item => !item || !item.condition || !item.suggestion),
      divergences: output.divergences?.some(item => !item || !item.issue || !item.ai_a_view || !item.ai_b_view),
      audit_phases: output.audit_summary?.phases?.some(phase => !phase || !phase.phase || !phase.steps)
    }

    // ✅ 修复：使用普通函数调用，不调用Hook
    const hasEmpty = Object.values(hasEmptyItems).some(Boolean)
    setHasEmpty(hasEmpty)

    if (hasEmpty) {
      console.warn('[ResultPage] 存在空项或缺失关键字段，已兜底处理', {
        originalOutput: output,
        hasEmptyItems,
        safeKeyActions,
        safeHypotheticalAdvice,
        safeDivergences,
        safeAuditPhasesWithSteps
      })
    }
  }, [result]) // ✅ 移除setHasEmpty依赖，setter函数是稳定的

  // 获取任务结果 - 修复无限循环和数据更新问题
  useEffect(() => {
    const MAX_POLL = 20;
    let polls = 0;
    let intervalId: NodeJS.Timeout | null = null;
    let isMounted = true;

    const fetchTaskResult = async () => {
      if (!isMounted || polls >= MAX_POLL) {
        console.warn('[Result] 轮询超限或组件已卸载，停止');
        if (intervalId) clearInterval(intervalId);
        return;
      }
      polls++;
      
      try {
        setLoading(true)
        const taskData = await taskAPI.getTaskResult(taskId)
        console.log(`📋 获取任务结果... (轮询 ${polls}/${MAX_POLL})`, taskData)
        
        if (!isMounted) return;
        
        if (taskData.status === 'completed' && taskData.output) {
          setResult(taskData)
          if (intervalId) clearInterval(intervalId);
        } else if (taskData.status === 'failed') {
          setError(taskData.output?.error || '任务执行失败')
          if (intervalId) clearInterval(intervalId);
        } else if (taskData.status === 'processing') {
          // 任务仍在处理中，继续轮询
          console.log('🔄 任务仍在处理中，继续等待...')
        }
      } catch (err) {
        console.error('❌ 获取任务结果失败:', err)
        if (isMounted) {
          setError('获取任务结果失败，请稍后重试')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    if (taskId) {
      fetchTaskResult()
      
      // ✅ 修复轮询机制 - 不依赖result状态
      intervalId = setInterval(() => {
        if (!isMounted || polls >= MAX_POLL) {
          if (intervalId) clearInterval(intervalId);
          return;
        }
        console.log('🔄 轮询获取最新数据...')
        fetchTaskResult()
      }, 2000)
      
      return () => {
        isMounted = false;
        if (intervalId) clearInterval(intervalId);
      }
    }
  }, [taskId]) // ✅ 移除result依赖，避免无限循环

  // 复制文本到剪贴板
  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSection(section)
      setTimeout(() => setCopiedSection(null), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // ========== 加载和错误状态 ==========
  // ✅ 统一渲染路径 - 确保Hook调用顺序稳定
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-700">正在加载结果...</h2>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">加载失败</h2>
          <p className="text-gray-600 mb-4">{error || '任务尚未完成或没有可用的结果'}</p>
          <Link
            href={`/dashboard/task/${taskId}/progress`}
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            返回进度页面
          </Link>
        </div>
      </div>
    )
  }

  // ========== 运行时兜底处理 ==========
  // 过滤空项并提供默认值（在条件渲染之后定义）
  const output = result.output
  const safeKeyActions = output.executive_summary?.key_actions?.filter(Boolean) ?? []
  const safeHypotheticalAdvice = output.hypothetical_advice?.filter(Boolean) ?? []
  const safeDivergences = output.divergences?.filter(Boolean) ?? []
  const safeAuditPhases = output.audit_summary?.phases?.filter(Boolean) ?? []
  
  // 为每个阶段的安全步骤提供兜底
  const safeAuditPhasesWithSteps = safeAuditPhases.map(phase => ({
    ...phase,
    steps: phase.steps?.filter(Boolean) ?? []
  }))

  // ========== 渲染主内容 ==========
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* ========== 顶部导航 ========== */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block">
              ← 返回工作台
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">任务结果</h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <Badge variant="secondary">{result.scene}</Badge>
              <span>•</span>
              <span>{formatDate(result.created_at)}</span>
              <span>•</span>
              <span>¥{result.cost.toFixed(3)} / {result.duration.toFixed(1)}秒</span>
            </div>
          </div>
          
          <Button variant="outline" onClick={() => window.print()}>
            📄 导出PDF
          </Button>
        </div>

        {/* ========== 🎯 核心结论（TL;DR）========== */}
        {output.executive_summary?.tldr && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🎯</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-3">核心结论</h2>
                <p className="text-lg text-gray-800 leading-relaxed">
                  {output.executive_summary.tldr}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* ========== ⚡ 关键行动 ========== */}
        {safeKeyActions.length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>⚡</span>
              <span>关键行动</span>
            </h2>
            <div className="space-y-3">
              {safeKeyActions.map((action, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-800 flex-1">{action}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ========== ✅ 确定性建议 ========== */}
        {output.certain_advice && (
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>✅</span>
                <span>{output.certain_advice.title || '确定性建议'}</span>
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(output.certain_advice!.content, 'certain_advice')}
              >
                {copiedSection === 'certain_advice' ? '✓ 已复制' : '📋 复制'}
              </Button>
            </div>
            
            <div className="prose prose-gray max-w-none mb-4">
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {output.certain_advice.content}
              </div>
            </div>

            {/* 风险提示 */}
            {output.certain_advice.risks && output.certain_advice.risks.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>风险提示</span>
                </h3>
                <ul className="space-y-1 text-sm text-red-600">
                  {output.certain_advice.risks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}

        {/* ========== 🤔 假设性建议（可折叠）========== */}
        {safeHypotheticalAdvice.length > 0 && (
          <Card className="p-6 mb-6">
            <details className="group">
              <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span>🤔</span>
                  <span>假设性建议</span>
                  <Badge variant="secondary">{safeHypotheticalAdvice.length}个场景</Badge>
                </span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              
              <div className="mt-4 space-y-4">
                {safeHypotheticalAdvice.map((advice, index) => (
                  <div key={index} className="border-l-4 border-yellow-400 pl-4 py-2">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {index + 1}. {advice.condition ?? '未知条件'}
                    </h3>
                    <p className="text-gray-700">{advice.suggestion ?? '暂无建议'}</p>
                  </div>
                ))}
              </div>
            </details>
          </Card>
        )}

        {/* ========== ⚡ 分歧点分析 ========== */}
        {safeDivergences.length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>⚡</span>
              <span>AI分歧点分析</span>
              <Badge variant="secondary">增强信任</Badge>
            </h2>
            
            <div className="space-y-6">
              {safeDivergences.map((divergence, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-4">
                    {index + 1}. {divergence.issue ?? '未知问题'}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {/* AI-A 观点 */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                        <span>🤖</span>
                        <span>Kimi（深度分析）</span>
                      </div>
                      <p className="text-sm text-blue-900 mb-2">
                        <strong>观点：</strong>{divergence.ai_a_view ?? '暂无观点'}
                      </p>
                      <p className="text-xs text-blue-700">
                        <strong>理由：</strong>{divergence.ai_a_reason ?? '暂无理由'}
                      </p>
                    </div>
                    
                    {/* AI-B 观点 */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                        <span>🤖</span>
                        <span>Qwen（流量视角）</span>
                      </div>
                      <p className="text-sm text-green-900 mb-2">
                        <strong>观点：</strong>{divergence.ai_b_view ?? '暂无观点'}
                      </p>
                      <p className="text-xs text-green-700">
                        <strong>理由：</strong>{divergence.ai_b_reason ?? '暂无理由'}
                      </p>
                    </div>
                  </div>
                  
                  {/* 综合建议 */}
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                      <span>💡</span>
                      <span>我们的综合建议</span>
                    </div>
                    <p className="text-sm text-yellow-900">{divergence.our_suggestion ?? '暂无建议'}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ========== 🔗 下一步行动（勾子设计）========== */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🔗</span>
            <span>下一步行动</span>
          </h2>
          
          <div className="space-y-3">
            {/* 深度定制 */}
            {output.hooks?.satisfaction_check && (
              <Dialog open={isDeepDiveOpen} onOpenChange={setIsDeepDiveOpen}>
                <DialogTrigger asChild>
                  <button className="w-full p-4 bg-white rounded-lg border-2 border-purple-300 hover:border-purple-400 hover:shadow-md transition-all text-left">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">💬</div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">补充信息，获得更精准建议</div>
                        <p className="text-sm text-gray-600 mt-1">{output.hooks.satisfaction_check}</p>
                      </div>
                      <div className="text-gray-400">→</div>
                    </div>
                  </button>
                </DialogTrigger>
                
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>深度定制</DialogTitle>
                    <DialogDescription>
                      补充以下信息，AI将为你生成更精准的建议
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    {output.hooks.missing_info_hint?.map((hint, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-900">💡 {hint}</p>
                      </div>
                    ))}
                    
                    <textarea
                      placeholder="在这里补充更多信息..."
                      className="w-full p-3 border rounded-lg resize-none"
                      rows={4}
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeepDiveOpen(false)}>
                      取消
                    </Button>
                    <Button onClick={() => {
                      // TODO: 实现深度定制逻辑
                      alert('深度定制功能将在 Day 47-48 实现')
                      setIsDeepDiveOpen(false)
                    }}>
                      开始深度分析
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* 创建类似任务 */}
            <button
              onClick={() => router.push(`/dashboard/new?template=${result.scene}`)}
              className="w-full p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">🔄</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">基于此任务创建类似任务</div>
                  <p className="text-sm text-gray-600 mt-1">使用相同场景，分析新问题</p>
                </div>
                <div className="text-gray-400">→</div>
              </div>
            </button>

            {/* 导出报告 */}
            <button
              onClick={() => window.print()}
              className="w-full p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">📤</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">导出完整报告</div>
                  <p className="text-sm text-gray-600 mt-1">保存为PDF或打印</p>
                </div>
                <div className="text-gray-400">→</div>
              </div>
            </button>
          </div>
        </Card>

        {/* ========== 📊 审计轨迹（可折叠）========== */}
        {safeAuditPhasesWithSteps.length > 0 && (
          <Card className="p-6 mb-6">
            <details className="group">
              <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span>📊</span>
                  <span>审计轨迹</span>
                  <Badge variant="secondary">{safeAuditPhasesWithSteps.reduce((total, phase) => total + phase.steps.length, 0)}个步骤</Badge>
                </span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              
              <div className="mt-4">
                <Tabs defaultValue="timeline">
                  <TabsList>
                    <TabsTrigger value="timeline">时间线视图</TabsTrigger>
                    <TabsTrigger value="phases">阶段视图</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="timeline" className="mt-4">
                    <div className="space-y-3">
                      {safeAuditPhasesWithSteps.map((phase, phaseIndex) => (
                        <div key={phaseIndex}>
                          <h3 className="font-semibold text-gray-800 mb-2 sticky top-0 bg-gray-50 py-2">
                            {phase.phase ?? '未知阶段'}
                          </h3>
                          {phase.steps.map((step, stepIndex) => (
                            <div key={stepIndex} className="border-l-2 border-gray-300 pl-4 pb-3 ml-2">
                              <div className="flex items-start gap-2 mb-1">
                                <Badge variant="secondary" className="text-xs">{step.actor ?? '未知执行者'}</Badge>
                                <span className="text-sm text-gray-700">{step.action ?? '未知操作'}</span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                {step.reasoning ? (
                                  <>
                                    {step.reasoning.substring(0, 100)}
                                    {step.reasoning.length > 100 && '...'}
                                  </>
                                ) : (
                                  '暂无推理说明'
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="phases" className="mt-4">
                    <div className="grid gap-4">
                      {safeAuditPhasesWithSteps.map((phase, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold text-gray-800 mb-2">
                            {phase.phase ?? '未知阶段'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {phase.steps.length} 个步骤
                          </p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </details>
          </Card>
        )}

        {/* ========== 原始输入（调试）========== */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="p-6 mb-6">
            <details>
              <summary className="font-semibold cursor-pointer">🔧 开发调试信息</summary>
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">用户输入：</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{result.user_input}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">原始输出：</h4>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-96">
                    {JSON.stringify(output, null, 2)}
                  </pre>
                </div>
              </div>
            </details>
          </Card>
        )}

        {/* ========== 底部导航 ========== */}
        <div className="flex justify-center gap-4 pt-6">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            返回工作台
          </Button>
          <Button onClick={() => router.push('/dashboard/new')}>
            创建新任务
          </Button>
        </div>
      </div>
    </div>
  )
}
