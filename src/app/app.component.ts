import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from './app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Welcome to Big Al\'s';  //backward slash, Apostrophe
  languages = [
    {show: 'English', value: 'en'},
    {show: 'French', value: 'fr'},
    {show: 'Chinese', value: 'cn'},
  ];
  selectedLang?: string = 'en';

  openedSidenav = false;

  isLoading$?: Observable<boolean>;

  isLoading: boolean;

  constructor(
    public translate: TranslateService,
    private authService: AuthService,
    private appStore: Store<{app:AppState}>
  ) {
    translate.addLangs(['en', 'fr', 'cn']);
    translate.setDefaultLang('en');
    this.authService.initAuthListener();
    this.isLoading$ = this.appStore.select(state => state.app.isLoading).pipe(
      tap(resp => console.log(resp))
    );
  }

  switchLang(value: any) {
    console.log(value);
    this.translate.use(value);
    this.selectedLang = value;
  }

  onToggleSidenav() {

  }

  onLogout() {
    //this.authService.logout();
  }
}
