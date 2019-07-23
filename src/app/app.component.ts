import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { map, catchError } from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  formEndereco = new FormGroup({
    cep: new FormControl('', [
      Validators.required
      ,Validators.minLength(8)
      ,Validators.maxLength(8)
      ,Validators.pattern('[0-9]{8}')
    ],
    this.validaCEP.bind(this)
    )
    ,logradouro: new FormControl({value: '', disabled: true})
    ,complemento: new FormControl({value: '', disabled: true})
    ,bairro: new FormControl({value: '', disabled: true})
    ,localidade: new FormControl({value: '', disabled: true})
    ,uf: new FormControl({value: '', disabled: true})
  })

  endereco = false;
  erro = "";

  constructor(private http: HttpClient) {}

  validaCEP(control: AbstractControl){

    return this
            .http
            .get(`https://viacep.com.br/ws/${control.value}/json/`)
            .pipe(
              map((response: any )=>{
                if(response.erro) {
                  return {cepInvalido: response.erro}
                }
                return null
              })
              ,catchError(
                (response: HttpErrorResponse) => [{cepInvalido: !response.ok}]
              )
            )

  }

  consultar(){

    const cep = this.formEndereco.get('cep').value;

    if(this.formEndereco.invalid){
      this.formEndereco.markAllAsTouched();
      return
    }

    this.http
        .get(`https://viacep.com.br/ws/${cep}/json/`)
        .subscribe(
          (dados: Endereco) => {

            //console.log(dados);

            if(dados.erro) {
              this.erro = `CEP ${cep} não encontrado!`;
              return
            }

            if(this.erro) this.erro = "";

            this.formEndereco.patchValue(dados);
            this.endereco = true;
          },
          erro => {
            //console.error(erro)
            this.formEndereco.reset();
            this.erro = "Erro no CEP, o mesmo deve conter apenas 8 números"
          }
        )
  }
}

class Endereco {

  cep = "";
  logradouro = "";
  complemento = "";
  bairro = "";
  localidade = "";
  uf = "";
  unidade = "";
  ibge = "";
  gia = "";
  erro = "";

}
