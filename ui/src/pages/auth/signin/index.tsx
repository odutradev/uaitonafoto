import { useLoginForm } from './hooks/useLoginForm'
import { LoginForm } from './subcomponents'

const SignIn = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    errorMessage,
    submitting,
    handleSubmit,
    handleGoogleLogin
  } = useLoginForm()

  return (
    <LoginForm
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      errorMessage={errorMessage}
      submitting={submitting}
      onSubmit={handleSubmit}
      onGoogleLogin={handleGoogleLogin}
    />
  )
}

export default SignIn
