import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TemplateCard } from '@app/shared/models/template-card.model';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { EventDay } from '@shared/models/event-day.model';

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

  getAssociatedEvents(idTemplate: number): Observable<EventDay[]> {
    return this.http
      .get<EventDay[]>(`${environment.apiUrl}/evento/plantilla/${idTemplate}`);
  };
}
