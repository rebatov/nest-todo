import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { CreateTodoInterface, EditTodoInterface } from './interface';
import { TodoService } from './todo.service';

@UseGuards(JwtGuard)
@Controller('todos')
export class TodoController {
  constructor(private todoService: TodoService) { }
  @Post()
  createTodo(
    @GetUser('id') userId: number,
    @Body() payload: CreateTodoInterface,
  ) {
    return this.todoService.createTodo(userId, payload);
  }

  @Get()
  getTodos(@GetUser('id') userId: number) {
    return this.todoService.getTodos(userId);
  }

  @Get(':id')
  getTodoById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) todoId: number
  ) {
    return this.todoService.getTodoById(userId, todoId);
  }

  @Patch(':id')
  editTodoById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) todoId: number,
    @Body() payload: EditTodoInterface,
  ) {
    return this.todoService.editTodoById(userId, todoId, payload);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteTodoById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) todoId: number
  ) {
    this.todoService.deleteTodoById(userId, todoId);
  }
}
