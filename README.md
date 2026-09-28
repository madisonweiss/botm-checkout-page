# Book of the Month: Checkout Page

Checkout page for a Book of the Month box. Shows the books in proper order, saved shipping
address, and an order summary. Placing the order hits `POST /api/checkout`; a successful
order shows a confirmation screen with the order number and ship date.

You can also:

- Remove books from the cart (and bring them all back with **Reset cart**)
- Apply a promo code for $5 off (see below)
- After placing an order, hit **Start a new order** to go back to a clean checkout

Built with React 19 + TypeScript + Vite + MUI.

## Running it

Needs Node 20.19+ or 22.12+ (Vite 8 requirement).

```sh
npm install
npm run dev
```

Open whatever URL Vite prints — usually `http://localhost:5173`.

Other scripts: `npm run build` (typecheck + build), `npm run lint` (Oxlint).

## Trying the different states

There's no real backend here. The spec gives you an endpoint contract, not a server, so
`POST /api/checkout` is faked by a small Vite dev middleware in `mock-api.ts`. By default it
waits about a second and sends back an order number + a ship date 3 days out.

To hit the other paths, add a query param to the URL instead of changing any code:

| URL                       | What happens                                         |
| ------------------------- | ---------------------------------------------------- |
| `/?simulate=timeout`      | Server just never responds — client times out at 15s |
| `/?simulate=network`      | Connection gets dropped mid-request                  |
| `/?simulate=invalid-body` | 200 status but HTML instead of JSON                  |
| `/?simulate=error`        | 409 with a real error message                        |

## Promo code

`BOTM5` gets you $5 off (not case sensitive). Discount is capped at the subtotal so total
never goes negative, and tax is calculated after the discount.

## Project structure

```
src/
  api/checkout.ts          placeOrder(): the POST request
  components/
    CheckoutPage.tsx       Page layout, order summary, checkout state
    OrderItems.tsx         List of books in the order
    ShippingAddressCard.tsx
    OrderConfirmation.tsx  Success screen
    RainbowDivider.tsx     Decorative stripe shared by both screens
  data/mockData.ts         Mock books and address
  format.ts                Price and ship date formatting
  types.ts                 Data types and API request/response types
mock-api.ts                Dev-only mock of POST /api/checkout
```

## Decisions and assumptions

**Prices are stored in integer cents.** Prices are stored as cents and then converted to dollar amounts for display, in `formatPrice`. This decision was made after researching best practices for storing currency data.

**Tax is mocked.** The spec doesn't mention tax or shipping at all, so I went with NYC's
8.875% combined rate to have something realistic on screen. Shipping shows as free. A real backend would obviously own this calculation, not the client.

**The promo code is mocked on the client.** The code and discount are hard-coded in `CheckoutPage.tsx`, and the code isn't sent with the order, since the spec's request body only has `bookIds`.IIn a real version the server would validate the code and apply the discount itself.

**Every failure becomes a `CheckoutError` with a message that's safe to show the user.** This covers network errors, timeouts, non-JSON responses and error responses from the API.

**Requests time out after 15 seconds.** `fetch` doesn't have a built-in timeout, so without this the server just hangs forever. After a timeout, the message says the order _may_ have gone through and to check email before retrying since a timeout doesn't tell you whether the server got the request or not.

**The mock API is Vite middleware instead of a fake `fetch`.** This was really important to me. It's more setup than it needed to be, but I wanted the client to make real HTTP requests, so status codes, response parsing and network failures are all tested the same way they would be against a real backend.

**Double submission is prevented by disabling the button** while the request is in progress. The cart and promo code controls are disabled too.

**"Start a new order" resets everything by remounting the page.** `App.tsx` gives `CheckoutPage` a `key` and changes it when the button is clicked, so all of the page's state starts fresh.

**Ship dates are parsed as local dates.** A bare date like `2026-09-29` is parsed in local time, because `new Date("2026-09-29")` is treated as UTC midnight and would show the previous day in US time zones.

## With more time

- Tests for `placeOrder` and the checkout page's states.
- Runtime validation on the API response (right now it's just typed as `CheckoutResponse`,
  nothing checks the shape actually matches).
- Real tax/shipping numbers from the server.
