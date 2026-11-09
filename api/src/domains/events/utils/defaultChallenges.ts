import { randomUUID } from 'crypto'
import type { EventChallenge, EventType } from '../repositories/events/types'

export const DEFAULT_CHALLENGES_BY_TYPE: Record<EventType, string[]> = {
  wedding: [
    'Foto com o padrinho ou madrinha mais animado 🕺',
    'O brinde mais bonito da sua mesa 🥂',
    'Flagra dos noivos apaixonados 💍',
    'O melhor passinho na pista de dança 💃',
    'Selfie com alguém da família dos noivos 👨‍👩‍👧',
    'Foto do doce ou prato mais gostoso da festa 🍰',
    'Foto com o convidado mais elegante da noite ✨'
  ],
  birthday: [
    'Foto fazendo careta com o aniversariante 🤪',
    'O abraço mais apertado da festa 🫂',
    'Flagra na hora de cantar o Parabéns 🎂',
    'A pose mais engraçada da sua mesa 📸',
    'Brinde com copo cheio ao aniversariante! 🍻',
    'Foto do look mais estiloso da festa 🕶️',
    'Selfie com 4 pessoas sorrindo 😁'
  ],
  corporate: [
    'Selfie criativa com o seu time 💼',
    'Foto de networking: com alguém que acabou de conhecer 🤝',
    'Foto fazendo a pose executiva mais marcante 👔',
    'Foto da equipe brindando ao sucesso do evento 🥂',
    'Foto em frente ao painel ou logo oficial do evento 🏢',
    'O sorriso mais contagiante da empresa ⭐',
    'Selfie com alguém de outro departamento 🚀'
  ],
  other: [
    'A foto mais animada da galera reunida 🎉',
    'A melhor gargalhada flagrada no evento 😂',
    'Foto do brinde mais épico da noite 🍹',
    'A pose mais criativa da festa 🕺',
    'Selfie com pessoas de mesas diferentes 🤝',
    'Foto do detalhe mais bonito da decoração 🌺',
    'Foto do momento mais emocionante da noite ❤️'
  ]
}

export const buildDefaultChallenges = (eventType: EventType): EventChallenge[] => {
  const titles = DEFAULT_CHALLENGES_BY_TYPE[eventType] || DEFAULT_CHALLENGES_BY_TYPE.other
  return titles.map((title) => ({
    id: randomUUID(),
    title,
    active: true,
    createdAt: new Date().toISOString()
  }))
}

export default buildDefaultChallenges
