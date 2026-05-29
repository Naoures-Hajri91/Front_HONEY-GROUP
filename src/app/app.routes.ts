import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { Devis } from './pages/devis/devis';
import { Formation } from './pages/formation/formation'; // Import conservé de HEAD
import { Tourisme } from './pages/tourisme/tourisme';
import { ItDigital } from './pages/it-digital/it-digital';
import { TourismeCatalogue } from './pages/tourisme-catalogue/tourisme-catalogue';
import { TourismeReservation } from './pages/tourisme-reservation/tourisme-reservation';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { MonCompte } from './pages/mon-compte/mon-compte';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'mon-compte', component: MonCompte, canActivate: [authGuard] },
  { path: 'devis/:pole', component: Devis },
  { path: 'formation', component: Formation }, // Route conservée de HEAD
  { path: 'tourisme', component: Tourisme },
  { path: 'tourisme/catalogue', component: TourismeCatalogue },
  {
    path: 'tourisme/reservation/:idSession',
    component: TourismeReservation,
    canActivate: [authGuard],
  },
  { path: 'it-digital', component: ItDigital }
];