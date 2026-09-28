import type { Book, ShippingAddress } from '../types'

//-------------------- Mock book data --------------------//

// Note: Covers come from the Open Library covers API. 
// If one fails to load, the UI falls back to a placeholder.
// (These are some of my faves + one's I want to try!)
export const mockBooks: Book[] = [
  {
    id: 'book1',
    title: 'The Two Towers',
    author: 'J. R. R. Tolkien',
    coverImage: 'https://covers.openlibrary.org/b/isbn/978-0261102361-M.jpg',
    priceCents: 1699,
  },
  {
    id: 'book2',
    title: 'All the Light We Cannot See',
    author: 'Anthony Doerr',
    coverImage: 'https://covers.openlibrary.org/b/isbn/978-1476746586-M.jpg',
    priceCents: 1899,
  },
  {
    id: 'book3',
    title: 'Mistborn',
    author: 'Brian Sanderson',
    coverImage: 'https://covers.openlibrary.org/b/isbn/978-0765377135-M.jpg',
    priceCents: 999,
  },
  {
    id: 'book4',
    title: 'The Pillars of the Earth',
    author: 'Ken Follett',
    coverImage: 'https://covers.openlibrary.org/b/isbn/978-0451166890-M.jpg',
    priceCents: 1699,
  },
]

//-------------------- Mock shipping address --------------------//

export const mockAddress: ShippingAddress = {
  name: 'Madison Weiss',
  line1: '34 W 27th St',
  line2: 'FL 10',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
}
