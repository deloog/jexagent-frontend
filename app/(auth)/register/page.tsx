import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* 左侧：注册表单 */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                J
              </div>
              <span className="text-2xl font-bold">JexAgent</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">创建账户</h1>
            <p className="text-slate-600">开始使用AI协作决策助手</p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input 
                id="name" 
                placeholder="张三"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">邮箱地址</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com"
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input 
                id="password" 
                type="password"
                placeholder="至少8个字符"
                className="h-11"
              />
            </div>

            <Button className="w-full h-11 text-base" size="lg">
              创建账户
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-600">已有账户？</span>{" "}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              立即登录
            </Link>
          </div>
        </div>
      </div>

      {/* 右侧：优势展示 */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-purple-600 p-12 text-white">
        <div className="max-w-md space-y-8">
          <div>
            <h2 className="text-4xl font-bold mb-4">
              立即开始
              <br />
              免费体验
            </h2>
            <p className="text-lg opacity-90">
              注册即可获得免费额度，无需信用卡
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg mb-1">每天3次免费额度</h3>
                <p className="opacity-90">足够体验完整功能</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg mb-1">多AI协作分析</h3>
                <p className="opacity-90">从不同视角穷尽认知</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg mb-1">完整审计轨迹</h3>
                <p className="opacity-90">查看AI协作全过程</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}