import { NextRequest, NextResponse } from 'next/server';
import Mailgun from 'mailgun.js';
import formData from 'form-data';

const mailgun = new Mailgun(formData);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({
        status: 'error',
        message: 'Missing required fields: name, email, subject, and message are required.',
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        status: 'error',
        message: 'Invalid email address format.',
      }, { status: 400 });
    }

    // Initialize Mailgun client
    const mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY || '',
    });

    if (!process.env.MAILGUN_API_KEY) {
      console.error('MAILGUN_API_KEY is not configured');
      return NextResponse.json({
        status: 'error',
        message: 'Email service is not configured. Please try again later.',
      }, { status: 500 });
    }

    // Prepare email content
    const emailData = {
      from: `YardSaleFndr Contact <noreply@mg.dynamicshark.com>`,
      to: 'info@dynamicshark.com', // This should be your actual email
      subject: `YSF Contact Form: ${subject}`,
      text: `
New contact form submission from YardSaleFndr:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from the YardSaleFndr contact form.
Reply directly to this email to respond to ${name} at ${email}.
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
    New Contact Form Submission
  </h2>
  
  <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #374151; margin-top: 0;">Contact Details</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
    <p><strong>Subject:</strong> ${subject}</p>
  </div>
  
  <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
    <h3 style="color: #374151; margin-top: 0;">Message</h3>
    <p style="line-height: 1.6; color: #4b5563;">${message.replace(/\n/g, '<br>')}</p>
  </div>
  
  <div style="margin-top: 20px; padding: 15px; background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #2563eb;">
    <p style="margin: 0; color: #1e40af; font-size: 14px;">
      This message was sent from the YardSaleFndr contact form. 
      Reply directly to this email to respond to ${name}.
    </p>
  </div>
</div>
      `,
      'h:Reply-To': email, // Set reply-to as the sender's email
    };

    // Send email via Mailgun
    await mg.messages.create('mg.dynamicshark.com', emailData);

    return NextResponse.json({
      status: 'success',
      message: 'Your message has been sent successfully! We\'ll get back to you soon.',
    }, { status: 200 });

  } catch (error) {
    console.error('Failed to send email:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to send message. Please try again later or contact us directly.',
      error: process.env.NODE_ENV === 'development' ? error : 'Internal server error',
    }, { status: 500 });
  }
}
