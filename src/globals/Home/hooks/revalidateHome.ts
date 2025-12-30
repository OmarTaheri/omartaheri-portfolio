import type { GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateHome: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating home page`)
    // Revalidate multiple paths for comprehensive cache bust
    revalidatePath('/', 'layout')
    revalidatePath('/')
    revalidateTag('global_home')
    revalidateTag('pages_home')
  }
  return doc
}
