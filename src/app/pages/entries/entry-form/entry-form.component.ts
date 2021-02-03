import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { switchMap } from "rxjs/operators";

import toastr from "toastr";
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry();

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuild: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buldEntryForm();
    this.loadEntry();
  }

  ngAfterContentChecked() {

    this.setPageTitle()

  }



  // PRIVATE METHODS
  private setCurrentAction() {

    if (this.route.snapshot.url[0].path == "new") {
      this.currentAction = "new"
    } else {
      this.currentAction = "edit"
    }

  }

  private buldEntryForm() {
    this.entryForm = this.formBuild.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  private loadEntry() {
    if (this.currentAction == "edit") {

      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get("id")))
      )
        .subscribe(
          (entry) => {
            this.entry = entry;
            this.entryForm.patchValue(entry)
          },
          (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
        )

    }
  }

  private setPageTitle() {
    if (this.currentAction == "new") {
      this.pageTitle = "Cadastro de Novo lançamento";
    } else {
      const entryName = this.entry.name || ""
      this.pageTitle = "Editando lançamento: " + entryName;
    }
  }



  submitForm() {
    this.submittingForm = true;

    if (this.currentAction == "new") {
      this.createEntry();
    } else {
      this.updateEntry();
    }
  }

  private updateEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value)

    this.entryService.update(entry)
      .subscribe(
        entry => { this.actionsForSucess(entry) },
        error => this.actionsForError(error)
      )
  }

  private createEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value)

    this.entryService.create(entry)
      .subscribe(
        entry => { this.actionsForSucess(entry) },
        error => this.actionsForError(error)
      )
  }

  private actionsForError(error: any) {
    toastr.error("Ocorreu um erro ao processar sua solicitação!");

    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ["Falha na comucicação com o servidor. Por favor, teste mas tarde."]
    }

  }

  private actionsForSucess(entry: Entry) {

    toastr.success("Solicitação processada com sucesso!");

    this.router.navigateByUrl("entries", { skipLocationChange: true }).then(
      () => this.router.navigate(["entries", entry.id, "edit"])
    )

  }




}
