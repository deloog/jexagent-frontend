import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 导航栏 */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              J
            </div>
            <span className="text-xl font-bold">JexAgent</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="px-4 py-2 text-sm font-medium hover:text-blue-600">
              登录
            </Link>
            <Link href="/register" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              免费开始
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero区域 */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            多AI协作决策助手
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            当单一AI给你<span className="text-blue-600">一个答案</span>时
            <br />
            JexAgent召集<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">AI编辑部</span>穷尽认知
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            通过多AI协作，从不同视角分析问题，前置问询收集关键信息，一次性给出高质量建议
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link 
              href="/register" 
              className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 inline-flex items-center gap-2"
            >
              立即开始 - 免费
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link 
              href="#features" 
              className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-lg text-lg font-medium hover:border-gray-300"
            >
              了解更多
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>免费试用</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>无需信用卡</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>每天3次额度</span>
            </div>
          </div>
        </div>
      </section>

      {/* 核心价值 */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 border border-gray-200 rounded-full text-sm font-medium mb-4">
              核心优势
            </div>
            <h2 className="text-4xl font-bold mb-4">为什么选择 JexAgent？</h2>
            <p className="text-xl text-gray-600">不只是AI工具，而是你的认知协作伙伴</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* 卡片1 */}
            <div className="p-8 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl">
                🧠
              </div>
              <h3 className="text-2xl font-bold mb-3">穷尽认知</h3>
              <p className="text-gray-600 mb-4">多AI从不同视角协作分析</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>不依赖单一AI视角，确保重要观点都被考虑</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>持续深化直到没有新信息增量</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>透明展示完整思考过程</span>
                </li>
              </ul>
            </div>

            {/* 卡片2 */}
            <div className="p-8 border-2 border-gray-200 rounded-2xl hover:border-purple-500 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl">
                ⚡
              </div>
              <h3 className="text-2xl font-bold mb-3">单轮解决</h3>
              <p className="text-gray-600 mb-4">前置问询，一次性给建议</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span>智能评估信息充足度，避免多轮折腾</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span>3-5个核心问题收集关键信息</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span>节省时间，提升决策效率</span>
                </li>
              </ul>
            </div>

            {/* 卡片3 */}
            <div className="p-8 border-2 border-gray-200 rounded-2xl hover:border-green-500 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl">
                🛡️
              </div>
              <h3 className="text-2xl font-bold mb-3">可解释性</h3>
              <p className="text-gray-600 mb-4">完整展示AI协作过程</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>查看完整的多AI对话轨迹</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>了解每个建议的论据来源</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>增强决策信心，避免黑箱焦虑</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 应用场景 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 border border-gray-200 bg-white rounded-full text-sm font-medium mb-4">
              适用场景
            </div>
            <h2 className="text-4xl font-bold mb-4">为自媒体创作者量身定制</h2>
            <p className="text-xl text-gray-600">MVP版本聚焦三大核心场景</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-2xl">
                🎯
              </div>
              <h3 className="text-xl font-bold mb-3">选题分析</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 热点是否值得追？</li>
                <li>• 多角度分析受众兴趣</li>
                <li>• 评估内容差异化空间</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 text-2xl">
                ✨
              </div>
              <h3 className="text-xl font-bold mb-3">内容创作</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 多AI协作生成初稿</li>
                <li>• 交叉审查优化质量</li>
                <li>• 风格与调性把控</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 text-2xl">
                ⚖️
              </div>
              <h3 className="text-xl font-bold mb-3">风险评估</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 法律合规性检查</li>
                <li>• 舆论风险预判</li>
                <li>• 应对策略建议</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="text-xl mb-8 opacity-90">
            免费版每天3次，无需信用卡，立即体验AI协作的力量
          </p>
          <Link 
            href="/register" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-medium hover:bg-gray-100"
          >
            立即免费使用
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-2">
              J
            </div>
            <span className="text-white font-bold text-lg">JexAgent</span>
          </div>
          <p className="text-sm">© 2025 JexAgent. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}