import { Movimentacao, Requisicao } from './../../../../models/requisicao.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RequisicaoService } from 'src/app/services/requisicao.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Funcionario } from 'src/app/models/funcionario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  @Input() movimentacoes: Movimentacao[] = [];
  @Input() requisicaoSelecionada: Requisicao | null = null;
  @Input() displayDialogMovimentacoes: boolean = false;
  @Input() funcionarioLogado: Funcionario | null = null;

  @Output() displayChange = new EventEmitter();

  listaStatus: string[] = [
    'Aberto',
    'Pendente',
    'Processando',
    'Não autorizado',
    'Finalizando'
  ];
  displayDialogMovimentacao: boolean = false;
  form: FormGroup;
  edit: boolean = false;
  indexMovimentacoes: number = 0;

  constructor(
    private requisicaoService: RequisicaoService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      funcionario: new FormControl('', Validators.required),
      dataHora: new FormControl(''),
      status: new FormControl('', Validators.required),
      descricao: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  selecionarMovimento(mov: Movimentacao, index: number) {
    this.edit = true;
    this.displayDialogMovimentacao = true;
    this.form.setValue(mov);
    this.indexMovimentacoes = index;
  }

  onClose() {
    this.displayChange.emit(false);
  }

  update() {
    this.movimentacoes[this.indexMovimentacoes] = this.form.value
    if (this.requisicaoSelecionada != null) {
      this.requisicaoSelecionada.movimentacoes = this.movimentacoes;
      this.requisicaoSelecionada.status = this.form.controls['status'].value
      this.requisicaoSelecionada.ultimaAtualizacao = new Date();
      this.requisicaoService.createOrUpdate(this.requisicaoSelecionada)
        .then(() => {
          this.displayDialogMovimentacao = false;
          Swal.fire(`Movimentação ${!this.edit ? 'salvo' : 'atualizado'} com sucesso.`, '', 'success');
        })
        .catch((erro) => {
          this.displayDialogMovimentacao = true;
          Swal.fire(`Erro ao ${!this.edit ? 'salvo' : 'atualizado'} o Movimentação.`, `Detalhes: ${erro}`, 'error');
        })
      this.form.reset()
    }
  }

  remove(array: any[], element: any) {
    return array.filter(el => el !== element);
  }

  delete(mov: Movimentacao) {
    const movs = this.remove(this.movimentacoes, mov)
    Swal.fire({
      title: 'Confirma a exclusão da Movimentação?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if (result.value && this.requisicaoSelecionada != null) {
        this.requisicaoSelecionada.movimentacoes = movs;
        this.requisicaoService.createOrUpdate(this.requisicaoSelecionada)
          .then(() => {
            Swal.fire('Movimentação excluída com sucesso!', '', 'success')
            this.movimentacoes = movs;
          })
      }
    })
  }

}
