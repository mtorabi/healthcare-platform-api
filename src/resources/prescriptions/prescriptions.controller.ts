import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('prescriptions')
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) { }

  @Post()
  create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(createPrescriptionDto);
  }

  @Get()
  findAll() {
    return this.prescriptionsService.findAll();
  }

  @Get('top-prescribed-drugs')
  @ApiQuery({ name: 'from', required: false, type: String, description: 'Start date for filtering prescriptions (ISO format)', example: '2025-01-01T00:00:00.000Z' })
  @ApiQuery({ name: 'to', required: false, type: String, description: 'End date for filtering prescriptions (ISO format)', example: '2025-08-24T23:59:59.999Z' })
  @ApiQuery({ name: 'count', required: false, type: Number, description: 'Number of top drugs to return (default: 10)' })
  topPrescribedDrugs(@Query() query: { from: Date; to: Date; count: number }) {
    return this.prescriptionsService.topPrescribedDrugs(query.from ?? new Date(0), query.to ?? new Date(), query.count ?? 10);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prescriptionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrescriptionDto: UpdatePrescriptionDto) {
    return this.prescriptionsService.update(+id, updatePrescriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prescriptionsService.remove(+id);
  }
}
