import { AuthGuard } from './auth/auth.guard';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { TrainingComponent } from './training/training.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path:'signup', component: SignupComponent},
  {path:'login', component: LoginComponent},
  //{path:'training', component: TrainingComponent},
  // {path:'training', component: TrainingComponent, canActivate:[AuthGuard]},
  { path: 'training', loadChildren: () => import('./training/training.module').then(m => m.TrainingModule), canActivate:[AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]  //!!!!!!!!
})
export class AppRoutingModule { }
