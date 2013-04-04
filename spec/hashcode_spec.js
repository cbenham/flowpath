describe("Numeric Hashcode", function() {
    var hashFunction;

    beforeEach(function() {
        hashFunction = new fp.ToStringHashFunction();
    });

    it("should use the underlying numeric value to create a hash code", function() {
        expect(hashFunction.hashCode(5)).toBe("5");
    });

    it("should use convert arbitrary object to a string", function() {
        var object = {
            toString: function() { return "arbitrary"; }
        };

        expect(hashFunction.hashCode(object)).toBe("arbitrary");
    });
});