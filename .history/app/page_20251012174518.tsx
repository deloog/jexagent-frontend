import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/layout/navbar"
import { ArrowRight, Sparkles, Zap, Shield, CheckCircle2, Brain, Target, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section - 渐变背景 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* 装饰性背景 */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <div className="container mx-auto px-4 pt-32 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700 border-blue-200">
              <Sparkles className="w-3 h-3 mr-2 inline" />
              多AI协作决策助手
            </Badge>
            
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              当单一AI给你<span className="text-blue-600">一个答案</span>时
              <br />
              JexAgent召集<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI编辑部</span>穷尽认知
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              通过多AI协作，从不同视角分析问题，前置问询收集关键信息，一次性给出高质量建议
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="text-lg px-8 py-6 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/50 transition-all" asChild>
                <Link href="/register">
                  立即开始 - 免费
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="#features">了解更多</Link>
              </Button>
            </div>
            
            {/* 社会证明 */}
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>免费试用</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>无需信用卡</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>每天3次额度</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 核心价值 - 现代卡片设计 */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">核心优势</Badge>
            <h2 className="text-4xl font-bold mb-4">为什么选择 JexAgent？</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              不只是AI工具，而是你的认知协作伙伴
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* 卡片1 */}
            <Card className="p-8 border-2 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">穷尽认知</h3>
              <p className="text-slate-600 mb-4">多AI从不同视角协作分析</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>不依赖单一AI视角，确保重要观点都被考虑</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>持续深化直到没有新信息增量</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>透明展示完整思考过程</span>
                </li>
              </ul>
            </Card>

            {/* 卡片2 */}
            <Card className="p-8 border-2 hover:border-purple-500 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">单轮解决</h3>
              <p className="text-slate-600 mb-4">前置问询，一次性给建议</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>智能评估信息充足度，避免多轮折腾</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>3-5个核心问题收集关键信息</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>节省时间，提升决策效率</span>
                </li>
              </ul>
            </Card>

            {/* 卡片3 */}
            <Card className="p-8 border-2 hover:border-green-500 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">可解释性</h3>
              <p className="text-slate-600 mb-4">完整展示AI协作过程</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>查看完整的多AI对话轨迹</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>了解每个建议的论据来源</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>增强决策信心，避免黑箱焦虑</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* 应用场景 - 更现代的布局 */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">适用场景</Badge>
            <h2 className="text-4xl font-bold mb-4">为自媒体创作者量身定制</h2>
            <p className="text-xl text-slate-600">MVP版本聚焦三大核心场景</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">选题分析</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• 热点是否值得追？</li>
                <li>• 多角度分析受众兴趣</li>
                <li>• 评估内容差异化空间</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">内容创作</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• 多AI协作生成初稿</li>
                <li>• 交叉审查优化质量</li>
                <li>• 风格与调性把控</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">风险评估</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• 法律合规性检查</li>
                <li>• 舆论风险预判</li>
                <li>• 应对策略建议</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="text-xl mb-8 opacity-90">
            免费版每天3次，无需信用卡，立即体验AI协作的力量
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6 shadow-xl" asChild>
            <Link href="/register">
              立即免费使用
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4 text-center">
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