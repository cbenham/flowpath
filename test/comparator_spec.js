describe("AscendingNumericComparator", function() {
    var comparator;

    beforeEach(function() {
        comparator = new ajs.AscendingNumericComparator();
    });

    it("should yield a negative number when the left hand side is less than the right hand side", function() {
        expect(comparator.compare(1, 2)).toBe(-1);
    });

    it("should yield a positive number when the left hand side is greater than the left hand side", function() {
        expect(comparator.compare(2, 1)).toBe(1);
    });

    it("should yield zero when the left and right hand sides are of equal value", function() {
        expect(comparator.compare(1, 1)).toBe(0);
    });
});

describe("NegationComparator", function() {
    var comparator;

    beforeEach(function() {
        comparator = new ajs.NegationComparator(new ajs.AscendingNumericComparator());
    });

    it("should yield a negative number when the right hand side is less then the right", function() {
        expect(comparator.compare(2, 1)).toBe(-1);
    });

    it("should yield a positive number when the right hand side is greater than the left", function () {
        expect(comparator.compare(1, 2)).toBe(1);
    });

    it("should yield zero when the left and right hand sides are of equal value", function() {
        expect(comparator.compare(1, 1)).toBe(0);
    });
});

describe("DescendingNumericComparator", function() {
    var comparator;

    beforeEach(function() {
        comparator = new ajs.DescendingNumericComparator();
    });

    it("should yield a negative number when the right hand side is less then the right", function() {
        expect(comparator.compare(2, 1)).toBe(-1);
    });

    it("should yield a positive number when the right hand side is greater than the left", function () {
        expect(comparator.compare(1, 2)).toBe(1);
    });

    it("should yield zero when the left and right hand sides are of equal value", function() {
        expect(comparator.compare(1, 1)).toBe(0);
    });
});