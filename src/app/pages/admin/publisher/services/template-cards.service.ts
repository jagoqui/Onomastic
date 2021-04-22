import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { TemplateCard } from '@adminShared/models/template-card.model';
import { EventDay } from '@adminShared/models/event-day.model';

@Injectable({
  providedIn: 'root'
})
export class TemplateCardsService {

  constructor(
    private http: HttpClient) {
  }

  saveTemplateCard(card: TemplateCard): Observable<TemplateCard> {
    const cardBlob = new Blob([JSON.stringify(card)], { type: 'application/json' });
    const formData = new FormData();
    formData.append('plantilla', cardBlob);
    return this.http
      .post<TemplateCard>(`${environment.apiUrl}/plantillas`, formData);
  }

  getAllCards(): Observable<TemplateCard[]> {
    return this.http
      .get<TemplateCard[]>(`${environment.apiUrl}/plantillas`);
  }

  getCardById(id: number): Observable<TemplateCard> {
    return this.http
      .get<TemplateCard>(`${environment.apiUrl}/plantillas/${id}`);
  }

  delete(id: number): Observable<any> {
    return this.http
      .delete<any>(`${environment.apiUrl}/plantillas/${id}`);
  }
}
