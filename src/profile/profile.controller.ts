// import { Controller, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { PrismaClient } from '@prisma/client';
// import { Request } from 'express';

// const prisma = new PrismaClient();

// @Controller('profile')
// export class ProfileController {
//   @Post('avatar')
//   @UseInterceptors(FileInterceptor('avatar'))
//   async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
//     const userId = req.user.id; // Предполагается, что у вас есть middleware для аутентификации
//     const avatarPath = `/uploads/${file.filename}`; // Путь к загруженной аватарке

//     await prisma.user.update({
//       where: { id: userId },
//       data: { avatarPath },
//     });

//     return { message: 'Аватарка успешно обновлена', avatarPath };
//   }
// }
