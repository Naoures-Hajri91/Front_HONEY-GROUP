export interface PoleDto {
  id?: number;
  id_pole?: number;
  nom?: string;
  nom_pole?: string;
}

function poleNom(p: PoleDto): string {
  return (p.nom || p.nom_pole || '').toLowerCase();
}

export function getPoleId(poles: PoleDto[], keywords: string[]): number | null {
  const pole = poles.find((p) => keywords.some((k) => poleNom(p).includes(k)));
  if (!pole) {
    return null;
  }
  return pole.id ?? pole.id_pole ?? null;
}

export function getTourismePoleId(poles: PoleDto[]): number | null {
  return getPoleId(poles, ['eco', 'tourisme']);
}

export function getItPoleId(poles: PoleDto[]): number | null {
  return getPoleId(poles, ['it', 'digital']);
}
