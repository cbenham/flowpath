describe("List", function() {
    var list;

    beforeEach(function() {
        list = new fp.List();
    });

    var assertListContents = function(list, expected) {
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
            assertListContents(list, expected);
        });

        it("should be able to add variable set of arguments", function() {
            list.addAll(8, 3, 7, 2);
            assertListContents(list, [8, 3, 7, 2]);
        });

        it("should be able to be constructed with an array", function() {
            var expected = [5, 2, 6, 8];
            list = new fp.List(expected);
            assertListContents(list, expected);
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
            var secondList = new fp.List(expectedSecondListContents);
            list.addAll(secondList);
            assertListContents(list, initialItems.concat(expectedSecondListContents));
        });

        it("should be able to be constructed with contents of another list", function() {
            var secondList = new fp.List(list);
            assertListContents(secondList, initialItems);
        });
    });

});