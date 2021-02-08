import { Injectable, Injector } from '@angular/core';

import { Observable } from "rxjs";
import { catchError, flatMap, map } from "rxjs/operators";
import { Entry } from './entry.model';
import { CategoryService } from '../../categories/shared/category.service';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';

import * as moment from "moment";


@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry>{

  constructor(protected injector: Injector, private categoryService: CategoryService) {
    super("api/entries", injector, Entry.fromJosn);
  }


  create(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.create.bind(this));
  }

  update(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.update.bind(this));
  }

  private setCategoryAndSendToServer(entry: Entry, sendFn: any): Observable<Entry> {

    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;

        return sendFn(entry);

      }),
      catchError(this.handleError)
    )

  }
  getByMonthAndYear(month: number, year: number): Observable<Entry[]> {
    return this.getAll().pipe(
      map(entries => this.filterByMothAndYear(entries, month, year))
    )
  }

  private filterByMothAndYear(entries: Entry[], month: number, year: number) {
    return entries.filter(entry => {
      const entryData = moment(entry.date, 'DD/MM/YYYY');
      const mothMatches = entryData.month() + 1 == month;
      const yearMatches = entryData.year() == year;

      if (mothMatches && yearMatches) {          
        return entry 
      };
    })

  }


}
