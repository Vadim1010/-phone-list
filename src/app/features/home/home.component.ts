import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Phone } from './phone.model';

@Component({
  selector: 'tl-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public phoneList$: Observable<Phone[]>;
  public chang: number = 0;

  private URL: string = 'telephones';
  private subscriptions: Subscription[] = [];

  constructor(private http: HttpClient) {
  }

  public ngOnInit(): void {
    this.getPhoneList();
  }

  public ngOnDestroy(): void {
    if (this.subscriptions.length) {
      this.subscriptions.forEach((elem: Subscription): void => {
        elem.unsubscribe();
      });
    }
  }

  public addPhoneNumber(phoneItem: Phone): void {
    this.subscriptions.push(this.http.post<Phone>(this.URL, phoneItem)
      .subscribe(
        () => this.getPhoneList()
      )
    );
  }

  public deleteItem(id: number): void {
    this.subscriptions.push(this.http.delete(`${this.URL}/${id}`)
      .subscribe(() => {
        this.getPhoneList();
      })
    );
  }

  public changItem(id: number, item: Phone): void {
    this.subscriptions.push(this.http.put(`${this.URL}/${id}`, item)
      .subscribe(() => {
        this.getPhoneList();
        this.chang = 0;
      })
    );
  }

  public changShow(id: number = 0): void {
    if (id === this.chang) {
      id = 0;
    }

    this.chang = id;
  }

  private getPhoneList(): void {
    this.phoneList$ = this.http.get<Phone[]>(this.URL);
  }
}
