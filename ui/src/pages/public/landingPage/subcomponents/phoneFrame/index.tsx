import { Body, Island, Screen } from "./styles";
import type { PhoneFrameProps } from "./types";

const PhoneFrame = ({ children, className }: PhoneFrameProps) => (
  <Body className={className}>
    <Screen>
      <Island aria-hidden="true" />
      {children}
    </Screen>
  </Body>
);

export default PhoneFrame;
