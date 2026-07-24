if (missing.length > 0) {
      throw new Error(`Missing required email configuration: ${missing.join(', ')}`);
    }

    return {
      host: requiredEnvVars.host!,
      port: parseInt(requiredEnvVars.port!, 10) || 587,
      secure: process.env.EMAIL_SECURE === 'true' || false,
      auth: {
        user: requiredEnvVars.user!,
        pass: requiredEnvVars.pass!
      }
    };
  }

  private async initializeTransporter(): Promise<void> {
    try {
      this.transporter = nodemailer.createTransporter(this.config);
      
      // Verify connection configuration
      await this.transporter.verify();
      console.log('Email service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize email service:', error);
      throw new Error('Email service initialization failed');
    }
  }

  private ensureTransporter(): nodemailer.Transporter {
    if (!this.transporter) {
      throw new Error('Email transporter not initialized');
    }
    return this.transporter;
  }

  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    try {
      // Validate input
      const validatedOptions = sendEmailSchema.parse(options);
      
      const transporter = this.ensureTransporter();
      
      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME || 'Website'} <${process.env.EMAIL_FROM || this.config.auth.user}>`,
        to: Array.isArray(validatedOptions.to) ? validatedOptions.to.join(', ') : validatedOptions.to,
        cc: validatedOptions.cc ? (Array.isArray(validatedOptions.cc) ? validatedOptions.cc.join(', ') : validatedOptions.cc) : undefined,
        bcc: validatedOptions.bcc ? (Array.isArray(validatedOptions.bcc) ? validatedOptions.bcc.join(', ') : validatedOptions.bcc) : undefined,
        subject: validatedOptions.subject,
        html: validatedOptions.html,
        text: validatedOptions.text,
        attachments: validatedOptions.attachments
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error(`Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Contact form notification email
  async sendContactFormNotification(formData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message: string;
    source?: string;
  }): Promise<boolean> {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || this.config.auth.user;
      
      const subject = `New Contact Form Submission from ${formData.name}`;
      
      const html = this.generateContactFormHTML(formData);
      const text = this.generateContactFormText(formData);

      return await this.sendEmail({
        to: adminEmail,
        subject,
        html,
        text
      });
    } catch (error) {
      console.error('Failed to send contact form notification:', error);
      throw error;
    }
  }

  // Auto-reply to contact form submitter
  async sendContactFormAutoReply(email: string, name: string): Promise<boolean> {
    try {
      const subject = 'Thank you for contacting us';
      
      const html = this.generateAutoReplyHTML(name);
      const text = this.generateAutoReplyText(name);

      return await this.sendEmail({
        to: email,
        subject,
        html,
        text
      });
    } catch (error) {
      console.error('Failed to send auto-reply email:', error);
      throw error;
    }
  }

  // Job application notification
  async sendJobApplicationNotification(applicationData: {
    jobId: string;
    jobTitle: string;
    applicantName: string;
    applicantEmail: string;
    resume?: string;
  }): Promise<boolean> {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || this.config.auth.user;
      
      const subject = `New Job Application: ${applicationData.jobTitle}`;
      
      const html = this.generateJobApplicationHTML(applicationData);
      const text = this.generateJobApplicationText(applicationData);

      const attachments = applicationData.resume ? [{
        filename: `${applicationData.applicantName.replace(/\s+/g, '_')}_Resume.pdf`,
        content: applicationData.resume,
        contentType: 'application/pdf'
      }] : undefined;

      return await this.sendEmail({
        to: adminEmail,
        subject,
        html,
        text,
        attachments
      });
    } catch (error) {
      console.error('Failed to send job application notification:', error);
      throw error;
    }
  }

  private generateContactFormHTML(data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message: string;
    source?: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { margin-top: 5px; padding: 10px; background: #f8f9fa; border-radius: 3px; }
          .message { white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
            <p>You have received a new message through your website contact form.</p>
          </div>
          
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${data.name}</div>
          </div>
          
          <div class="field">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          
          ${data.phone ? `
          <div class="field">
            <div class="label">Phone:</div>
            <div class="value">${data.phone}</div>
          </div>
          ` : ''}
          
          ${data.company ? `
          <div class="field">
            <div class="label">Company:</div>
            <div class="value">${data.company}</div>
          </div>
          ` : ''}
          
          ${data.source ? `
          <div class="field">
            <div class="label">Source:</div>
            <div class="value">${data.source}</div>
          </div>
          ` : ''}
          
          <div class="field">
            <div class="label">Message:</div>
            <div class="value message">${data.message}</div>
          </div>
          
          <hr>
          <p><small>This email was sent from your website contact form at ${new Date().toLocaleString()}.</small></p>
        </div>
      </body>
      </html>
    `;
  }

  private generateContactFormText(data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message: string;
    source?: string;
  }): string {
    let text = `New Contact Form Submission\n\n`;
    text += `Name: ${data.name}\n`;
    text += `Email: ${data.email}\n`;
    if (data.phone) text += `Phone: ${data.phone}\n`;
    if (data.company) text += `Company: ${data.company}\n`;
    if (data.source) text += `Source: ${data.source}\n`;
    text += `\nMessage:\n${data.message}\n\n`;
    text += `---\nThis email was sent from your website contact form at ${new Date().toLocaleString()}.`;
    return text;
  }

  private generateAutoReplyHTML(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Thank you for your message</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .content { padding: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Thank You for Your Message</h2>
          </div>
          
          <div class="content">
            <p>Dear ${name},</p>
            
            <p>Thank you for reaching out to us through our website. We have received your message and appreciate you taking the time to contact us.</p>
            
            <p>Our team will review your inquiry and get back to you within 24-48 hours during business days.</p>
            
            <p>If you have any urgent matters, please feel free to call us directly.</p>
            
            <p>Best regards,<br>
            The Team</p>
          </div>
          
          <hr>
          <p><small>This is an automated response. Please do not reply to this email.</small></p>
        </div>
      </body>
      </html>
    `;
  }

  private generateAutoReplyText(name: string): string {
    return `Dear ${name},

Thank you for reaching out to us through our website. We have received your message and appreciate you taking the time to contact us.

Our team will review your inquiry and get back to you within 24-48 hours during business days.

If you have any urgent matters, please feel free to call us directly.

Best regards,
The Team

---
This is an automated response. Please do not reply to this email.`;
  }

  private generateJobApplicationHTML(data: {
    jobId: string;
    jobTitle: string;
    applicantName: string;
    applicantEmail: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Job Application</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { margin-top: 5px; padding: 10px; background: #f8f9fa; border-radius: 3px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Job Application Received</h2>
          </div>
          
          <div class="field">
            <div class="label">Position:</div>
            <div class="value">${data.jobTitle}</div>
          </div>
          
          <div class="field">
            <div class="label">Job ID:</div>
            <div class="value">${data.jobId}</div>
          </div>
          
          <div class="field">
            <div class="label">Applicant Name:</div>
            <div class="value">${data.applicantName}</div>
          </div>
          
          <div class="field">
            <div class="label">Applicant Email:</div>
            <div class="value"><a href="mailto:${data.applicantEmail}">${data.applicantEmail}</a></div>
          </div>
          
          <hr>
          <p><small>Application received at ${new Date().toLocaleString()}.</small></p>
        </div>
      </body>
      </html>
    `;
  }

  private generateJobApplicationText(data: {
    jobId: string;
    jobTitle: string;
    applicantName: string;
    applicantEmail: string;
  }): string {
    return `New Job Application Received

Position: ${data.jobTitle}
Job ID: ${data.jobId}
Applicant Name: ${data.applicantName}
Applicant Email: ${data.applicantEmail}

---
Application received at ${new Date().toLocaleString()}.`;
  }
}

// Create singleton instance
const emailService = new EmailService();

// Export utility functions
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  return emailService.sendEmail(options);
}

export async function sendContactFormNotification(formData: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  source?: string;
}): Promise<boolean> {
  return emailService.sendContactFormNotification(formData);
}

export async function sendContactFormAutoReply(email: string, name: string): Promise<boolean> {
  return emailService.sendContactFormAutoReply(email, name);
}

export async function sendJobApplicationNotification(applicationData: {
  jobId: string;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  resume?: string;
}): Promise<boolean> {
  return emailService.sendJobApplicationNotification(applicationData);
}

// Export types
export type { SendEmailOptions, EmailTemplate };

// Export the service instance for advanced usage
export { emailService };