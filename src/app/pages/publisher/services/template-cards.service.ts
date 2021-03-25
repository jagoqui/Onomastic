import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TemplateCard } from '@app/shared/models/template-card.model';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { AuthService } from '@auth/services/auth.service';
import { ImageUpload } from '@shared/models/image-upload.model';

@Injectable({
  providedIn: 'root'
})
export class TemplateCardsService {

  constructor(
    private http: HttpClient,
    private authSvc: AuthService) {
  }

  newCardTemplate(card: TemplateCard, image: File): Observable<TemplateCard> {
    const cardBlob = new Blob([JSON.stringify(card)], { type: 'application/json' });
    const formData = new FormData();
    formData.append('file', image);
    formData.append('plantilla', cardBlob);
    return this.http
      .post<TemplateCard>(`${environment.apiUrl}/plantillas/${this.authSvc.getUserId()}`, formData, {
        reportProgress: true
      });
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
      .delete<any>(`${environment.apiUrl}/plantillas/${id}/${this.authSvc.getUserId()}`);
  }
}
