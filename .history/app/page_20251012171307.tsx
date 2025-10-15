import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/layout/navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 text-center">
        <Badge className="mb-4" variant="secondary">
          多AI协作决策助手
        </Badge>
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          当单一AI给你一个答案时<br />
          JexAgent召集AI编辑部穷尽认知
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          通过多AI协作，从不同视角分析问题，确保重要观点都被考虑。
          前置问询收集关键信息，一次性给出高质量建议。
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/register">立即开始 - 免费</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#how-it-works">了解更多</Link>
          </Button>
        </div>
      </section>

      {/* 核心价值 */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">三大核心价值</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <CardTitle>穷尽认知</CardTitle>
              <CardDescription>多AI从不同视角协作分析</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
              不依赖单一AI的视角。通过多模型协作确保重要观点都被考虑让你确信&ldquo;答案已经足够全面&rdquo;。"。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <CardTitle>单轮解决</CardTitle>
              <CardDescription>前置问询，一次性给建议</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                智能评估信息充足度，必要时通过3-5个核心问题收集关键信息，避免多轮折腾，提升决策效率。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <CardTitle>可解释性</CardTitle>
              <CardDescription>完整展示AI协作过程</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                查看完整的多AI对话轨迹，了解每个建议的论据来源，增强决策信心，避免黑箱焦虑。
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 应用场景 */}
      <section id="how-it-works" className="container mx-auto px-4 py-16 bg-slate-50 rounded-3xl">
        <h2 className="text-3xl font-bold text-center mb-12">适用场景（MVP版）</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>📝 选题分析</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 热点是否值得追？</li>
                <li>• 多角度分析受众兴趣</li>
                <li>• 评估内容差异化空间</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>✍️ 内容创作</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 多AI协作生成初稿</li>
                <li>• 交叉审查优化质量</li>
                <li>• 风格与调性把控</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>⚖️ 风险评估</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 法律合规性检查</li>
                <li>• 舆论风险预判</li>
                <li>• 应对策略建议</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
        <p className="text-muted-foreground mb-8">
          免费版每天3次，无需信用卡
        </p>
        <Button size="lg" asChild>
          <Link href="/register">立即免费使用</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 JexAgent. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}