import nodemailer from 'nodemailer';
import { Lead, EmailTemplate, EmailTemplateType } from '../types/database';

// SMTP Configuration
interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter;
  private retryAttempts = 3;
  private retryDelay = 1000; // 1 second

  constructor() {
    this.transporter = this.createTransporter();
  }

  private createTransporter(): nodemailer.Transporter {
    const config: SMTPConfig = {
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASSWORD || ''
      }
    };

    return nodemailer.createTransporter(config);
  }

  // Send email with retry logic
  private async sendEmailWithRetry(mailOptions: nodemailer.SendMailOptions, attempt = 1): Promise<boolean> {
    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${mailOptions.to}`);
      return true;
    } catch (error) {
      console.error(`Email send attempt ${attempt} failed:`, error);

      if (attempt < this.retryAttempts) {
        console.log(`Retrying email send in ${this.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        return this.sendEmailWithRetry(mailOptions, attempt + 1);
      }

      console.error(`Failed to send email after ${this.retryAttempts} attempts`);
      return false;
    }
  }

  // Send new lead notification to admin
  async sendNewLeadNotification(lead: Lead): Promise<boolean> {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.LEAD_NOTIFICATION_EMAIL;

    if (!adminEmail) {
      console.error('No admin email configured for lead notifications');
      return false;
    }

    const subject = ` New Lead: ${lead.name} from ${lead.company || 'Unknown Company'}`;
    const htmlContent = this.getNewLeadNotificationTemplate(lead);
    const textContent = this.generateTextFromLead(lead);

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.SMTP_USER,
      to: adminEmail,
      subject,
      html: htmlContent,
      text: textContent,
      headers: {
        'X-Lead-ID': lead.id,
        'X-Lead-Priority': lead.priority
      }
    };

    return this.sendEmailWithRetry(mailOptions);
  }

  // Send confirmation email to lead
  async sendLeadConfirmation(lead: Lead): Promise<boolean> {
    const subject = 'Thank you for contacting us!';
    const htmlContent = this.getConfirmationTemplate(lead);
    const textContent = `Dear ${lead.name},\n\nThank you for reaching out to us. We have received your inquiry and will get back to you within 24 hours.\n\nBest regards,\nThe Team`;

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.SMTP_USER,
      to: lead.email,
      subject,
      html: htmlContent,
      text: textContent,
      headers: {
        'X-Lead-ID': lead.id
      }
    };

    return this.sendEmailWithRetry(mailOptions);
  }

  // Send nurture sequence email
  async sendNurtureEmail(lead: Lead, templateType: EmailTemplateType, customMessage?: string): Promise<boolean> {
    const template = this.getNurtureTemplate(templateType, lead, customMessage);

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.SMTP_USER,
      to: lead.email,
      subject: template.subject,
      html: template.htmlContent,
      text: template.textContent,
      headers: {
        'X-Lead-ID': lead.id,
        'X-Template-Type': templateType
      }
    };

    return this.sendEmailWithRetry(mailOptions);
  }

  // Send follow-up email
  async sendFollowUpEmail(lead: Lead, message: string, sentBy?: string): Promise<boolean> {
    const subject = `Follow-up: ${lead.company ? `${lead.company} - ` : ''}${lead.name}`;
    const htmlContent = this.getFollowUpTemplate(lead, message, sentBy);
    const textContent = `Dear ${lead.name},\n\n${message}\n\nBest regards,\n${sentBy || 'The Team'}`;

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.SMTP_USER,
      to: lead.email,
      subject,
      html: htmlContent,
      text: textContent,
      headers: {
        'X-Lead-ID': lead.id,
        'X-Follow-Up': 'true'
      }
    };

    return this.sendEmailWithRetry(mailOptions);
  }

  // Generate new lead notification template
  private getNewLeadNotificationTemplate(lead: Lead): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Lead Notification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; }
            .content { background: #f8f9fa; padding: 20px; }
            .lead-info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .priority-${lead.priority} { border-left: 5px solid ${this.getPriorityColor(lead.priority)}; }
            .footer { text-align: center; margin-top: 20px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1> New Lead Alert</h1>
            </div>
            <div class="content">
              <div class="lead-info priority-${lead.priority}">
                <h2>${lead.name}</h2>
                <p><strong>Email:</strong> ${lead.email}</p>
                ${lead.phone ? `<p><strong>Phone:</strong> ${lead.phone}</p>` : ''}
                ${lead.company ? `<p><strong>Company:</strong> ${lead.company}</p>` : ''}
                <p><strong>Source:</strong> ${lead.source}</p>
                <p><strong>Priority:</strong> <span style="color: ${this.getPriorityColor(lead.priority)}; font-weight: bold;">${lead.priority.toUpperCase()}</span></p>
                <p><strong>Lead Score:</strong> ${lead.score}/100</p>
                <p><strong>Message:</strong></p>
                <blockquote style="background: #f1f1f1; padding: 10px; border-radius: 3px;">
                  ${lead.message}
                </blockquote>
              </div>
              <p style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL}/admin/applications/${lead.id}"
                   style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                  View Lead in CRM
                </a>
              </p>
            </div>
            <div class="footer">
              <p>Received at ${new Date(lead.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  // Generate confirmation template
  private getConfirmationTemplate(lead: Lead): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Thank You for Contacting Us</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #28a745; color: white; padding: 20px; text-align: center; }
            .content { background: #f8f9fa; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1> Thank You!</h1>
            </div>
            <div class="content">
              <h2>Dear ${lead.name},</h2>
              <p>Thank you for reaching out to us! We have received your inquiry and appreciate your interest in our services.</p>

              <h3>What happens next?</h3>
              <ul>
                <li>Our team will review your inquiry within 24 hours</li>
                <li>We'll reach out to discuss your needs in detail</li>
                <li>We'll provide you with a customized solution</li>
              </ul>

              <p>If you have any urgent questions, please don't hesitate to contact us directly.</p>

              <p>Best regards,<br>The Team</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  // Generate nurture template
  private getNurtureTemplate(templateType: EmailTemplateType, lead: Lead, customMessage?: string): EmailTemplate {
    const templates = {
      [EmailTemplateType.NURTURE_SEQUENCE]: {
        subject: `${lead.name}, here's how we can help ${lead.company || 'your business'}`,
        htmlContent: `
          <h2>Hi ${lead.name},</h2>
          <p>I wanted to follow up on your recent inquiry and share some insights that might be valuable for ${lead.company || 'your business'}.</p>
          ${customMessage ? `<p>${customMessage}</p>` : ''}
          <p>Would you like to schedule a brief call to discuss your needs?</p>
          <p>Best regards,<br>The Team</p>
        `,
        textContent: `Hi ${lead.name}, I wanted to follow up on your recent inquiry...`
      },
      [EmailTemplateType.FOLLOW_UP]: {
        subject: `Following up on your inquiry`,
        htmlContent: `
          <h2>Hi ${lead.name},</h2>
          <p>${customMessage || 'I wanted to follow up on your recent inquiry.'}</p>
          <p>Best regards,<br>The Team</p>
        `,
        textContent: customMessage || 'Following up on your inquiry...'
      }
    };

    return {
      id: templateType,
      name: templateType,
      templateType,
      variables: ['name', 'company'],
      ...templates[templateType]
    };
  }

  // Generate follow-up template
  private getFollowUpTemplate(lead: Lead, message: string, sentBy?: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Follow-up</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Hi ${lead.name},</h2>
            <div style="margin: 20px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <p>Best regards,<br>${sentBy || 'The Team'}</p>
          </div>
        </body>
      </html>
    `;
  }

  // Generate text content from lead
  private generateTextFromLead(lead: Lead): string {
    return `
New Lead Received:

Name: ${lead.name}
Email: ${lead.email}
${lead.phone ? `Phone: ${lead.phone}` : ''}
${lead.company ? `Company: ${lead.company}` : ''}
Source: ${lead.source}
Priority: ${lead.priority.toUpperCase()}
Lead Score: ${lead.score}/100

Message:
${lead.message}

Received at: ${new Date(lead.createdAt).toLocaleString()}
    `.trim();
  }

  // Get priority color
  private getPriorityColor(priority: string): string {
    const colors = {
      hot: '#dc3545',
      warm: '#ffc107',
      cold: '#6c757d'
    };
    return colors[priority as keyof typeof colors] || '#6c757d';
  }

  // Test email configuration
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service connection verified successfully');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const emailService = new EmailService();

// Utility functions for email operations
export const sendNewLeadNotification = (lead: Lead) => emailService.sendNewLeadNotification(lead);
export const sendLeadConfirmation = (lead: Lead) => emailService.sendLeadConfirmation(lead);
export const sendNurtureEmail = (lead: Lead, templateType: EmailTemplateType, message?: string) =>
  emailService.sendNurtureEmail(lead, templateType, message);
export const sendFollowUpEmail = (lead: Lead, message: string, sentBy?: string) =>
  emailService.sendFollowUpEmail(lead, message, sentBy);
export const testEmailConnection = () => emailService.testConnection();
