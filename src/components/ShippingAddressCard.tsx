import { Paper, Typography } from '@mui/material'
import type { ShippingAddress } from '../types'

// Renders the user's shipping address
export function ShippingAddressCard({ address }: { address: ShippingAddress }) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Shipping to
      </Typography>
      <Typography component="address" sx={{ fontStyle: 'normal' }}>
        {address.name}
        <br />
        {address.line1}
        {address.line2 && (
          <>
            <br />
            {address.line2}
          </>
        )}
        <br />
        {address.city}, {address.state} {address.zipCode}
      </Typography>
    </Paper>
  )
}
