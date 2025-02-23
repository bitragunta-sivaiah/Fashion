import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
 
import { RouterProvider } from 'react-router-dom'
import router from './router/index.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
// import ErrorBoundary from './layout/ErrorBoundary.jsx'
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
 
     <RouterProvider router={router}/>
  
  </Provider>,
)
