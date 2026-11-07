import { Box, Typography } from '@mui/material'

import useProfile from './hooks/useProfile'
import ProfileDetailsForm from './sections/profileDetailsForm'
import UserOverview from './sections/userOverview'
import { headerBoxStyles, pageTitleStyles, profilePageStyles } from './styles'

const Profile = () => {
  const {
    user,
    values,
    isDirty,
    isSaving,
    isSendingReset,
    setField,
    handleSubmit,
    handleResetChanges,
    handleSendPasswordReset
  } = useProfile()

  if (!user) return null

  return (
    <Box sx={profilePageStyles}>
      <Box component="header" sx={headerBoxStyles}>
        <Typography variant="h3" component="h1" sx={pageTitleStyles}>
          Meu perfil
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visualize os dados base da sua conta e mantenha suas informações de contato atualizadas.
        </Typography>
      </Box>

      <UserOverview user={user} />

      <ProfileDetailsForm
        email={user.email}
        values={values}
        isDirty={isDirty}
        isSaving={isSaving}
        isSendingReset={isSendingReset}
        onChangeField={setField}
        onSubmit={handleSubmit}
        onReset={handleResetChanges}
        onSendPasswordReset={handleSendPasswordReset}
      />
    </Box>
  )
}

export default Profile
