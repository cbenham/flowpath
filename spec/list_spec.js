describe("List", function() {
    var list;

    beforeEach(function() {
        list = new fp.List();
    });

    var assertListContents = function(expected) {
        expect(list.size()).toBe(expected.length);
        for(var index in expected) {
            expect(list.get(index)).toBe(expected[index]);
        }
    };

    describe("with no elements", function() {
        it("should be empty", function() {
            expect(list.isEmpty()).toBe(true);
        });

        it("should have a zero size", function() {
            expect(list.size()).toBe(0);
        });

        it("should be able to add contents of a list", function() {
            var expected = [3, 4, 5, 6];
            list.addAll(expected);
            assertListContents(expected);
        });

        it("should be able to add variable set of arguments", function() {
            list.addAll(8, 3, 7, 2);
            assertListContents([8, 3, 7, 2]);
        });
    });

    describe("with one element", function() {
        beforeEach(function() {
            list.add(5);
        });

        it("should take an item and store it", function() {
            expect(list.get(0)).toBe(5);
        });
        
        it("should append newly added items to the end of the list", function() {
            list.add(4);
            expect(list.get(1)).toBe(4);
        });

        it("should not be empty when it has some content", function() {
            expect(list.isEmpty()).toBe(false);
        });

        it("should have a size greater than zero when it has some content", function() {
            expect(list.size()).toBe(1);
        });
    });

    describe("with many elements", function() {
        var initialItems = [4, 5, 6, 3, 2, 1];

        beforeEach(function() {
            for(var index in initialItems) {
                list.add(initialItems[index]);
            }
        });
        
        it("should yield the first element", function() {
            expect(list.first()).toBe(4);
        });

        it("should yield the last element", function() {
            expect(list.last()).toBe(1);
        });

        it("should be able to add contents of one list to another", function() {
            var expectedSecondListContents = [3, 2, 6, 8];
            var secondList = new fp.List();
            secondList.addAll(expectedSecondListContents);
            list.addAll(secondList);
            assertListContents(initialItems.concat(expectedSecondListContents));
        });
    });

});