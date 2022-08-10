import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService{

  constructor(private prisma: PrismaService) {}
  

  async signup(dto: AuthDto) { 
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash
        },
      });
      delete user.hash;   //Removes only the hash instead of the big select
      return user;
  
    } catch(error) {
      if(error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials already used');
        }
      }
      throw error;
    }
  }


  signin() {
    return { msg: 'I have signed in '}
  }

}