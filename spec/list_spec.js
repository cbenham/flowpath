describe("List", function() {
    var list;

    beforeEach(function() {
        list = new fp.List();
    });

    var assertListContents = function(list, expected) {
        var expectedArguments = expected.join(", ");
        var actualArguments = list.items.join(", ");
        expect(actualArguments).toBe(expectedArguments);
    };

    var assertArraysEqual = function(expectedItems, item) {
        expect(expectedItems.length).toBe(item.length);
    };

    describe("with no elements", function() {
        it("should be empty", function() {
            expect(list.isEmpty()).toBe(true);
        });

        it("should have a zero size", function() {
            expect(list.size()).toBe(0);
        });

        it("should be able to add contents of an array", function() {
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

        it("should be able to iterate over each item", function() {
            var eachElement = [];
            var eachIndex = [];
            list.each(function(item, index) {
                eachElement.push(item);
                eachIndex.push(index);
            });

            assertArraysEqual(initialItems, eachElement);
            assertArraysEqual([1, 2, 3, 4, 5, 6], eachIndex);
        });

        it("should be able to iterate over each item while condition holds true", function() {
            var eachElement = [];
            var eachIndex = [];
            list.eachWith(function(item, index) {
                eachElement.push(item);
                eachIndex.push(index);
                return item != 6;
            });

            assertArraysEqual(eachElement, [4, 5, 6]);
            assertArraysEqual(eachIndex, [1, 2, 3]);
        });

        it("should find the index for a specified item", function() {
            expect(list.indexOf(2)).toBe(4);
        });

        it("should return -1 if the item cannot be found", function() {
            expect(list.indexOf(9999)).toBe(-1);
        });

        it("should return true if the list contains a given element", function() {
            expect(list.contains(6)).toBe(true);
        });

        it("should return false if the list does not contain a given element", function() {
            expect(list.contains(9999)).toBe(false);
        });

        it("should return true if the list contains an element in the first position", function() {
            list = new fp.List([4, 7, 8]);
            expect(list.contains(4)).toBe(true);
        });

        it("should remove an item at a given location", function() {
            list.deleteAt(2);
            assertListContents(list, [4, 5, 3, 2, 1]);
        });

        it("should add items to the beginning", function() {
            list.prepend(99);
            assertListContents(list, [99].concat(initialItems));
        });

        it("should add contents of array to the beginning", function() {
            var expectedItems = [99, 98, 97];
            list.prependAll(expectedItems);
            assertListContents(list, expectedItems.concat(initialItems));
        });

        it("should prepend variable arguments", function() {
            list.prependAll(55, 66, 77);
            assertListContents(list, [55, 66, 77].concat(initialItems));
        });

        it("should prepend list", function() {
            var otherList = new fp.List([55, 66, 77]);
            list.prependAll(otherList);
            assertListContents(list, [55, 66, 77].concat(initialItems));
        });

        it("should be able to replace elements", function() {
            expect(list.replace(5, 99)).toBe(1);
            assertListContents(list, [4, 5, 6, 3, 2, 99]);
        });

        it("should raise an exception when replacing an element beyond the length of the list", function() {
            var replacingItemBeyondEndOfList = function() {
                list.replace(initialItems.length + 1, 8);
            };

            expect(replacingItemBeyondEndOfList).toThrow("Cannot replace element at index that does not exist: "
                + (initialItems.length + 1));
        });

        it("should raise an exception when replacing an element before the beginning of the list", function() {
            var replcingItemBeforeBeginningOfList = function() {
                list.replace(-1, 3);
            };

            expect(replcingItemBeforeBeginningOfList).toThrow("Cannot replace element at index that does not exist: -1");
        });

        it("should reverse the order of items", function() {
            list.reverse();
            assertListContents(list, [1, 2, 3, 6, 5, 4]);
        });

        it("should be able to insert a single item", function() {
            list.insert(3, 99);
            assertListContents(list, [4, 5, 6, 99, 3, 2, 1]);
        });

        it("should be able to insert an array of items", function() {
            list.insertAll(2, [55, 66, 77]);
            assertListContents(list, [4, 5, 55, 66, 77, 6, 3, 2, 1]);
        });

        it("should be able to insert variable arguments", function() {
            list.insertAll(2, 55, 66, 77);
            assertListContents(list, [4, 5, 55, 66, 77, 6, 3, 2, 1]);
        });

        it("should be able to insert elements of a list", function() {
            var otherList = new fp.List([55, 66, 77]);
            list.insertAll(2, otherList);
            assertListContents(list, [4, 5, 55, 66, 77, 6, 3, 2, 1]);
        });
    });

});