import { Box, Stack } from '@mui/material'

// Fun colors for the rainbow divider
const stripeColors = [
  '#F0B93D', 
  '#E895BE', 
  '#2E6199', 
  '#4FA35C', 
  '#7EC8E3', 
  '#B49BC4', 
  '#CC5B3B']

// Renders a thin rainbow stripe used as a decorative divider (inspo from BOTM website!)
export function RainbowDivider() {
  return (
    <Stack direction="row" sx={{ height: 8, width: '100%', mb: 3 }}>
      {stripeColors.map((color) => (
        <Box key={color} sx={{ flex: 1, backgroundColor: color }} />
      ))}
    </Stack>
  )
}
