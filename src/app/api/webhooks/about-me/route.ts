import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import crypto from 'crypto'
import { clearDocumentCache } from '@/services/about-me'

function validateWebhookSignature(
  payload: string,
  signature: string | null
): boolean {
  const secret = process.env.GITHUB_WEBHOOK_SECRET
  if (!secret || !signature) {
    console.warn(
      'Webhook signature validation failed: missing secret or signature'
    )
    return false
  }

  if (!signature.startsWith('sha256=')) {
    console.warn(
      'Webhook signature validation failed: invalid signature format'
    )
    return false
  }

  try {
    const computed =
      'sha256=' +
      crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex')
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computed))
  } catch (error) {
    console.error('Webhook signature validation error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('x-hub-signature-256')

    if (!validateWebhookSignature(payload, signature)) {
      console.warn('Unauthorized webhook request received')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const event = JSON.parse(payload)

    // Only respond to the About-Me source branch that publishes documents.
    if (event.ref === 'refs/heads/master') {
      console.log(
        'About-Me repository updated, clearing cache and revalidating...'
      )

      // Clear in-memory cache
      clearDocumentCache()

      // Invalidate Next.js cache
      revalidateTag('about-me-documents')
      revalidatePath('/documents')

      console.log('Cache cleared and revalidation triggered')
    } else {
      console.log(`Webhook received for ref ${event.ref}, ignoring`)
    }

    return NextResponse.json({ status: 'OK' }, { status: 200 })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
