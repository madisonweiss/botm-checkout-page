//-------------------- Basic types --------------------//

// Book
export interface Book {
  id: string
  title: string
  author: string
  coverImage: string
  // Prices are stored as cents and then converted to dollar amounts to display.
  // This decision was made after researching best practices for storing currency data.
  priceCents: number
}

// Shipping Address
export interface ShippingAddress {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  zipCode: string
}

//-------------------- Request types --------------------//

// Request body to make a checkout
export interface CheckoutRequestBody {
  bookIds: string[]
}

// Checkout response
export type CheckoutResponse = CheckoutSuccessResponse | CheckoutErrorResponse

// Successful checkout
export interface CheckoutSuccessResponse {
  orderId: string
  estimatedShipDate: string 
}

// Unsuccessful checkout
export interface CheckoutErrorResponse {
  error: string
}
