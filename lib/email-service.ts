import nodemailer, { Transporter } from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
    from?: string;
}

interface QuestionnaireLinkOptions {
    clientEmail: string;
    clientName: string;
    projectName: string;
    questionnaireUrl: string;
    expiresAt?: Date;
}

interface FollowUpEmailOptions {
    recipientEmail: string;
    recipientName: string;
    projectName: string;
    followUpQuestions: string[];
    message?: string;
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
    if (transporter) return transporter;

  const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');

  transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
                user: smtpUser,
                pass: smtpPassword,
        },
  });

  return transporter;
}

export async function sendEmail(options: EmailOptions): Promise<string> {
    try {
          const transporter = getTransporter();
          const from = options.from || process.env.SENDER_EMAIL || 'noreply@clientflow.app';

      const result = await transporter.sendMail({
              from,
              to: options.to,
              subject: options.subject,
              text: options.text,
              html: options.html,
      });

      return result.messageId;
    } catch (error) {
          console.error('Error sending email:', error);
          throw new Error('Failed to send email');
    }
}

export async function sendQuestionnaireLink(
    options: QuestionnaireLinkOptions
  ): Promise<string> {
    const expiresText = options.expiresAt
      ? ` by ${options.expiresAt.toLocaleDateString()}`
          : '';

  const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Hello ${options.clientName},</h2>

                        <p style="color: #666; line-height: 1.6;">
                                We're excited to get started on your <strong>${options.projectName}</strong> project! 
                                        To help us understand your vision and requirements, we've prepared a questionnaire.
                                              </p>

                                                    <p style="color: #666; line-height: 1.6;">
                                                            Please take 10-15 minutes to answer the questions below${expiresText}.
                                                                  </p>

                                                                        <div style="text-align: center; margin: 30px 0;">
                                                                                <a href="${options.questionnaireUrl}" 
                                                                                           style="background-color: #4F46E5; color: white; padding: 12px 30px; 
                                                                                                             text-decoration: none; border-radius: 5px; font-weight: bold;
                                                                                                                               display: inline-block;">
                                                                                                                                         Start Questionnaire
                                                                                                                                                 </a>
                                                                                                                                                       </div>
                                                                                                                                                       
                                                                                                                                                             <p style="color: #666; line-height: 1.6;">
                                                                                                                                                                     Your responses will help us create a more targeted and effective solution for your project. 
                                                                                                                                                                             If you have any questions, please don't hesitate to reach out.
                                                                                                                                                                                   </p>
                                                                                                                                                                                   
                                                                                                                                                                                         <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                                                                                                                                                                                               
                                                                                                                                                                                                     <p style="color: #999; font-size: 12px;">
                                                                                                                                                                                                             ClientFlow Lite - Professional Project Management
                                                                                                                                                                                                                   </p>
                                                                                                                                                                                                                       </div>
                                                                                                                                                                                                                         `;

  return sendEmail({
        to: options.clientEmail,
        subject: `${options.projectName} - Initial Project Questionnaire`,
        html,
        text: `Hello ${options.clientName},\n\nPlease complete the project questionnaire at: ${options.questionnaireUrl}\n\nThank you!`,
  });
}

export async function sendFollowUpEmail(
    options: FollowUpEmailOptions
  ): Promise<string> {
    const questionsHtml = options.followUpQuestions
      .map((q, idx) => `<li style="margin: 8px 0;">${q}</li>`)
      .join('');

  const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Follow-up Questions for ${options.projectName}</h2>

                        <p style="color: #666; line-height: 1.6;">
                                Hello ${options.recipientName},
                                      </p>

                                            <p style="color: #666; line-height: 1.6;">
                                                    Thank you for completing the initial questionnaire! We have a few follow-up questions 
                                                            that will help us refine our approach and ensure we deliver exactly what you're looking for.
                                                                  </p>

                                                                        ${options.message ? `<p style="color: #666; line-height: 1.6;">${options.message}</p>` : ''}

                                                                              <h3 style="color: #333; margin-top: 20px;">Follow-up Questions:</h3>
                                                                                    <ul style="color: #666;">
                                                                                            ${questionsHtml}
                                                                                                  </ul>

                                                                                                        <div style="text-align: center; margin: 30px 0;">
                                                                                                                <a href="#" 
                                                                                                                           style="background-color: #4F46E5; color: white; padding: 12px 30px; 
                                                                                                                                             text-decoration: none; border-radius: 5px; font-weight: bold;
                                                                                                                                                               display: inline-block;">
                                                                                                                                                                         Answer Follow-up Questions
                                                                                                                                                                                 </a>
                                                                                                                                                                                       </div>
                                                                                                                                                                                       
                                                                                                                                                                                             <p style="color: #666; line-height: 1.6;">
                                                                                                                                                                                                     We look forward to your responses. These details will be crucial in moving the project forward.
                                                                                                                                                                                                           </p>
                                                                                                                                                                                                           
                                                                                                                                                                                                                 <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                                                                                                                                                                                                                       
                                                                                                                                                                                                                             <p style="color: #999; font-size: 12px;">
                                                                                                                                                                                                                                     ClientFlow Lite - Professional Project Management
                                                                                                                                                                                                                                           </p>
                                                                                                                                                                                                                                               </div>
                                                                                                                                                                                                                                                 `;

  return sendEmail({
        to: options.recipientEmail,
        subject: `${options.projectName} - Follow-up Questions`,
        html,
        text: `Hello ${options.recipientName},\n\nWe have follow-up questions:\n${options.followUpQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\nThank you!`,
  });
}

export async function sendProjectStatusEmail(
    recipientEmail: string,
    recipientName: string,
    projectName: string,
    status: string,
    updates: string[]
  ): Promise<string> {
    const updatesHtml = updates
      .map((update) => `<li style="margin: 8px 0;">${update}</li>`)
      .join('');

  const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">${projectName} - Status Update</h2>

                        <p style="color: #666; line-height: 1.6;">
                                Hello ${recipientName},
                                      </p>

                                            <p style="color: #666; line-height: 1.6;">
                                                    Here's a status update on your ${projectName} project:
                                                          </p>

                                                                <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #4F46E5; margin: 20px 0;">
                                                                        <p style="color: #333; margin: 0;"><strong>Current Status:</strong> ${status}</p>
                                                                              </div>

                                                                                    <h3 style="color: #333; margin-top: 20px;">Recent Updates:</h3>
                                                                                          <ul style="color: #666;">
                                                                                                  ${updatesHtml}
                                                                                                        </ul>
                                                                                                        
                                                                                                              <p style="color: #666; line-height: 1.6;">
                                                                                                                      We're excited about the progress and will continue to keep you informed every step of the way.
                                                                                                                            </p>
                                                                                                                            
                                                                                                                                  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                                                                                                                                        
                                                                                                                                              <p style="color: #999; font-size: 12px;">
                                                                                                                                                      ClientFlow Lite - Professional Project Management
                                                                                                                                                            </p>
                                                                                                                                                                </div>
                                                                                                                                                                  `;

  return sendEmail({
        to: recipientEmail,
        subject: `${projectName} - Status Update`,
        html,
        text: `Hello ${recipientName},\n\nStatus: ${status}\n\nUpdates:\n${updates.map((u) => `- ${u}`).join('\n')}\n\nThank you!`,
  });
}
