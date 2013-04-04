describe("Map", function() {
    var map;

    beforeEach(function() {
        map = new fp.Map();
    });

    describe("with no elements", function() {
        it("should have an initial size of zero", function() {
            expect(map.size()).toBe(0);
        });

        it("should initially be empty", function() {
            expect(map.isEmpty()).toBe(true);
        });

        it("should not contain an arbitrary key", function() {
            expect(map.contains('arbitraryKey')).toBe(false);
        });

        it("should return null when attempting to remove an element", function() {
            expect(map.remove("arbitraryKey")).toBeNull();
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

        it("should replace the value of an existing key", function() {
            var expectedValue = "anotherValue";
            map.put("firstKey", expectedValue);
            expect(map.get("firstKey")).toBe(expectedValue);
        });

        it("should not grow in size when replacing an existing value", function() {
            map.put("firstKey", "anotherValue");
            expect(map.size()).toBe(1);
        });

        it("should accurately count the number of entries", function() {
            expect(map.size()).toBe(1);
        });

        it("should not be empty", function() {
            expect(map.isEmpty()).toBe(false);
        });

        it("should contain the given key", function() {
            expect(map.contains("firstKey")).toBe(true);
        });

        it("should yield the value of a key that is removed", function() {
            expect(map.remove("firstKey")).toBe("firstValue");
        });

        it("should not contain a removed key", function() {
            map.remove("firstKey");
            expect(map.contains("firstKey")).toBe(false);
        });

        it("should have one fewer elements when a key is removed", function() {
            map.remove("firstKey");
            expect(map.size()).toBe(0);
        });
    });
});