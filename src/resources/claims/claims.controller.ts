import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Claim } from './entities/claim.entity';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { ClaimsService } from './claims.service';

@ApiTags('claims')
@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) { }

  @Post()
  @ApiResponse({ status: 201, description: 'The claim has been successfully created.', type: Claim })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  create(@Body() createClaimDto: CreateClaimDto) {
    return this.claimsService.create(createClaimDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of all claims', type: [Claim] })
  findAll() {
    return this.claimsService.findAll();
  }

  @Get('claims-cost')
  @ApiResponse({
    status: 200, description: 'Total claim cost per patient', schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          patientId: { type: 'number', example: 1 },
          totalClaimCost: { type: 'number', example: 100.50 }
        },
      },
    },
  })
  @ApiQuery({ name: 'patientId', required: false, type: Number, description: 'ID of the patient to get total claim cost for', example: 1 })
  claimCostPerPatient(@Query('patientId') patientId: number) {
    return this.claimsService.claimCostPerPatient(patientId);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Claim found', type: Claim })
  @ApiResponse({ status: 404, description: 'Claim not found' })
  findOne(@Param('id') id: string) {
    return this.claimsService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Claim updated', type: Claim })
  @ApiResponse({ status: 404, description: 'Claim not found' })
  update(@Param('id') id: string, @Body() updateClaimDto: UpdateClaimDto) {
    return this.claimsService.update(+id, updateClaimDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Claim deleted', type: Boolean })
  @ApiResponse({ status: 404, description: 'Claim not found' })
  remove(@Param('id') id: string) {
    return this.claimsService.remove(+id);
  }
}
