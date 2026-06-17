import { decrypt } from "@/lib/encryption"
import { prisma } from "@/lib/prisma"
import { auth } from "../../auth"

const KEY_PREFIX_LENGTH = 12
const KEY_INDEX_LENGTH = 64
const KEY_LENGTH = 128

export async function verifyApiKey(request: Request) {
  const apiKey = request.headers.get("Authorization")?.split("Bearer ")[1]
  if (!apiKey) return null

  const keyIndex = apiKey.slice(KEY_PREFIX_LENGTH, KEY_PREFIX_LENGTH + KEY_INDEX_LENGTH)
  const key = apiKey.slice(KEY_PREFIX_LENGTH + KEY_INDEX_LENGTH, KEY_PREFIX_LENGTH + KEY_INDEX_LENGTH + KEY_LENGTH)

  if (!keyIndex || !key) return null

  const apiKeyRecord = await prisma.apiKey.findFirst({
    where: { key_index: keyIndex },
  })

  if (!apiKeyRecord) return null

  let decryptedKey = ""
  try {
    decryptedKey = decrypt(JSON.parse(apiKeyRecord.key))
  } catch {
    return null
  }

  if (!decryptedKey || decryptedKey !== key) return null

  return apiKeyRecord
}

export async function getUserFromRequest(request: Request) {
  const apiKey = await verifyApiKey(request)
  if (apiKey) {
    const user = await prisma.user.findUnique({
      where: { id: apiKey.user_id },
    })
    return user
  }

  const session = await auth()

  if (!session?.user?.email) return null

  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
  })

  return user
}
