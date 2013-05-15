describe("Util", function() {
    describe("type", function() {
        it("should capture the name of the type of the object", function() {
            expect(fp.Util.type(123)).toBe("number");
        });
    });

    describe("isNanValue", function() {
        it("should indicate that a string is not a number", function() {
            expect(fp.Util.isNanValue("this is not NaN")).toBe(false);
        });

        it("should indicate that a normal number does not qualify as NaN", function() {
            expect(fp.Util.isNanValue(123)).toBe(false);
        });

        it("should indicate that a NaN value is not a number", function() {
            expect(fp.Util.isNanValue(NaN)).toBe(true);
        });
    });
});