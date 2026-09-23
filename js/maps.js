// 2v2 Map & Terrain System with Gravity & Platform Geometry
export const MAPS = {
    brawlhaven: {
        id: 'brawlhaven',
        name: 'BRAWLHAVEN',
        bgKey: 'map_brawlhaven',
        themeColor: '#38bdf8',
        gravity: 0.46,
        bounds: { minX: 40, maxX: 1240, minY: 40, maxY: 690 },
        platforms: [
            // Main solid floating island (solid top and sides)
            { id: 'bh_main', x: 220, y: 540, width: 840, height: 120, type: 'solid', label: 'Main Island' },
            // Upper soft platform (pass-through from below, jump down with Down+Jump)
            { id: 'bh_top', x: 440, y: 370, width: 400, height: 16, type: 'soft', label: 'Sky Tier' }
        ],
        spawns: [
            { x: 320, y: 470, facing: 0 },         // Blue P1
            { x: 440, y: 470, facing: 0 },         // Blue P2
            { x: 840, y: 470, facing: Math.PI },   // Red P1 (P3)
            { x: 960, y: 470, facing: Math.PI }    // Red P2 (P4)
        ]
    },
    great_hall: {
        id: 'great_hall',
        name: 'GREAT HALL',
        bgKey: 'map_great_hall',
        themeColor: '#fbbf24',
        gravity: 0.46,
        bounds: { minX: 40, maxX: 1240, minY: 40, maxY: 690 },
        platforms: [
            // Solid Grand Hall Floor
            { id: 'gh_floor', x: 140, y: 570, width: 1000, height: 100, type: 'solid', label: 'Citadel Floor' },
            // Lower-Left soft platform
            { id: 'gh_left', x: 220, y: 430, width: 250, height: 16, type: 'soft', label: 'Left Balcony' },
            // Lower-Right soft platform
            { id: 'gh_right', x: 810, y: 430, width: 250, height: 16, type: 'soft', label: 'Right Balcony' },
            // High Center Throne tier
            { id: 'gh_center', x: 490, y: 310, width: 300, height: 16, type: 'soft', label: 'Throne Spire' }
        ],
        spawns: [
            { x: 260, y: 500, facing: 0 },
            { x: 380, y: 500, facing: 0 },
            { x: 900, y: 500, facing: Math.PI },
            { x: 1020, y: 500, facing: Math.PI }
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
