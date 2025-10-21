'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/lib/useSocket';

export default function TestSocketCostPage() {
  const [testTaskId] = useState('test-cost-task');
  const { costData, connectionStatus } = useSocket(testTaskId);

  useEffect(() => {
    console.log('🔍 [TEST] TestSocketCostPage mounted');
    console.log('🔍 [TEST] Connection status:', connectionStatus);
    console.log('🔍 [TEST] Cost data:', costData);
    
    // 添加一个全局监听器来验证事件
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.testSocket = {
        connectionStatus,
        costData,
        timestamp: Date.now()
      };
    }
  }, [connectionStatus, costData]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">WebSocket成本更新测试</h1>
      
      <div className="space-y-4">
        <div>
          <strong>连接状态:</strong> {connectionStatus}
        </div>
        
        <div>
          <strong>成本数据:</strong> {costData ? JSON.stringify(costData) : 'null'}
        </div>
        
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p>打开浏览器控制台查看调试信息</p>
          <p>测试任务ID: {testTaskId}</p>
          <p>在控制台输入: <code>window.testSocket</code> 查看状态</p>
        </div>
      </div>
    </div>
  );
}
