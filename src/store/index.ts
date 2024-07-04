// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'
import knowledge from 'src/store/apps/knowledge'
import email from 'src/store/apps/email'

export const store = configureStore({
  reducer: {
    knowledge,
    email
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
