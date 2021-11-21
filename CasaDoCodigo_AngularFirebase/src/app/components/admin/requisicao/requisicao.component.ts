import { FuncionarioService } from './../../../services/funcionario.service';
import { Funcionario } from 'src/app/models/funcionario.model';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Requisicao } from 'src/app/models/requisicao.model';
import { Departamento } from 'src/app/models/departamento.model';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RequisicaoService } from 'src/app/services/requisicao.service';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-requisicao',
  templateUrl: './requisicao.component.html',
  styleUrls: ['./requisicao.component.css']
})
export class RequisicaoComponent implements OnInit {

  requisicoes$: Observable<Requisicao[]> | null = null;
  departamentos$: Observable<Departamento[]> | null = null;
  edit: boolean = false;
  displayDialogRequisicoes: boolean = false;
  form: FormGroup;
  funcionarioLogado: Funcionario | null = null;

  constructor(
    private requisicoesService: RequisicaoService,
    private departamentoService: DepartamentoService,
    private auth: AuthenticationService,
    private funcionarioService: FuncionarioService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id: new FormControl(),
      destino: new FormControl('', Validators.required),
      solicitante: new FormControl(''),
      dataAbertura: new FormControl(''),
      ultimaAtualizacao: new FormControl(''),
      status: new FormControl(''),
      descricao: new FormControl('', Validators.required),
      movimentacoes: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.departamentos$ = this.departamentoService.list();
    this.recuperarFuncionario();
  }

  async recuperarFuncionario() {
    this.auth.authUser()
      .subscribe(dados => {
        if (dados?.email != null && dados?.email != undefined) {
          this.funcionarioService.getFuncionarioLogado(dados?.email)
          .subscribe(funcionarios => {
            this.funcionarioLogado = funcionarios[0];
            if (this.funcionarioLogado != null) {
              this.requisicoes$ = this.requisicoesService.list()
              .pipe(map((reqs: Requisicao[]) => reqs.filter(r => r.solicitante.email === this.funcionarioLogado?.email)));
            }
          });
        }
      });
  }

  add() {
    this.form.reset();
    this.edit = false;
    this.displayDialogRequisicoes = true;
    this.setValorPadrao();
  }

  setValorPadrao() {
    this.form.patchValue({
      solicitante: this.funcionarioLogado,
      status: 'Aberto',
      dataAbertura: new Date(),
      ultimaAtualizacao: new Date(),
      movimentacoes: []
    })
  }

  selecionaRequisicao(func: Requisicao) {
    this.edit = true;
    this.displayDialogRequisicoes = true;
    this.form.setValue(func);
  }

  save() {
    this.requisicoesService.createOrUpdate(this.form.value)
      .then(() => {
        this.displayDialogRequisicoes = false;
        Swal.fire(`Requisição ${!this.edit ? 'salvo' : 'atualizado'} com sucesso.`, '', 'success')
        this.displayDialogRequisicoes = false;
      })
      .catch((erro) => {
        this.displayDialogRequisicoes = true;
        Swal.fire(`Erro ao ${!this.edit ? 'salvo' : 'atualizado'} o Requisição.`, `Detalhes: ${erro}`, 'error')
      })
    this.form.reset()
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
        this.requisicoesService.delete(depto.id)
          .then(() => {
            Swal.fire('Requisição excluído com sucesso!', '', 'success')
          })
      }
    })
  }

}
