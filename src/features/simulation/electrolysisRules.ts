/**
 * Chemical Rules Engine for Electrolysis Simulation
 * Based on Kurikulum Merdeka Fase F Kimia SMA Kelas 12
 */

export type ElectrolyteId =
  | 'cuso4'
  | 'nacl_aq'
  | 'agno3'
  | 'h2so4'
  | 'ki'
  | 'znso4'
  | 'niso4'
  | 'aucl3'
  | 'nacl_molten';

export type ElectrodeId = 'C' | 'Pt' | 'Au' | 'Cu' | 'Zn' | 'Ag' | 'Fe';

export interface ElectrolyteInfo {
  id: ElectrolyteId;
  name: string;
  formula: string;
  phase: 'aq' | 'molten';
  color: string; // CSS color string for the solution
  textColor: string;
  cations: { formula: string; charge: number; color: string }[];
  anions: { formula: string; charge: number; color: string }[];
  description: string;
}

export interface ElectrodeInfo {
  id: ElectrodeId;
  name: string;
  symbol: string;
  isInert: boolean;
  color: string;
  highlightColor: string;
  description: string;
}

export interface ElectrolysisReactionResult {
  cathodeReaction: string;
  cathodeReactionType: 'metal_deposition' | 'gas_evolution';
  cathodeProduct: string;
  cathodeVisualNote: string;
  cathodeDepositColor?: string; // e.g. '#b45309' for copper
  cathodeGasType?: 'H2' | null;

  anodeReaction: string;
  anodeReactionType: 'anode_dissolution' | 'halogen_gas' | 'oxygen_gas';
  anodeProduct: string;
  anodeVisualNote: string;
  anodeGasType?: 'Cl2' | 'O2' | 'I2' | null;
  anodeErosion: boolean;

  totalReaction: string;
  solutionObservation: string;
  industrialApplicationNote?: string;
}

export const ELECTROLYTES: Record<ElectrolyteId, ElectrolyteInfo> = {
  cuso4: {
    id: 'cuso4',
    name: 'Larutan Tembaga(II) Sulfat',
    formula: 'CuSO₄ (aq)',
    phase: 'aq',
    color: 'rgba(14, 165, 233, 0.45)', // Sky blue
    textColor: '#0284c7',
    cations: [{ formula: 'Cu²⁺', charge: 2, color: '#0284c7' }],
    anions: [{ formula: 'SO₄²⁻', charge: -2, color: '#64748b' }],
    description: 'Larutan berwarna biru cerah mengandung kation Cu²⁺ dan anion oksi SO₄²⁻.',
  },
  nacl_aq: {
    id: 'nacl_aq',
    name: 'Larutan Natrium Klorida (Brine)',
    formula: 'NaCl (aq)',
    phase: 'aq',
    color: 'rgba(224, 242, 254, 0.4)', // Crystal clear with light blue tint
    textColor: '#0369a1',
    cations: [{ formula: 'Na⁺', charge: 1, color: '#8b5cf6' }],
    anions: [{ formula: 'Cl⁻', charge: -1, color: '#10b981' }],
    description: 'Larutan garam dapur bening. Na⁺ logam aktif, Cl⁻ ion halida reaktif.',
  },
  agno3: {
    id: 'agno3',
    name: 'Larutan Perak Nitrat',
    formula: 'AgNO₃ (aq)',
    phase: 'aq',
    color: 'rgba(241, 245, 249, 0.5)', // Clear silvery
    textColor: '#475569',
    cations: [{ formula: 'Ag⁺', charge: 1, color: '#94a3b8' }],
    anions: [{ formula: 'NO₃⁻', charge: -1, color: '#64748b' }],
    description: 'Larutan bening perak nitrat, ion Ag⁺ sangat mudah direduksi menjadi perak murni.',
  },
  h2so4: {
    id: 'h2so4',
    name: 'Larutan Asam Sulfat Encer',
    formula: 'H₂SO₄ (aq)',
    phase: 'aq',
    color: 'rgba(238, 242, 255, 0.45)', // Clear light indigo
    textColor: '#4338ca',
    cations: [{ formula: 'H⁺', charge: 1, color: '#3b82f6' }],
    anions: [{ formula: 'SO₄²⁻', charge: -2, color: '#64748b' }],
    description: 'Larutan elektrolit asam kuat penghantar listrik tinggi; sumber proton H⁺.',
  },
  ki: {
    id: 'ki',
    name: 'Larutan Kalium Iodida',
    formula: 'KI (aq)',
    phase: 'aq',
    color: 'rgba(254, 240, 138, 0.45)', // Pale yellowish
    textColor: '#a16207',
    cations: [{ formula: 'K⁺', charge: 1, color: '#a855f7' }],
    anions: [{ formula: 'I⁻', charge: -1, color: '#eab308' }],
    description: 'Larutan bening kekuningan. Oksidasi menghasilkan iodin I₂ kecokelatan.',
  },
  znso4: {
    id: 'znso4',
    name: 'Larutan Seng Sulfat',
    formula: 'ZnSO₄ (aq)',
    phase: 'aq',
    color: 'rgba(248, 250, 252, 0.45)', // Clear
    textColor: '#475569',
    cations: [{ formula: 'Zn²⁺', charge: 2, color: '#64748b' }],
    anions: [{ formula: 'SO₄²⁻', charge: -2, color: '#64748b' }],
    description: 'Larutan garam seng bening digunakan dalam proses galvanisasi elektro.',
  },
  niso4: {
    id: 'niso4',
    name: 'Larutan Nikel Sulfat',
    formula: 'NiSO₄ (aq)',
    phase: 'aq',
    color: 'rgba(110, 231, 183, 0.45)', // Bright emerald green
    textColor: '#047857',
    cations: [{ formula: 'Ni²⁺', charge: 2, color: '#059669' }],
    anions: [{ formula: 'SO₄²⁻', charge: -2, color: '#64748b' }],
    description: 'Larutan hijau zamrud khas ion Ni²⁺; larutan utama pelapisan nikel.',
  },
  aucl3: {
    id: 'aucl3',
    name: 'Larutan Emas(III) Klorida',
    formula: 'AuCl₃ (aq)',
    phase: 'aq',
    color: 'rgba(253, 224, 71, 0.5)', // Golden yellow
    textColor: '#ca8a04',
    cations: [{ formula: 'Au³⁺', charge: 3, color: '#eab308' }],
    anions: [{ formula: 'Cl⁻', charge: -1, color: '#10b981' }],
    description: 'Larutan emas kuning keemasan, digunakan untuk penyepuhan perhiasan mewah.',
  },
  nacl_molten: {
    id: 'nacl_molten',
    name: 'Lelehan NaCl Cair (Tanpa Air, 801 °C)',
    formula: 'NaCl (l)',
    phase: 'molten',
    color: 'rgba(254, 215, 170, 0.65)', // Warm glowing molten orange
    textColor: '#c2410c',
    cations: [{ formula: 'Na⁺(l)', charge: 1, color: '#ea580c' }],
    anions: [{ formula: 'Cl⁻(l)', charge: -1, color: '#16a34a' }],
    description: 'Lelehan ionik murni bersuhu tinggi bebas pelarut air; prinsip Proses Downs.',
  },
};

export const ELECTRODES: Record<ElectrodeId, ElectrodeInfo> = {
  C: {
    id: 'C',
    name: 'Karbon / Grafit',
    symbol: 'C (Grafit)',
    isInert: true,
    color: '#334155', // Slate dark
    highlightColor: '#475569',
    description: 'Inert (tidak ikut bereaksi). Konduktor listrik andal dan murah.',
  },
  Pt: {
    id: 'Pt',
    name: 'Platina',
    symbol: 'Pt',
    isInert: true,
    color: '#94a3b8', // Silver platinum
    highlightColor: '#cbd5e1',
    description: 'Inert standar laboratorium. Tahan terhadap oksidasi asam pekat.',
  },
  Au: {
    id: 'Au',
    name: 'Emas',
    symbol: 'Au',
    isInert: true,
    color: '#eab308', // Shiny gold
    highlightColor: '#fde047',
    description: 'Inert mulia dengan potensial reduksi sangat tinggi.',
  },
  Cu: {
    id: 'Cu',
    name: 'Tembaga',
    symbol: 'Cu',
    isInert: false,
    color: '#b45309', // Copper reddish-orange
    highlightColor: '#d97706',
    description: 'Elektroda aktif. Jika dijadikan anode, tembaga akan teroksidasi melarut.',
  },
  Zn: {
    id: 'Zn',
    name: 'Seng',
    symbol: 'Zn',
    isInert: false,
    color: '#64748b', // Slate zinc
    highlightColor: '#94a3b8',
    description: 'Elektroda aktif dengan kecenderungan oksidasi kuat.',
  },
  Ag: {
    id: 'Ag',
    name: 'Perak',
    symbol: 'Ag',
    isInert: false,
    color: '#cbd5e1', // Silver white
    highlightColor: '#e2e8f0',
    description: 'Elektroda aktif perak untuk pelapisan sendok/perhiasan (electroplating).',
  },
  Fe: {
    id: 'Fe',
    name: 'Besi',
    symbol: 'Fe',
    isInert: false,
    color: '#475569', // Iron metallic
    highlightColor: '#64748b',
    description: 'Elektroda aktif besi mudah mengalami oksidasi.',
  },
};

/**
 * Calculates electrochemical reaction products and observations
 */
export function calculateElectrolysisReactions(
  electrolyteId: ElectrolyteId,
  cathodeId: ElectrodeId,
  anodeId: ElectrodeId
): ElectrolysisReactionResult {
  const electrolyte = ELECTROLYTES[electrolyteId];
  const anode = ELECTRODES[anodeId];

  // 1. REAKSI KATODA (REDUKSI)
  let cathodeReaction = '';
  let cathodeReactionType: 'metal_deposition' | 'gas_evolution' = 'gas_evolution';
  let cathodeProduct = '';
  let cathodeVisualNote = '';
  let cathodeDepositColor: string | undefined = undefined;
  let cathodeGasType: 'H2' | null = null;

  if (electrolyte.phase === 'molten') {
    // Lelehan NaCl -> Na+ langsung direduksi
    cathodeReaction = 'Na⁺(l) + e⁻ → Na(l)';
    cathodeReactionType = 'metal_deposition';
    cathodeProduct = 'Logam Natrium cair (Na)';
    cathodeVisualNote = 'Terbentuk cairan logam natrium (Na) mengapung di permukaan katoda.';
    cathodeDepositColor = '#facc15';
  } else {
    // Larutan berair
    switch (electrolyteId) {
      case 'cuso4':
        cathodeReaction = 'Cu²⁺(aq) + 2e⁻ → Cu(s)';
        cathodeReactionType = 'metal_deposition';
        cathodeProduct = 'Endapan Tembaga murni (Cu)';
        cathodeVisualNote = 'Batang katoda terlapisi endapan logam tembaga merah kecokelatan yang semakin menebal.';
        cathodeDepositColor = '#b45309';
        break;

      case 'nacl_aq':
        cathodeReaction = '2H₂O(l) + 2e⁻ → H₂(g) + 2OH⁻(aq)';
        cathodeReactionType = 'gas_evolution';
        cathodeProduct = 'Gas Hidrogen (H₂) + Ion OH⁻ (Basa)';
        cathodeVisualNote = 'Muncul gelembung-gelembung gas tak berwarna (H₂) dengan cepat di permukaan katoda. Daerah sekitar katoda bersifat basa.';
        cathodeGasType = 'H2';
        break;

      case 'agno3':
        cathodeReaction = 'Ag⁺(aq) + e⁻ → Ag(s)';
        cathodeReactionType = 'metal_deposition';
        cathodeProduct = 'Endapan Perak berkilau (Ag)';
        cathodeVisualNote = 'Batang katoda terlapisi kristal perak (Ag) putih berkilau yang menempel rapat.';
        cathodeDepositColor = '#e2e8f0';
        break;

      case 'h2so4':
        cathodeReaction = '2H⁺(aq) + 2e⁻ → H₂(g)';
        cathodeReactionType = 'gas_evolution';
        cathodeProduct = 'Gas Hidrogen (H₂)';
        cathodeVisualNote = 'Pelepasan gas hidrogen (H₂) deras berupa gelembung-gelembung naik ke permukaan katoda.';
        cathodeGasType = 'H2';
        break;

      case 'ki':
        cathodeReaction = '2H₂O(l) + 2e⁻ → H₂(g) + 2OH⁻(aq)';
        cathodeReactionType = 'gas_evolution';
        cathodeProduct = 'Gas Hidrogen (H₂) + Ion OH⁻';
        cathodeVisualNote = 'Gelembung gas H₂ terbentuk aktif di katoda; larutan sekitar katoda menjadi basa.';
        cathodeGasType = 'H2';
        break;

      case 'znso4':
        cathodeReaction = 'Zn²⁺(aq) + 2e⁻ → Zn(s)';
        cathodeReactionType = 'metal_deposition';
        cathodeProduct = 'Endapan Logam Seng (Zn)';
        cathodeVisualNote = 'Terbentuk lapisan seng abu-abu keperakan yang melapisi batang katoda (proses galvanis).';
        cathodeDepositColor = '#94a3b8';
        break;

      case 'niso4':
        cathodeReaction = 'Ni²⁺(aq) + 2e⁻ → Ni(s)';
        cathodeReactionType = 'metal_deposition';
        cathodeProduct = 'Lapisan Logam Nikel (Ni)';
        cathodeVisualNote = 'Terbentuk lapisan nikel perak-kekuningan keras mengkilap pada permukaan katoda.';
        cathodeDepositColor = '#a1a1aa';
        break;

      case 'aucl3':
        cathodeReaction = 'Au³⁺(aq) + 3e⁻ → Au(s)';
        cathodeReactionType = 'metal_deposition';
        cathodeProduct = 'Endapan Emas murni (Au)';
        cathodeVisualNote = 'Batang katoda terlapisi logam emas kuning berkilau yang indah (penyepuhan emas).';
        cathodeDepositColor = '#eab308';
        break;

      default:
        cathodeReaction = '2H₂O(l) + 2e⁻ → H₂(g) + 2OH⁻(aq)';
        cathodeReactionType = 'gas_evolution';
        cathodeProduct = 'Gas Hidrogen (H₂)';
        cathodeVisualNote = 'Terbentuk gelembung gas tak berwarna di katoda.';
        cathodeGasType = 'H2';
        break;
    }
  }

  // 2. REAKSI ANODA (OKSIDASI)
  let anodeReaction = '';
  let anodeReactionType: 'anode_dissolution' | 'halogen_gas' | 'oxygen_gas' = 'oxygen_gas';
  let anodeProduct = '';
  let anodeVisualNote = '';
  let anodeGasType: 'Cl2' | 'O2' | 'I2' | null = null;
  let anodeErosion = false;

  if (!anode.isInert) {
    // Anode AKTIF (Cu, Zn, Ag, Fe) -> Anode teroksidasi melarut!
    anodeErosion = true;
    anodeReactionType = 'anode_dissolution';
    switch (anodeId) {
      case 'Cu':
        anodeReaction = 'Cu(s) → Cu²⁺(aq) + 2e⁻';
        anodeProduct = 'Ion Cu²⁺ (Anode Cu larut)';
        anodeVisualNote = 'Batang tembaga (Cu) teroksidasi, terkikis/menipis, dan melepaskan ion Cu²⁺ ke larutan.';
        break;
      case 'Zn':
        anodeReaction = 'Zn(s) → Zn²⁺(aq) + 2e⁻';
        anodeProduct = 'Ion Zn²⁺ (Anode Zn larut)';
        anodeVisualNote = 'Batang seng (Zn) cepat terkikis dan melarut menjadi ion seng.';
        break;
      case 'Ag':
        anodeReaction = 'Ag(s) → Ag⁺(aq) + e⁻';
        anodeProduct = 'Ion Ag⁺ (Anode Ag larut)';
        anodeVisualNote = 'Batang perak (Ag) terlarut memasok ion Ag⁺ secara berkesinambungan.';
        break;
      case 'Fe':
        anodeReaction = 'Fe(s) → Fe²⁺(aq) + 2e⁻';
        anodeProduct = 'Ion Fe²⁺ (Anode Fe larut)';
        anodeVisualNote = 'Batang besi terkorosi/terkikis melepaskan ion besi kehijauan ke dalam cairan.';
        break;
      default:
        anodeReaction = `${anode.symbol}(s) → ${anode.symbol}²⁺(aq) + 2e⁻`;
        anodeProduct = `Ion ${anode.symbol}`;
        anodeVisualNote = `Batang elektroda ${anode.name} terlarut secara aktif.`;
    }
  } else {
    // Anode INERT (C, Pt, Au) -> Bergantung pada anion dan fase
    if (electrolyte.phase === 'molten') {
      anodeReaction = '2Cl⁻(l) → Cl₂(g) + 2e⁻';
      anodeReactionType = 'halogen_gas';
      anodeProduct = 'Gas Klorin (Cl₂)';
      anodeVisualNote = 'Pelepasan gas klorin (Cl₂) berwarna kuning kehijauan dengan bau menyengat di anoda.';
      anodeGasType = 'Cl2';
    } else {
      // Larutan berair dengan elektroda inert
      switch (electrolyteId) {
        case 'nacl_aq':
        case 'aucl3':
          anodeReaction = '2Cl⁻(aq) → Cl₂(g) + 2e⁻';
          anodeReactionType = 'halogen_gas';
          anodeProduct = 'Gas Klorin (Cl₂)';
          anodeVisualNote = 'Muncul gelembung gas Cl₂ berwarna kuning kehijauan muda di permukaan anoda.';
          anodeGasType = 'Cl2';
          break;

        case 'ki':
          anodeReaction = '2I⁻(aq) → I₂(aq/s) + 2e⁻';
          anodeReactionType = 'halogen_gas';
          anodeProduct = 'Iodin (I₂) kecokelatan';
          anodeVisualNote = 'Larutan di sekitar anoda berubah warna menjadi kuning tua kecokelatan akibat terbentuknya I₂.';
          anodeGasType = 'I2';
          break;

        case 'cuso4':
        case 'agno3':
        case 'h2so4':
        case 'znso4':
        case 'niso4':
        default:
          anodeReaction = '2H₂O(l) → O₂(g) + 4H⁺(aq) + 4e⁻';
          anodeReactionType = 'oxygen_gas';
          anodeProduct = 'Gas Oksigen (O₂) + Ion H⁺ (Asam)';
          anodeVisualNote = 'Muncul gelembung gas oksigen (O₂) tak berwarna. Larutan sekitar anoda bertambah asam (pH turun).';
          anodeGasType = 'O2';
          break;
      }
    }
  }

  // 3. REAKSI SEL TOTAL
  let totalReaction = '';
  if (electrolyteId === 'cuso4' && anodeId === 'Cu') {
    totalReaction = 'Cu(s, anode) → Cu(s, katode) [Pemindahan / Penyepuhan Tembaga]';
  } else if (electrolyteId === 'agno3' && anodeId === 'Ag') {
    totalReaction = 'Ag(s, anode) → Ag(s, katode) [Penyepuhan Perak Murni]';
  } else if (electrolyteId === 'nacl_molten') {
    totalReaction = '2NaCl(l) → 2Na(l) + Cl₂(g)';
  } else if (electrolyteId === 'nacl_aq' && anode.isInert) {
    totalReaction = '2NaCl(aq) + 2H₂O(l) → 2NaOH(aq) + H₂(g) + Cl₂(g)';
  } else if (electrolyteId === 'cuso4' && anode.isInert) {
    totalReaction = '2CuSO₄(aq) + 2H₂O(l) → 2Cu(s) + O₂(g) + 2H₂SO₄(aq)';
  } else if (electrolyteId === 'h2so4' && anode.isInert) {
    totalReaction = '2H₂O(l) → 2H₂(g) + O₂(g) [Penguraian Air Murni]';
  } else if (electrolyteId === 'ki' && anode.isInert) {
    totalReaction = '2KI(aq) + 2H₂O(l) → 2KOH(aq) + H₂(g) + I₂(aq)';
  } else {
    totalReaction = `${cathodeReaction}  +  ${anodeReaction}`;
  }

  // 4. KETERANGAN PENGAMATAN LARUTAN & APLIKASI
  let solutionObservation = '';
  let industrialApplicationNote = '';

  if (electrolyteId === 'cuso4') {
    if (anodeId === 'Cu') {
      solutionObservation = 'Warna biru larutan CuSO₄ tetap konstan karena laju pelarutan Cu di anode sama persis dengan laju pengendapan Cu di katode.';
      industrialApplicationNote = 'Aplikasi Industri: Prinsip dasar Electroplating (Penyepuhan) dan Electrorefining (Pemurnian Tembaga Kasar 99,99%).';
    } else {
      solutionObservation = 'Warna biru larutan perlahan memudar seiring berkurangnya ion Cu²⁺, dan larutan berubah menjadi semakin asam karena menghasilkan H⁺.';
      industrialApplicationNote = 'Aplikasi Industri: Elektrowinning tembaga dari bijih tambang.';
    }
  } else if (electrolyteId === 'nacl_aq') {
    solutionObservation = 'Menghasilkan larutan basa kuat NaOH di sekitar katoda serta membebaskan gas H₂ (di katoda) dan gas Cl₂ (di anoda).';
    industrialApplicationNote = 'Aplikasi Industri: Proses Klor-Alkali berskala besar untuk produksi sabun, kertas, dan desinfektan.';
  } else if (electrolyteId === 'nacl_molten') {
    solutionObservation = 'Berlangsung pada bejana sel elektrolisis lelehan cair suhu tinggi tanpa pelarut air untuk mencegah reduksi air.';
    industrialApplicationNote = 'Aplikasi Industri: Proses Downs untuk mengekstrak logam reaktif Natrium murni.';
  } else {
    solutionObservation = 'Reaksi elektrokimia non-spontan digerakkan sepenuhnya oleh suplai energi listrik arus searah (DC).';
  }

  return {
    cathodeReaction,
    cathodeReactionType,
    cathodeProduct,
    cathodeVisualNote,
    cathodeDepositColor,
    cathodeGasType,
    anodeReaction,
    anodeReactionType,
    anodeProduct,
    anodeVisualNote,
    anodeGasType,
    anodeErosion,
    totalReaction,
    solutionObservation,
    industrialApplicationNote,
  };
}
