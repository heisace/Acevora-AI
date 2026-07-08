// Stub API route - will be implemented later
export async function POST(request: Request) {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
