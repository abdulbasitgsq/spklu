// Showcase data: use-case descriptions, mock histogram distributions, and priority grids per charging type

export const chargingTypeInfo = {
  slow: {
    id: 'slow',
    label: 'Slow AC',
    power: '7.4 kW',
    color: '#3b82f6',
    colorLight: 'rgba(59, 130, 246, 0.1)',
    tagline: 'Home & Overnight Charging',
    subtitle: 'Residential Whitespaces',
    description: `Slow AC chargers (7.4 kW) are the backbone of EV adoption. They serve residential users who charge overnight — plugging in when they arrive home and unplugging with a full battery the next morning. The typical dwell time is 6–10 hours, making apartment complexes, residential clusters, and gated communities the ideal locations.`,
    insight: `Our analysis identifies residential zones with high EV registration density but no nearby slow charging infrastructure. These "overnight gaps" represent the most fundamental market whitespace — users in these areas must drive out of their neighborhood to charge, creating unnecessary range anxiety.`,
    idealLocations: ['Apartemen & kondominium', 'Cluster perumahan premium', 'Area parkir kantor (parkir harian)', 'Hotel & penginapan long-stay'],
    dwellTime: '6–10 jam',
    userProfile: 'Pemilik EV residensial, tamu hotel long-stay',
  },
  medium: {
    id: 'medium',
    label: 'Destination AC',
    power: '22 kW',
    color: '#10b981',
    colorLight: 'rgba(16, 185, 129, 0.1)',
    tagline: 'Destination & Retail Charging',
    subtitle: 'Destination Whitespaces',
    description: `Medium AC chargers (22 kW) serve the "destination" use case — users who park at a commercial location for 1–3 hours and expect a meaningful charge while they shop, dine, or work. This is the sweet spot where charging integrates seamlessly into daily routines.`,
    insight: `We track Points of Interest (POIs) like malls, restaurants, offices, and co-working spaces, then overlay existing charger coverage. The spatial mismatch between high-POI-density areas and charger availability reveals the exact commercial zones where destination charging demand is unmet.`,
    idealLocations: ['Mall & pusat perbelanjaan', 'Restoran & kafe populer', 'Co-working space & perkantoran', 'Pusat hiburan & bioskop'],
    dwellTime: '1–3 jam',
    userProfile: 'Pengunjung mall, pekerja kantoran, dine-in customer',
  },
  fast: {
    id: 'fast',
    label: 'Transit DC',
    power: '50 kW',
    color: '#f59e0b',
    colorLight: 'rgba(245, 158, 11, 0.1)',
    tagline: 'Transit & On-the-Go Charging',
    subtitle: 'Transit Whitespaces',
    description: `Fast DC chargers (50 kW) are for transit users — ride-hailing drivers, delivery fleets, and commuters who need a rapid top-up in 20–40 minutes. These users cannot afford long dwell times; they pull off the road, charge, and leave. Location along major transit corridors is critical.`,
    insight: `We map transit corridor intensity using ride-hailing GPS traces, traffic volume data, and SPBU (gas station) locations. Gaps in fast charging along high-traffic corridors represent lost revenue — every taxi and ride-hailing driver in these areas must detour to charge, reducing their earning hours.`,
    idealLocations: ['SPBU & rest area jalan tol', 'Koridor taksi online (Grab/Gojek)', 'Simpul transportasi utama', 'Area fleet depot & logistik'],
    dwellTime: '20–40 menit',
    userProfile: 'Driver taksi online, kurir, komuter antarkota',
  },
  highspeed: {
    id: 'highspeed',
    label: 'Highway Ultrafast',
    power: '120+ kW',
    color: '#ef4444',
    colorLight: 'rgba(239, 68, 68, 0.1)',
    tagline: 'Highway & Premium Rapid Charging',
    subtitle: 'Highway Transit Whitespaces',
    description: `Ultrafast DC chargers (120+ kW) enable highway-speed charging — from 10% to 80% in under 20 minutes. These serve intercity travelers, premium EV owners (Tesla, BMW iX, Hyundai Ioniq 5), and long-distance logistics. Placement at highway exits and premium rest areas is essential.`,
    insight: `We analyze intercity traffic patterns and toll gate data to identify highway segments where EV drivers face "range anxiety corridors" — stretches of 100+ km without any fast charging option. These are the highest-value whitespaces for ultrafast infrastructure investment.`,
    idealLocations: ['Gerbang tol & rest area tol', 'SPBU premium di jalur antarkota', 'Showroom & dealer mobil listrik', 'Area komersial CBD premium'],
    dwellTime: '10–20 menit',
    userProfile: 'Traveler antarkota, pemilik EV premium, fleet logistik',
  },
};

// Mock histogram distribution data for "Opportunity Tail" chart
// Each array represents bin counts for gap scores 0-200 in bins of 10
export const gapDistributions = {
  slow: {
    bins: [0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190],
    counts: [3800,2200,1400,950,720,580,450,360,290,240,195,160,130,105,85,68,52,38,25,15],
    label: 'Slow AC (7.4 kW)',
  },
  medium: {
    bins: [0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190],
    counts: [4200,2600,1600,1100,800,620,490,380,300,250,200,170,140,115,92,74,58,42,30,18],
    label: 'Destination AC (22 kW)',
  },
  fast: {
    bins: [0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190],
    counts: [3500,2000,1300,880,680,540,420,340,275,225,185,150,122,100,80,64,48,35,22,12],
    label: 'Transit DC (50 kW)',
  },
  highspeed: {
    bins: [0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190],
    counts: [4500,2800,1700,1150,850,660,510,400,320,260,210,175,145,118,95,76,60,44,32,20],
    label: 'Ultrafast DC (120+ kW)',
  },
};

// Mock priority grids per charging type (top 10 highest gap scores)
export const priorityGrids = {
  slow: [
    { gridId: 'J3N2M2Y7R7R', poiCount: 180, gapScore: 180.0 },
    { gridId: 'J3N2M2Y7R8P', poiCount: 174, gapScore: 174.0 },
    { gridId: 'J3N2M8B2H7M', poiCount: 150, gapScore: 150.0 },
    { gridId: 'J3N2M8B22GB0', poiCount: 147, gapScore: 147.0 },
    { gridId: 'J3N2M8B22G8R', poiCount: 147, gapScore: 147.0 },
    { gridId: 'J3N2M8B22P24', poiCount: 147, gapScore: 147.0 },
    { gridId: 'J3N2M3T7R8F', poiCount: 146, gapScore: 146.0 },
    { gridId: 'J3N2M8B22G8J', poiCount: 145, gapScore: 145.0 },
    { gridId: 'J3N2M8B2H7W', poiCount: 143, gapScore: 143.0 },
    { gridId: 'J3N2M2Y8P7F', poiCount: 139, gapScore: 139.0 },
  ],
  medium: [
    { gridId: 'K4P3N3Z8S8S', poiCount: 195, gapScore: 195.0 },
    { gridId: 'K4P3N3Z8S9Q', poiCount: 188, gapScore: 188.0 },
    { gridId: 'K4P3N9C3I8N', poiCount: 162, gapScore: 162.0 },
    { gridId: 'K4P3N9C33HC', poiCount: 158, gapScore: 158.0 },
    { gridId: 'K4P3N9C33H9S', poiCount: 155, gapScore: 155.0 },
    { gridId: 'K4P3N9C33Q35', poiCount: 153, gapScore: 153.0 },
    { gridId: 'K4P3N4U8S9G', poiCount: 151, gapScore: 151.0 },
    { gridId: 'K4P3N9C33H9K', poiCount: 149, gapScore: 149.0 },
    { gridId: 'K4P3N9C3I8X', poiCount: 147, gapScore: 147.0 },
    { gridId: 'K4P3N3Z9Q8G', poiCount: 144, gapScore: 144.0 },
  ],
  fast: [
    { gridId: 'L5Q4O4A9T9T', poiCount: 172, gapScore: 172.0 },
    { gridId: 'L5Q4O4A9T0R', poiCount: 165, gapScore: 165.0 },
    { gridId: 'L5Q4O0D4J9O', poiCount: 148, gapScore: 148.0 },
    { gridId: 'L5Q4O0D44IC', poiCount: 145, gapScore: 145.0 },
    { gridId: 'L5Q4O0D44I0T', poiCount: 142, gapScore: 142.0 },
    { gridId: 'L5Q4O0D44R46', poiCount: 140, gapScore: 140.0 },
    { gridId: 'L5Q4O5V9T0H', poiCount: 138, gapScore: 138.0 },
    { gridId: 'L5Q4O0D44I0L', poiCount: 136, gapScore: 136.0 },
    { gridId: 'L5Q4O0D4J9Y', poiCount: 134, gapScore: 134.0 },
    { gridId: 'L5Q4O4A0R9H', poiCount: 131, gapScore: 131.0 },
  ],
  highspeed: [
    { gridId: 'M6R5P5B0U0U', poiCount: 160, gapScore: 160.0 },
    { gridId: 'M6R5P5B0U1S', poiCount: 154, gapScore: 154.0 },
    { gridId: 'M6R5P1E5K0P', poiCount: 138, gapScore: 138.0 },
    { gridId: 'M6R5P1E55JD', poiCount: 135, gapScore: 135.0 },
    { gridId: 'M6R5P1E55J1U', poiCount: 132, gapScore: 132.0 },
    { gridId: 'M6R5P1E55S57', poiCount: 130, gapScore: 130.0 },
    { gridId: 'M6R5P6W0U1I', poiCount: 128, gapScore: 128.0 },
    { gridId: 'M6R5P1E55J1M', poiCount: 126, gapScore: 126.0 },
    { gridId: 'M6R5P1E5K0Z', poiCount: 124, gapScore: 124.0 },
    { gridId: 'M6R5P5B1S0I', poiCount: 121, gapScore: 121.0 },
  ],
};

// Map category key to whitespacePoints category values
export const categoryKeyMap = {
  slow: 'slow',
  medium: 'medium',
  fast: 'high',
  highspeed: 'highspeed',
};
