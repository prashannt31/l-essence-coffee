import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Send Alert Email to YOU
    await resend.emails.send({
      from: 'L-Essence Coffee <onboarding@resend.dev>', // Swap to your domain later
      to: 'your-personal-email@gmail.com', // Where you want to receive inquiries
      subject: `🚨 New Luxury Enquiry from ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #0B0B0B; color: #F5F2EB;">
          <h2 style="color: #C4B5A5; border-bottom: 1px solid #333; padding-bottom: 10px;">New Website Enquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p style="background: #161616; padding: 15px; border-left: 3px solid #C4B5A5;"><strong>Message:</strong><br/>${message}</p>
        </div>
      `,
    });

    // 2. Send Luxury Confirmation Email to the CUSTOMER
    await resend.emails.send({
      from: 'L-Essence Coffee <onboarding@resend.dev>', 
      to: email, // Sent automatically to the user who filled out the form
      subject: 'We have received your enquiry — L-Essence Coffee',
      html: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #0B0B0B; color: #F5F2EB; text-align: center;">
          <h1 style="color: #F5F2EB; font-weight: normal; font-size: 28px; margin-bottom: 24px;">Thank You for Connecting</h1>
          <p style="font-family: sans-serif; font-size: 14px; color: #A3B19B; line-height: 1.6; max-w: 450px; margin: 0 auto 30px auto;">
            Hello ${name},<br/><br/>
            Your message has safely reached our roasting studio. True luxury cannot be rushed, but our team reviews every message with deliberate attention. Expect a personal response within 24 hours.
          </p>
          <div style="border-top: 1px solid #222; padding-top: 20px; font-family: sans-serif; font-size: 11px; color: #A3B19B; letter-spacing: 0.2em; uppercase;">
            L-ESSENCE COFFEE ROASTERS
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}