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

interface PasswordResetEmailProps {
  email: string;
  resetUrl: string;
}

export function PasswordResetEmail({
  email = "admin@mifaretech.co.uk",
  resetUrl = "https://mifaretech.co.uk/admin/reset-password?token=sample",
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Mifaretech Admin password</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
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
              Password Reset Request
            </Heading>
            <Text style={paragraph}>
              You recently requested to reset the password for your Mifaretech staff administrator
              account (<strong>{email}</strong>).
            </Text>
            <Text style={paragraph}>
              Click the secure button below to choose a new password. This verification link expires
              in 1 hour.
            </Text>

            <Section style={btnSection}>
              <Button style={button} href={resetUrl}>
                Reset Staff Password &rarr;
              </Button>
            </Section>

            <Text style={smallText}>
              If the button doesn&apos;t work, copy and paste this link into your browser:
            </Text>
            <Text style={urlBox}>
              <Link href={resetUrl} style={link}>
                {resetUrl}
              </Link>
            </Text>

            <Hr style={divider} />

            <Text style={securityNote}>
              <strong>Security Notice:</strong> If you did not initiate this request, your account
              remains secure. You can safely ignore this email or notify your system administrator.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Mifaretech Ltd &middot; Industrial Hardware Solutions &middot; Enterprise Console
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default PasswordResetEmail;

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

const securityNote: React.CSSProperties = {
  margin: "0",
  fontSize: "12px",
  lineHeight: "18px",
  color: "#64748B",
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
