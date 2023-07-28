import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from 'src/rmq/rmq.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private rmqService: RmqService,
  ) {}

  @EventPattern('create_user')
  async createUser(@Payload() data, @Ctx() context: RmqContext) {
    const response = this.userService.createUser(data);
    this.rmqService.ack(context);

    return response;
  }

  @EventPattern('login_user')
  async loginUser(@Payload() data, @Ctx() context: RmqContext) {
    const response = this.userService.loginUser(data);
    this.rmqService.ack(context);

    return response;
  }

  @EventPattern('get_user_by_id')
  async getUserById(@Payload() id: string, @Ctx() context: RmqContext) {
    const user = this.userService.getUserById(id);
    this.rmqService.ack(context);

    return user;
  }
}
