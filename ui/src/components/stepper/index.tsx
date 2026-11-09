import { Fragment } from 'react'
import { Box, Typography } from '@mui/material'
import { Check as CheckIcon } from '@mui/icons-material'

import {
  stepBadgeStyles,
  stepConnectorStyles,
  stepDescriptionStyles,
  stepItemStyles,
  stepLabelStyles,
  stepLabelWrapperStyles,
  stepperContainerStyles
} from './styles'
import type { StepperProps } from './types'

export const Stepper = ({
  steps,
  activeStep,
  onStepClick,
  clickablePastSteps = false,
  sx
}: StepperProps) => {
  return (
    <Box sx={[stepperContainerStyles, ...(Array.isArray(sx) ? sx : [sx])]}>
      {steps.map((rawStep, index) => {
        const step = typeof rawStep === 'string' ? { label: rawStep } : rawStep
        const isCompleted = index < activeStep
        const isActive = index === activeStep

        const status = isCompleted ? 'completed' : isActive ? 'active' : 'upcoming'
        const isClickable = Boolean(
          onStepClick && (isCompleted ? clickablePastSteps || true : false)
        )

        const handleClick = () => {
          if (isClickable && onStepClick) {
            onStepClick(index)
          }
        }

        return (
          <Fragment key={index}>
            {index > 0 && (
              <Box sx={stepConnectorStyles(index <= activeStep)} />
            )}

            <Box
              sx={stepItemStyles(isClickable)}
              onClick={handleClick}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
            >
              <Box sx={stepBadgeStyles(status)}>
                {isCompleted ? (
                  <CheckIcon sx={{ fontSize: '1.1rem' }} />
                ) : (
                  step.icon ?? index + 1
                )}
              </Box>

              <Box sx={stepLabelWrapperStyles}>
                <Typography sx={stepLabelStyles(status)}>
                  {step.label}
                </Typography>
                {step.description && (
                  <Typography sx={stepDescriptionStyles}>
                    {step.description}
                  </Typography>
                )}
              </Box>
            </Box>
          </Fragment>
        )
      })}
    </Box>
  )
}

export default Stepper
