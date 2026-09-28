import { Resend } from "resend";
import { EnquiryAutoReplyEmail } from "@/emails/enquiry-auto-reply-email";
import { type EnquiryItemRow, EnquiryNotificationEmail } from "@/emails/enquiry-notification-email";
import { PasswordResetEmail } from "@/emails/password-reset-email";
import { ProductEnquiryEmail } from "@/emails/product-enquiry-email";
import { UserInviteEmail } from "@/emails/user-invite-email";
import { env } from "@/env";

const isDevPlaceholder =
  !env.RESEND_API_KEY ||
  env.RESEND_API_KEY.includes("placeholder") ||
  env.RESEND_API_KEY === "re_placeholder_key_dev";

const resend = isDevPlaceholder ? null : new Resend(env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, url: string) {
  if (!resend) {
    console.log(
      `\n========================================\n[PASSWORD RESET EMAIL SIMULATION]\nTo: ${email}\nReset Link: ${url}\n========================================\n`,
    );
    return;
  }

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM || "Mifaretech Security <no-reply@mifaretech.co.uk>",
    to: email,
    subject: "Reset your Mifaretech Admin password",
    react: PasswordResetEmail({
      email,
      resetUrl: url,
    }),
  });

  if (error) {
    throw new Error(`Resend password reset email failed: ${error.message}`);
  }
}

export async function sendUserInviteEmail(
  email: string,
  name: string,
  url: string,
  role = "editor",
) {
  if (!resend) {
    console.log(
      `\n========================================\n[USER INVITATION EMAIL SIMULATION]\nTo: ${email} (${name}, Role: ${role})\nInvite/Setup Link: ${url}\n========================================\n`,
    );
    return;
  }

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM || "Mifaretech Administration <no-reply@mifaretech.co.uk>",
    to: email,
    subject: "You've been invited to Mifaretech Enterprise Console",
    react: UserInviteEmail({
      name,
      email,
      role,
      setupUrl: url,
    }),
  });

  if (error) {
    throw new Error(`Resend user invite email failed: ${error.message}`);
  }
}

export async function sendProductEnquiryNotification(data: {
  reference: string;
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  productName: string;
  modelNumber?: string | null;
  quantity?: number;
  message: string;
}) {
  const recipient = env.SALES_INBOX || "sales@mifaretech.co.uk";
  const siteUrl = env.NEXT_PUBLIC_SITE_URL || "https://mifaretech.co.uk";
  const adminUrl = `${siteUrl}/admin/enquiries`;

  if (!resend) {
    console.log(
      `\n========================================\n[PRODUCT ENQUIRY NOTIFICATION SIMULATION]\nRef: ${data.reference}\nFrom: ${data.name} (${data.email}, ${data.phone})\nCompany: ${data.company || "N/A"}\nProduct: ${data.productName} (Qty: ${data.quantity || 1})\nMessage: ${data.message}\nTo Staff: ${recipient}\n========================================\n`,
    );
    return;
  }

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM || "Mifaretech Enquiries <no-reply@mifaretech.co.uk>",
    to: recipient,
    replyTo: data.email,
    subject: `New Hardware Enquiry: ${data.productName} [${data.reference}]`,
    react: ProductEnquiryEmail({
      reference: data.reference,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      productName: data.productName,
      modelNumber: data.modelNumber,
      quantity: data.quantity,
      message: data.message,
      adminUrl,
    }),
  });

  if (error) {
    throw new Error(`Resend product enquiry email failed: ${error.message}`);
  }
}

export async function sendEnquiryNotification(data: {
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
}) {
  const recipient = env.SALES_INBOX || "sales@mifaretech.co.uk";
  const siteUrl = env.NEXT_PUBLIC_SITE_URL || "https://mifaretech.co.uk";
  const adminUrl = `${siteUrl}/admin/enquiries`;

  if (!resend) {
    console.log(
      `\n========================================\n[STAFF ENQUIRY NOTIFICATION SIMULATION]\nRef: ${data.reference}\nName: ${data.name} (${data.email}, ${data.phone})\nCompany: ${data.company || "N/A"}\nItems: ${data.items?.length || 0}\nMessage: ${data.message}\nTo Sales Inbox: ${recipient}\n========================================\n`,
    );
    return;
  }

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM || "Mifaretech Enquiries <no-reply@mifaretech.co.uk>",
    to: recipient,
    replyTo: data.email,
    subject: `New Commercial Enquiry [${data.reference}] from ${data.name}${data.company ? ` (${data.company})` : ""}`,
    react: EnquiryNotificationEmail({
      ...data,
      adminUrl,
    }),
  });

  if (error) {
    throw new Error(`Resend staff notification failed: ${error.message}`);
  }
}

export async function sendEnquiryAutoReply(data: {
  reference: string;
  name: string;
  email: string;
  company?: string | null;
  message?: string | null;
  items?: EnquiryItemRow[];
}) {
  if (!resend) {
    console.log(
      `\n========================================\n[VISITOR AUTO-REPLY SIMULATION]\nTo: ${data.email} (${data.name})\nRef: ${data.reference}\nItems: ${data.items?.length || 0}\n========================================\n`,
    );
    return;
  }

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM || "Mifaretech Enquiries <no-reply@mifaretech.co.uk>",
    to: data.email,
    replyTo: env.SALES_INBOX || "sales@mifaretech.co.uk",
    subject: `We've received your hardware enquiry [${data.reference}] - Mifaretech`,
    react: EnquiryAutoReplyEmail(data),
  });

  if (error) {
    throw new Error(`Resend visitor auto-reply failed: ${error.message}`);
  }
}
