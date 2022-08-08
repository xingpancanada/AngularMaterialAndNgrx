import { AuthService } from './../../auth/auth.service';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.scss']
})
export class NavHeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>();

  languages = [
    {show: 'English', value: 'en'},
    {show: 'French', value: 'fr'},
    {show: 'Chinese', value: 'cn'},
  ];
  selectedLang?: string = 'en';

  openedSidenav = false;

  isAuth?: boolean;
  authSub?: Subscription;

  constructor(
    public translate: TranslateService,
    private authService: AuthService
  ) {
    translate.addLangs(['en', 'fr', 'cn']);
    translate.setDefaultLang('en');
  }


  ngOnInit(): void {
    this.authSub = this.authService.authChangeSj.subscribe(resp => {
      this.isAuth = resp;
    });
  }

  switchLang(value: any) {
    console.log(value);
    this.translate.use(value);
    this.selectedLang = value;
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if(this.authSub){
      this.authSub.unsubscribe();
    }
  }
}
