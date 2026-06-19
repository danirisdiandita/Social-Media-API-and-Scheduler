# Connections API

Base URL: `https://autoposting.my.id/api/connection`

Auth: API key via `Authorization: Bearer <key>` header, or session cookie.

## List Connections

```bash
# via API key
curl -X GET \
  "https://autoposting.my.id/api/connection?page=1&limit=10" \
  -H "Authorization: Bearer autoposting-your-api-key-here"

# via session cookie
curl -X GET \
  "https://autoposting.my.id/api/connection?page=1&limit=10" \
  -H "Cookie: authjs.session-token=your-session-token-here"
```

### Query Params

| Param   | Default | Description          |
|---------|---------|----------------------|
| `page`  | 1       | Page number          |
| `limit` | 10      | Items per page       |

### Response

```json
{
  "data": [{ "id": 1, "user_id": 1, "connection_slug": "...", "display_name": "...", "social_media": "tiktok", ... }],
  "page": 1,
  "limit": 10,
  "totalCount": 42,
  "totalPages": 5
}
```

## Delete Connection

```bash
# via API key
curl -X DELETE \
  "https://autoposting.my.id/api/connection/42" \
  -H "Authorization: Bearer autoposting-your-api-key-here"

# via session cookie
curl -X DELETE \
  "https://autoposting.my.id/api/connection/42" \
  -H "Cookie: authjs.session-token=your-session-token-here"
```

### Response

```json
{ "message": "Connection deleted successfully" }
```
