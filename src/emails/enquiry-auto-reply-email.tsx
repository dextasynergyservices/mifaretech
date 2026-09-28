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
import type { EnquiryItemRow } from "./enquiry-notification-email";

export interface EnquiryAutoReplyEmailProps {
  reference: string;
  name: string;
  email?: string;
  items?: EnquiryItemRow[];
  company?: string | null;
  message?: string | null;
}

export function EnquiryAutoReplyEmail({
  reference = "MFT-SAMPLE",
  name = "David Smith",
  items = [],
  company,
}: EnquiryAutoReplyEmailProps) {
  const whatsappUrl = `https://wa.me/447448670925?text=Hello%20Mifaretech,%20I%20am%20following%20up%20on%20my%20enquiry%20${reference}`;

  return (
    <Html>
      <Head />
      <Preview>We've received your enquiry [{reference}] &bull; Mifaretech Hardware</Preview>
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

          {/* Reference Badge */}
          <Section style={badgeSection}>
            <Text style={badgeText}>
              ENQUIRY REFERENCE: <strong>{reference}</strong>
            </Text>
          </Section>

          {/* Main Greeting & Next Steps */}
          <Section style={bodySection}>
            <Heading as="h2" style={greeting}>
              Hello {name}
              {company ? ` (${company})` : ""},
            </Heading>
            <Text style={paragraph}>
              Thank you for reaching out to <strong>Mifaretech</strong>. We have successfully logged
              your commercial hardware enquiry.
            </Text>
            <Text style={paragraph}>
              A hardware specialist is reviewing your requirements and will reply with a detailed
              specification sheet, formal fleet pricing, and delivery estimates within{" "}
              <strong>2 business hours</strong> (Mon&ndash;Fri, 08:30&ndash;17:30 GMT).
            </Text>
          </Section>

          {/* SLA Card */}
          <Section style={slaCard}>
            <Heading as="h4" style={slaTitle}>
              WHAT HAPPENS NEXT?
            </Heading>
            <Text style={slaStep}>
              &bull; <strong>Review:</strong> Our engineers check peripheral compatibility,
              interface ports (USB/RS232/Ethernet), and OS driver requirements.
            </Text>
            <Text style={slaStep}>
              &bull; <strong>Fleet Quote:</strong> We apply volume tier pricing and provide formal
              PDF quotations ready for corporate procurement.
            </Text>
            <Text style={slaStep}>
              &bull; <strong>Dispatch:</strong> Guaranteed genuine Fametech hardware with UK &amp;
              West Africa warranty support.
            </Text>
          </Section>

          {/* Hardware Summary if items present */}
          {items && items.length > 0 && (
            <Section style={card}>
              <Text style={cardSubtitle}>REQUESTED HARDWARE SUMMARY</Text>
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
                        Model: {item.modelNumber}
                      </Text>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Need Urgent Answers? WhatsApp CTA */}
          <Section style={whatsappSection}>
            <Heading as="h4" style={whatsappTitle}>
              Need an immediate answer or counter layout check?
            </Heading>
            <Text style={whatsappText}>
              Chat directly with our technical team on WhatsApp quoting reference{" "}
              <strong>{reference}</strong>.
            </Text>
            <div style={{ textAlign: "center", marginTop: "14px" }}>
              <Button href={whatsappUrl} style={whatsappButton}>
                Chat with Us on WhatsApp &rarr;
              </Button>
            </div>
          </Section>

          <Hr style={divider} />

          {/* Footer Details */}
          <Section style={footer}>
            <Text style={footerText}>
              <strong>Mifaretech Limited</strong> &bull; Commercial Hardware Specialist
              <br />
              Telephone:{" "}
              <Link href="tel:+447448670925" style={footerLink}>
                +44 7448 670925
              </Link>{" "}
              &bull; Email:{" "}
              <Link href="mailto:sales@mifaretech.co.uk" style={footerLink}>
                sales@mifaretech.co.uk
              </Link>
              <br />
              Distribution Centers: United Kingdom &amp; West Africa
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default EnquiryAutoReplyEmail;

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

const badgeSection = {
  backgroundColor: "#ECFDF5",
  border: "1px solid #A7F3D0",
  borderRadius: "8px",
  padding: "10px 14px",
  marginBottom: "20px",
  textAlign: "center" as const,
};

const badgeText = {
  fontSize: "12px",
  fontWeight: "700",
  color: "#065F46",
  letterSpacing: "0.5px",
  margin: "0",
};

const bodySection = {
  marginBottom: "20px",
};

const greeting = {
  fontSize: "18px",
  fontWeight: "800",
  color: "#0F172A",
  margin: "0 0 10px 0",
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#334155",
  margin: "0 0 12px 0",
};

const slaCard = {
  backgroundColor: "#F8FAFC",
  border: "1px solid #E2E8F0",
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "20px",
};

const slaTitle = {
  fontSize: "11px",
  fontWeight: "800",
  letterSpacing: "0.5px",
  color: "#2F4CE0",
  margin: "0 0 10px 0",
  textTransform: "uppercase" as const,
};

const slaStep = {
  fontSize: "12px",
  color: "#334155",
  lineHeight: "1.5",
  margin: "6px 0",
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
  color: "#475569",
  margin: "0 0 8px 0",
  textTransform: "uppercase" as const,
};

const whatsappSection = {
  backgroundColor: "#F0FDF4",
  border: "1px solid #BBF7D0",
  borderRadius: "12px",
  padding: "18px",
  marginBottom: "20px",
  textAlign: "center" as const,
};

const whatsappTitle = {
  fontSize: "13px",
  fontWeight: "800",
  color: "#166534",
  margin: "0 0 6px 0",
};

const whatsappText = {
  fontSize: "12px",
  color: "#15803D",
  margin: "0",
  lineHeight: "1.4",
};

const whatsappButton = {
  backgroundColor: "#16A34A",
  color: "#FFFFFF",
  fontSize: "12px",
  fontWeight: "700",
  padding: "10px 20px",
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
  lineHeight: "1.6",
  margin: "0",
};

const footerLink = {
  color: "#64748B",
  textDecoration: "underline",
};
