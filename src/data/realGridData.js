/**
 * Real spatial grid cell data extracted from viewer-spklu/outputs/map_medium.html
 * 14,929 grid cells covering Jakarta area with POI counts and gap scores
 * for both medium (22kW) and fast (50kW+) charging types.
 * 
 * Each cell has:
 *   gid: string (unique grid ID like "J3N2M2Y7R7R")
 *   lat/lng: center coordinates
 *   poi_medium: # destination POIs within 3-min drive
 *   poi_fast: # transit POIs within 3-min drive  
 *   supply_medium: # medium chargers within 3-min drive
 *   supply_fast: # fast chargers within 3-min drive
 *   gap_medium: medium_gap_score (poi - supply)
 *   gap_fast: fast_gap_score
 *   fill_color: [r,g,b,a] from original analysis
 * 
 * Cell size: ~0.000898 deg x 0.000898 deg (~100m x 100m)
 * Coverage: lat -6.3642 to -6.2025, lng 106.7371 to 106.8665 (Jakarta)
 */

import gridCellsRaw from './gridCells.json';

// The raw data
export const gridCells = gridCellsRaw;

// Cell dimensions in degrees
export const CELL_SIZE_DEG = 0.000898;

// Priority grids from CSV (real data from the analysis)
export const realPriorityGrids = {
  medium: [
    { gid: 'J3N2M2Y7R7R', poiCount: 180, gapScore: 180.0 },
    { gid: 'J3N2M2Y7R8P', poiCount: 174, gapScore: 174.0 },
    { gid: 'J3N2M822H7M', poiCount: 150, gapScore: 150.0 },
    { gid: 'J3N2M822G8Q', poiCount: 147, gapScore: 147.0 },
    { gid: 'J3N2M822G8R', poiCount: 147, gapScore: 147.0 },
    { gid: 'J3N2M822P24', poiCount: 147, gapScore: 147.0 },
    { gid: 'J3N2M3T788F', poiCount: 146, gapScore: 146.0 },
    { gid: 'J3N2M822G8J', poiCount: 145, gapScore: 145.0 },
    { gid: 'J3N2M822H7W', poiCount: 143, gapScore: 143.0 },
    { gid: 'J3N2M2Y8P7F', poiCount: 139, gapScore: 139.0 },
    { gid: 'J3N2M762R3H', poiCount: 139, gapScore: 139.0 },
    { gid: 'J3N2M822G8C', poiCount: 139, gapScore: 139.0 },
    { gid: 'J3N2M822M79', poiCount: 139, gapScore: 139.0 },
    { gid: 'J3N2M822M7R', poiCount: 138, gapScore: 138.0 },
    { gid: 'J3N2M2Y8P7M', poiCount: 136, gapScore: 136.0 },
    { gid: 'J3N2M2Y7R88', poiCount: 135, gapScore: 135.0 },
    { gid: 'J3N2M822G8P', poiCount: 134, gapScore: 134.0 },
    { gid: 'J3N2M822G85', poiCount: 133, gapScore: 133.0 },
    { gid: 'J3N2M822G8L', poiCount: 133, gapScore: 133.0 },
    { gid: 'J3N2M822M2V', poiCount: 133, gapScore: 133.0 },
  ],
  fast: [
    { gid: 'J3N2M2Y7Y2C', poiCount: 62, gapScore: 62.0 },
    { gid: 'J3N2M2Y7X2G', poiCount: 61, gapScore: 61.0 },
    { gid: 'J3N2M2Y7Y25', poiCount: 60, gapScore: 60.0 },
    { gid: 'J3N2M2Y7Y2J', poiCount: 60, gapScore: 60.0 },
    { gid: 'J3N2M2Y7Y2X', poiCount: 59, gapScore: 59.0 },
    { gid: 'J3N2M2Y7Y75', poiCount: 59, gapScore: 59.0 },
    { gid: 'J3N2M2Y7X2N', poiCount: 58, gapScore: 58.0 },
    { gid: 'J3N2M2Y7X7H', poiCount: 58, gapScore: 58.0 },
    { gid: 'J3N2M2Y7Y7F', poiCount: 58, gapScore: 58.0 },
    { gid: 'J3N2M2Y7Q2V', poiCount: 57, gapScore: 57.0 },
    { gid: 'J3N2M2Y7Q78', poiCount: 57, gapScore: 57.0 },
    { gid: 'J3N2M2Y7R7P', poiCount: 57, gapScore: 57.0 },
    { gid: 'J3N2M2Y7R7W', poiCount: 57, gapScore: 57.0 },
    { gid: 'J3N2M2Y7R7X', poiCount: 57, gapScore: 57.0 },
    { gid: 'J3N2M2Y7Y2P', poiCount: 57, gapScore: 57.0 },
    { gid: 'J3N2M2Y7Y2V', poiCount: 57, gapScore: 57.0 },
    { gid: 'J3N2M2Y7Y2W', poiCount: 57, gapScore: 57.0 },
    { gid: 'J3N2M2Y7Y78', poiCount: 57, gapScore: 57.0 },
    { gid: 'J3N2M2Y7R78', poiCount: 56, gapScore: 56.0 },
    { gid: 'J3N2M2Y7X2V', poiCount: 56, gapScore: 56.0 },
  ],
};

// National summary from 01_national_summary.csv
export const nationalSummary = {
  totalChargers: 4707,
  mediumChargers: 2779,
  fastChargers: 723,
  uniqueProviders: 42,
};
