import { Alert, Box, Button, CircularProgress, Divider, IconButton, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { type FormEvent, useState } from 'react'
import { CheckoutError, placeOrder } from '../api/checkout'
import { formatPrice } from '../format'
import type { Book, CheckoutSuccessResponse, ShippingAddress } from '../types'
import { OrderConfirmation } from './OrderConfirmation'
import { OrderItems } from './OrderItems'
import { RainbowDivider } from './RainbowDivider'
import { ShippingAddressCard } from './ShippingAddressCard'
import CelebrationIcon from '@mui/icons-material/Celebration';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HelpOutlineIcon from "@mui/icons-material/Help";

// The state of the checkout
type CheckoutStatus = 'idle' | 'loading' | 'error' | 'success'

interface CheckoutPageProps {
  books: Book[]
  address: ShippingAddress
  onStartNewOrder: () => void
}

// For the purpose of mocking tax. The total combined tax rate for NYC is 8.875%.
const NYC_TAX_RATE = 0.08875

// Mocked promo code
const PROMO_CODE = 'BOTM5'
const PROMO_DISCOUNT_CENTS = 500

// Renders the checkout page
export function CheckoutPage({ books, address, onStartNewOrder }: CheckoutPageProps) {
  const [status, setStatus] = useState<CheckoutStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [confirmation, setConfirmation] = useState<CheckoutSuccessResponse | null>(null)
  const [cart, setCart] = useState<Book[]>(books)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)

  // Assumption: In real life the server would calculate tax and shipping. For this task,
  // tax is mocked at NYC's rate and shipping is free. Tax is rounded to the nearest cent.
  const subtotalCents = cart.reduce((sum, b) => sum + b.priceCents, 0)
  
  // The discount can't be more than the subtotal, so the total never goes negative.
  // Tax is calculated after the discount, since NY taxes the discounted price.
  const discountCents = promoApplied ? Math.min(PROMO_DISCOUNT_CENTS, subtotalCents) : 0
  const taxCents = Math.round((subtotalCents - discountCents) * NYC_TAX_RATE)
  const totalCents = subtotalCents - discountCents + taxCents
  
  const isLoading = status === 'loading'

  // Changing the cart should clear any error, since it was about the old cart
  function updateCart(next: Book[]) {
    setCart(next)
    if (status === 'error') {
      setStatus('idle')
      setErrorMessage(null)
    }
  }

  // Validates and applies the promo code
  function handleApplyPromo(e: FormEvent) {
    e.preventDefault()
    if (promoCode.trim().toUpperCase() === PROMO_CODE) {
      setPromoApplied(true)
      setPromoError(null)
    } else {
      setPromoApplied(false)
      setPromoError("Invalid code.")
    }
  }

  // Places the order
  async function handlePlaceOrder() {
    setStatus('loading')
    setErrorMessage(null)
    try {
      const result = await placeOrder(cart.map((b) => b.id))
      setConfirmation(result)
      setStatus('success')
    } catch (err) {
      const message =
        err instanceof CheckoutError ? err.message : 'Something went wrong and your order was not placed. Please try again.'
      setErrorMessage(message)
      setStatus('error')
    }
  }

  // If the order was successful display the order confirmation box
  if (status === 'success' && confirmation) {
    return <OrderConfirmation {...confirmation} onStartNewOrder={onStartNewOrder} />
  }

  return (
    <Box component="main">
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 3, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Review your order
        </Typography>
        <BookmarkIcon fontSize="large" sx={{ color: '#FCB513' }}/>
      </Stack>

      <RainbowDivider />

      <Stack direction='row' spacing={3} sx={{ alignItems: 'flex-start' }}>
        <Box sx={{ flex: 2, width: '100%' }}>
          <OrderItems
            books={cart}
            onRemove={(id) => updateCart(cart.filter((b) => b.id !== id))}
            onReset={() => updateCart(books)}
            canReset={cart.length < books.length}
            disabled={isLoading}
          />
        </Box>

        <Stack spacing={3} sx={{ flex: 1, width: '100%', position: { md: 'sticky' }, top: { md: 24 } }}>
          <ShippingAddressCard address={address} />

          <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack direction="row" spacing={0.25} sx={{ alignItems: 'center', mb: 1}}>
                <Typography variant="h6" component="h2">
                  Order summary
                </Typography>
                <Tooltip title="See READ.ME for promo code!" placement="top">
                  <IconButton size="small" aria-label="more information" sx={{ p: 0.25 }}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
            </Stack>
            {!promoApplied && (
              <Stack component="form" direction="row" spacing={1} onSubmit={handleApplyPromo} sx={{ mb: 2 }}>
                <TextField
                  size="small"
                  label="Promo code"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value)
                    setPromoError(null)
                  }}
                  error={promoError !== null}
                  helperText={promoError}
                  disabled={isLoading}
                  fullWidth
                />
                <Button type="submit" variant="outlined" disabled={isLoading || promoCode.trim() === ''} sx={{ alignSelf: 'flex-start', height: 40 }}>
                  Apply
                </Button>
              </Stack>
            )}
            {promoApplied && (
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
                <CelebrationIcon fontSize="small" />
                <Typography variant="body2">Congrats! You've received {formatPrice(discountCents)} off!</Typography>
              </Stack>
            )}
            <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal</Typography>
              <Typography sx={{ fontWeight: 700 }}>{formatPrice(subtotalCents)}</Typography>
            </Stack>
            {/* For the purpose of mocking discounts */}
            {promoApplied && (
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography>
                  Discount
                </Typography>
                <Typography color="success.main">−{formatPrice(discountCents)}</Typography>
              </Stack>
            )}
            {/* For the purpose of mocking shipping */}
            <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping</Typography>
              <Typography>{'FREE'}</Typography>
            </Stack>
            {/* For the purpose of mocking tax */}
            <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
              <Typography>Tax</Typography>
              <Typography>{formatPrice(taxCents)}</Typography>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 2 }}>
              <Typography>Total</Typography>
              <Typography sx={{ fontWeight: 700 }}>{formatPrice(totalCents)}</Typography>
            </Stack>
            <Divider sx={{ mb: 2 }} />

            {/* Displays checkout error */}
            {status === 'error' && errorMessage && (
              <Alert severity="error" role="alert" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            {/* If there's an error, prompt the user to try again */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handlePlaceOrder}
              disabled={isLoading || cart.length === 0}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : undefined}
            >
              {isLoading ? 'Placing your order…' : status === 'error' ? 'Try again' : 'Place order'}
            </Button>

            {/* Reminds the user to not refresh while order is loading */}
            <Typography
              variant="body2"
              color="text.secondary"
              aria-live="polite"
              sx={{ mt: 1.5, textAlign: 'center', minHeight: '1.5em' }}
            >
              {isLoading ? 'Don’t close or refresh this page.' : ''}
            </Typography>
          </Paper>
        </Stack>
      </Stack>
    </Box>
  )
}
