import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/api-key"
import { NextResponse } from "next/server"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const connectionId = parseInt(id)

  if (isNaN(connectionId)) {
    return NextResponse.json({ error: "Invalid connection ID" }, { status: 400 })
  }

  const connection = await prisma.connection.findFirst({
    where: { id: connectionId, user_id: user.id },
  })

  if (!connection) {
    return NextResponse.json({ error: "Connection not found" }, { status: 404 })
  }

  const { action, tagId } = await request.json()

  if (typeof tagId !== "number" || !["add", "remove"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  if (action === "add") {
    const tag = await prisma.tag.findFirst({
      where: { id: tagId, user_id: user.id },
    })
    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    await prisma.connection.update({
      where: { id: connectionId },
      data: { tags: { connect: { id: tagId } } },
    })
  } else {
    await prisma.connection.update({
      where: { id: connectionId },
      data: { tags: { disconnect: { id: tagId } } },
    })
  }

  return NextResponse.json({ success: true })
}
