import { Box, Typography } from '@mui/material'

import { footerStyles, headerBoxStyles, pageTitleStyles, profilePageStyles } from './styles'
import useProfilePage, { ProfilePageProvider } from './hook'
import ProfileDetailsForm from './sections/profileDetailsForm'
import UserOverview from './sections/userOverview'
import { version } from '@assets/config'

const ProfileContent = () => {
  const { user } = useProfilePage()

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

      <UserOverview />

      <ProfileDetailsForm />

      <Box component="footer" sx={footerStyles}>
        <Typography variant="caption" color="text.secondary">
          uaiToNaFoto • Versão {version}
        </Typography>
      </Box>
    </Box>
  )
}

const Profile = () => (
  <ProfilePageProvider>
    <ProfileContent />
  </ProfilePageProvider>
)

export default Profile
