import { HttpException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SALT_RESULT } from 'src/constants';
import { GenerateUsernameService } from 'src/global/generate_username/generate_username.service';
import { MailerService } from '@nestjs-modules/mailer';
import { LoginDto } from './dtos/login.dto';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { Response } from 'express';
import { SocialAuthResponceService } from 'src/global/social_auth_responce/social_auth_responce.service';
import { AccessTokenService } from 'src/global/access_token/access_token.service';
import { ResetTokenService } from 'src/global/reset_token/reset_token.service';
import { VerifyMailService } from 'src/mailers/verify_mail/verify_mail.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private unique_username: GenerateUsernameService,
    private window_responder: SocialAuthResponceService,
    private access_token: AccessTokenService,
    private reset_token: ResetTokenService,
    private verify_mail: VerifyMailService,
  ) {}

  async registerUser(data: RegisterDto) {
    // recieving data
    const present_user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (present_user && present_user.provider === 'email') {
      throw new HttpException(
        `User with this email already exists, please sign-in`,
        404,
      );
    }
    if (present_user && present_user.provider !== 'email') {
      throw new HttpException(
        `provider of ${present_user.email} is ${present_user.provider}, please use ${present_user.provider} to register`,
        404,
      );
    }

    // formating
    const username = await this.unique_username.generate(data.name);
    const verify_token = this.jwt.sign(
      {
        username: username,
        name: data.name,
        email: data.email,
        method: 'signup',
      },
      { expiresIn: '15m' },
    );
    const magic_link = `${process.env.FRONT_ORIGIN}/verification/?token=${verify_token}`;

    // sending mail
    this.verify_mail.send(data.email, magic_link);
    return {
      message: `Magic link send to ${data.email}`,
      ok: true,
    };
  }

  async loginUser(data: LoginDto) {
    // checking
    const the_user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    // error handling
    if (!the_user) {
      throw new HttpException('User is not defined', 404);
    }
    if (the_user.provider !== 'email') {
      throw new HttpException(
        `provider of ${the_user.email} is ${the_user.provider}, please use ${the_user.provider} to register`,
        404,
      );
    }

    // generating token
    const verify_token = this.jwt.sign(
      {
        email: the_user.email,
        method: 'signin',
      },
      { expiresIn: '15m' },
    );
    const magic_link = `${process.env.FRONT_ORIGIN}/verification/?token=${verify_token}`;
    // sending mail
    this.verify_mail.send(data.email, magic_link);

    return {
      message: `welcome back, Magic link send to ${data.email}`,
      ok: true,
    };
  }

  async verifyMagicLink(token: string) {
    const data = this.jwt.verify(token);
    if (data.method == 'signup') {
      const userdata = {
        name: data.name,
        username: data.username,
        email: data.email,
        provider: 'email',
      };
      const new_user = await this.prisma.user.create({ data: userdata });
      if (!new_user) {
        throw new HttpException('Server Error, try again later', 400);
      }
      const access_token = this.access_token.generate(new_user);
      const reset_token = this.reset_token.generate(new_user);
      return {
        access_token: access_token,
        reset_token: reset_token,
      };
    } else if (data.method == 'signin') {
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (!user) {
        throw new HttpException('User is not defined', 404);
      }
      const access_token = this.access_token.generate(user);
      const reset_token = this.reset_token.generate(user);
      return {
        access_token: access_token,
        reset_token: reset_token,
      };
    } else {
      throw new HttpException('Invalid Token', 404);
    }
  }

  async getUserProfile(req: RequestWithUser) {
    const userdata = await this.prisma.user.findUnique({
      where: { id: req.user.id, email: req.user.email },
    });
    if (!userdata) {
      throw new HttpException('user is not defined', 404);
    }
    return userdata;
  }

  async githubHandler(req: RequestWithUser, res: Response) {
    const github_user_data = req.user;

    const existing_user = await this.prisma.user.findFirst({
      where: { provider_id: github_user_data.provider_id, provider: 'github' },
    });
    const existing_email = await this.prisma.user.findFirst({
      where: { email: github_user_data.email },
    });

    if (!existing_user && existing_email) {
      return res.send(
        this.window_responder.respond({
          is_ok: false,
          message: `provider of ${existing_email.email} is ${existing_email.provider}, please use ${existing_email.provider} to register`,
        }),
      );
    }

    if (!existing_user) {
      const u_username = await this.unique_username.generate(
        github_user_data.username,
      );
      const new_user = await this.prisma.user.create({
        data: {
          name: github_user_data.name,
          username: u_username,
          email: github_user_data.email,
          provider_id: github_user_data.provider_id,
          provider: github_user_data.provider,
        },
      });
      const access_token = this.access_token.generate(new_user);
      const reset_token = this.reset_token.generate(new_user);
      res.send(
        this.window_responder.respond({
          access_token: access_token,
          reset_token: reset_token,
        }),
      );
    } else {
      const access_token = this.access_token.generate(existing_user);
      const reset_token = this.reset_token.generate(existing_user);
      res.send(
        this.window_responder.respond({
          access_token: access_token,
          reset_token: reset_token,
        }),
      );
    }
  }

  async googleHandler(req: RequestWithUser, res: Response) {
    const google_user_data = req.user;

    const existing_user = await this.prisma.user.findFirst({
      where: { provider_id: google_user_data.provider_id, provider: 'google' },
    });
    const existing_email = await this.prisma.user.findFirst({
      where: { email: google_user_data.email },
    });

    if (!existing_user && existing_email) {
      return res.send(
        this.window_responder.respond({
          is_ok: false,
          message: `provider of ${existing_email.email} is ${existing_email.provider}, please use ${existing_email.provider} to register`,
        }),
      );
    }

    if (!existing_user) {
      const u_username = await this.unique_username.generate(
        google_user_data.name,
      );
      const new_user = await this.prisma.user.create({
        data: {
          name: google_user_data.name,
          username: u_username,
          email: google_user_data.email,
          provider_id: google_user_data.provider_id,
          provider: google_user_data.provider,
        },
      });
      const access_token = this.access_token.generate(new_user);
      const reset_token = this.reset_token.generate(new_user);
      res.send(
        this.window_responder.respond({
          access_token: access_token,
          reset_token: reset_token,
        }),
      );
    } else {
      const access_token = this.access_token.generate(existing_user);
      const reset_token = this.reset_token.generate(existing_user);
      res.send(
        this.window_responder.respond({
          access_token: access_token,
          reset_token: reset_token,
        }),
      );
    }
  }

  async ResetToken(token: string) {
    const payload = this.jwt.verify(token);
    if (payload.action !== 'reset' || !payload.email) {
      return new HttpException('invalid reset token', 404);
    }
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (!user) {
      throw new HttpException('User is not defined', 404);
    }
    return this.access_token.generate(user);
  }
}
