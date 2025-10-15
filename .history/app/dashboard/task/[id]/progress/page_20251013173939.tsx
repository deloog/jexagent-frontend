import Link from "next/link"

export default function ProgressPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 animate-pulse">
          ⚙️
        </div>
        <h1 className="text-2xl font-bold mb-2">AI正在协作分析中...</h1>
        <p className="text-gray-600 mb-4">任务ID: {params.id}</p>
        <p className="text-sm text-gray-500">
          （进度页面将在Day 10-11实现）
        </p>
        <Link 
          href="/dashboard"
          className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          返回工作台
        </Link>
      </div>
    </div>
  )
}