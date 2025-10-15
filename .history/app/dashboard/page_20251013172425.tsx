import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              J
            </div>
            <span className="text-xl font-bold">JexAgent</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
              <span>今日剩余：</span>
              <span className="font-bold">3/3</span>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
              U
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* 欢迎区域 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">工作台</h1>
          <p className="text-gray-600">开始新的AI协作任务，或查看历史记录</p>
        </div>

        {/* 快速操作 */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/dashboard/new"
            className="p-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white hover:shadow-xl transition-all group"
          >
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-2xl font-bold mb-2">创建新任务</h3>
            <p className="text-blue-100 mb-4">开始AI协作分析</p>
            <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
              <span>立即开始</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <div className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">使用统计</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>本月任务：0 次</div>
              <div>总计任务：0 次</div>
            </div>
          </div>

          <div className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">当前套餐</h3>
            <div className="space-y-2 text-sm">
              <div className="text-gray-600">免费版</div>
              <Link href="/pricing" className="text-blue-600 hover:underline block">
                升级套餐 →
              </Link>
            </div>
          </div>
        </div>

        {/* 历史任务 */}
        <div>
          <h2 className="text-2xl font-bold mb-4">最近任务</h2>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">还没有任务记录</h3>
            <p className="text-gray-600 mb-6">创建你的第一个AI协作任务</p>
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              <span>立即开始</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}