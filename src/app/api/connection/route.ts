import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/api-key";

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const search = searchParams.get("search") || "";
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    user_id: user.id,
  };

  if (search) {
    where.username = { contains: search };
  }

  const [connections, totalCount] = await Promise.all([
    prisma.connection.findMany({
      where,
      orderBy: { id: "asc" },
      skip,
      take: limit,
      include: { tags: { select: { id: true, name: true } } },
    }),
    prisma.connection.count({
      where,
    }),
  ]);

  return new Response(
    JSON.stringify({
      data: connections,
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
