describe("PriorityQueue", function() {

    it("should yield the first element when peeking", function() {
        var underlyingData = [2, 67];
        var queue = new ajs.PriorityQueue(underlyingData);
        expect(queue.peek()).toBe(2);
    });

    it("should yield its size", function() {
        var underlyingData = [5, 3, 77];
        var queue = new ajs.PriorityQueue(underlyingData);
        expect(queue.size()).toBe(3);
    });

    it("should copy the seed data it is constructed with so it is entirely within control", function() {
        var underlyingData = [];
        var queue = new ajs.PriorityQueue(underlyingData);
        underlyingData.push(22);
        expect(queue.size()).toBe(0);
    });

    it("should be empty when it has no data", function() {
        var underlyingData = [];
        var queue = new ajs.PriorityQueue(underlyingData);
        expect(queue.isEmpty()).toBe(true);
    });

    it("should not be empty when it has data", function() {
        var underlyingData = [44];
        var queue = new ajs.PriorityQueue(underlyingData);
        expect(queue.isEmpty()).toBe(false);
    });
});
