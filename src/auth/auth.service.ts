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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private unique_username: GenerateUsernameService,
    private mailer: MailerService,
  ) {}

  async registerUser(data: RegisterDto) {
    // resiecing data
    const present_user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (present_user) {
      throw new HttpException(
        `User with this email already exists, provider: ${present_user.provider}`,
        404,
      );
    }

    // formating
    const hashed_password = await bcrypt.hash(data.password, SALT_RESULT);
    const username = await this.unique_username.generate(data.name);
    const verify_token = this.jwt.sign({
      username: username,
      name: data.name,
      email: data.email,
      password: hashed_password,
      method: 'signup',
    });
    const magic_link = `${process.env.FRONT_ORIGIN}/verification/?token=${verify_token}`;

    // sending mail
    this.mailer.sendMail({
      to: data.email,
      subject: 'Verify your email | Svolve',
      text: 'You can verify your email by clicking the link below',
      html: `<a href=${magic_link} target="_blanck">Verify my email</a>`,
    });
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
    if (!the_user) {
      throw new HttpException('User is not defined', 404);
    }
    const is_password_ok = await bcrypt.compare(
      data.password,
      the_user.password,
    );
    if (!is_password_ok) {
      throw new HttpException('Password is incorrect', 404);
    }
    // generating token
    const verify_token = this.jwt.sign({
      email: the_user.email,
      password: the_user.password,
      username: the_user.username,
      method: 'signin',
    });
    const magic_link = `${process.env.FRONT_ORIGIN}/verification/?token=${verify_token}`;
    // sending mail
    this.mailer.sendMail({
      to: data.email,
      subject: 'Welcome back | Svolve',
      text: 'You can verify your email by clicking the link below',
      html: `<a href=${magic_link} target="_blanck">Verify my email</a>`,
    });
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
        password: data.password,
        email: data.email,
        provider: 'email',
      };
      const new_user = await this.prisma.user.create({ data: userdata });
      if (!new_user) {
        throw new HttpException('Server Error', 400);
      }
      const reset_token = this.jwt.sign(
        {
          email: new_user.email,
          password: new_user.password,
        },
        { expiresIn: '45d' },
      );
      const access_token = this.jwt.sign({
        id: new_user.id,
        email: new_user.email,
        username: new_user.username,
      });
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
      const reset_token = this.jwt.sign(
        {
          email: user.email,
          password: user.password,
        },
        { expiresIn: '45d' },
      );
      const access_token = this.jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
      });
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
      where: { id: req.user.id },
    });
    if (!userdata) {
      throw new HttpException('user is not defined', 404);
    }
    return userdata;
  }

  async githubHandler(req: RequestWithUser, res: Response) {
    const github_user_data = req.user;

    const existing_user = await this.prisma.user.findFirst({
      where: { github_id: github_user_data.github_id },
    });
    const existing_email = await this.prisma.user.findFirst({
      where: { email: github_user_data.email },
    });

    if (!existing_user && existing_email) {
      return res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ is_ok: false, message: "User with email of this github accaunt already exists"}, "http://localhost:3000");
              window.close();
            </script>
          </body>
        </html>
      `);
    }

    if (!existing_user) {
      const u_username = await this.unique_username.generate(
        github_user_data.username,
      );
      const password = await bcrypt.hash(
        Math.random().toString(36).slice(-8),
        SALT_RESULT,
      );
      const new_user = await this.prisma.user.create({
        data: {
          name: github_user_data.name,
          username: u_username,
          email: github_user_data.email,
          github_id: github_user_data.github_id,
          password: password,
          provider: github_user_data.provider,
        },
      });
      const access_token = this.jwt.sign({
        id: new_user.id,
        username: new_user.username,
        email: new_user.email,
      });
      const reset_token = this.jwt.sign(
        {
          email: new_user.email,
          password: new_user.password,
        },
        { expiresIn: '45d' },
      );
      res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ access_token: "${access_token}", reset_token: "${reset_token}" }, "http://localhost:3000");
              window.close();
            </script>
          </body>
        </html>
      `);
    } else {
      const access_token = this.jwt.sign({
        id: existing_user.id,
        username: existing_user.username,
        email: existing_user.email,
      });
      const reset_token = this.jwt.sign(
        {
          email: existing_user.email,
          password: existing_user.password,
        },
        { expiresIn: '45d' },
      );
      res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ access_token: "${access_token}", reset_token: "${reset_token}" }, "http://localhost:3000");
              window.close();
            </script>
          </body>
        </html>
      `);
    }
  }
}
