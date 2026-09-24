// 2v2 Map & Terrain System with Gravity & Platform Geometry
export const MAPS = {
    brawlhaven: {
        id: 'brawlhaven',
        name: 'BRAWLHAVEN',
        bgKey: 'map_brawlhaven',
        themeColor: '#38bdf8',
        gravity: 0.46,
        bounds: { minX: 40, maxX: 2440, minY: 40, maxY: 690 },
        platforms: [
            // Main solid floating island (solid top and sides, doubled width)
            { id: 'bh_main', x: 380, y: 540, width: 1680, height: 130, type: 'solid', label: 'Main Island' },
            // West Perch (Solid Obstacle)
            { id: 'bh_left_pod', x: 80, y: 440, width: 240, height: 24, type: 'solid', label: 'West Perch' },
            // East Perch (Solid Obstacle)
            { id: 'bh_right_pod', x: 2120, y: 440, width: 240, height: 24, type: 'solid', label: 'East Perch' },
            // Lower-Left Sky Tier (soft platform)
            { id: 'bh_tier_left', x: 580, y: 390, width: 440, height: 18, type: 'soft', label: 'Sky Tier West' },
            // Lower-Right Sky Tier (soft platform)
            { id: 'bh_tier_right', x: 1420, y: 390, width: 440, height: 18, type: 'soft', label: 'Sky Tier East' },
            // High Apex Sanctum (Center High Tier)
            { id: 'bh_apex', x: 990, y: 260, width: 460, height: 20, type: 'soft', label: 'Apex Sanctum' }
        ],
        spawns: [
            { x: 580, y: 470, facing: 0 },         // Blue P1
            { x: 820, y: 470, facing: 0 },         // Blue P2
            { x: 1620, y: 470, facing: Math.PI },   // Red P1 (P3)
            { x: 1860, y: 470, facing: Math.PI }    // Red P2 (P4)
        ]
    },
    great_hall: {
        id: 'great_hall',
        name: 'GREAT HALL',
        bgKey: 'map_great_hall',
        themeColor: '#fbbf24',
        gravity: 0.46,
        bounds: { minX: 40, maxX: 2440, minY: 40, maxY: 690 },
        platforms: [
            // Solid Grand Hall Floor (doubled width)
            { id: 'gh_floor', x: 200, y: 570, width: 2040, height: 110, type: 'solid', label: 'Citadel Floor' },
            // Lower-Left soft balcony
            { id: 'gh_left_low', x: 280, y: 440, width: 360, height: 18, type: 'soft', label: 'Left Balcony' },
            // Lower-Right soft balcony
            { id: 'gh_right_low', x: 1800, y: 440, width: 360, height: 18, type: 'soft', label: 'Right Balcony' },
            // Left Pillar Gate (Solid Obstacle)
            { id: 'gh_pillar_left', x: 680, y: 340, width: 300, height: 24, type: 'solid', label: 'West Pillar Gate' },
            // Right Pillar Gate (Solid Obstacle)
            { id: 'gh_pillar_right', x: 1460, y: 340, width: 300, height: 24, type: 'solid', label: 'East Pillar Gate' },
            // High Center Throne Spire
            { id: 'gh_throne', x: 1020, y: 240, width: 400, height: 20, type: 'soft', label: 'Emperor Throne' }
        ],
        spawns: [
            { x: 500, y: 500, facing: 0 },
            { x: 740, y: 500, facing: 0 },
            { x: 1700, y: 500, facing: Math.PI },
            { x: 1940, y: 500, facing: Math.PI }
        ]
    }
};

export class MapManager {
    constructor() {
        this.currentMapId = 'brawlhaven';
        this.currentMap = MAPS.brawlhaven;
    }

    setMap(mapId) {
        if (MAPS[mapId]) {
            this.currentMapId = mapId;
            this.currentMap = MAPS[mapId];
        }
    }

    getPlatforms() {
        return this.currentMap ? this.currentMap.platforms : [];
    }

    getSpawns() {
        return this.currentMap ? this.currentMap.spawns : [];
    }
}

export const mapManager = new MapManager();
