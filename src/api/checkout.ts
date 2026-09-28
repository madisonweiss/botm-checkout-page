import type { CheckoutRequestBody, CheckoutResponse, CheckoutSuccessResponse } from '../types'

// Allow 15 seconds before timeout
const TIMEOUT_MS = 15000

export class CheckoutError extends Error {}

// Places a user's order. Covers potential errors like request timeout, network 
// failure, invalid response body, unsucessful status. 
export async function placeOrder(bookIds: string[]): Promise<CheckoutSuccessResponse> {
  let response: Response

  try {
    response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookIds: bookIds } satisfies CheckoutRequestBody),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (err) {
    // Catches timeout error
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      // Assumption: In production, a confirmation email would be sent to the user. 
      // In the case of a timeout error, the order still may have gone through.
      // Therefore, we should reccommended the user to check their email
      // to prevent placing the order again. 
      throw new CheckoutError(
        'This is taking longer than expected. Please check your email for confirmation before trying again.',
      )
    }
    // Catches network error
    throw new CheckoutError("We couldn't place your order. Check your connection and try again.")
  }

  // Checks if the response is json 
  let data: CheckoutResponse
  try {
    data = await response.json()
  } catch {
    throw new CheckoutError('We got an unexpected response. Please try again.')
  }

  // Assumption: A successful HTTP status always matches CheckoutSuccessResponse, and a
  // failed status (or a successful status whose body has an error field) always
  // matches CheckoutErrorResponse.

  // Checks if the response returned an error
  if (!response.ok || 'error' in data) {
    const message = 'error' in data && data.error 
      ? data.error 
      : `Something went wrong (status ${response.status}).`
    throw new CheckoutError(message)
  }

  return { orderId: data.orderId, estimatedShipDate: data.estimatedShipDate }
}
