import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useRef } from 'react'
import { formatShipDate } from '../format'
import type { CheckoutSuccessResponse } from '../types'
import { RainbowDivider } from './RainbowDivider'

interface OrderConfirmationProps extends CheckoutSuccessResponse {
  onStartNewOrder: () => void
}

// Renders the order confirmation box
export function OrderConfirmation({ orderId, estimatedShipDate, onStartNewOrder }: OrderConfirmationProps) {
  // Moves focus to the new heading since the page content is swapped out
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <Paper variant="outlined" sx={{ p: 5, textAlign: 'center' }}>
      <RainbowDivider/>
      <Stack spacing={2} sx={{ alignItems: 'center', mt: 6 }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 64 }} />
        <Typography variant="h4" component="h1" ref={headingRef} tabIndex={-1} sx={{ outline: 'none' }}>
          Your order is confirmed!
        </Typography>
        <Typography color="text.secondary">Thanks for being a member. Happy reading!</Typography>
        <Box
          component="dl"
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            columnGap: 3,
            rowGap: 1,
            textAlign: 'left',
            m: 0,
            mt: 1,
            '& dt': { color: 'text.secondary' },
            '& dd': { m: 0, fontWeight: 600 },
          }}
        >
          <dt>Order number</dt>
          <dd>{orderId}</dd>
          <dt>Estimated ship date</dt>
          <dd>{formatShipDate(estimatedShipDate)}</dd>
        </Box>
      </Stack>
      <Stack sx={{ alignItems: 'flex-end', mt: 3 }}>
        <Button variant="contained" onClick={onStartNewOrder}>
          Start a new order
        </Button>
      </Stack>
    </Paper>
  )
}
