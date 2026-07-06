// Dataset perencanaan EV: Whitespace, SPBU, PLN, & Pencarian Alamat Populer

export const whitespacePoints = [
  // JAKARTA
  {
    id: "ws-jk-1",
    name: "Cluster Kemang Gaps",
    city: "Jakarta Selatan",
    provinsi: "DKI Jakarta",
    lat: -6.2731,
    lng: 106.8106,
    category: "slow",
    radius: 800,
    intensity: 0.8,
    scores: {
      plnGrid: 9.2,
      traffic: 8.5,
      poiDensity: 9.0,
      competition: 9.6,
      overall: 91,
      recommendation: "SANGAT DIREKOMENDASIKAN",
      description: "Wilayah Kemang ini memiliki lalu lintas kendaraan listrik (EV) premium yang padat. Ketersediaan home charging lambat (slow AC) sangat dibutuhkan di area pemukiman dan apartemen sekitar, sementara gardu PLN terdekat memiliki surplus daya 1.2MVA."
    }
  },
  {
    id: "ws-jk-2",
    name: "Menteng Hub Gaps",
    city: "Jakarta Pusat",
    provinsi: "DKI Jakarta",
    lat: -6.1919,
    lng: 106.8322,
    category: "medium",
    radius: 900,
    intensity: 0.7,
    scores: {
      plnGrid: 8.8,
      traffic: 9.0,
      poiDensity: 8.7,
      competition: 8.2,
      overall: 87,
      recommendation: "LAYAK",
      description: "Pusat perkantoran dan bisnis Menteng membutuhkan stasiun pengisian daya Medium AC (22 kW) untuk mengakomodasi parkir harian karyawan kantor. Kapasitas kabel tanah PLN di area ini sangat baik."
    }
  },
  {
    id: "ws-jk-3",
    name: "Tol Dalam Kota Kuningan Corridor",
    city: "Jakarta Selatan",
    provinsi: "DKI Jakarta",
    lat: -6.2367,
    lng: 106.8228,
    category: "high",
    radius: 1200,
    intensity: 0.9,
    scores: {
      plnGrid: 9.5,
      traffic: 9.8,
      poiDensity: 9.2,
      competition: 7.9,
      overall: 91,
      recommendation: "SANGAT DIREKOMENDASIKAN",
      description: "Koridor jalan tol dengan mobilitas sangat tinggi. Sangat potensial untuk dibangun stasiun DC Fast Charge (50-80 kW) guna mendukung pengemudi taksi online dan komuter luar daerah. Gardu distribusi PLN Rasuna Said sangat memadai."
    }
  },
  {
    id: "ws-jk-4",
    name: "CBD Sudirman Ultrafast Gap",
    city: "Jakarta Pusat",
    provinsi: "DKI Jakarta",
    lat: -6.2146,
    lng: 106.8184,
    category: "highspeed",
    radius: 1000,
    intensity: 0.95,
    scores: {
      plnGrid: 9.7,
      traffic: 9.5,
      poiDensity: 9.8,
      competition: 8.0,
      overall: 93,
      recommendation: "SANGAT DIREKOMENDASIKAN",
      description: "Jantung bisnis Jakarta dengan populasi mobil listrik termewah. Dibutuhkan instalasi Ultrafast Charger (120 kW+) untuk pengisian kilat (< 20 menit) bagi para eksekutif. PLN memiliki koneksi grid tegangan menengah 20kV di koridor Sudirman."
    }
  },

  // BANDUNG
  {
    id: "ws-bd-1",
    name: "Dago Wisata Gaps",
    city: "Bandung",
    provinsi: "Jawa Barat",
    lat: -6.8864,
    lng: 107.6152,
    category: "highspeed",
    radius: 1100,
    intensity: 0.85,
    scores: {
      plnGrid: 8.2,
      traffic: 9.2,
      poiDensity: 8.8,
      competition: 9.1,
      overall: 88,
      recommendation: "LAYAK",
      description: "Area tujuan wisata utama di Bandung Utara. Wisatawan akhir pekan dari Jakarta sangat membutuhkan stasiun pengisian cepat (Ultrafast DC) sebelum kembali melakukan perjalanan jauh. Grid PLN Dago memiliki ruang daya yang cukup untuk 150 kW."
    }
  },
  {
    id: "ws-bd-2",
    name: "Pasteur Gateway Gaps",
    city: "Bandung",
    provinsi: "Jawa Barat",
    lat: -6.8992,
    lng: 107.5756,
    category: "high",
    radius: 1000,
    intensity: 0.9,
    scores: {
      plnGrid: 8.6,
      traffic: 9.5,
      poiDensity: 8.2,
      competition: 8.9,
      overall: 89,
      recommendation: "LAYAK",
      description: "Titik masuk utama kota Bandung via pintu tol Pasteur. Pemasangan DC Fast Charger di koridor masuk kota ini sangat dibutuhkan untuk mengisi daya kendaraan setelah perjalanan antarkota."
    }
  },

  // BALI
  {
    id: "ws-bl-1",
    name: "Seminyak Retail Gaps",
    city: "Badung, Bali",
    provinsi: "Bali",
    lat: -8.6913,
    lng: 115.1682,
    category: "medium",
    radius: 900,
    intensity: 0.75,
    scores: {
      plnGrid: 8.5,
      traffic: 8.9,
      poiDensity: 9.5,
      competition: 9.3,
      overall: 90,
      recommendation: "SANGAT DIREKOMENDASIKAN",
      description: "Pusat hiburan dan villa di Bali Selatan dengan sewa kendaraan EV turis yang berkembang pesat. Charger Medium AC sangat cocok diletakkan di dekat kompleks ritel dan kafe di mana mobil terparkir selama 2-3 jam."
    }
  },
  {
    id: "ws-bl-2",
    name: "Kuta Beachfront Corridor",
    city: "Badung, Bali",
    provinsi: "Bali",
    lat: -8.7224,
    lng: 115.1678,
    category: "high",
    radius: 1000,
    intensity: 0.8,
    scores: {
      plnGrid: 8.0,
      traffic: 9.1,
      poiDensity: 9.4,
      competition: 8.5,
      overall: 87,
      recommendation: "LAYAK",
      description: "Jalan utama tepi pantai Kuta memiliki lalu lintas mobil sewaan sangat tinggi. Fast charger DC (50 kW) akan sangat diminati oleh pengemudi sewaan dan pemandu wisata untuk pengisian daya cepat."
    }
  },

  // SURABAYA
  {
    id: "ws-sb-1",
    name: "Gubeng Station Area Gaps",
    city: "Surabaya",
    provinsi: "Jawa Timur",
    lat: -7.2654,
    lng: 112.7519,
    category: "medium",
    radius: 800,
    intensity: 0.7,
    scores: {
      plnGrid: 9.0,
      traffic: 8.8,
      poiDensity: 8.5,
      competition: 8.7,
      overall: 87,
      recommendation: "LAYAK",
      description: "Kawasan padat di sekitar stasiun kereta api utama dan perhotelan. Sangat layak untuk dipasang pengisian daya Medium AC (22 kW) bagi tamu hotel dan pengemudi transit."
    }
  }
];

export const spbuLocations = [
  // JAKARTA
  {
    id: "spbu-jk-1",
    name: "SPBU Pertamina 31.12902 Kuningan",
    provinsi: "DKI Jakarta",
    lat: -6.2345,
    lng: 106.8234,
    address: "Jl. H. R. Rasuna Said Kav. X-2, Kuningan, Jakarta Selatan"
  },
  {
    id: "spbu-jk-2",
    name: "SPBU Shell Gatot Subroto",
    provinsi: "DKI Jakarta",
    lat: -6.2392,
    lng: 106.8185,
    address: "Jl. Jenderal Gatot Subroto No. 34, Jakarta Selatan"
  },
  {
    id: "spbu-jk-3",
    name: "SPBU Pertamina 31.10303 Menteng",
    provinsi: "DKI Jakarta",
    lat: -6.1882,
    lng: 106.8368,
    address: "Jl. Cikini Raya No. 113, Menteng, Jakarta Pusat"
  },
  {
    id: "spbu-jk-4",
    name: "SPBU Shell Kemang Raya",
    provinsi: "DKI Jakarta",
    lat: -6.2698,
    lng: 106.8152,
    address: "Jl. Kemang Raya No. 45, Jakarta Selatan"
  },

  // BANDUNG
  {
    id: "spbu-bd-1",
    name: "SPBU Pertamina 34.40116 Dago",
    provinsi: "Jawa Barat",
    lat: -6.8895,
    lng: 107.6160,
    address: "Jl. Ir. H. Juanda No. 139, Dago, Bandung"
  },
  {
    id: "spbu-bd-2",
    name: "SPBU Pertamina 34.40135 Pasteur",
    provinsi: "Jawa Barat",
    lat: -6.8975,
    lng: 107.5810,
    address: "Jl. Dr. Djunjunan No. 120, Pasteur, Bandung"
  },

  // BALI
  {
    id: "spbu-bl-1",
    name: "SPBU Pertamina 54.80327 Seminyak",
    provinsi: "Bali",
    lat: -8.6854,
    lng: 115.1742,
    address: "Jl. Sunset Road, Seminyak, Badung, Bali"
  },
  {
    id: "spbu-bl-2",
    name: "SPBU Pertamina 54.80305 Kuta Bypass",
    provinsi: "Bali",
    lat: -8.7295,
    lng: 115.1795,
    address: "Jl. Bypass Ngurah Rai, Kuta, Bali"
  }
];

export const plnLocations = [
  // JAKARTA
  {
    id: "pln-jk-1",
    name: "PLN Gardu Induk Menteng",
    provinsi: "DKI Jakarta",
    lat: -6.1952,
    lng: 106.8290,
    address: "Jl. Sutan Syahrir No. 1, Menteng, Jakarta Pusat"
  },
  {
    id: "pln-jk-2",
    name: "PLN UP3 Bulungan KEBAYORAN",
    provinsi: "DKI Jakarta",
    lat: -6.2420,
    lng: 106.7972,
    address: "Jl. Bulungan No. 3, Kebayoran Baru, Jakarta Selatan"
  },
  {
    id: "pln-jk-3",
    name: "PLN Distribusi Jakarta Raya Kuningan",
    provinsi: "DKI Jakarta",
    lat: -6.2238,
    lng: 106.8298,
    address: "Jl. M.I. Ridwan Rais No. 1, Jakarta Pusat"
  },

  // BANDUNG
  {
    id: "pln-bd-1",
    name: "PLN UP3 Bandung Cikapundung",
    provinsi: "Jawa Barat",
    lat: -6.9152,
    lng: 107.6105,
    address: "Jl. Asia Afrika No. 63, Bandung"
  },

  // BALI
  {
    id: "pln-bl-1",
    name: "PLN ULP Denpasar Timur",
    provinsi: "Bali",
    lat: -8.6582,
    lng: 115.2425,
    address: "Jl. Bypass Ngurah Rai, Sanur, Denpasar, Bali"
  }
];

export const searchableAddresses = [
  { name: "Sudirman Jakarta", lat: -6.2146, lng: 106.8184, zoom: 14, type: "address" },
  { name: "Kemang Jakarta", lat: -6.2731, lng: 106.8106, zoom: 14, type: "address" },
  { name: "Menteng Jakarta", lat: -6.1919, lng: 106.8322, zoom: 14, type: "address" },
  { name: "Dago Bandung", lat: -6.8864, lng: 107.6152, zoom: 14, type: "address" },
  { name: "Pasteur Bandung", lat: -6.8992, lng: 107.5756, zoom: 14, type: "address" },
  { name: "Kuta Bali", lat: -8.7224, lng: 115.1678, zoom: 14, type: "address" },
  { name: "Seminyak Bali", lat: -8.6913, lng: 115.1682, zoom: 14, type: "address" },
  { name: "SPBU Pertamina Kuningan", lat: -6.2345, lng: 106.8234, zoom: 16, type: "spbu" },
  { name: "SPBU Shell Gatot Subroto", lat: -6.2392, lng: 106.8185, zoom: 16, type: "spbu" },
  { name: "SPBU Pertamina Dago", lat: -6.8895, lng: 107.6160, zoom: 16, type: "spbu" },
  { name: "SPBU Pertamina Seminyak", lat: -8.6854, lng: 115.1742, zoom: 16, type: "spbu" }
];

export const spatialMismatchData = {
  "DKI Jakarta": {
    slow: {
      supply: [
        [-6.18, 106.81],
        [-6.18, 106.84],
        [-6.23, 106.84],
        [-6.23, 106.81]
      ],
      gap: [
        [-6.24, 106.81],
        [-6.24, 106.85],
        [-6.28, 106.85],
        [-6.28, 106.81]
      ],
      desc: "Slow AC Gap (7.4 kW): Konsentrasi mobil listrik pemukiman tinggi di Kemang & Cilandak butuh pengisian lambat rumahan."
    },
    medium: {
      supply: [
        [-6.19, 106.815],
        [-6.18, 106.835],
        [-6.225, 106.845],
        [-6.23, 106.81]
      ],
      gap: [
        [-6.23, 106.81],
        [-6.225, 106.855],
        [-6.275, 106.865],
        [-6.27, 106.815]
      ],
      desc: "Destination Whitespaces (22 kW): Mismatch spasial antara densitas POI hotel/ritel tinggi dengan minimnya suplai Medium AC di Jaksel."
    },
    fast: {
      supply: [
        [-6.195, 106.82],
        [-6.185, 106.83],
        [-6.21, 106.835],
        [-6.215, 106.81]
      ],
      gap: [
        [-6.22, 106.82],
        [-6.21, 106.85],
        [-6.26, 106.85],
        [-6.25, 106.81]
      ],
      desc: "Transit Whitespaces (50 kW): Gaps di area tol dalam kota Kuningan & Tebet untuk pengemudi taksi online transit."
    },
    highspeed: {
      supply: [
        [-6.20, 106.81],
        [-6.19, 106.83],
        [-6.215, 106.83],
        [-6.22, 106.81]
      ],
      gap: [
        [-6.23, 106.81],
        [-6.22, 106.84],
        [-6.28, 106.84],
        [-6.28, 106.81]
      ],
      desc: "Highway Transit Whitespaces (120+ kW): Celah koridor Sudirman/Thamrin & TB Simatupang untuk pengisian ultrafast mobil premium."
    }
  },
  "Jawa Barat": {
    slow: {
      supply: [
        [-6.88, 107.60],
        [-6.88, 107.62],
        [-6.91, 107.62],
        [-6.91, 107.60]
      ],
      gap: [
        [-6.91, 107.57],
        [-6.91, 107.60],
        [-6.93, 107.60],
        [-6.93, 107.57]
      ],
      desc: "Slow AC Gap (7.4 kW): Kebutuhan charging rumahan di perumahan Bandung Utara."
    },
    medium: {
      supply: [
        [-6.88, 107.59],
        [-6.87, 107.62],
        [-6.90, 107.62],
        [-6.90, 107.59]
      ],
      gap: [
        [-6.90, 107.56],
        [-6.90, 107.59],
        [-6.92, 107.59],
        [-6.92, 107.56]
      ],
      desc: "Destination Whitespaces (22 kW): Area komersial Pasteur & PVJ terindikasi gap pengisian AC 22kW tujuan belanja."
    },
    fast: {
      supply: [
        [-6.89, 107.60],
        [-6.89, 107.61],
        [-6.91, 107.61],
        [-6.91, 107.60]
      ],
      gap: [
        [-6.89, 107.57],
        [-6.89, 107.59],
        [-6.91, 107.59],
        [-6.91, 107.57]
      ],
      desc: "Transit Whitespaces (50 kW): Jalur komuter utama Pasteur gate menuju pusat kota."
    },
    highspeed: {
      supply: [
        [-6.89, 107.60],
        [-6.88, 107.62],
        [-6.90, 107.62],
        [-6.90, 107.60]
      ],
      gap: [
        [-6.91, 107.58],
        [-6.91, 107.61],
        [-6.93, 107.61],
        [-6.93, 107.58]
      ],
      desc: "Highway Transit Whitespaces (120+ kW): Pintu keluar tol Pasteur menuju Dago."
    }
  },
  "Bali": {
    slow: {
      supply: [
        [-8.71, 115.15],
        [-8.71, 115.19],
        [-8.74, 115.19],
        [-8.74, 115.15]
      ],
      gap: [
        [-8.67, 115.14],
        [-8.67, 115.18],
        [-8.70, 115.18],
        [-8.70, 115.14]
      ],
      desc: "Slow AC Gap (7.4 kW): Area villa Seminyak & Canggu butuh stasiun slow AC untuk mobil sewaan turis menginap."
    },
    medium: {
      supply: [
        [-8.72, 115.16],
        [-8.71, 115.19],
        [-8.735, 115.19],
        [-8.73, 115.16]
      ],
      gap: [
        [-8.68, 115.15],
        [-8.67, 115.18],
        [-8.71, 115.18],
        [-8.71, 115.15]
      ],
      desc: "Destination Whitespaces (22 kW): Pusat keramaian turis di Kuta & Seminyak butuh pengisian AC di mall beachfront."
    },
    fast: {
      supply: [
        [-8.72, 115.15],
        [-8.72, 115.17],
        [-8.74, 115.17],
        [-8.74, 115.15]
      ],
      gap: [
        [-8.69, 115.15],
        [-8.69, 115.17],
        [-8.71, 115.17],
        [-8.71, 115.15]
      ],
      desc: "Transit Whitespaces (50 kW): Koridor Bypass Ngurah Rai menuju Jimbaran."
    },
    highspeed: {
      supply: [
        [-8.73, 115.16],
        [-8.72, 115.18],
        [-8.74, 115.18],
        [-8.74, 115.16]
      ],
      gap: [
        [-8.70, 115.15],
        [-8.70, 115.17],
        [-8.72, 115.17],
        [-8.72, 115.15]
      ],
      desc: "Highway Transit Whitespaces (120+ kW): Kuta Bypass menuju gerbang tol Nusa Dua."
    }
  }
};

