import nodemailer from 'nodemailer';
import { Lead, EmailNotificationData } from '@/types/database';

// Email transporter configuration
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email templates
const emailTemplates = {
  new_lead: {
    subject: 'New Lead Submitted - {{leadName}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Lead Notification</h2>
        <p>A new lead has been submitted through the contact form:</p>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Contact Details</h3>
          <p><strong>Name:</strong> {{leadName}}</p>
          <p><strong>Email:</strong> {{leadEmail}}</p>
          {{#if leadCompany}}<p><strong>Company:</strong> {{leadCompany}}</p>{{/if}}
          {{#if leadPhone}}<p><strong>Phone:</strong> {{leadPhone}}</p>{{/if}}
          <p><strong>Source:</strong> {{leadSource}}</p>
          <p><strong>Lead Score:</strong> {{leadScore}}/100</p>
          {{#if leadBudget}}<p><strong>Budget:</strong> {{leadBudget}}</p>{{/if}}
          {{#if leadTimeline}}<p><strong>Timeline:</strong> {{leadTimeline}}</p>{{/if}}
        </div>

        <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h3 style="margin-top: 0;">Message</h3>
          <p style="white-space: pre-wrap;">{{leadMessage}}</p>
        </div>

        {{#if leadServices}}
        <div style="margin: 20px 0;">
          <h3>Interested Services</h3>
          <ul>
            {{#each leadServices}}
            <li>{{this}}</li>
            {{/each}}
          </ul>
        </div>
        {{/if}}

        <div style="margin: 30px 0; text-align: center;">
          <a href="{{dashboardUrl}}/admin/applications/{{leadId}}"
             style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Lead Details
          </a>
        </div>

        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          This notification was sent automatically from your website's contact form.
        </p>
      </div>
    `,
  },

  lead_welcome: {
    subject: 'Thank you for contacting us - {{leadName}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank You for Your Inquiry!</h2>

        <p>Dear {{leadName}},</p>

        <p>Thank you for reaching out to us. We have received your message and will get back to you within 24 hours.</p>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Your Inquiry Details</h3>
          <p><strong>Name:</strong> {{leadName}}</p>
          <p><strong>Email:</strong> {{leadEmail}}</p>
          {{#if leadCompany}}<p><strong>Company:</strong> {{leadCompany}}</p>{{/if}}
          <p><strong>Message:</strong></p>
          <p style="font-style: italic; background: white; padding: 10px; border-radius: 4px;">{{leadMessage}}</p>
        </div>

        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1976d2;">What Happens Next?</h3>
          <ul style="padding-left: 20px;">
            <li>Our team will review your inquiry within 2-4 hours</li>
            <li>We'll prepare a tailored response based on your requirements</li>
            <li>You'll receive a detailed follow-up within 24 hours</li>
            <li>If urgent, feel free to call us at {{companyPhone}}</li>
          </ul>
        </div>

        <p>In the meantime, feel free to explore our services and recent work:</p>
        <ul>
          <li><a href="{{siteUrl}}/services" style="color: #007bff;">Our Services</a></li>
          <li><a href="{{siteUrl}}/portfolio" style="color: #007bff;">Portfolio</a></li>
          <li><a href="{{siteUrl}}/about" style="color: #007bff;">About Us</a></li>
        </ul>

        <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #666;">Need immediate assistance?</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> {{companyPhone}}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> {{companyEmail}}</p>
        </div>

        <p>Best regards,<br>
        {{companyName}} Team</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          This email was sent from {{siteUrl}}. If you didn't submit this form, please ignore this email.
        </p>
      </div>
    `,
  },

  status_change: {
    subject: 'Lead Status Updated - {{leadName}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Lead Status Update</h2>

        <p>The status of lead <strong>{{leadName}}</strong> has been updated:</p>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Lead:</strong> {{leadName}} ({{leadEmail}})</p>
          <p><strong>Previous Status:</strong> <span style="color: #666;">{{previousStatus}}</span></p>
          <p><strong>New Status:</strong> <span style="color: #007bff; font-weight: bold;">{{newStatus}}</span></p>
          <p><strong>Updated:</strong> {{updatedAt}}</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{dashboardUrl}}/admin/applications/{{leadId}}"
             style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Lead Details
          </a>
        </div>
      </div>
    `,
  },

  follow_up: {
    subject: 'Follow-up Reminder - {{leadName}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Follow-up Reminder</h2>

        <p>This is a reminder to follow up with lead <strong>{{leadName}}</strong>:</p>

        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #856404;">Lead Information</h3>
          <p><strong>Name:</strong> {{leadName}}</p>
          <p><strong>Email:</strong> {{leadEmail}}</p>
          {{#if leadCompany}}<p><strong>Company:</strong> {{leadCompany}}</p>{{/if}}
          <p><strong>Status:</strong> {{leadStatus}}</p>
          <p><strong>Score:</strong> {{leadScore}}/100</p>
          <p><strong>Days since last contact:</strong> {{daysSinceContact}}</p>
        </div>

        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0;">Suggested Actions:</h4>
          <ul>
            <li>Send a personalized follow-up email</li>
            <li>Schedule a phone call or video meeting</li>
            <li>Share relevant case studies or proposals</li>
            <li>Update lead status after contact</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{dashboardUrl}}/admin/applications/{{leadId}}"
             style="background: #ffc107; color: #212529; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Take Action
          </a>
        </div>
      </div>
    `,
  },
};

// Compile template with data
function compileTemplate(template: string, data: Record<string, any>): string {
  let compiled = template;

  // Simple template replacement ({{variable}})
  compiled = compiled.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    return data[key.trim()] || '';
  });

  // Conditional blocks {{#if variable}}...{{/if}}
  compiled = compiled.replace(/\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
    return data[condition.trim()] ? content : '';
  });

  // Each loops {{#each array}}...{{/each}}
  compiled = compiled.replace(/\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayName, itemTemplate) => {
    const array = data[arrayName.trim()];
    if (Array.isArray(array)) {
      return array.map(item => itemTemplate.replace(/\{\{this\}\}/g, item)).join('');
    }
    return '';
  });

  return compiled;
}

// Send email notification
export async function sendEmailNotification(notificationData: EmailNotificationData): Promise<boolean> {
  try {
    const { type, lead, to, previousStatus, newStatus, customMessage } = notificationData;

    if (!emailTemplates[type]) {
      throw new Error(`Unknown email template type: ${type}`);
    }

    const template = emailTemplates[type];

    // Prepare template data
    const templateData = {
      leadId: lead.id,
      leadName: lead.name,
      leadEmail: lead.email,
      leadCompany: lead.company,
      leadPhone: lead.phone,
      leadMessage: lead.message,
      leadSource: lead.source,
      leadScore: lead.score,
      leadStatus: lead.status,
      leadBudget: lead.budget,
      leadTimeline: lead.timeline,
      leadServices: lead.services,
      previousStatus,
      newStatus,
      customMessage,
      updatedAt: new Date().toLocaleString(),
      daysSinceContact: Math.floor((Date.now() - lead.updatedAt.getTime()) / (1000 * 60 * 60 * 24)),
      dashboardUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      siteUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      companyName: process.env.COMPANY_NAME || 'Your Company',
      companyEmail: process.env.COMPANY_EMAIL || 'hello@company.com',
      companyPhone: process.env.COMPANY_PHONE || '(555) 123-4567',
    };

    // Compile email content
    const subject = compileTemplate(template.subject, templateData);
    const html = compileTemplate(template.html, templateData);

    // Send email
    await transporter.sendMail({
      from: `"${process.env.COMPANY_NAME || 'Your Company'}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`Email notification sent: ${type} to ${to}`);
    return true;

  } catch (error) {
    console.error('Email notification error:', error);
    return false;
  }
}

// Send bulk email notifications
export async function sendBulkNotifications(
  notifications: EmailNotificationData[]
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const notification of notifications) {
    try {
      const success = await sendEmailNotification(notification);
      if (success) {
        sent++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error('Bulk notification error:', error);
      failed++;
    }
  }

  return { sent, failed };
}

// Test email configuration
export async function testEmailConfiguration(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration test failed:', error);
    return false;
  }
}

// Send test email
export async function sendTestEmail(to: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"${process.env.COMPANY_NAME || 'Your Company'}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject: 'Test Email - Contact Form System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Configuration Test</h2>
          <p>This is a test email to verify that your email notification system is working correctly.</p>
          <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
          <p>If you received this email, your configuration is working properly!</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('Test email failed:', error);
    return false;
  }
}
