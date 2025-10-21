'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface CostData {
  current_cost: number;
  breakdown: {
    deepseek: number;
    kimi: number;
    qwen: number;
  };
}

export default function CostDemoPage() {
  const [costData, setCostData] = useState<CostData | null>(null);
  const [simulatedProgress, setSimulatedProgress] = useState(0);

  // 模拟成本数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      // 模拟任务进度
      setSimulatedProgress(prev => {
        const newProgress = Math.min(prev + 10, 100);
        
        // 模拟成本数据
        if (newProgress <= 100) {
          const baseCost = 0.0234;
          const progressFactor = newProgress / 100;
          const currentCost = baseCost * progressFactor;
          
          setCostData({
            current_cost: currentCost,
            breakdown: {
              deepseek: currentCost * 0.1923, // 约 0.0045
              kimi: currentCost * 0.6667,     // 约 0.0156
              qwen: currentCost * 0.1410      // 约 0.0033
            }
          });
        }
        
        return newProgress;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">成本显示功能演示</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 模拟进度 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">模拟任务进度</h2>
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${simulatedProgress}%` }}
              />
            </div>
            <p className="text-center text-gray-600">
              进度: {simulatedProgress}%
            </p>
          </div>
        </Card>

        {/* 成本显示 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">实时成本显示</h2>
          {costData ? (
            <div className="space-y-4">
              {/* 总成本 */}
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">实时成本</span>
                <span className="text-2xl font-bold text-blue-600">
                  ¥{costData.current_cost.toFixed(4)}
                </span>
              </div>

              {/* 成本分解 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">DeepSeek</div>
                  <div className="font-semibold text-blue-700">
                    ¥{costData.breakdown.deepseek.toFixed(4)}
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Kimi</div>
                  <div className="font-semibold text-green-700">
                    ¥{costData.breakdown.kimi.toFixed(4)}
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Qwen</div>
                  <div className="font-semibold text-purple-700">
                    ¥{costData.breakdown.qwen.toFixed(4)}
                  </div>
                </div>
              </div>

              {/* 成本比例 */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700">成本分布</h3>
                <div className="flex h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500" 
                    style={{ width: `${(costData.breakdown.deepseek / costData.current_cost) * 100}%` }}
                    title="DeepSeek"
                  />
                  <div 
                    className="bg-green-500" 
                    style={{ width: `${(costData.breakdown.kimi / costData.current_cost) * 100}%` }}
                    title="Kimi"
                  />
                  <div 
                    className="bg-purple-500" 
                    style={{ width: `${(costData.breakdown.qwen / costData.current_cost) * 100}%` }}
                    title="Qwen"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>DeepSeek: {((costData.breakdown.deepseek / costData.current_cost) * 100).toFixed(1)}%</span>
                  <span>Kimi: {((costData.breakdown.kimi / costData.current_cost) * 100).toFixed(1)}%</span>
                  <span>Qwen: {((costData.breakdown.qwen / costData.current_cost) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">等待成本数据...</p>
          )}
        </Card>
      </div>

      {/* 功能说明 */}
      <Card className="p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">成本显示功能说明</h2>
        <div className="space-y-3 text-gray-700">
          <p>✅ <strong>后端修复已完成</strong>：成本计算逻辑已修复，能够正确从审计轨迹中计算成本</p>
          <p>✅ <strong>WebSocket推送</strong>：后端通过Socket.IO实时推送成本更新到前端</p>
          <p>✅ <strong>前端接收</strong>：useSocket hook正确接收并处理cost_update事件</p>
          <p>✅ <strong>UI显示</strong>：进度页面正确显示实时成本和分解成本</p>
          <p>✅ <strong>测试验证</strong>：通过测试任务验证了成本推送功能正常工作</p>
        </div>
      </Card>
    </div>
  );
}
