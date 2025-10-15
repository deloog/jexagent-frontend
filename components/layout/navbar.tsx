"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  // 临时假数据：是否登录
  const isLoggedIn = false // 后续从状态管理读取
  const userName = "用户" // 后续从用户信息读取

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
            J
          </div>
          <span className="text-xl font-bold">JexAgent</span>
        </Link>

        {/* 导航链接 */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/features" className="text-sm font-medium hover:text-primary transition-colors">
            功能特性
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
            定价
          </Link>
          <Link href="/docs" className="text-sm font-medium hover:text-primary transition-colors">
            文档
          </Link>
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            // 已登录：显示头像菜单
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback>{userName[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">工作台</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">设置</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>退出登录</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // 未登录：显示登录注册按钮
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">登录</Link>
              </Button>
              <Button asChild>
                <Link href="/register">免费开始</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}