import Link from "next/link"

export default function ResultPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-2xl px-4">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6">
          ✓
        </div>
        <h1 className="text-3xl font-bold mb-4">分析报告已生成</h1>
        <p className="text-gray-600 mb-6">任务ID: {params.id}</p>
        <div className="p-6 bg-white rounded-2xl border-2 border-gray-200 mb-6 text-left">
          <h3 className="font-bold mb-2">📊 报告包含：</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• 确定性建议（基于已知信息）</li>
            <li>• 假设性建议（覆盖未知情况）</li>
            <li>• 多AI分歧点说明</li>
            <li>• 完整审计轨迹</li>
          </ul>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          （完整结果页面将在Day 12-13实现）
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/dashboard"
            className="px-6 py-3 border-2 border-gray-200 rounded-lg font-medium hover:border-gray-300"
          >
            返回工作台
          </Link>
          <Link 
            href="/dashboard/new"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            创建新任务
          </Link>
        </div>
      </div>
    </div>
  )
}