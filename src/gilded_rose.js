class Item {
    constructor(name, sellIn, quality) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }
}

class ItemHandler {
    MAX_QUALITY;
    clamp(quality) { }
    update(quality, sellIn) { }
    support(name) { }
}

class DefaultItemHandler extends ItemHandler {
    MAX_QUALITY = 50;
    DEFAULT_QUALITY_DELTA = -1;

    clamp(quality) {
        if (quality > this.MAX_QUALITY) return this.MAX_QUALITY;
        if (quality < 0) return 0;
        return quality;
    }

    update(quality, sellIn) {
        quality = this.clamp(quality + this.DEFAULT_QUALITY_DELTA);
        sellIn -= 1;
        return {
            quality: quality,
            sellIn: sellIn
        };
    }

    support(name) {
        return true;
    }
}

class SulfurasHandler extends DefaultItemHandler {
    MAX_QUALITY = 80;

    update(quality, sellIn) {
        quality = this.MAX_QUALITY;

        return {
            quality: quality,
            sellIn: sellIn
        };
    }

    support(name) {
        return name === 'Sulfuras, Hand of Ragnaros';
    }
}

class AgedBrieHandler extends DefaultItemHandler {
    update(quality, sellIn) {
        if (sellIn < 0) {
            quality = 0;
        } else {
            quality = this.clamp(quality + 1);
        }
        sellIn -= 1;
        return {
            quality: quality,
            sellIn: sellIn
        };
    }

    support(name) {
        return name === 'Aged Brie';
    }
}

class BackstagePassesHandler extends DefaultItemHandler {
    update(quality, sellIn) {
        let delta = 1;
        if (sellIn <= 0) {
            quality = 0;
        } else if (sellIn <= 5) {
            delta = 3;
        } else if (sellIn <= 10) {
            delta = 2;
        } else if (sellIn > 10) {
            delta = 1;
        }

        quality = this.clamp(quality + delta);
        sellIn -= 1;

        return {
            quality: quality,
            sellIn: sellIn
        };
    }

    support(name) {
        return name === 'Backstage passes to a TAFKAL80ETC concert';
    }
}

class ConjuredItemHandler extends DefaultItemHandler {
    update(quality, sellIn) {
        quality = this.clamp(quality + this.DEFAULT_QUALITY_DELTA * 2);
        sellIn -= 1;

        return {
            quality: quality,
            sellIn: sellIn
        };
    }

    support(name) {
        return name.startsWith('Conjured');
    }
}

class ComplexItemHandler {
    handlers = [
        new SulfurasHandler(),
        new AgedBrieHandler(),
        new BackstagePassesHandler(),
        new ConjuredItemHandler(),
        new DefaultItemHandler(),
    ];

    handle(item) {
        for (const handler of this.handlers) {
            if (handler.support(item.name)) {
                const result = handler.update(item.quality, item.sellIn);
                item.quality = result.quality;
                item.sellIn = result.sellIn;
                return item;
            }
        }
    }
}

class Shop {
    constructor(items = []) {
        this.items = items;
    }

    complexHandler = new ComplexItemHandler();

    updateQuality() {
        return this.items.map((item) => {
            return this.complexHandler.handle(item);
        });
    }
}

module.exports = {
    Item,
    Shop
};
