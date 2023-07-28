import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private config: ConfigService) {}
  canActivate(context: ExecutionContext): any {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token');
    }

    const token = authHeader.slice(7, authHeader.length);

    try {
      const decodedToken = this.decodedToken(token);
      request.user = decodedToken;
      return true;
    } catch (error) {
      throw error;
    }
  }

  decodedToken(token: string) {
    const decodedToken: any = this.jwtService.decode(
      token,
      this.config.get('SECRET_KEY'),
    );

    const dateNow = new Date();

    if (decodedToken.exp < dateNow.getTime() / 1000) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Unathorized',
      });
    } else {
      return decodedToken;
    }
  }
}
