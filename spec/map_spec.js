describe("Map", function() {
    var map;

    beforeEach(function() {
        map = new ajs.Map();
    });

    describe("with no elements", function() {
        it("should have an initial size of zero", function() {
            expect(map.size()).toBe(0);
        });

        it("should initially be empty", function() {
            expect(map.isEmpty()).toBe(true);
        });
    });

    describe("with elements", function() {
        beforeEach(function() {
            map.put("firstKey", "firstValue");
        });

        it("should be able to map a value against a key", function() {
            expect(map.get("firstKey")).toBe("firstValue");
        });

        it("should be possible to add more than a single key/value pair", function() {
            map.put("secondKey", "secondValue");
            expect(map.get("firstKey")).toBe("firstValue");
            expect(map.get("secondKey")).toBe("secondValue");
        });

        it("should accurately count the number of entries when there are entries", function() {
            expect(map.size()).toBe(1);
        });

        it("should not be empty", function() {
            expect(map.isEmpty()).toBe(false);
        });
    });
});