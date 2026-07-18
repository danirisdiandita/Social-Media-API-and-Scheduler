import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/api-key"
import { NextResponse } from "next/server"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const tagId = parseInt(id)

  if (isNaN(tagId)) {
    return NextResponse.json({ error: "Invalid tag ID" }, { status: 400 })
  }

  const tag = await prisma.tag.findFirst({
    where: { id: tagId, user_id: user.id },
  })

  if (!tag) {
    return NextResponse.json({ error: "Tag not found" }, { status: 404 })
  }

  await prisma.tag.delete({ where: { id: tagId } })

  return NextResponse.json({ success: true })
}
