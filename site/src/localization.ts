export const languageStorageKey = 'd4b-data-language';
const terms: Record<string, [string, string]> = {
  general: ['Usage général', 'General purpose'], compute: ['Calcul', 'Compute'], storage: ['Stockage', 'Storage'],
  accelerated: ['Calcul accéléré', 'Accelerated computing'], performance: ['Haute performance', 'High performance'],
  memory: ['Mémoire', 'Memory'], encoding: ['Encodage', 'Encoding'],
  gpu: ['GPU', 'GPU'], fpga: ['FPGA', 'FPGA'], asic: ['ASIC', 'ASIC'],

  Bioenergy: ['Bioénergie', 'Bioenergy'], Coal: ['Charbon', 'Coal'], Gas: ['Gaz', 'Gas'],
  Hydro: ['Hydraulique', 'Hydro'], Nuclear: ['Nucléaire', 'Nuclear'],
  'Other Fossil': ['Autres énergies fossiles', 'Other fossil fuels'],
  'Other Renewables': ['Autres énergies renouvelables', 'Other renewables'],
  Solar: ['Solaire', 'Solar'], Wind: ['Éolien', 'Wind'],
  computer: ['Ordinateur', 'Computer'], desktop_personal: ['Ordinateur de bureau personnel', 'Personal desktop'],
  desktop_professional: ['Ordinateur de bureau professionnel', 'Professional desktop'],
  laptop: ['Ordinateur portable', 'Laptop'], mobile: ['Appareil mobile', 'Mobile device'],
  network_fixed: ['Réseau fixe', 'Fixed network'], network_mobile: ['Réseau mobile', 'Mobile network'],
  screen: ['Écran', 'Screen'], smartphone: ['Smartphone', 'Smartphone'], tablet: ['Tablette', 'Tablet'],
  vm_large: ['Grande machine virtuelle', 'Large virtual machine'], vm_medium: ['Machine virtuelle moyenne', 'Medium virtual machine'],
  vm_small: ['Petite machine virtuelle', 'Small virtual machine'],
  text: ['Texte', 'Text'], speech: ['Parole', 'Speech'], image: ['Image', 'Image'],
  embedding: ['Représentation vectorielle', 'Embedding'], video: ['Vidéo', 'Video'],
  ranking: ['Classement', 'Ranking'], vision: ['Vision', 'Vision'], transcription: ['Transcription', 'Transcription'],
  safety: ['Sécurité', 'Safety'], audio: ['Audio', 'Audio'], code: ['Code', 'Code'], document: ['Document', 'Document'],
  score: ['Score', 'Score'], dense: ['Dense', 'Dense'], moe: ['Mélange d’experts (MoE)', 'Mixture of experts (MoE)'],
};
export function termLabel(value: string, lang: string): string {
  return terms[value]?.[lang === 'fr' ? 0 : 1] || value;
}
export function regionLabel(code: string, fallback: string, lang: string): string {
  if (/^[A-Z]{2}$/.test(code)) {
    try { return new Intl.DisplayNames([lang], { type: 'region' }).of(code) || fallback; } catch {}
  }
  const continents: Record<string, string> = { Africa: 'Afrique', Asia: 'Asie', Europe: 'Europe', 'North America': 'Amérique du Nord', 'South America': 'Amérique du Sud', Oceania: 'Océanie', Antarctica: 'Antarctique', World: 'Monde' };
  return lang === 'fr' ? continents[fallback] || fallback : fallback;
}
