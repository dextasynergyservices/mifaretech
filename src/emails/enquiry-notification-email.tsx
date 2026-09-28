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

export interface EnquiryItemRow {
  productId?: string | null;
  productName: string;
  modelNumber?: string | null;
  quantity: number;
}

export interface EnquiryNotificationEmailProps {
  reference: string;
  enquiryId?: string;
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  businessType?: string | null;
  terminalCount?: number | null;
  message: string;
  items?: EnquiryItemRow[];
  quizAnswers?: Record<string, string | string[]>;
  source?: string;
  adminUrl?: string;
}

export function EnquiryNotificationEmail({
  reference = "MFT-SAMPLE",
  enquiryId,
  name = "David Smith",
  email = "d.smith@example.com",
  phone = "+44 7448 670925",
  company = "Apex Retail Ltd",
  businessType = "retail",
  terminalCount = 2,
  message = "Looking for multi-counter hardware quotation for retail stores.",
  items = [],
  quizAnswers,
  source = "contact_form",
  adminUrl = "https://mifaretech.co.uk/admin/enquiries",
}: EnquiryNotificationEmailProps) {
  const enquiryAdminLink = enquiryId ? `${adminUrl}/${enquiryId}` : adminUrl;

  return (
    <Html>
      <Head />
      <Preview>
        New Enquiry [{reference}] from {name} {company ? `(${company})` : ""}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo & Brand Header */}
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

          {/* Alert Banner */}
          <Section style={alertBanner}>
            <Text style={alertText}>
              NEW COMMERCIAL ENQUIRY &bull; <strong>{reference}</strong>
            </Text>
          </Section>

          {/* Source & Quick Stats */}
          <Section style={metaBox}>
            <Text style={metaText}>
              <strong>Origin:</strong> {source.toUpperCase()} &bull;{" "}
              <strong>Business Sector:</strong> {businessType || "General Commercial"} &bull;{" "}
              <strong>Terminals Needed:</strong> {terminalCount ?? "Not specified"}
            </Text>
          </Section>

          {/* Hardware Basket Items if any */}
          {items && items.length > 0 && (
            <Section style={card}>
              <Text style={cardSubtitle}>REQUESTED HARDWARE BASKET ({items.length} ITEMS)</Text>
              <div style={{ marginTop: "8px" }}>
                {items.map((item, index) => (
                  <div
                    key={
                      item.productId ||
                      `${item.productName}-${item.modelNumber || "item"}-${item.quantity}`
                    }
                    style={{
                      padding: "8px 0",
                      borderBottom: index < items.length - 1 ? "1px solid #E2E8F0" : "none",
                    }}
                  >
                    <Text
                      style={{
                        margin: "0",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#0F172A",
                      }}
                    >
                      {item.productName}{" "}
                      <span style={{ color: "#2F4CE0", fontSize: "12px", fontWeight: "normal" }}>
                        &times; {item.quantity} unit(s)
                      </span>
                    </Text>
                    {item.modelNumber && (
                      <Text
                        style={{
                          margin: "2px 0 0",
                          fontSize: "11px",
                          color: "#64748B",
                          fontFamily: "monospace",
                        }}
                      >
                        MODEL: {item.modelNumber}
                      </Text>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Quiz answers if present */}
          {quizAnswers && Object.keys(quizAnswers).length > 0 && (
            <Section style={card}>
              <Text style={cardSubtitle}>HARDWARE ADVISOR QUIZ RECOMMENDATION</Text>
              <div style={{ marginTop: "6px" }}>
                {Object.entries(quizAnswers).map(([k, v]) => (
                  <Text key={k} style={{ margin: "4px 0", fontSize: "12px", color: "#334155" }}>
                    <strong style={{ textTransform: "capitalize" }}>{k}:</strong>{" "}
                    {Array.isArray(v) ? v.join(", ") : String(v)}
                  </Text>
                ))}
              </div>
            </Section>
          )}

          {/* Client Details Section */}
          <Section style={infoSection}>
            <Heading as="h4" style={sectionHeader}>
              CLIENT CONTACT INFORMATION
            </Heading>
            <Text style={infoRow}>
              <strong>Contact Name:</strong> {name}
            </Text>
            {company && (
              <Text style={infoRow}>
                <strong>Company:</strong> {company}
              </Text>
            )}
            <Text style={infoRow}>
              <strong>Email Address:</strong>{" "}
              <Link href={`mailto:${email}`} style={link}>
                {email}
              </Link>
            </Text>
            <Text style={infoRow}>
              <strong>Telephone:</strong>{" "}
              <Link href={`tel:${phone}`} style={link}>
                {phone}
              </Link>
            </Text>
          </Section>

          {/* Message / Specifications Section */}
          <Section style={infoSection}>
            <Heading as="h4" style={sectionHeader}>
              PROJECT REQUIREMENTS &amp; MESSAGE
            </Heading>
            <Section style={messageBox}>
              <Text style={messageText}>{message}</Text>
            </Section>
          </Section>

          {/* Action CTA Button */}
          <Section style={ctaSection}>
            <Button href={enquiryAdminLink} style={ctaButton}>
              Open Enquiry in Admin Console &rarr;
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Footer Details */}
          <Section style={footer}>
            <Text style={footerText}>
              This notification was generated automatically by the Mifaretech Commercial Portal.
              <br />
              UK: +44 7448 670925 &bull; London &amp; West Africa &bull; sales@mifaretech.co.uk
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default EnquiryNotificationEmail;

/* STYLES */
const main = {
  backgroundColor: "#F8FAFC",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: "30px 10px",
};

const container = {
  backgroundColor: "#FFFFFF",
  margin: "0 auto",
  padding: "36px 32px",
  borderRadius: "16px",
  maxWidth: "580px",
  border: "1px solid #E2E8F0",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
};

const header = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const logo = {
  margin: "0 auto 8px auto",
  display: "block",
};

const brandTitle = {
  fontSize: "24px",
  fontWeight: "900",
  letterSpacing: "-0.5px",
  color: "#0F172A",
  margin: "0 0 2px 0",
};

const tagline = {
  fontSize: "11px",
  fontStyle: "italic",
  color: "#64748B",
  margin: "0",
};

const alertBanner = {
  backgroundColor: "#EEF2FF",
  border: "1px solid #C7D2FE",
  borderRadius: "8px",
  padding: "10px 14px",
  marginBottom: "16px",
  textAlign: "center" as const,
};

const alertText = {
  fontSize: "12px",
  fontWeight: "700",
  color: "#3730A3",
  letterSpacing: "0.5px",
  margin: "0",
};

const metaBox = {
  backgroundColor: "#F1F5F9",
  borderRadius: "8px",
  padding: "8px 12px",
  marginBottom: "16px",
};

const metaText = {
  fontSize: "11px",
  color: "#475569",
  margin: "0",
};

const card = {
  backgroundColor: "#F8FAFC",
  border: "1px solid #E2E8F0",
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "20px",
};

const cardSubtitle = {
  fontSize: "10px",
  fontWeight: "800",
  letterSpacing: "1px",
  color: "#2F4CE0",
  margin: "0 0 8px 0",
  textTransform: "uppercase" as const,
};

const infoSection = {
  marginBottom: "20px",
};

const sectionHeader = {
  fontSize: "11px",
  fontWeight: "800",
  letterSpacing: "0.5px",
  color: "#475569",
  borderBottom: "1px solid #E2E8F0",
  paddingBottom: "6px",
  margin: "0 0 12px 0",
};

const infoRow = {
  fontSize: "13px",
  color: "#334155",
  margin: "5px 0",
  lineHeight: "1.4",
};

const link = {
  color: "#2F4CE0",
  textDecoration: "underline",
};

const messageBox = {
  backgroundColor: "#F8FAFC",
  borderLeft: "4px solid #2F4CE0",
  padding: "12px 14px",
  borderRadius: "0 8px 8px 0",
};

const messageText = {
  fontSize: "13px",
  color: "#1E293B",
  lineHeight: "1.6",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const ctaSection = {
  textAlign: "center" as const,
  marginTop: "28px",
  marginBottom: "24px",
};

const ctaButton = {
  backgroundColor: "#2F4CE0",
  color: "#FFFFFF",
  fontSize: "13px",
  fontWeight: "700",
  padding: "12px 24px",
  borderRadius: "9999px",
  textDecoration: "none",
  display: "inline-block",
};

const divider = {
  borderColor: "#E2E8F0",
  margin: "24px 0 16px 0",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "11px",
  color: "#94A3B8",
  lineHeight: "1.5",
  margin: "0",
};
