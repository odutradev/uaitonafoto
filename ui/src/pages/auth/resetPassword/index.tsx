import { ResetPasswordForm } from './subcomponents/resetPasswordForm'
import { ResetPasswordPageProvider } from './hook'

const ResetPassword = () => (
  <ResetPasswordPageProvider>
    <ResetPasswordForm />
  </ResetPasswordPageProvider>
)

export default ResetPassword
