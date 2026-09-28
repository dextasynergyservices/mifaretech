import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type * as React from "react";

interface UserInviteEmailProps {
  name: string;
  email: string;
  role?: string;
  setupUrl: string;
}

export function UserInviteEmail({
  name = "Alison Davies",
  email = "staff@mifaretech.co.uk",
  role = "editor",
  setupUrl = "https://mifaretech.co.uk/admin/reset-password?token=sample",
}: UserInviteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You&apos;ve been invited to Mifaretech Enterprise Console</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Img
              src="https://mifaretech.co.uk/logo.png"
              width="52"
              height="52"
              alt="Mifaretech"
              style={logo}
            />
            <Heading style={brandTitle}>
              Mifare<span style={{ color: "#2F4CE0" }}>tech</span>
            </Heading>
            <Text style={tagline}>...lean forward smartly!</Text>
          </Section>

          {/* Body Content */}
          <Section style={content}>
            <Heading as="h3" style={heading}>
              Welcome to the Team, {name}!
            </Heading>
            <Text style={paragraph}>
              An administrator has invited you to join the{" "}
              <strong>Mifaretech Enterprise Console</strong> as an authorized staff member.
            </Text>

            <Section style={roleCard}>
              <Text style={roleLabel}>ASSIGNED ACCESS ROLE</Text>
              <Text style={roleValue}>{role.toUpperCase()}</Text>
              <Text style={roleEmail}>Associated Account: {email}</Text>
            </Section>

            <Text style={paragraph}>
              Please activate your account and choose your security passphrase by clicking the
              button below:
            </Text>

            <Section style={btnSection}>
              <Button style={button} href={setupUrl}>
                Activate Staff Account &rarr;
              </Button>
            </Section>

            <Text style={smallText}>Direct setup link (expires in 48 hours):</Text>
            <Text style={urlBox}>
              <Link href={setupUrl} style={link}>
                {setupUrl}
              </Link>
            </Text>

            <Hr style={divider} />

            <Section style={securityNotice}>
              <Text style={securityHeader}>Mandatory Two-Factor Authentication (2FA)</Text>
              <Text style={securityBody}>
                Upon your first login, you will be prompted to link a time-based authenticator app
                (Google Authenticator, 1Password, or Authy) to secure your staff account.
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>Mifaretech System Solutions &middot; Enterprise Console</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default UserInviteEmail;

const main: React.CSSProperties = {
  backgroundColor: "#f4f6fb",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container: React.CSSProperties = {
  maxWidth: "540px",
  margin: "30px auto",
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  overflow: "hidden",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 12px rgba(0, 8, 46, 0.05)",
};

const header: React.CSSProperties = {
  padding: "32px 24px 20px 24px",
  textAlign: "center" as const,
  backgroundColor: "#00082E",
};

const logo: React.CSSProperties = {
  margin: "0 auto",
  borderRadius: "12px",
};

const brandTitle: React.CSSProperties = {
  margin: "10px 0 2px 0",
  fontSize: "20px",
  fontWeight: "900",
  color: "#ffffff",
  letterSpacing: "-0.5px",
};

const tagline: React.CSSProperties = {
  margin: "0",
  fontSize: "11px",
  fontWeight: "700",
  color: "#F27500",
};

const content: React.CSSProperties = {
  padding: "32px 28px",
};

const heading: React.CSSProperties = {
  margin: "0 0 16px 0",
  fontSize: "18px",
  fontWeight: "800",
  color: "#000F5C",
};

const paragraph: React.CSSProperties = {
  margin: "0 0 14px 0",
  fontSize: "14px",
  lineHeight: "22px",
  color: "#334155",
};

const roleCard: React.CSSProperties = {
  margin: "18px 0 22px 0",
  padding: "16px",
  backgroundColor: "#F8FAFC",
  borderRadius: "12px",
  border: "1px solid #E2E8F0",
};

const roleLabel: React.CSSProperties = {
  margin: "0 0 4px 0",
  fontSize: "10px",
  fontWeight: "800",
  color: "#64748B",
  letterSpacing: "0.5px",
};

const roleValue: React.CSSProperties = {
  margin: "0",
  fontSize: "16px",
  fontWeight: "800",
  color: "#1230C4",
};

const roleEmail: React.CSSProperties = {
  margin: "4px 0 0 0",
  fontSize: "12px",
  color: "#64748B",
};

const btnSection: React.CSSProperties = {
  textAlign: "center" as const,
  margin: "24px 0 24px 0",
};

const button: React.CSSProperties = {
  backgroundColor: "#001C9E",
  color: "#ffffff",
  borderRadius: "30px",
  padding: "14px 32px",
  fontSize: "13px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  boxShadow: "0 2px 6px rgba(0, 28, 158, 0.25)",
};

const smallText: React.CSSProperties = {
  margin: "0 0 6px 0",
  fontSize: "12px",
  color: "#64748B",
};

const urlBox: React.CSSProperties = {
  margin: "0 0 20px 0",
  fontSize: "11px",
  wordBreak: "break-all" as const,
};

const link: React.CSSProperties = {
  color: "#1230C4",
};

const divider: React.CSSProperties = {
  borderColor: "#E2E8F0",
  margin: "20px 0",
};

const securityNotice: React.CSSProperties = {
  backgroundColor: "#FFFBEB",
  border: "1px solid #FEF3C7",
  borderRadius: "10px",
  padding: "14px 16px",
};

const securityHeader: React.CSSProperties = {
  margin: "0 0 4px 0",
  fontSize: "12px",
  fontWeight: "700",
  color: "#B45309",
};

const securityBody: React.CSSProperties = {
  margin: "0",
  fontSize: "12px",
  lineHeight: "18px",
  color: "#92400E",
};

const footer: React.CSSProperties = {
  padding: "16px 24px 24px 24px",
  textAlign: "center" as const,
  backgroundColor: "#F8FAFC",
  borderTop: "1px solid #E2E8F0",
};

const footerText: React.CSSProperties = {
  margin: "0",
  fontSize: "11px",
  color: "#94A3B8",
};
