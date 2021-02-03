import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  TemplateCard,
  TemplateCardResponse,
} from '@app/shared/models/template-card.model';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateCardsService {

  constructor(private http: HttpClient) { }

  newCardTemplate(card: TemplateCard): Observable<TemplateCardResponse> {
    // const file: FormData = new FormData();
    // file.append('file', 'test');
    return this.http
      .post<TemplateCardResponse>(`${environment.API_URL}/plantillas`, card.backgroundImage, {
        reportProgress: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          id: '1',
          texto: card.htmlContent,
        }
      });
  }
}
