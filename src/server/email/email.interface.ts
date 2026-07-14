export interface SendInvitationEmailInput {
  email: string;
  name?: string;
  invitationUrl: string;
  expiresAt: Date;
}

// For send reset password url
export type SendPasswordResetEmailInput = {
  email: string;
  resetUrl: string;
};

export interface EmailService {
  sendInvitation(input: SendInvitationEmailInput): Promise<void>;
  sendPasswordReset(input: SendPasswordResetEmailInput): Promise<void>;
}
