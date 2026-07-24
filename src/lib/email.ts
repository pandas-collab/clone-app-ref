// Email utilities for contact form and lead management

export interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

export interface EmailMessage {
  to: string
  from: string
  subject: string
  html: string
  text?: string
}

export class EmailService {
  private config: EmailConfig

  constructor(config: EmailConfig) {
    this.config = config
  }

  async sendEmail(message: EmailMessage): Promise<boolean> {
    try {
      // TODO: Implement actual email sending
      console.log('Sending email:', message.subject, 'to', message.to)
      return true
    } catch (error) {
      console.error('Failed to send email:', error)
      return false
    }
  }

  async sendContactNotification(contactData: {
    name: string
    email: string
    message: string
  }): Promise<boolean> {
    const message: EmailMessage = {
      to: process.env.ADMIN_EMAIL || 'admin@example.com',
      from: process.env.FROM_EMAIL || 'noreply@example.com',
      subject: `New Contact Form Submission from ${contactData.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Message:</strong></p>
        <p>${contactData.message}</p>
      `,
      text: `New Contact Form Submission from ${contactData.name}\nEmail: ${contactData.email}\nMessage: ${contactData.message}`
    }

    return await this.sendEmail(message)
  }
}

// Default email service instance
export const emailService = new EmailService({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
})

// Email templates for notifications
export const EMAIL_TEMPLATES = {
  LEAD_NOTIFICATION: {
    subject: 'New Lead Captured',
    html: (lead: any) => `
      <h2>New Lead Notification</h2>
      <p><strong>Name:</strong> ${lead.name}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Phone:</strong> ${lead.phone || 'Not provided'}</p>
      <p><strong>Company:</strong> ${lead.company || 'Not provided'}</p>
      <p><strong>Message:</strong> ${lead.message}</p>
      <p><strong>Lead Score:</strong> ${lead.score}/100</p>
      <p><strong>Status:</strong> ${lead.status}</p>
      <p><strong>Source:</strong> ${lead.source}</p>
      <p><strong>Submitted:</strong> ${new Date(lead.createdAt).toLocaleString()}</p>
    `,
    text: (lead: any) => `
      New Lead Notification

      Name: ${lead.name}
      Email: ${lead.email}
      Phone: ${lead.phone || 'Not provided'}
      Company: ${lead.company || 'Not provided'}
      Message: ${lead.message}
      Lead Score: ${lead.score}/100
      Status: ${lead.status}
      Source: ${lead.source}
      Submitted: ${new Date(lead.createdAt).toLocaleString()}
    `
  },
  LEAD_WELCOME: {
    subject: 'Thank you for your inquiry',
    html: (lead: any) => `
      <h2>Thank you for contacting us!</h2>
      <p>Hi ${lead.name},</p>
      <p>Thank you for your inquiry. We've received your message and will get back to you within 24 hours.</p>
      <p>Our team will review your request and contact you at ${lead.email}.</p>
      <p>Best regards,<br>The Team</p>
    `,
    text: (lead: any) => `
      Thank you for contacting us!

      Hi ${lead.name},

      Thank you for your inquiry. We've received your message and will get back to you within 24 hours.

      Our team will review your request and contact you at ${lead.email}.

      Best regards,
      The Team
    `
  }
};

// Enhanced notification system
export async function sendLeadNotification(lead: any) {
  try {
    const template = EMAIL_TEMPLATES.LEAD_NOTIFICATION;

    // Send to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@company.com',
      subject: template.subject,
      html: template.html(lead),
      text: template.text(lead)
    });

    // Send welcome email to lead
    const welcomeTemplate = EMAIL_TEMPLATES.LEAD_WELCOME;
    await sendEmail({
      to: lead.email,
      subject: welcomeTemplate.subject,
      html: welcomeTemplate.html(lead),
      text: welcomeTemplate.text(lead)
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send lead notification:', error);
    return { success: false, error };
  }
}
