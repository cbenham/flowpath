describe("List", function() {
    var list;

    var Item = function(value) {
        this.value = value;
    };

    var AscendingItemComparator = function() {
    };
    AscendingItemComparator.prototype.compare = function(left, right) {
        if(left.value < right.value) {
            return -1;
        } else if(left.value === right.value) {
            return 0;
        } else {
            return 1;
        }
    }

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

        it("should be able to find the index of a complex object when constructed with array of items", function() {
            var unwantedItem = new Item(3);
            var storedWantedItem = new Item(4);
            var targetItem = new Item(4);
            list = new fp.List([unwantedItem, storedWantedItem], new AscendingItemComparator());
            expect(list.indexOf(targetItem)).toBe(1);
        });

        it("should be able to find the index of a complex object when constructed with list of items", function() {
            var unwantedItem = new Item(3);
            var storedWantedItem = new Item(4);
            var targetItem = new Item(4);
            list = new fp.List(new fp.List([unwantedItem, storedWantedItem]), new AscendingItemComparator());
            expect(list.indexOf(targetItem)).toBe(1);
        });

        it("should be able to take a comparator as the sole argument upon construction", function() {
            list = new fp.List(new AscendingItemComparator());
            list.addAll([new Item(2), new Item(4), new Item(6)]);
            expect(list.indexOf(new Item(4))).toBe(1);
        });

        it("should raise an exception when constructed with more than two arguments", function() {
            var constructListWithMoreThanTwoArguments = function() {
                new fp.List(1, 2, 3);
            };

            expect(constructListWithMoreThanTwoArguments).toThrow('May only construct a list with one or two arguments,'
                + ' please refer to the "flowpath" documentation for details.');
        });

        it("should yield null when finding the minimum value", function() {
            expect(list.min()).toBeNull();
        });

        it("should yield null when finding the maximum value", function() {
            expect(list.max()).toBeNull();
        });

        it("should return an empty list when flattening", function() {
            expect(list.flatten().isEmpty()).toBe(true);
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
        var initialItems;

        beforeEach(function() {
            initialItems = [4, 5, 6, 3, 2, 1];
            list.addAll(initialItems);
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

        it("should copy contents of supplied array upon construction so changes do not affect the new list", function() {
            list = new fp.List(initialItems);
            initialItems.push(444);
            assertListContents(list, [4, 5, 6, 3, 2, 1 ]);
        });

        it("should copy contents of supplied list upon construction so changes do not affect the new list", function() {
            var newList = new fp.List(list);
            list.add(444);
            assertListContents(newList, [4, 5, 6, 3, 2, 1]);
        });

        it("should copy supplied array upon construction with comparator so new list is change tolerant", function() {
            list = new fp.List(initialItems, new AscendingItemComparator());
            initialItems.push(999);
            assertListContents(list, [4, 5, 6, 3, 2, 1]);
        });

        it("should copy contents of supplied list upon construction with comparator for change tolerance", function() {
            var newList = new fp.List(list, new AscendingItemComparator());
            list.add(77);
            assertListContents(newList, [4, 5, 6, 3, 2, 1]);
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

        it("should set the list as the receiver when calling each", function() {
            list.each(function(item, index) {
                expect(this instanceof fp.List).toBe(true);
            });
        });

        it("should be able to iterate over each item while condition holds true", function() {
            var eachElement = [];
            var eachIndex = [];
            list.eachWhile(function(item, index) {
                eachElement.push(item);
                eachIndex.push(index);
                return item != 6;
            });

            assertArraysEqual(eachElement, [4, 5, 6]);
            assertArraysEqual(eachIndex, [1, 2, 3]);
        });
        
        it("should set the list as the receiver when calling each while", function() {
            list.eachWhile(function(item, index) {
                expect(this instanceof fp.List).toBe(true);
            });
        });

        it("should find the index for a specified item", function() {
            expect(list.indexOf(2)).toBe(4);
        });

        it("should return -1 if the item cannot be found", function() {
            expect(list.indexOf(9999)).toBe(null);
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

        it("should return true when an item was found and deleted from the list", function() {
            expect(list.deleteItem(6)).toBe(true);
            assertListContents(list, [4, 5, 3, 2, 1]);
        });

        it("should return false when attempting to delete an item that cannot be found", function() {
            expect(list.deleteItem(999)).toBe(false);
            assertListContents(list, [4, 5, 6, 3, 2, 1]);
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
            var replacingItemBeforeBeginningOfList = function() {
                list.replace(-1, 3);
            };

            expect(replacingItemBeforeBeginningOfList).toThrow("Cannot replace element at index that does not exist: -1");
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

        it("should be possible to clear the list", function() {
            list.clear();
            expect(list.isEmpty()).toBe(true);
        });

        it("should yield an array of the contained elements when converting to an array", function() {
            var copy = list.toArray();
            assertListContents(list, copy);
        });

        it("should yield an array as a copy of the list such that modifications have no effect", function() {
            var copy =  list.toArray();
            copy.push(888);
            assertListContents(list, [4, 5, 6, 3, 2, 1]);

            var expected = [4, 5, 6, 3, 2, 1, 888];
            for(var index = 0; index < copy.length; index++) {
                expect(copy[index]).toBe(expected[index]);
            }
        });

        it("should be able to clone the original list", function() {
            var clone = list.clone();
            assertListContents(clone, [4, 5, 6, 3, 2, 1]);
        });

        it("should include the comparator of the original list when cloning it", function() {
            var expectedItem = new Item(9);
            var items = [new Item(3), expectedItem, new Item(5)];
            list = new fp.List(items, new AscendingItemComparator()).clone();
            expect(list.indexOf(expectedItem)).toBe(1);
        });

        it("should provide direct access to the underlying array backing the list", function() {
            expect(list.raw()).toBe(list.items);
        });

        it("should collect each item returned by the supplied function", function() {
            var result = list.collect(function(item) { return item * 2; });
            assertListContents(result, [8, 10, 12, 6, 4, 2]);
        });

        it("should collect each item returned by the supplied function and use the original comparator", function() {
            list = new fp.List([new Item(2), new Item(4), new Item(6)], new AscendingItemComparator());
            var result = list.collect(function(item, index) {
                return new Item(item.value * index + this.get(0).value);
            });
            expect(result.indexOf(new Item(14))).toBe(2);
        });

        it("should be able to accumulate on the array while injecting", function() {
            var result = list.inject(10, function(accumulator, item) { return accumulator + item + this.get(0); });
            expect(result).toBe(55);
        });
        
        it("should create a duplicate list when flattening", function() {
            var result = list.flatten();
            assertListContents(result, [4, 5, 6, 3, 2, 1]);
        });
    });

    describe("with arbitrary objects", function() {

        beforeEach(function() {
            list = new fp.List([new Item(4), new Item(9), new Item(5), new Item(3), new Item(7), new Item(8)],
                new AscendingItemComparator());
        });

        it("should be able to find the minimum value", function() {
            expect(list.min()).toBe(list.get(3));
        });

        it("should be able to find the maximum value", function() {
            expect(list.max()).toBe(list.get(1));
        });

    });

    describe("with nested collections", function() {
        it("should create a new list with a nested set of array elements", function() {
            list = new fp.List([1, 2, [3, 4], 5, 6]);
            assertListContents(list.flatten(), [1, 2, 3, 4, 5, 6]);
        });

        it("should create a new list with nested set of list elements", function() {
            var nested = new fp.List([3, 4]);
            list = new fp.List([1, 2, nested, 5, 6]);
            assertListContents(list.flatten(), [1, 2, 3, 4, 5, 6]);
        });

        it("should be able to flatten over multiple depths", function() {
            var innerNestedList = new fp.List([11, 12]);
            var nestedList = new fp.List([7, 8, [9, 10], innerNestedList, 13, 14]);
            list = new fp.List([1, 2, [3, 4, [5, 6], nestedList, 15, 16]]);
            assertListContents(list.flatten(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        });

        it("should use the comparator of the parent list when flattening", function() {
            list = new fp.List([new Item(1), [new Item(2)], new Item(3)], new AscendingItemComparator());
            expect(list.flatten().indexOf(new Item(2))).toBe(1);
        });
    });

});