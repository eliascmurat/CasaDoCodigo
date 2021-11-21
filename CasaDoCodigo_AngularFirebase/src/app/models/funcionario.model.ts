import { Model } from "../core/model";
import { Departamento } from "./departamento.model";

export class Funcionario extends Model{
  nome: string = '';
  funcao: string = '';
  email: string = '';
  ultimoAcesso: any;
  departamento: Departamento = new Departamento();
}
