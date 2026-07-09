export interface SendInvitationEmailInput {
  email: string;
  name?: string;
  invitationUrl: string;
  expiresAt: Date;
}

export interface EmailService {
  sendInvitation(input: SendInvitationEmailInput): Promise<void>;
}
