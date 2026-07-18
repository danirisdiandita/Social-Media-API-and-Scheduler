import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/api-key"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const user = await getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const tags = await prisma.tag.findMany({
    where: { user_id: user.id },
    orderBy: { name: "asc" },
  })

  return NextResponse.json({ data: tags })
}

export async function POST(request: Request) {
  const user = await getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name } = await request.json()
  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Tag name is required" }, { status: 400 })
  }

  const trimmed = name.trim()

  const existing = await prisma.tag.findFirst({
    where: { user_id: user.id, name: trimmed },
  })

  if (existing) {
    return NextResponse.json({ data: existing })
  }

  const tag = await prisma.tag.create({
    data: {
      user_id: user.id,
      name: trimmed,
    },
  })

  return NextResponse.json({ data: tag }, { status: 201 })
}
