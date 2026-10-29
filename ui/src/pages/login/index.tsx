import { useLoginForm } from './hooks/useLoginForm'
import { LoginForm } from './subcomponents'

const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
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
      submitting={submitting}
      onSubmit={handleSubmit}
      onGoogleLogin={handleGoogleLogin}
    />
  )
}

export default Login
