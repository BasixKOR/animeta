import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Signing } from './django/signing';
import { jsonSerializer } from './serializer';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private sessionCookieAge = 1000 * 60 * 60 * 24 * 90
  private secretKey: string

  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    const secretKey = configService.get('ANIMETA_SECURITY_SECRET_KEY')
    if (!secretKey) throw new Error('ANIMETA_SECURITY_SECRET_KEY is not set')
    this.secretKey = secretKey
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.extractUser(req)
    if (user) {
      (req as any).user = user
    }
    next()
  }

  private async extractUser(req: Request): Promise<User | null> {
    const header = req.header('x-animeta-session-key')
    if (!header) {
      return null
    }
    try {
      const session = Signing.loadString(header, this.secretKey, "django.contrib.sessions.backends.signed_cookies", jsonSerializer, this.sessionCookieAge)
      // TODO: handle _session_expiry
      // TODO: handle _auth_user_hash
      const userId: string | undefined | null = session?.['_auth_user_id']
      if (userId) {
        // TODO: do not always load user
        return await this.userRepository.findOne(userId) ?? null
      }
      return null
    } catch (e) {
      return null
    }
  }
}
