'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSocket, ConnectionStatus } from '@/lib/useSocket';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { taskAPI } from '@/lib/api';

// ✅ 常量定义 - 便于维护
const ANIMATION_STEP_DELAY = 50;
const COMPLETION_DELAY = 1000;
const CONNECTION_WAIT_TIMEOUT = 2000;

interface Message {
  phase: string;
  actor: string;
  content: string;
  timestamp: string;
}

export default function TaskProgressPage() {
  const { id: taskId } = useParams<{ id: string }>();
  const router = useRouter();
  
  const [currentProgress, setCurrentProgress] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ 动画状态
  const animationStateRef = useRef({
    targetProgress: 0,
    isAnimating: false,
    mounted: true
  });
  const animationTimerRef = useRef<number | null>(null);
  
  // ✅ 消息去重用的 Set
  const messageKeysRef = useRef<Set<string>>(new Set());

  // ✅ 使用重构后的 useSocket（带类型定义）
  const { 
    progressHistory, 
    latestProgress, 
    aiMessages,
    isComplete, 
    completionData,
    connectionStatus 
  } = useSocket(taskId);

  // ✅ 动画函数 - 保持原设计，已验证正确
  const animateToTarget = useCallback(() => {
    if (animationTimerRef.current !== null) {
      clearTimeout(animationTimerRef.current);
    }

    if (!animationStateRef.current.mounted) return;
    animationStateRef.current.isAnimating = true;

    const step = () => {
      if (!animationStateRef.current.mounted) {
        animationStateRef.current.isAnimating = false;
        return;
      }

      setCurrentProgress(prev => {
        const target = animationStateRef.current.targetProgress;
        
        if (prev >= target) {
          animationStateRef.current.isAnimating = false;
          return target;
        }

        // ✅ 动态步长 - 保持原设计 Math.ceil(diff / 20)
        const diff = target - prev;
        const stepSize = Math.max(1, Math.ceil(diff / 20));
        const newProgress = Math.min(prev + stepSize, target);

        if (newProgress < target) {
          animationTimerRef.current = window.setTimeout(step, ANIMATION_STEP_DELAY);
        } else {
          animationStateRef.current.isAnimating = false;
        }

        return newProgress;
      });
    };

    step();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ 监听历史进度变化
  useEffect(() => {
    if (progressHistory.length > 0) {
      const latest = progressHistory[progressHistory.length - 1];
      const newTarget = latest.progress;

      if (newTarget > animationStateRef.current.targetProgress) {
        animationStateRef.current.targetProgress = newTarget;
        
        if (!animationStateRef.current.isAnimating) {
          animateToTarget();
        }
      }
    }
  }, [progressHistory, animateToTarget]);

  // ✅ 添加消息到消息流 - 改进去重逻辑
  useEffect(() => {
    if (latestProgress?.message) {
      const newMessage: Message = {
        phase: latestProgress.phase || 'unknown',
        actor: 'AI',
        content: latestProgress.message,
        timestamp: new Date().toISOString()
      };

      // ✅ 使用 Set 去重，防止 A→B→A 场景
      const messageKey = `${newMessage.phase}-${newMessage.content}-${newMessage.timestamp}`;
      
      if (!messageKeysRef.current.has(messageKey)) {
        messageKeysRef.current.add(messageKey);
        setMessages(prev => [...prev, newMessage]);
      }
    }
  }, [latestProgress]);

  // ✅ 启动任务处理 - 添加竞态条件保护
  useEffect(() => {
    if (!taskId) return;

    const controller = new AbortController();
    let stillMounted = true;

    const checkAndStartProcessing = async () => {
      try {
        const task = await taskAPI.getTask(taskId);
        
        // ✅ 检查是否已取消
        if (!stillMounted || controller.signal.aborted) {
          console.log('🚫 任务已取消或组件已卸载');
          return;
        }
        
        console.log('🔄 任务状态:', task.status);
        
        if (task.status === 'ready_for_processing') {
          console.log('🚀 启动后台任务处理...');
          
          // ✅ 等待 WebSocket 连接建立（保留硬等，生产环境必需）
          await new Promise(resolve => setTimeout(resolve, CONNECTION_WAIT_TIMEOUT));
          
          if (!stillMounted || controller.signal.aborted) return;
          
          // ✅ 启动后台处理
          await taskAPI.startProcessing(taskId);
          
          if (stillMounted) {
            console.log('✅ 后台任务已启动');
          }
        }
      } catch (err) {
        if (stillMounted) {
          const errorMessage = err instanceof Error ? err.message : '启动处理失败';
          console.error('❌ 启动处理失败:', err);
          setError(errorMessage);
        }
      }
    };

    checkAndStartProcessing();

    return () => {
      stillMounted = false;
      controller.abort();
    };
  }, [taskId]); // ✅ 移除 isProcessingStarted 依赖，避免循环

  // ✅ 统一的任务完成处理 - 修复竞态条件
  useEffect(() => {
    if (isComplete && completionData) {
      console.log('✅ 任务完成，准备跳转', { isComplete, completionData });
      
      // 停止动画
      if (animationTimerRef.current !== null) {
        clearTimeout(animationTimerRef.current);
      }
      
      // 确保进度到达100%
      setCurrentProgress(100);
      animationStateRef.current.targetProgress = 100;
      animationStateRef.current.isAnimating = false;
      
      // 延迟跳转，确保数据已保存到数据库
      const MAX_RETRY = 5;
      let retries = 0;
      let isJumping = false;
      
      const jumpToResult = async () => {
        if (isJumping || !animationStateRef.current.mounted) return;
        isJumping = true;
        
        if (retries >= MAX_RETRY) {
          console.warn('[Progress] 重试超限，直接跳转');
          router.push(`/dashboard/task/${taskId}/result`);
          return;
        }
        retries++;
        
        try {
          console.log(`🔄 验证任务状态... (重试 ${retries}/${MAX_RETRY})`);
          
          // 验证任务确实已完成
          const task = await taskAPI.getTask(taskId);
          console.log('📋 任务状态验证:', task.status);
          
          if (task.status === 'completed') {
            console.log('✅ 任务状态已验证，跳转到结果页');
            router.push(`/dashboard/task/${taskId}/result`);
          } else {
            console.log('⚠️ 任务状态未完成，等待重试...');
            isJumping = false;
            // 如果状态不是completed，等待1秒后重试
            setTimeout(() => {
              if (animationStateRef.current.mounted) {
                jumpToResult();
              }
            }, 1000);
          }
        } catch (error) {
          console.error('❌ 验证任务状态失败:', error);
          isJumping = false;
          // 验证失败时直接跳转
          console.log('🔄 验证失败，直接跳转到结果页');
          router.push(`/dashboard/task/${taskId}/result`);
        }
      };
      
      // 延迟跳转，给数据库更新留出时间
      setTimeout(jumpToResult, COMPLETION_DELAY);
    }
  }, [isComplete, completionData, taskId, router]);

  // ✅ 组件生命周期管理
  useEffect(() => {
    animationStateRef.current.mounted = true;
    return () => {
      animationStateRef.current.mounted = false;
      if (animationTimerRef.current !== null) {
        clearTimeout(animationTimerRef.current);
      }
      messageKeysRef.current.clear();
    };
  }, []);

  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">
          {isComplete ? '✅ 任务完成' : '🔄 AI正在协作...'}
        </h1>

        {/* ✅ 错误提示横幅 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-600">❌ {error}</p>
          </div>
        )}

        {/* ✅ 连接状态指示器 - 类型安全 */}
        <div className="mb-4 flex items-center gap-2">
          {connectionStatus === 'connecting' && (
            <>
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-600">连接中...</span>
            </>
          )}
          {connectionStatus === 'connected' && (
            <>
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-600">AI正在处理中...</span>
            </>
          )}
          {connectionStatus === 'disconnected' && (
            <>
              <div className="w-4 h-4 bg-red-500 rounded-full" />
              <span className="text-sm text-gray-600">连接断开，正在重连...</span>
            </>
          )}
        </div>

        {/* 进度条 */}
        <div aria-label="任务进度" role="region">
          <Progress value={currentProgress} className="mb-6" />
          <p className="text-sm text-gray-600 mb-6">
            进度: {currentProgress.toFixed(0)}%
            {latestProgress && (
              <span className="ml-4 text-gray-500">
                当前阶段: {latestProgress.phase}
              </span>
            )}
          </p>
        </div>

        {/* AI消息流 */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">{msg.actor}</span>
                <span className="text-sm text-gray-500">{msg.phase}</span>
              </div>
              <p className="text-sm">{msg.content}</p>
            </div>
          ))}
          
          {aiMessages.map((msg, idx) => (
            <div key={`ai-${idx}`} className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">{msg.actor}</span>
              </div>
              <p className="text-sm">{msg.content}</p>
            </div>
          ))}
        </div>

        {/* 调试信息（仅开发环境） */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-gray-100 rounded text-xs space-y-1">
            <p>📋 进度历史: {progressHistory.length} 条</p>
            <p>📊 当前进度: {currentProgress}%</p>
            <p>🎯 目标进度: {animationStateRef.current.targetProgress}%</p>
            <p>🔌 连接状态: {connectionStatus}</p>
            <p>💬 消息数量: {messages.length + aiMessages.length} 条</p>
            <p>🔑 去重键数: {messageKeysRef.current.size} 个</p>
          </div>
        )}
      </Card>
    </div>
  );
}
