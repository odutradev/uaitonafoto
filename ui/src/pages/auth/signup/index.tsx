import { useRegisterForm } from './hooks/useRegisterForm'
import { RegisterForm } from './subcomponents'

const SignUp = () => {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errorMessage,
    submitting,
    handleSubmit,
    handleGoogleLogin
  } = useRegisterForm()

  return (
    <RegisterForm
      name={name}
      setName={setName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      errorMessage={errorMessage}
      submitting={submitting}
      onSubmit={handleSubmit}
      onGoogleLogin={handleGoogleLogin}
    />
  )
}

export default SignUp

