import { Controller, Get, Param } from '@nestjs/common';
import { TypesService } from './types.service';

@Controller('types')
export class TypesController {
    constructor(private readonly typesService: TypesService) {}

    @Get("/:organisation_id")
    findAll(@Param('organisation_id') organisation_id: string) {
    }
}
