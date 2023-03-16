import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoInterface, EditTodoInterface } from './interface';

@Injectable()
export class TodoService {

  constructor(private prisma: PrismaService) { }

  async createTodo(userId: number, payload: CreateTodoInterface) {
    const todo = await this.prisma.todo.create({
      data: {
        userId,
        ...payload,
      }
    });
    return todo;
  }

  getTodos(userId: number) {
    return this.prisma.todo.findMany({
      where: {
        userId,
      }
    })
  }

  getTodoById(userId: number, todoId: number,) {
    return this.prisma.todo.findFirst({
      where: {
        userId,
        id: todoId,
      }
    })
  }

  async editTodoById(userId: number, todoId: number, payload: EditTodoInterface) {
    const todo = await this.prisma.todo.findUnique({
      where: {
        id: todoId,
      }
    });

    if (!todo || todo.userId !== userId)
      throw new ForbiddenException('Edit access denied');

    return this.prisma.todo.update({
      where: {
        id: todoId,
      },
      data: {
        ...payload,
      }
    })

  }

  async deleteTodoById(userId: number, todoId: number) {
    const todo = await this.prisma.todo.findUnique({
      where: {
        id: todoId,
      }
    });

    if (!todo || todo.userId !== userId)
      throw new ForbiddenException('Edit access denied');

    await this.prisma.todo.delete({
      where: {
        id: todoId,
      }
    })
  }
}
