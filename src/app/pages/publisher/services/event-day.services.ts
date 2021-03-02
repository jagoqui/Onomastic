import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ConditionRes} from '@app/shared/models/event-day.model';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';
import {AuthService} from '@auth/services/auth.service';
import {PlatformUserResponse} from '@shared/models/platform-users.model';

@Injectable({
  providedIn: 'root'
})
export class EventDayService {

  constructor(
    private http: HttpClient,
    private authSvc: AuthService
  ) {
  }

  getConditions(): Observable<ConditionRes[]> {
    let id: number;
    this.authSvc.userResponse$.subscribe((userRes: PlatformUserResponse) => {
      if (userRes) {
        id = userRes.id;
      }
    });
    return this.http
      .get<ConditionRes[]>(`${environment.API_URL}/evento/condiciones/${id}`);
  }

}
