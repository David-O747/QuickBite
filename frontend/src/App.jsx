import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { MicroInteractionsProvider } from './context/MicroInteractionsContext'
import MisclickTracker from './components/MisclickTracker'
import StudyLoginGuard from './components/StudyLoginGuard'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import BrowsePage from './pages/BrowsePage'
import ProductPage from './pages/ProductPage'
import BasketPage from './pages/BasketPage'
import CheckoutDeliveryPage from './pages/CheckoutDeliveryPage'
import CheckoutPaymentPage from './pages/CheckoutPaymentPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import OffersPage from './pages/OffersPage'
import RewardsPage from './pages/RewardsPage'
import InfoPage from './pages/InfoPage'
import AboutUsPage from './pages/AboutUsPage'
import DeliveryAreasPage from './pages/DeliveryAreasPage'
import HelpCentrePage from './pages/HelpCentrePage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import CookiePolicyPage from './pages/CookiePolicyPage'
import RestaurantMenuPage from './pages/RestaurantMenuPage'
import AccountPage from './pages/AccountPage'

const MICRO_INTERACTIONS_ENABLED =
  import.meta.env.VITE_SITE_VERSION !== 'A'

function App() {
  return (
    <MicroInteractionsProvider enabled={MICRO_INTERACTIONS_ENABLED}>
      <AppProvider>
        <div className={MICRO_INTERACTIONS_ENABLED ? 'mi-on' : 'mi-off'}>
          <BrowserRouter>
            <MisclickTracker />
            <StudyLoginGuard />
            <TaskKeyListener />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/info/about-us" element={<AboutUsPage />} />
              <Route path="/info/delivery-areas" element={<DeliveryAreasPage />} />
              <Route path="/info/help-centre" element={<HelpCentrePage />} />
              <Route path="/info/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/info/cookie-policy" element={<CookiePolicyPage />} />
              <Route path="/info/:pageSlug" element={<InfoPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/restaurant/:restaurantId" element={<RestaurantMenuPage />} />
              <Route path="/product/:productId" element={<ProductPage />} />
              <Route path="/basket" element={<BasketPage />} />
              <Route path="/checkout/delivery" element={<CheckoutDeliveryPage />} />
              <Route path="/checkout/payment" element={<CheckoutPaymentPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AppProvider>
    </MicroInteractionsProvider>
  )
}

export default App
