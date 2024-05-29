define([
    'js/rendering/map/hex'
], function (
    Hexagon
) {
    return class Grid {
        constructor(depth, size) {
            this.hexes = new Map();
    
            this.depth = Math.abs(depth);
            const d = this.depth;
    
            for (let q = -d; q <= d; q++) {
                for (let r = -d; r <= d; r++) {
                    if (Math.abs(q + r) <= d) {
                        this.hexes.set([q, r], new Hexagon(q, r, size));
                    }
                }
            }
        }
        allToList() {
            const list = [];
            this.hexes.forEach((h) => {
                list.push(h);
            });
            return list;
        }
    }
})