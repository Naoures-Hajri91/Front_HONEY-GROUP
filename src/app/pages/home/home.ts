import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Poles } from '../../services/poles';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  private poleService = inject(Poles);
  private cd = inject(ChangeDetectorRef);
  private router = inject(Router);
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

  openPole(poleName: string): void {

    const p = poleName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // 🌴 TOURISME
    if (p.includes('tour') || p.includes('eco')) {

      window.open(
        'https://www.honeygroupmadatourism.com/',
        '_blank'
      );

      return;
    }

    // 💻 IT — catalogue & devis sur le portail unifié
    if (p.includes('it') || p.includes('digital')) {
      this.router.navigate(['/it-digital']);
      return;
    }

    // 🎉 EVENT
    if (p.includes('event') || p.includes('evenementiel')) {

      window.open(
        'https://honeygroup-mg.vercel.app/',
        '_blank'
      );

      return;
    }

    // 📚 FORMATION
    this.router.navigate(['/devis', poleName]);
  }
}
