import { Movimentacao } from './../../../models/requisicao.model';
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Requisicao } from 'src/app/models/requisicao.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Funcionario } from './../../../models/funcionario.model';
import { RequisicaoService } from './../../../services/requisicao.service';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-movimentacao',
  templateUrl: './movimentacao.component.html',
  styleUrls: ['./movimentacao.component.css']
})
export class MovimentacaoComponent implements OnInit {
  @Input() funcionarioLogado: Funcionario | null = null;
  requisicoes$: Observable<Requisicao[] | null> | undefined;
  movimentacoes$: Movimentacao[] = [];
  requisicaoSelecionada: Requisicao | null = null;
  edit: boolean = false;
  displayDialogMovimentacao: boolean = false;
  displayDialogMovimentacoes: boolean = false;
  form: FormGroup;
  listaStatus: string[] = [
    'Aberto',
    'Pendente',
    'Processando',
    'Não autorizado',
    'Finalizando'
  ];

  constructor(
    private requisicaoService: RequisicaoService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      funcionario: new FormControl('', Validators.required),
      dataHora: new FormControl(''),
      status: new FormControl('', Validators.required),
      descricao: new FormControl('', Validators.required)
    });
    this.requisicoes$ = this.requisicaoService.list()
      .pipe(
        map((reqs: Requisicao[]) =>
          reqs.filter(r => r.destino.nome === this.funcionarioLogado?.departamento.nome)
        )
      );
  }

  ngOnInit() {}

  setValorPadrao() {
    this.form.patchValue({
      funcionario: this.funcionarioLogado,
      dataHora: new Date()
    })
    this.movimentacoes$ = [];
  }

  add(requisicao: Requisicao) {
    this.form.reset();
    this.edit = false;
    this.setValorPadrao();
    this.requisicaoSelecionada = requisicao;
    this.movimentacoes$ = (!requisicao.movimentacoes ? [] : requisicao.movimentacoes);
    this.displayDialogMovimentacao = true;
  }

  verMovimentacoes(requisicao: Requisicao) {
    this.requisicaoSelecionada = requisicao;
    this.movimentacoes$ = requisicao.movimentacoes;
    this.displayDialogMovimentacoes = true;
  }

  save() {
    this.movimentacoes$.push(this.form.value);
    if (this.requisicaoSelecionada != null) {
      this.requisicaoSelecionada.movimentacoes = this.movimentacoes$;
      this.requisicaoSelecionada.status = this.form.controls['status'].value
      this.requisicaoSelecionada.ultimaAtualizacao = new Date();
      this.requisicaoService.createOrUpdate(this.requisicaoSelecionada)
        .then(() => {
          this.displayDialogMovimentacao = false;
          Swal.fire(`Requisição ${!this.edit ? 'salvo' : 'atualizado'} com sucesso.`, '', 'success');
        })
        .catch((erro) => {
          this.displayDialogMovimentacao = true;
          Swal.fire(`Erro ao ${!this.edit ? 'salvo' : 'atualizado'} o Requisição.`, `Detalhes: ${erro}`, 'error');
        })
      this.form.reset();
    }
  }

  delete(depto: Requisicao) {
    Swal.fire({
      title: 'Confirma a exclusão do Requisição?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if (result.value) {
        this.requisicaoService.delete(depto.id)
          .then(() => {
            Swal.fire('Requisição excluído com sucesso!', '', 'success')
          })
      }
    });
  }

  onDialogClose(event: any) {
    this.displayDialogMovimentacoes = event;
  }
}
