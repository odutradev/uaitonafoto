import { Box } from '@mui/material'
import { toast } from 'react-toastify'

import useAuth from '@hooks/useAuth'

import Events from './sections/events'
import Invoices from './sections/invoices'
import Plans from './sections/plans'
import Subscriptions from './sections/subscriptions'
import Welcome from './sections/welcome'
import useCheckout from './hooks/useCheckout'
import { homeContentStyles } from './styles'

const Home = () => {
  const { user } = useAuth()
  const {
    plans,
    subscriptions,
    invoices,
    invoicesPage,
    invoicesTotalPages,
    isLoadingPlans,
    isLoadingInvoices,
    checkoutPlanId,
    cancellingSubscriptionId,
    startCheckout,
    handleCancelSubscription,
    handleInvoicesPageChange
  } = useCheckout()

  if (!user) return null

  const firstName = user.name.split(' ')[0]
  const activeSubscriptionPlanIds = subscriptions
    .filter((sub) => sub.status !== 'CANCELLED')
    .map((sub) => sub.planId)

  const handleCreateEvent = () => {
    toast.info('A criação de eventos chega em breve!')
  }

  return (
    <Box sx={homeContentStyles}>
      <Welcome firstName={firstName} onCreateEvent={handleCreateEvent} />
      <Events onCreateEvent={handleCreateEvent} />
      <Subscriptions
        subscriptions={subscriptions}
        cancellingId={cancellingSubscriptionId}
        onCancelSubscription={handleCancelSubscription}
      />
      <Plans
        plans={plans}
        isLoading={isLoadingPlans}
        checkoutPlanId={checkoutPlanId}
        activeSubscriptionPlanIds={activeSubscriptionPlanIds}
        freeTrialClaimed={Boolean(user.freeTrialClaimedAt)}
        freeCredits={user.freeCredits}
        paidCredits={user.paidCredits}
        onSelectPlan={startCheckout}
      />
      <Invoices
        invoices={invoices}
        page={invoicesPage}
        totalPages={invoicesTotalPages}
        isLoading={isLoadingInvoices}
        onPageChange={handleInvoicesPageChange}
      />
    </Box>
  )
}

export default Home
