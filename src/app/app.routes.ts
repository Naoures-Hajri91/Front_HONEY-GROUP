import { Routes } from '@angular/router';
import {Home} from './pages/home/home';
import {Register} from './pages/register/register';
import {Login} from './pages/login/login';
import {Devis} from './pages/devis/devis';
import {Tourisme} from './pages/tourisme/tourisme';
import {ItDigital} from './pages/it-digital/it-digital';
import { TourismeCatalogue } from './pages/tourisme-catalogue/tourisme-catalogue';
import { TourismeReservation } from './pages/tourisme-reservation/tourisme-reservation';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'devis/:pole', component: Devis },
  { path: 'tourisme', component: Tourisme },
  { path: 'tourisme/catalogue', component: TourismeCatalogue},
  { path: 'tourisme/reservation/:idSession', component: TourismeReservation },
  { path: 'it-digital', component: ItDigital }
];
