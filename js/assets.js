// Asset Manager for Multi-Pose Character Animation & Backgrounds
export class AssetManager {
    constructor() {
        this.images = {};
        this.isLoaded = {};

        this.poseKeys = ['idle', 'attack_light', 'attack_heavy', 'shield', 'hurt', 'ultimate'];

        this.tryAutoLoadDefaults();
    }

    tryAutoLoadDefaults() {
        const v = '10';
        // Background
        this.loadImage('background', `assets/background.png?v=${v}`);

        // Single fallback images
        this.loadImage('p1', `assets/p1.png?v=${v}`);
        this.loadImage('p2', `assets/p2.png?v=${v}`);

        const allChars = ['yanagi', 'velina', 'nicole', 'trigger', 'vivian', 'jotaro', 'goku', 'giorno'];
        allChars.forEach(char => {
            this.loadImage(`${char}_idle`, `assets/${char}/idle.png?v=${v}`);
        });

        // Yanagi and Velina specific multi-poses if present
        this.poseKeys.forEach(pose => {
            this.loadImage(`yanagi_${pose}`, `assets/yanagi/${pose}.png?v=${v}`);
            this.loadImage(`velina_${pose}`, `assets/velina/${pose}.png?v=${v}`);
        });
    }

    loadImage(key, src) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            this.images[key] = img;
            this.isLoaded[key] = true;
            console.log(`[AssetManager] Loaded: ${key}`);
        };
        img.onerror = () => {
            this.images[key] = null;
            this.isLoaded[key] = false;
        };
        img.src = src;
    }

    loadFromFile(key, file) {
        return new Promise((resolve, reject) => {
            if (!file) return reject('No file');
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    this.images[key] = img;
                    this.isLoaded[key] = true;
                    resolve(img);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    getImage(key) {
        return this.isLoaded[key] ? this.images[key] : null;
    }

    // Get specific pose sprite with hierarchical fallback:
    // e.g. yanagi_attack_light -> yanagi_idle -> p1 -> null
    getCharacterSprite(characterId, pose = 'idle') {
        const primaryKey = `${characterId}_${pose}`;
        if (this.isLoaded[primaryKey]) {
            return this.images[primaryKey];
        }

        // Fallback 1: Character's idle pose
        const idleKey = `${characterId}_idle`;
        if (this.isLoaded[idleKey]) {
            return this.images[idleKey];
        }

        // Fallback 2: Generic p1 or p2 image
        const genericKey = characterId === 'yanagi' ? 'p1' : 'p2';
        if (this.isLoaded[genericKey]) {
            return this.images[genericKey];
        }

        return null;
    }
}

export const assets = new AssetManager();
