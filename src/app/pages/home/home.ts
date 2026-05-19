import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { Poles } from '../../services/poles';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Header,
    Footer,
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  private poleService = inject(Poles);
  private cd = inject(ChangeDetectorRef);

  poles: any[] = [];

  ngOnInit(): void {

    this.poleService.getAllPoles().subscribe(data => {

      this.poles = data ?? [];

      // 🔥 force refresh UI (évite NG0100 + image non affichée)
      this.cd.detectChanges();
    });
  }

  // ✅ version robuste (évite problème de casse / espaces API)
  getImage(nom: string): string {

    const clean = nom?.trim().toLowerCase();

    switch (clean) {

      case 'it & digital':
        return 'assets/images/it.png';

      case 'ecotourisme':
        return 'assets/images/tourisme.png';

      case 'événementiel':
        return 'assets/images/event.png';

      case 'formation':
        return 'assets/images/formation.png';

      default:
        return 'assets/images/default.png';
    }
  }

  getIcon(nom: string): string {

    const clean = nom?.trim().toLowerCase();

    switch (clean) {

      case 'it & digital': return '💻';
      case 'ecotourisme': return '🌍';
      case 'événementiel': return '📅';
      case 'formation': return '🎓';

      default: return '⭐';
    }
  }
}
