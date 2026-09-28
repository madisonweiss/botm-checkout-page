import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

// Dev-only mock of POST /api/checkout.
// Tradeoff: I did this instead of mocking inside the React code because I really 
// wanted the client to be able to make a real HTTP request. That way the network, 
// status-code and JSON-parsing paths are exercised exactly as they would be against 
// a real backend.
//
// To try each failure placeOrder handles, add a query param to the page URL:
//   ?simulate=timeout       -> never responds, so the client times out after 15s
//   ?simulate=network       -> drops the connection (shows up as a fetch failure)
//   ?simulate=invalid-body  -> 200 with a non-JSON body (e.g. a proxy error page)
//   ?simulate=error         -> 409 with { error }
export function mockCheckoutApi(): Plugin {
  return {
    name: 'mock-checkout-api',
    configureServer(server) {
      server.middlewares.use('/api/checkout', (req, res) => {
        void handleCheckout(req, res)
      })
    },
  }
}

// This is a 1.2 second delay
const DELAY_MS = 1200

// Prevents request from resolving instantly (so it actually looks like its loading)
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Sends json response to client
function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

async function handleCheckout(req: IncomingMessage, res: ServerResponse) {
  // The simulate param is on the page URL
  const simulate = new URL(req.headers.referer ?? 'http://x').searchParams.get('simulate')

  // Simulates a timeout error
  if (simulate === 'timeout') return

  await sleep(DELAY_MS)

  // Kills the connection to simulate server crash/ wifi issue
  if (simulate === 'network') {
    req.socket.destroy()
    return
  }

  // Simulates 200 status code with non-JSON body
  if (simulate === 'invalid-body') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end('<html><body>Service unavailable</body></html>')
    return
  }

  // Simulates a realistic error received from the server
  if (simulate === 'error') {
    sendJson(res, 409, { error: 'One of the books in your box is no longer available. Please choose another.' })
    return
  }

  // If there's no simulated error, give an orderID and estimatedShipDate
  const shipDate = new Date()
  shipDate.setDate(shipDate.getDate() + 3)

  sendJson(res, 200, {
    orderId: `BOTM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    estimatedShipDate: shipDate.toISOString().slice(0, 10),
  })
}
