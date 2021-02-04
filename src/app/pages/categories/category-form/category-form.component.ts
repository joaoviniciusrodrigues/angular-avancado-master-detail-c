import { Component, Injector } from '@angular/core';
import { Validators } from "@angular/forms";
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';

import { Category } from '../shared/categories.model';
import { CategoryService } from '../shared/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent extends BaseResourceFormComponent<Category> {

  constructor(
    protected categoryService: CategoryService,
    protected injector: Injector
  ) {

    super(injector, new Category(), categoryService, Category.fromJosn)
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuild.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  protected creationPageTitle(): string {
    return "Cadastro de Nova Categoria"
  }

  protected edtionPageTitle(): string {
    const categoryName = this.resource.name || "";
    
    return "Cadastro de Nova Categoria: " + categoryName;
  }










}
