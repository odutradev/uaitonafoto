import { useResetPasswordForm } from './hooks/useResetPasswordForm'
import { ResetPasswordForm } from './subcomponents'

const ResetPassword = () => {
  const {
    token,
    email,
    setEmail,
    password,
    setPassword,
    submitting,
    submitted,
    handleSubmit
  } = useResetPasswordForm()

  return (
    <ResetPasswordForm
      token={token}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      submitting={submitting}
      submitted={submitted}
      onSubmit={handleSubmit}
    />
  )
}

export default ResetPassword
