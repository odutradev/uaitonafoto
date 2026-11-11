import Logo from "@components/logo";
import useLandingPage from "@pages/public/landingPage/hook";

import { Bottom, Brand, FooterBox, FooterLink, Inner, Links, Top } from "./styles";

const formatCompanyName = (name: string): string =>
  name.toLowerCase().replace(/(?:^|\s|-)\S/g, (char) => char.toUpperCase());

const formatCnpj = (cnpj: string): string => {
  const digits = cnpj.replace(/\D/g, "");
  if (digits.length === 14) return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  return cnpj;
};

export const Footer = () => {
  const { data: content } = useLandingPage();
  const data = content.footer;

  const copyrightText = data.copyrightSuffix.startsWith("©")
    ? data.copyrightSuffix
    : `© ${new Date().getFullYear()} ${data.copyrightSuffix}`;

  const companyInfo = [
    data.companyName ? formatCompanyName(data.companyName) : null,
    data.cnpj ? `CNPJ: ${formatCnpj(data.cnpj)}` : null
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <FooterBox>
      <Inner>
        <Top>
          <Brand>
            <Logo size="medium" variant="dark" />
            <p>{content.hero.description.split(".")[0]}.</p>
          </Brand>
          <Links aria-label="Links institucionais">
            <FooterLink to="/termos-de-uso">Termos de Uso</FooterLink>
            <FooterLink to="/politica-de-cancelamento">Cancelamento e Reembolso</FooterLink>
          </Links>
        </Top>
        <Bottom>
          <span>{copyrightText}</span>
          {companyInfo && <span>{companyInfo}</span>}
        </Bottom>
      </Inner>
    </FooterBox>
  );
};

export default Footer;
