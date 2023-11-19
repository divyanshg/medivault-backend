export interface MailInput {
  to: string;
  subject: string;
  content: string;
}

export abstract class EmailService {
  abstract send({ to, content, subject }: MailInput): Promise<void>;
}
