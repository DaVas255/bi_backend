import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'
import { AuthModule } from './auth/auth.module'
import { getGoogleRecaptchaConfig } from './config/google-recaptcha.config'
import { ImsModule } from './ims/ims.module'
import { PrismaMySqlModule } from './prisma/prisma-mysql.module'
import { PrismaPgModule } from './prisma/prisma-pg.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getGoogleRecaptchaConfig,
      inject: [ConfigService]
    }),
    AuthModule,
    UserModule,
    PrismaPgModule,
    PrismaMySqlModule,
    ImsModule
  ]
})
export class AppModule { }
