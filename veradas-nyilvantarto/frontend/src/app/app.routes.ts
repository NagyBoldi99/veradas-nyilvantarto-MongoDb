import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { LocationsComponent } from './locations/locations.component';
import { DonorsComponent } from './donors/donors.component';
import { DonationsComponent } from './donations/donations.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  { path: 'locations', component: LocationsComponent },
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'donors', component: DonorsComponent },
  { path: 'donations', component: DonationsComponent },

];

export const appRouterProviders = [provideRouter(routes)];
