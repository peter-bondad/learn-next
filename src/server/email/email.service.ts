import type { EmailService, SendInvitationEmailInput } from "./email.interface";

export class DevelopmentEmailService implements EmailService {
  async sendInvitation(input: SendInvitationEmailInput): Promise<void> {
    console.log("====== INVITATION EMAIL ======");
    console.log("To:", input.email);
    console.log("Invitation URL:", input.invitationUrl);
    console.log("Expires:", input.expiresAt);
    console.log("==============================");
  }
}

import { Resend } from "resend";

// Only basic template
export class ResendEmailService implements EmailService {
  constructor(private readonly resend: Resend) {}

  async sendInvitation(input: SendInvitationEmailInput): Promise<void> {
    await this.resend.emails.send({
      from: "Coffee Admin <noreply@example.com>",
      to: input.email,
      subject: "You are invited",
      html: `
        <h1>Welcome</h1>
        <p>Click the link below:</p>
        <a href="${input.invitationUrl}">s
          Accept Invitation
        </a>
      `,
    });
  }
}
