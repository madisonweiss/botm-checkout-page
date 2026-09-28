import MenuBookIcon from '@mui/icons-material/MenuBook'
import RefreshIcon from '@mui/icons-material/Refresh'
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import { Avatar, Box, Button, Divider, IconButton, List, ListItem, Paper, Stack, Typography } from '@mui/material'
import { Fragment } from 'react'
import { formatPrice } from '../format'
import type { Book } from '../types'

interface OrderItemsProps {
  books: Book[]
  onRemove: (bookId: string) => void
  onReset: () => void
  // Can reset if any books have been deleted
  canReset: boolean
  disabled: boolean
}

// Renders the list of items in a user's cart
export function OrderItems({ books, onRemove, onReset, canReset, disabled }: OrderItemsProps) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" component="h2">
          Your cart ({books.length} {books.length === 1 ? 'book' : 'books'})
        </Typography>
        <Button size="small" startIcon={<RefreshIcon />} onClick={onReset} disabled={disabled || !canReset}>
          Reset cart
        </Button>
      </Stack>
      {books.length === 0 && (
        <Typography color="text.secondary" sx={{ py: 2 }}>
          Your cart is empty. Use "Reset cart" to add your books back.
        </Typography>
      )}
      <List disablePadding>
        {books.map((book, i) => (
          <Fragment key={book.id}>
            {i > 0 && <Divider component="li" />}
            <ListItem disableGutters sx={{ py: 2, alignItems: 'flex-start' }}>
              <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                {/* Avatar renders menu book icon if the image fails to load */}
                <Avatar
                  variant="rounded"
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  sx={{ width: 64, height: 96, bgcolor: 'grey.200', color: 'grey.500' }}
                >
                  <MenuBookIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600 }}>{book.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {book.author}
                  </Typography>
                </Box>
                <Stack sx={{ alignItems: 'flex-end' }}>
                  <Typography sx={{ fontWeight: 500 }}>{formatPrice(book.priceCents)}</Typography>
                  <IconButton
                    aria-label={`Remove ${book.title} from cart`}
                    size="small"
                    onClick={() => onRemove(book.id)}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            </ListItem>
          </Fragment>
        ))}
      </List>
    </Paper>
  )
}
