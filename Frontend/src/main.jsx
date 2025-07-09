import { createRoot } from 'react-dom/client'
import './index.css'
import './CSS Utility/Utility.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import { store, persistor } from './Redux/Store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
      <Toaster />
    </PersistGate>
  </Provider>
)
