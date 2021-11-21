import { FilterDepartamentoPipe } from './../../../pipe/filter-departamento.pipe';
import { ComumModule } from './../../../modules/comum/comum.module';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FuncionarioRoutingModule } from './funcionario-routing.module';
import { FuncionarioComponent } from './funcionario.component';

import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    FuncionarioComponent,
    FilterDepartamentoPipe
  ],
  imports: [
    ComumModule,
    NgSelectModule,
    FuncionarioRoutingModule,
    MatIconModule
  ]
})
export class FuncionarioModule { }
