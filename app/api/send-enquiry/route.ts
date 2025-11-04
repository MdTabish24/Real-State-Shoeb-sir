import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function POST(request: Request) {
  try {
    const { name, phone, email, message, propertyTitle, propertyUrl } = await request.json();
    
    // Check if SendGrid is configured
    if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
      console.log('⚠️ SendGrid not configured. Email not sent.');
      return NextResponse.json({ success: true, message: 'SendGrid not configured' });
    }
    
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const emailContent = `
New Property Enquiry from EstateHub

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Property: ${propertyTitle || 'N/A'}
View Property: ${propertyUrl || 'N/A'}

Customer Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${name}
Phone: ${phone}
Email: ${email || 'Not provided'}

Message:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${message || 'No message'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sent from EstateHub Property Portal
    `;
    
    await sgMail.send({
      from: process.env.SENDGRID_FROM_EMAIL,
      to: 'universalprimeproperties1@gmail.com',
      subject: `🏠 New Property Enquiry from ${name}`,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: #0a2540; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">🏠 EstateHub</h1>
            <p style="margin: 5px 0 0 0;">New Property Enquiry</p>
          </div>
          
          <div style="background-color: white; padding: 30px; margin-top: 20px; border-radius: 8px;">
            <h2 style="color: #0a2540; border-bottom: 2px solid #C4F1F4; padding-bottom: 10px;">Property Details</h2>
            <p style="font-size: 16px; color: #333; margin-bottom: 10px;"><strong>Property:</strong> ${propertyTitle || 'N/A'}</p>
            <a href="${propertyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #00a8e8; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-bottom: 20px;">🏠 View Property on Website</a>
            
            <h2 style="color: #0a2540; border-bottom: 2px solid #C4F1F4; padding-bottom: 10px; margin-top: 30px;">Customer Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #666;"><strong>Name:</strong></td>
                <td style="padding: 10px 0; color: #333;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666;"><strong>Phone:</strong></td>
                <td style="padding: 10px 0; color: #333;"><a href="tel:${phone}" style="color: #0a2540; text-decoration: none;">${phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 10px 0; color: #333;"><a href="mailto:${email}" style="color: #0a2540; text-decoration: none;">${email || 'Not provided'}</a></td>
              </tr>
            </table>
            
            <h2 style="color: #0a2540; border-bottom: 2px solid #C4F1F4; padding-bottom: 10px; margin-top: 30px;">Message</h2>
            <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #C4F1F4; color: #333;">${message || 'No message'}</p>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #C4F1F4; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #0a2540;"><strong>Quick Actions:</strong></p>
              <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="display: inline-block; margin: 10px 5px; padding: 10px 20px; background-color: #25D366; color: white; text-decoration: none; border-radius: 5px;">📱 WhatsApp</a>
              <a href="tel:${phone}" style="display: inline-block; margin: 10px 5px; padding: 10px 20px; background-color: #0a2540; color: white; text-decoration: none; border-radius: 5px;">📞 Call</a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>Sent from EstateHub Property Portal</p>
          </div>
        </div>
      `,
    });
    
    console.log('✅ Email sent successfully');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Email error:', error.response?.body || error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
