import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import CtaButton from '../components/CtaButton'
import PopupIcon from '../components/studyPopups/PopupIcon'
import {
  getDeliveryStage,
  getDeliveryStageInfo,
  isOrderActive,
} from '../utils/deliveryStage'

function AccountPage() {
  const app = useApp()
  const { isLoggedIn, customer, orderHistory, loadCustomerData } = app
  const navigate = useNavigate()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!isLoggedIn || !customer?.id) {
      navigate('/login')
      return
    }
    loadCustomerData(customer.id)
  }, [isLoggedIn, customer?.id, navigate, loadCustomerData])

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const activeOrders = useMemo(
    () => orderHistory.filter((order) => isOrderActive(order)),
    [orderHistory, tick]
  )

  const pastOrders = useMemo(
    () => orderHistory.filter((order) => !isOrderActive(order)),
    [orderHistory, tick]
  )

  function viewOrder(orderNumber) {
    const order = app.openOrder(orderNumber)
    if (order) navigate('/order-confirmation')
  }

  if (!isLoggedIn) return null

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
            <PopupIcon iconId="lucide:user" size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My account</h1>
            <p className="text-sm text-gray-500">{app.customer?.customerEmail}</p>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <PopupIcon iconId="lucide:truck" size={20} />
            On the way
          </h2>
          {activeOrders.length === 0 ? (
            <p className="text-sm text-gray-500 rounded-xl border border-gray-100 bg-white p-4">
              No active deliveries right now.
            </p>
          ) : (
            <ul className="space-y-3">
              {activeOrders.map((order) => {
                const stage = getDeliveryStage(order)
                const stageInfo = getDeliveryStageInfo(order, stage)
                return (
                  <li
                    key={order.orderNumber}
                    className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{order.restaurantName}</p>
                        <p className="text-sm text-red-600 mt-0.5">{stageInfo.status}</p>
                        <p className="text-xs text-gray-500 mt-1">#{order.orderNumber}</p>
                      </div>
                      <p className="font-bold text-red-600">£{order.orderTotal.toFixed(2)}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <CtaButton
                        ctaButtonId={`account_view_${order.orderNumber}`}
                        className="rounded-lg text-xs px-3! py-1.5!"
                        onClick={() => viewOrder(order.orderNumber)}
                      >
                        View details
                      </CtaButton>
                      <Link to="/info/help-centre">
                        <CtaButton
                          ctaButtonId={`account_help_${order.orderNumber}`}
                          className="rounded-lg text-xs px-3! py-1.5! bg-white! text-red-600! border border-red-200"
                        >
                          Get Help
                        </CtaButton>
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <PopupIcon iconId="lucide:package-check" size={20} />
            Past orders
          </h2>
          {pastOrders.length === 0 ? (
            <p className="text-sm text-gray-500 rounded-xl border border-gray-100 bg-white p-4">
              Your completed orders will appear here.
            </p>
          ) : (
            <ul className="space-y-3">
              {pastOrders.map((order) => (
                <li
                  key={order.orderNumber}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{order.restaurantName}</p>
                      <p className="text-sm text-gray-600 mt-0.5">Delivered</p>
                      <p className="text-xs text-gray-500 mt-1">#{order.orderNumber}</p>
                    </div>
                    <p className="font-bold">£{order.orderTotal.toFixed(2)}</p>
                  </div>
                  <button
                    type="button"
                    className="mt-3 text-sm font-medium text-red-600"
                    onClick={() => viewOrder(order.orderNumber)}
                  >
                    View order details
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Link to="/info/help-centre">
          <CtaButton ctaButtonId="account_help_main" className="rounded-lg">
            Get Help
          </CtaButton>
        </Link>
      </main>

      <SiteFooter />
    </div>
  )
}

export default AccountPage
