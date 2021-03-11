import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plantilla, TemplateCard } from '@app/shared/models/template-card.model';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { EmailUsersService } from '@pages/¨publisher/services/email-users.service';
import { AuthService } from '@auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TemplateCardsService {

  constructor(
    private http: HttpClient,
    private authSvc: AuthService) {
  }

  newCardTemplate(plantilla: Plantilla, image: File): Observable<TemplateCard> {
    const cardBlob = new Blob([JSON.stringify(plantilla)], { type: 'application/json' });
    console.log(plantilla.texto, cardBlob);

    const formData = new FormData();
    formData.append('file', image);
    formData.append('plantilla', cardBlob);
    return this.http
      .post<TemplateCard>(`${environment.apiUrl}/plantillas/${this.authSvc.getUserId()}`, formData, {
        reportProgress: true
      });
  }

  getAllCards(): Observable<Plantilla[]> {
    return this.http
      .get<Plantilla[]>(`${environment.apiUrl}/plantillas`);
  }

  delete(id: number): Observable<any> {
    return this.http
      .delete<any>(`${environment.apiUrl}/plantillas/${id}/${this.authSvc.getUserId()}`);
  }
}
