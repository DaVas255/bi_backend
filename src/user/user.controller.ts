import { Auth } from '@/auth/decorators/auth.decorator'
import { CurrentUser } from '@/auth/decorators/user.decorator'
import { Controller, Get, Put } from '@nestjs/common'
import { Role, User } from '@prisma/client'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Auth()
  @Get('profile')
  async getProfile(@CurrentUser('id') id: string) {
    return this.userService.getById(id)
  }

  @Auth(Role.PREMIUM)
  @Get('premium')
  async getPremium() {
    return { text: 'Premium content' }
  }

  @Auth([Role.ADMIN, Role.MANAGER])
  @Get('manager')
  async getManagerContent() {
    return { text: 'Manager content' }
  }

  @Auth(Role.ADMIN)
  @Get('list')
  async getList() {
    return this.userService.getUsers()
  }

  @Auth()
  @Put('update')
  async update(@CurrentUser('id') id: string, data: Partial<User>) {
    return this.userService.update(id, data)
  }
}
