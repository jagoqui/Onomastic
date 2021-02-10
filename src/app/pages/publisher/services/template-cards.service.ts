import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TemplateCard } from '@app/shared/models/template-card.model';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateCardsService {

  constructor(private http: HttpClient) { }

  newCardTemplate(formData: FormData): Observable<TemplateCard> {
    return this.http
      .post<TemplateCard>(`${environment.API_URL}/plantillas`, formData, {
        reportProgress: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
  }
}
