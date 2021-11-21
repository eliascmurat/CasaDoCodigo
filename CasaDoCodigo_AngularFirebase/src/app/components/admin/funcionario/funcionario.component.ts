import { DepartamentoService } from './../../../services/departamento.service';
import { FuncionarioService } from './../../../services/funcionario.service';
import { Departamento } from 'src/app/models/departamento.model';
import { Observable } from 'rxjs';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Funcionario } from 'src/app/models/funcionario.model';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.css']
})
export class FuncionarioComponent implements OnInit {

  funcionarios$: Observable<Funcionario[]>;
  departamentos$: Observable<Departamento[]>;
  departamentoFiltro: string = 'TODOS';
  edit: boolean = false;
  displayDialogFuncionario: boolean = false;
  form: FormGroup;

  @ViewChild('inputFile', { static: false }) inputFile: ElementRef | null = null;
  uploadPercent: Observable<any> | null = null;
  downloadURL: Observable<string> | null = null;
  task: AngularFireUploadTask | null = null;
  complete: boolean = false;

  constructor(
    private storage: AngularFireStorage,
    private funcionarioService: FuncionarioService,
    private departamentoService: DepartamentoService,
    private fb: FormBuilder
  ) {
    this.funcionarios$ = this.funcionarioService.list();
    this.departamentos$ = this.departamentoService.list();
    this.form = this.fb.group({
      id: new FormControl(),
      nome: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      funcao: new FormControl(''),
      departamento: new FormControl('', Validators.required),
      foto: new FormControl()
    });
  }

  ngOnInit() {}

  add() {
    this.form.reset();
    this.edit = false;
    this.displayDialogFuncionario = true;
  }

  selecionaFuncionario(func: Funcionario) {
    this.edit = true;
    this.displayDialogFuncionario = true;
    this.form.setValue(func);
  }

  save() {
    this.funcionarioService.createOrUpdate(this.form.value)
      .then(() => {
        this.displayDialogFuncionario = false;
        Swal.fire(`Funcionário ${!this.edit ? 'salvo' : 'atualizado'} com sucesso.`, '', 'success')
        this.displayDialogFuncionario = false;
      })
      .catch((erro) => {
        this.displayDialogFuncionario = true;
        Swal.fire(`Erro ao ${!this.edit ? 'salvo' : 'atualizado'} o Funcionário.`, `Detalhes: ${erro}`, 'error')
      })
    this.form.reset()
  }

  delete(depto: Funcionario) {
    Swal.fire({
      title: 'Confirma a exclusão do Funcionário?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if (result.value) {
        this.funcionarioService.delete(depto.id)
          .then(() => {
            Swal.fire('Funcionario excluído com sucesso!', '', 'success')
          })
      }
    })
  }

  async upload(event: any) {
    this.complete = false;
    const file = event.target.files[0];
    const path = `funcionarios/${new Date().getTime().toString()}`;
    const fileRef = this.storage.ref(path);
    this.task = this.storage.upload(path, file);
    this.task.then(up => {
      fileRef.getDownloadURL().subscribe(url => {
        this.complete = true;
        this.form.patchValue({
          foto: url
        })
      });
    });
    this.uploadPercent = this.task.percentageChanges();
    if (this.inputFile != null) {
      this.inputFile.nativeElement.value = '';
    }
  }

}
