import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* 左侧：登录表单 */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                J
              </div>
              <span className="text-2xl font-bold">JexAgent</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">欢迎回来</h1>
            <p className="text-slate-600">登录你的账户继续使用</p>
          </div>

          <form className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">密码</Label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  忘记密码？
                </Link>
              </div>
              <Input 
                id="password" 
                type="password"
                className="h-11"
              />
            </div>

            <Button className="w-full h-11 text-base" size="lg">
              登录
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-600">还没有账户？</span>{" "}
            <Link href="/register" className="text-blue-600 font-medium hover:underline">
              立即注册
            </Link>
          </div>
        </div>
      </div>

      {/* 右侧：装饰区域 */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-purple-600 p-12 text-white items-center justify-center">
        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-6">
            多AI协作
            <br />
            穷尽认知边界
          </h2>
          <p className="text-xl opacity-90 leading-relaxed">
            通过多AI视角协作，让每一个决策都经过深度思考和充分论证
          </p>
        </div>
      </div>
    </div>
  )
}