import { NgModule } from '@angular/core';

import { DepartamentoRoutingModule } from './departamento-routing.module';
import { DepartamentoComponent } from './departamento.component';
import { ComumModule } from 'src/app/modules/comum/comum.module';
import { ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    DepartamentoComponent
  ],
  imports: [
    ComumModule,
    ReactiveFormsModule,
    DepartamentoRoutingModule,
    MatIconModule
  ]
})
export class DepartamentoModule { }
