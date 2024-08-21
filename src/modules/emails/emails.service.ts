import { Injectable } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';
import { join } from 'path';

@Injectable()
export class EmailsService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    context: Record<string, any>,
  ): Promise<void> {
    await this.transporter.sendMail({
      to,
      subject,
      html: await this.renderTemplate(template, context),
    });
  }

  private async renderTemplate(
    template: string,
    context: Record<string, any>,
  ) : Promise<string>{
    const hbs = require('express-handlebars').create({
      extname: '.hbs',
      layoutsDir: join(__dirname, 'templates'),
    });
    const html = await hbs.render(template, context);
    return html;
  }
}
