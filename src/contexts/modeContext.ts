import { createContext } from 'react'

import type { Mode } from '../types'

export const ModeContext = createContext<Mode>('edit')
