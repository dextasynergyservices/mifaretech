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

interface ProductEnquiryEmailProps {
  reference: string;
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  productName: string;
  modelNumber?: string | null;
  quantity?: number;
  message: string;
  adminUrl?: string;
}

export function ProductEnquiryEmail({
  reference = "MFT-SAMPLE",
  name = "Alison Davies",
  email = "client@example.com",
  phone = "+44 7448 670925",
  company = "Retail Group Ltd",
  productName = "Fametech POS-1000",
  modelNumber = "POS-1000-PRO",
  quantity = 5,
  message = "Please provide fleet quotation and technical datasheet.",
  adminUrl = "https://mifaretech.co.uk/admin/enquiries",
}: ProductEnquiryEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        New Hardware Enquiry: {productName} [{reference}]
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo & Brand Header */}
          <Section style={header}>
            <Img
              src="https://mifaretech.co.uk/logo.png"
              width="56"
              height="56"
              alt="Mifaretech"
              style={logo}
            />
            <Heading style={brandTitle}>
              Mifare<span style={{ color: "#2F4CE0" }}>tech</span>
            </Heading>
            <Text style={tagline}>...lean forward smartly!</Text>
          </Section>

          {/* Alert Banner */}
          <Section style={alertBanner}>
            <Text style={alertText}>
              COMMERCIAL HARDWARE ENQUIRY &bull; <strong>{reference}</strong>
            </Text>
          </Section>

          {/* Requested Hardware Card */}
          <Section style={card}>
            <Text style={cardSubtitle}>REQUESTED HARDWARE FLEET</Text>
            <Heading as="h3" style={hardwareTitle}>
              {productName}
            </Heading>
            {modelNumber && (
              <Text style={modelBadge}>
                MODEL NUMBER: <strong>{modelNumber}</strong>
              </Text>
            )}
            <Text style={quantityText}>
              Requested Quantity: <strong>{quantity || 1} unit(s)</strong>
            </Text>
          </Section>

          {/* Client Details Section */}
          <Section style={infoSection}>
            <Heading as="h4" style={sectionHeader}>
              CLIENT CONTACT INFORMATION
            </Heading>
            <Text style={infoRow}>
              <strong>Name:</strong> {name}
            </Text>
            <Text style={infoRow}>
              <strong>Email:</strong>{" "}
              <Link href={`mailto:${email}`} style={link}>
                {email}
              </Link>
            </Text>
            <Text style={infoRow}>
              <strong>Phone:</strong>{" "}
              <Link href={`tel:${phone}`} style={link}>
                {phone}
              </Link>
            </Text>
            {company && (
              <Text style={infoRow}>
                <strong>Company:</strong> {company}
              </Text>
            )}
          </Section>

          {/* Client Message */}
          <Section style={messageSection}>
            <Heading as="h4" style={sectionHeader}>
              ENQUIRY REQUIREMENTS &amp; NOTES
            </Heading>
            <Text style={messageBox}>{message}</Text>
          </Section>

          {/* Admin CTA Button */}
          <Section style={ctaSection}>
            <Button style={ctaButton} href={adminUrl}>
              Open Enquiry in Fleet Console &rarr;
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Mifaretech System Solutions &middot; Accredited distributor of Fametech POS hardware.
            </Text>
            <Text style={footerSubtext}>
              Automated commercial notification logged in PostgreSQL database.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default ProductEnquiryEmail;

const main: React.CSSProperties = {
  backgroundColor: "#f4f6fb",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container: React.CSSProperties = {
  maxWidth: "580px",
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
  margin: "12px 0 2px 0",
  fontSize: "22px",
  fontWeight: "900",
  color: "#ffffff",
  letterSpacing: "-0.5px",
};

const tagline: React.CSSProperties = {
  margin: "0",
  fontSize: "12px",
  fontWeight: "700",
  color: "#F27500",
  letterSpacing: "0.5px",
};

const alertBanner: React.CSSProperties = {
  backgroundColor: "#EEF2FF",
  borderBottom: "1px solid #DFE6FF",
  padding: "10px 24px",
  textAlign: "center" as const,
};

const alertText: React.CSSProperties = {
  margin: "0",
  fontSize: "11px",
  fontWeight: "700",
  color: "#1230C4",
  letterSpacing: "1px",
};

const card: React.CSSProperties = {
  margin: "24px",
  padding: "20px",
  backgroundColor: "#F8FAFC",
  borderRadius: "12px",
  border: "1px solid #E2E8F0",
};

const cardSubtitle: React.CSSProperties = {
  margin: "0 0 6px 0",
  fontSize: "11px",
  fontWeight: "800",
  color: "#64748B",
  letterSpacing: "0.5px",
};

const hardwareTitle: React.CSSProperties = {
  margin: "0 0 6px 0",
  fontSize: "18px",
  fontWeight: "800",
  color: "#000F5C",
};

const modelBadge: React.CSSProperties = {
  margin: "0 0 8px 0",
  fontSize: "12px",
  fontFamily: "monospace",
  color: "#475569",
};

const quantityText: React.CSSProperties = {
  margin: "0",
  fontSize: "13px",
  color: "#334155",
};

const infoSection: React.CSSProperties = {
  padding: "0 24px 16px 24px",
};

const sectionHeader: React.CSSProperties = {
  margin: "0 0 12px 0",
  fontSize: "11px",
  fontWeight: "800",
  color: "#64748B",
  letterSpacing: "0.5px",
};

const infoRow: React.CSSProperties = {
  margin: "0 0 8px 0",
  fontSize: "14px",
  color: "#1E293B",
  lineHeight: "20px",
};

const link: React.CSSProperties = {
  color: "#1230C4",
  textDecoration: "underline",
};

const messageSection: React.CSSProperties = {
  padding: "0 24px 24px 24px",
};

const messageBox: React.CSSProperties = {
  margin: "0",
  padding: "16px",
  backgroundColor: "#F8FAFC",
  borderRadius: "10px",
  border: "1px solid #CBD5E1",
  fontSize: "13px",
  lineHeight: "22px",
  color: "#0F172A",
  whiteSpace: "pre-wrap" as const,
};

const ctaSection: React.CSSProperties = {
  padding: "0 24px 28px 24px",
  textAlign: "center" as const,
};

const ctaButton: React.CSSProperties = {
  backgroundColor: "#001C9E",
  color: "#ffffff",
  borderRadius: "30px",
  padding: "14px 28px",
  fontSize: "13px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  boxShadow: "0 2px 6px rgba(0, 28, 158, 0.2)",
};

const divider: React.CSSProperties = {
  borderColor: "#E2E8F0",
  margin: "0 24px",
};

const footer: React.CSSProperties = {
  padding: "20px 24px 28px 24px",
  textAlign: "center" as const,
};

const footerText: React.CSSProperties = {
  margin: "0 0 4px 0",
  fontSize: "12px",
  color: "#64748B",
};

const footerSubtext: React.CSSProperties = {
  margin: "0",
  fontSize: "11px",
  color: "#94A3B8",
};
