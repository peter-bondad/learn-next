import type {
  EmailService,
  SendInvitationEmailInput,
  SendPasswordResetEmailInput,
} from "./email.interface";
import { Resend } from "resend";

export class DevelopmentEmailService implements EmailService {
  async sendInvitation(input: SendInvitationEmailInput): Promise<void> {
    console.log("====== INVITATION EMAIL ======");
    console.log("To:", input.email);
    console.log("Invitation URL:", input.invitationUrl);
    console.log("Expires:", input.expiresAt);
    console.log("==============================");
  }

  async sendPasswordReset(input: SendPasswordResetEmailInput): Promise<void> {
    console.log("====== PASSWORD RESET EMAIL ======");
    console.log("To:", input.email);
    console.log("Reset URL:", input.resetUrl);
    console.log("===================================");
  }
}

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

  async sendPasswordReset(input: SendPasswordResetEmailInput): Promise<void> {
    await this.resend.emails.send({
      from: "Coffee Admin <noreply@example.com>",
      to: input.email,
      subject: "Reset your password",
      html: `
        <h1>Reset your password</h1>
        <p>Click the link below. This link expires in 1 hour.</p>
        <a href="${input.resetUrl}">Reset Password</a>
      `,
    });
  }
}
