import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Authorized,
  InputType,
  Field,
  ObjectType,
} from 'type-graphql';
import { User, UserRole } from '../entities/User';
import { Context } from '../types/context';
import { RegisterInput } from '../inputs/RegisterInput';
import { LoginInput } from '../inputs/LoginInput';
import { createAccessToken, createRefreshToken } from '../utils/auth';
import { sendRefreshToken } from '../utils/sendRefreshToken';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'Hello World!';
  }

  @Query(() => [User])
  @Authorized([UserRole.ADMIN])
  async users(@Ctx() { req }: Context) {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: Context) {
    const userId = req.userId;
    if (!userId) return null;
    return User.findOne(userId);
  }

  @Mutation(() => LoginResponse)
  async register(
    @Arg('input') { email, password, firstName, lastName }: RegisterInput
  ): Promise<LoginResponse> {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const user = User.create({
      email,
      password,
      firstName,
      lastName,
      role: UserRole.CUSTOMER,
    });

    await user.save();

    return {
      accessToken: createAccessToken(user),
      user,
    };
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('input') { email, password }: LoginInput,
    @Ctx() { res }: Context
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Invalid login');
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      throw new Error('Invalid login');
    }

    // Send refresh token as a cookie
    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user,
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: Context) {
    sendRefreshToken(res, '');
    return true;
  }
}
