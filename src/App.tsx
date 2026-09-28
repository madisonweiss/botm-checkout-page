import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { useState } from 'react'
import { CheckoutPage } from './components/CheckoutPage'
import { mockAddress, mockBooks } from './data/mockData'

const theme = createTheme({
  palette: {
    primary: { main: '#0A69A6' },
    background: { default: '#faf8f5' },
  },
  shape: { borderRadius: 10 },
  typography: {
    h4: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
})

export default function App() {
  // Changing the key remounts CheckoutPage and resets all of its state
  const [checkoutKey, setCheckoutKey] = useState(0)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ p: 3 }}>
        <CheckoutPage
          key={checkoutKey}
          books={mockBooks}
          address={mockAddress}
          onStartNewOrder={() => setCheckoutKey((prev) => prev + 1)}
        />
      </Container>
    </ThemeProvider>
  )
}
