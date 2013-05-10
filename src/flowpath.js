fp = {};

(function comparatorFunctions() {
    /**
     * Comparator for creating ascending orders.
     * @constructor
     */
    fp.AscendingRelationalComparator = function() {
    };

    /**
     * Compares two objects to determine which is greater. The arguments must be able to respond to the operators:
     * < and >
     * @param {*} left the left hand object to compare.
     * @param {*} right the right hand object to compare.
     * @returns {Number} -1, 0 or 1 as the left hand object is less than, equal to and greater than the right hand.
     * object
     */
    fp.AscendingRelationalComparator.prototype.compare = function(left, right) {
        if(left < right) {
            return -1;
        } else if(left > right) {
            return 1;
        } else {
            return 0;
        }
    };

    /**
     * Comparator for creating descending orders.
     * @constructor
     */
    fp.DescendingRelationalComparator = function() {
        this.delegateComparator = new fp.NegationComparator(new fp.AscendingRelationalComparator());
    };
    /**
     * Compares two objects to determine which is greater. The arguments must be able to respond to the operators:
     * < and >
     * @param {*} left the left hand object to compare.
     * @param {*} right the right hand object to compare.
     * @returns {Number} 1, 0 or -1 as the left hand object is greater than, equal to or less than the right hand.
     */
    fp.DescendingRelationalComparator.prototype.compare = function(left, right) {
        return this.delegateComparator.compare(left, right);
    };

    /**
     * Compares two objects by delegating to the compareTo method on the object itself.
     * @constructor
     */
    fp.CompareToComparator = function() {
    };

    /**
     * Compares two objects by delegating to the compareTo method on the left hand object. The compareTo method will
     * be passed a single argument which will be the right hand object.
     * @param {*} left the object on which compareTo(Object) will be called.
     * @param {*} right the object that is passed to the compareTo method.
     * @returns {Number} returns the result of the call to the compareTo method. For ascending order, the compareTo
     * method should return -1, 0 or 1 as the left hand object is less than, equal to or greater than the right hand
     * object. For descending order, the compareTo method should return 1, 0 or -1 as the left hand object is
     * greater than, equal to or less than the right hand object.
     */
    fp.CompareToComparator.prototype.compare = function(left, right) {
        return left.compareTo(right);
    };

    /**
     * Delegates to another comparator to negate it's outcome.
     * @param {Comparator} delegateComparator the comparator that will be delegated to for negation.
     * @constructor
     */
    fp.NegationComparator = function(delegateComparator) {
        this.delegateComparator = delegateComparator;
    };
    /**
     * Negates the outcome of the underlying comparator.
     * @param {*} left the left hand object to compare.
     * @param {*} right the right hand object to compare.
     * @returns {Number} the opposite of the underlying delegate. The following will be returned for given results from
     * the delegate:
     * <ul>
     *   <li>when the delegate returns -1, this object will return 1</li>
     *   <li>when the delegate returns 0, this object will return 0</li>
     *   <li>when the delegate returns 1, this object will return -1</li>
     * </ul>
     */
    fp.NegationComparator.prototype.compare = function(left, right) {
        return this.delegateComparator.compare(left, right) * -1;
    };
})();

(function hashFunctions() {
    fp.ToStringHashFunction = function() {};

    fp.ToStringHashFunction.prototype.hashCode = function(object) {
        return object.toString();
    };
})();

(function collections() {

    (function priorityQueueFunctions() {
        /**
         * Creates a PriorityQueue. By default, ordering is handled by the {@link fp.CompareToComparator}. A different
         * strategy may be used by supplying an alternate comparator as the second (optional) argument to this
         * constructor. This constructor may be invoked with zero, one or two parameters.
         * <ul>
         *     <li>Zero parameters: creates an empty queue.</li>
         *     <li> One parameter: when an array or priority queue, will add contents of said structure. Otherwise will
         *         treat parameter as a comparator resulting in an empty queue.</li>
         *     <li> Two parameters: the first parameter is treated as either an array or priority queue whose elements
         *         will be added to this queue. Second parameter is treated as a comparator.</li>
         * </ul>
         * It is not possible to pass a variable set of arguments.
         * @param {Array|fp.PriorityQueue} [initialItems] the items that will initially be placed in the queue. Unlike
         * {@link fp.PriorityQueue#addAll|addAll}, this constructor does not accept variable arguments.
         * @param {Comparator} [comparator] the comparator that will be used to order the items. The comparator should
         * have a method called compare, that takes two arguments (the items to compare) and returns -1, 0 or 1 when the
         * left hand argument is less than, equal to or greater than the right hand argument.
         * @throws an exception when an attempt is made to add a null or undefined item.
         * @constructor
         */
        fp.PriorityQueue = function() {
            this.queue = [];
            var items = [];
            this.comparator = new fp.CompareToComparator();

            if(arguments.length === 1) {
                if(arguments[0] instanceof Array) {
                    items = arguments[0];
                } else {
                    this.comparator = arguments[0];
                }
            } else if(arguments.length === 2) {
                items = arguments[0];
                this.comparator = arguments[1];
            }
            this.addAll(items);
        };

        /**
         * Get the highest priority item without modifying the queue. Use {@link fp.PriorityQueue#poll|poll} to remove
         * and retrieve and item at once.
         * @returns {Object} the item with the highest priority or null if the queue is empty.
         */
        fp.PriorityQueue.prototype.peek = function() {
            if(this.isEmpty()) {
                return null;
            }
            return this.queue[0];
        };

        /**
         * Gets the size of the queue.
         * @returns {Number} the number of elements in the queue.
         */
        fp.PriorityQueue.prototype.size = function() {
            return this.queue.length;
        };

        /**
         * Determines whether the queue is empty or not.
         * @returns {boolean} true if the queue is empty, false otherwise.
         */
        fp.PriorityQueue.prototype.isEmpty = function() {
            return this.queue.length === 0;
        };

        /**
         * Clears the queue, leaving it empty.
         */
        fp.PriorityQueue.prototype.clear = function() {
            this.queue.length = 0;
        };

        /**
         * Adds a single item to the queue. Use this method to add items of type array.
         * To add multiple items at once consider using {@link fp.PriorityQueue#addAll|addAll}.
         * @param item the item to add, Arrays will be added to the queue (as opposed its elements).
         * @throws an exception when an attempt is made to add a null or undefined item.
         */
        fp.PriorityQueue.prototype.add = function(item) {
            if(item === null || item === undefined) {
                throw 'Cannot add null or undefined items';
            }
            this.queue.push(item);
            siftUp.call(this, this.queue.length);
        };

        /**
         * Adds multiple items to the queue. This method should be used to add the contents of an array, var args or
         * another queue to this queue. Use {@link fp.PriorityQueue#add|add} to add an array or another queue as an
         * item in this queue.
         * @param {Array|Varargs|fp.PriorityQueue} collectionOfItems Adds the contents of the supplied collection,
         * leaving the parameter collection unchanged.
         * @throws an exception when an attempt is made to add a null or undefined item.
         */
        fp.PriorityQueue.prototype.addAll = function() {
            var items = arguments;
            if(arguments.length === 1) {
                items = extractCollection(items, arguments[0]);
            }
            for(var index = 0; index < items.length; index++) {
                this.add(items[index]);
            }
        };

        /**
         * Returns and removes the item with the highest priority.
         * @returns {Object} the next item of highest priority.
         */
        fp.PriorityQueue.prototype.poll = function() {
            if(this.isEmpty()) {
                return null;
            }

            var valueToReturn = this.queue[0];
            var lastElementIndex = this.size() - 1;
            this.queue[0] = this.queue[lastElementIndex];
            this.queue.splice(lastElementIndex, 1);
            siftDown.call(this, 0);
            return valueToReturn;
        };

        function extractCollection(items, collection) {
            if(collection instanceof Array) {
                return collection;
            } else if(collection instanceof fp.PriorityQueue) {
                return collection.queue;
            }
            return items;
        }

        function siftUp(initialIndex) {
            var currentIndex = initialIndex;
            var topReached = false;
            while(currentIndex > 1 && !topReached) {
                var parentIndex = Math.floor(currentIndex / 2);
                var parentItem = this.queue[parentIndex - 1];
                var currentItem = this.queue[currentIndex - 1];

                if(this.comparator.compare(currentItem, parentItem) < 0) {
                    this.queue[parentIndex - 1] = currentItem;
                    this.queue[currentIndex - 1] = parentItem;
                    currentIndex = parentIndex;
                } else {
                    topReached = true;
                }
            }
        }

        function indexOfMinimumChild(indexOfRightChild, indexOfLeftChild) {
            if(indexOfRightChild < this.queue.length) {
                var left = this.queue[indexOfLeftChild];
                var right = this.queue[indexOfRightChild];
                return this.comparator.compare(left, right) < 0 ? indexOfLeftChild : indexOfRightChild;
            } else {
                return indexOfLeftChild;
            }
        }

        function swap(indexOfMinimumItem, currentIndex) {
            var minimumItem = this.queue[indexOfMinimumItem];
            this.queue[indexOfMinimumItem] = this.queue[currentIndex];
            this.queue[currentIndex] = minimumItem;
        }

        function siftDown(initialIndex) {
            var length = this.queue.length;
            var currentIndex = initialIndex;

            var atEnd = false;
            while(!atEnd) {
                var indexOfLeftChild = (currentIndex * 2) + 1;
                var indexOfRightChild = indexOfLeftChild + 1;

                if(indexOfRightChild <= length) {
                    var indexOfMinimumItem = indexOfMinimumChild.call(this, indexOfRightChild, indexOfLeftChild);
                    if(this.comparator.compare(this.queue[indexOfMinimumItem], this.queue[currentIndex]) < 0) {
                        swap.call(this, indexOfMinimumItem, currentIndex);
                        currentIndex = indexOfMinimumItem;
                    } else {
                        atEnd = true;
                    }
                } else {
                    atEnd = true;
                }
            }
        }
    })();

    (function mapFunctions() {
        fp.Map = function() {
            this.hashFunction = new fp.ToStringHashFunction();
            this.entries = [];
            this.count = 0;
        };

        fp.Map.prototype.put = function(key, value) {
            var hashCode = this.hashFunction.hashCode(key);
            if(!this.contains(key)) {
                this.count++;
            }
            this.entries[hashCode] = value;
        };

        fp.Map.prototype.get = function(key) {
            return this.entries[this.hashFunction.hashCode(key)];
        };

        fp.Map.prototype.size = function() {
            return this.count;
        };

        fp.Map.prototype.isEmpty = function() {
            return this.count === 0;
        };

        fp.Map.prototype.contains = function(key) {
            return this.entries.hasOwnProperty(this.hashFunction.hashCode(key));
        };

        fp.Map.prototype.remove = function(key) {
            var hashCode = this.hashFunction.hashCode(key);
            if(!this.contains(key)) {
                return null;

            }
            var valueToReturn = this.get(key);
            delete this.entries[hashCode];
            this.count--;
            return valueToReturn;
        };
    })();

    (function listFunctions() {
        /**
         * Creates a new list. The list can be initially be empty or seeded with items.
         * <ul>
         *     <li>Zero parameters: creates an empty list.</li>
         *     <li>One parameter: when an array or list, will add its contents. Otherwise the parameter will
         *         be treated as a comparator, resulting in an empty list.</li>
         *     <li>Two parameters: the first parameter is expected to be either an array or list whose elements
         *         will be added to the new list. The second parameter will be treated as a comparator.</li>
         * </ul>
         * @param {Array|fp.List} [collection] A collection of items that will be copied into this list. Changes to
         * the collection will not affect the newly constructed list, vice versa changes to the list will not affect
         * the collection.
         * @param {Comparator} [comparator] The comparator that will be used when items need to be compared. The
         * comparator should have a method called compare, that takes two arguments (the items to compare) and returns
         * -1, 0 or 1 when the left hand argument is less than, equal to or greater than the right hand argument:
         * <pre><code>compare(left, right)</code></pre>
         * Unless otherwise specified, this comparator will be copied over to any lists that are returned as the result
         * of any operations.
         * @constructor
         */
        fp.List = function() {
            this.items = [];
            this.comparator = new fp.AscendingRelationalComparator();

            if(arguments.length === 1) {
                handleConstructionWithSingleArgument.call(this, arguments);
            } else if(arguments.length === 2) {
                this.addAll((arguments[0] instanceof fp.List) ? arguments[0].items : arguments[0]);
                this.comparator = arguments[1];
            } else if(arguments.length > 2) {
                throw new Error('May only construct a list with one or two arguments,' +
                    ' please refer to the "flowpath" documentation for details.');
            }
        };

        function handleConstructionWithSingleArgument(constructorArguments) {
            if(constructorArguments[0] instanceof fp.List) {
                this.addAll(constructorArguments[0].items);
            } else if(constructorArguments[0] instanceof Array) {
                this.addAll(constructorArguments[0]);
            } else {
                this.comparator = constructorArguments[0];
            }
        }

        (function mutators() {
            /**
             * Adds an item to the list.
             * @param {*} item The item to be added.
             */
            fp.List.prototype.add = function(item) {
                this.items.push(item);
            };

            /**
             * Adds the contents of the supplied collection but not the collection itself. The contents will be added
             * to the end in the order they are found.
             * @param {Array|fp.List|varargs} arguments The collection or varargs which are to be added. When the first
             * argument is an array or list its contents will be added in order. When the first argument is neither an
             * array or list, the arguments will be treated as variable arguments such that each argument will be
             * added in turn.
             */
            fp.List.prototype.addAll = function() {
                var itemArguments = convertToArguments(arguments);
                for(var index = 0; index < itemArguments.length; index++) {
                    this.add(itemArguments[index]);
                }
            };

            /**
             * Empties the list.
             */
            fp.List.prototype.clear = function() {
                this.items.length = 0;
            };

            /**
             * Adds a single item to the beginning of the list, pushing all elements along one position.
             * @param {*} item The item to be prepended.
             */
            fp.List.prototype.prepend = function(item) {
                this.items.unshift(item);
            };

            /**
             * Prepends the contents of the supplied collection but not the collection itself. The contents will be
             * added to the beginning of the list in the same order they appear in the source collection.
             * @param {Array|fp.List|varargs} arguments The collection or varargs which are to be prepended. When
             * the first argument is an array or list, its contents will be added in order. When the first argument is
             * neither an array or list, the arguments will be treated as variable arguments such that each argument
             * will be prepended.
             */
            fp.List.prototype.prependAll = function() {
                var itemArguments = convertToArguments(arguments);
                for(var index = itemArguments.length - 1; index >= 0; index--) {
                    this.prepend(itemArguments[index]);
                }
            };

            /**
             * Deletes the item at the specified index.
             * @param [Number] index The index of the element to delete. Can use negative numbers to delete from
             * a specific number of elements from the end of the list toward the beginning of the list.
             * @returns {*} The object at the index that is being deleted. Null will be returned when the
             * supplied index is greater than the size of the list or when the index is greater than the
             * negative size of the list.
             */
            fp.List.prototype.deleteAt = function(index) {
                if(index >= this.size() || index <= (this.size() + 1) * -1) {
                    return null;
                }
                return this.items.splice(index, 1)[0];
            };

            fp.List.prototype.deleteItem = function(itemToDelete) {
                var itemDeleted = false;
                this.eachWhile(function(item, index) {
                    if(this.comparator.compare(item, itemToDelete) === 0) {
                        this.deleteAt(index);
                        itemDeleted = true;
                        return false;
                    }
                    return true;
                });
                return itemDeleted;
            };

            /**
             * Replaces the item at the given index.
             * @param {Number} index The index at which the item will be placed. The index must be between negative size
             * and size - 1 inclusive.
             * @param {*} item The item that will replace the existing item.
             * @returns {*} The item that was previously at the given index.
             */
            fp.List.prototype.replace = function(index, item) {
                if(index < (-this.size()) || index > this.items.length - 1) {
                    throw new Error('Index out of range: ' + index + ', minimum: ' +
                        -this.size() + ', maximum: ' + (this.size() - 1));
                } else if(index < 0) {
                    index = this.size() + index;
                }
                var previousValue = this.items[index];
                this.items[index] = item;
                return previousValue;
            };

            /**
             * Reverses the order of this list.
             */
            fp.List.prototype.reverse = function() {
                this.items.reverse();
            };

           /**
            * Inserts a single item at the specified index. Use this method instead of
            * {@link fp.List#insertAll|insertAll} when attempting to add a collection object to the list.
            * @param {Number} insertionIndex The location at which the item will be inserted, shifting all succeeding
            * items to the right of the inserted item by one. Items can be inserted beyond the end of the list. In such
            * a case, all elements between the end of the list and the final resting place will be null. By using a
            * negative number, items can be inserted, counting from the end of the list. To insert an item in the last
            * element of the list use -1, second last use -2 etc. Negative indexes must be no less than the negative
            * size of the list.
            * @param {*} item The item that will be inserted at the specified index.
            * @throws {Error} If the <i>insertionIndex</i> is greater than the negative size of the list.
            */
            fp.List.prototype.insert = function(insertionIndex, item) {
                if (insertionIndex > this.size()) {
                    for(var i = this.size(); i < insertionIndex; i++) {
                        this.items.push(null);
                    }
                    this.items.push(item);
                } else if (insertionIndex < -this.size()) {
                    throw new Error('Index out of range: ' + insertionIndex + ' too small, minimum: ' + -this.size());
                } else {
                    this.items.splice(insertionIndex, 0, item);
                }
            };

            /**
             * Inserts a list, array or varargs at the specified index. By specifying a single vararg it is possible
             * to insert a single item. When attempting to add a collection object to the list instead of its contents
             * consider using {@link fp.List#insert|insert}.
             * @param {Number} insertionIndex The location at which the item will be inserted, shifting all succeeding
             * items to the right of the inserted items by one. Items can be inserted beyond the end of the list. In
             * such a case, all items between the end of the list and the final resting place will be null. By using a
             * negative number, items can be inserted, counting from the end of the list. To insert items in the last
             * element of the list and beyond, use -1, for second last use -2 etc. Negative indexes must be no less than
             * the negative size of the list.
             * @param {*} items The items that will be inserted at the specified index. These can be in the form of
             * another list, an array or variable arguments. It may also be a single argument by using a single
             * variable argument.
             * @throws {Error} If the <i>insertionIndex</i> is greater than the negative size of the list.
             */
            fp.List.prototype.insertAll = function(insertionIndex) {
                var sourceIndex = 1;
                var itemsToInsert = arguments;
                if(arguments.length === 2) {
                    sourceIndex = 0;
                    itemsToInsert = extractItemsToInsert(arguments[1]);
                }

                if (insertionIndex > this.size()) {
                    insertBeyondLength.call(this, insertionIndex, itemsToInsert);
                } else if (insertionIndex < -this.size()) {
                    throw new Error('Index out of range: ' + insertionIndex + ' too small, minimum: ' + -this.size());
                } else {
                    spliceIn.call(this, itemsToInsert, sourceIndex, insertionIndex);
                }
            };

            function extractItemsToInsert(argument) {
                if (argument instanceof fp.List || argument instanceof Array) {
                    return argument instanceof fp.List ? argument.items : argument;
                }
                return [argument];
            }

            function insertBeyondLength(insertionIndex, itemsToInsert) {
                var counter;
                for(counter = this.size(); counter < insertionIndex; counter++) {
                    this.items.push(null);
                }
                for(counter = 0; counter < itemsToInsert.length; counter++) {
                    this.items.push(itemsToInsert[counter]);
                }
            }

            function spliceIn(itemsToInsert, sourceIndex, insertionIndex) {
                for(var index = (itemsToInsert.length - 1); index >= sourceIndex; index--) {
                    this.items.splice(insertionIndex, 0, itemsToInsert[index]);
                }
            }

            function convertToArguments(args) {
                if(args.length === 1) {
                    return (args[0] instanceof fp.List) ? args[0].items : args[0];
                }
                return args;
            }
        })();

        (function accessors() {
            fp.List.prototype.get = function(index) {
                return this.items[index];
            };

            /**
             * Checks if the list is empty.
             * @returns {boolean} Returns true if this list contains no items.
             */
            fp.List.prototype.isEmpty = function() {
                return this.size() === 0;
            };

            /**
             * Returns the first item in the list.
             * @returns {*} The first item in the list or null if the list is empty.
             */
            fp.List.prototype.first = function() {
                if (this.isEmpty()) {
                    return null;
                }
                return this.get(0);
            };

            /**
             * Returns the last item in the list.
             * @returns {*} The last item in the list or null if the list is empty.
             */
            fp.List.prototype.last = function() {
                if (this.isEmpty()) {
                    return null;
                }
                return this.get(this.size() - 1);
            };

            /**
             * Builds an array from the list.
             * @returns {Array} Copy of the list as an array. Being a copy, changes to the returned array will have no
             * effects on the list and vice versa.
             */
            fp.List.prototype.toArray = function() {
                var copy = [];
                this.each(function(item) {
                    copy.push(item);
                });
                return copy;
            };

            /**
             * Creates a new list which is a copy of this list. The comparator used in the source list will be used
             * in the cloned list.
             * @returns {fp.List} Copy of the list as a new list. Being a copy, changes to the returned list will have
             * no effects on the source list and vice versa.
             */
            fp.List.prototype.clone = function() {
                return new fp.List(this.items, this.comparator);
            };

            /**
             * Retrieves the array that backs the list.
             * @returns {Array} The array backing the list, changes to the list will affect the array while
             * changes to the array will affect the list.
             */
            fp.List.prototype.raw = function() {
                return this.items;
            };
        })();

        (function queries() {
            /**
             * Counts the number of items in the list.
             * @returns {Number} The number of items in the list.
             */
            fp.List.prototype.size = function() {
                return this.items.length;
            };

            fp.List.prototype.contains = function(target) {
                return this.indexOf(target) !== null;
            };

            fp.List.prototype.indexOf = function(target) {
                for(var index = 0; index < this.items.length; index++) {
                    if(this.comparator.compare(this.items[index], target) === 0) {
                        return index;
                    }
                }
                return null;
            };

            /**
             * Finds the object with the lowest value. Comparative values are determined using the comparator the list
             * list was constructed with or the default if none was specified at construction time.
             * @returns {*} The object with the least value or null if the list is empty.
             */
            fp.List.prototype.min = function() {
                return findExtremeValue.call(this, function(minValue, currentItem) {
                    return this.comparator.compare(minValue, currentItem) > 0 ? currentItem : minValue;
                });
            };

            /**
             * Finds the object with the greatest value. Comparative values are determined using the comparator the list
             * was constructed with or the default if none was specified at construction time.
             * @returns {*} The object with the least value or null if the list is empty.
             */
            fp.List.prototype.max = function() {
                return findExtremeValue.call(this, function(maxValue, currentItem) {
                    return this.comparator.compare(maxValue, currentItem) < 0 ? currentItem : maxValue;
                });
            };

            function findExtremeValue(closure) {
                if(this.isEmpty()) {
                    return null;
                }
                return this.inject(this.get(0), closure);
            }
        })();

        (function iteration() {
            /**
             * Iterates over each element in the list passing it as arguments to the supplied closure. The receiver of
             * the closure is the list itself.
             * @param {Function} closure A closure that will be called, once for each item in the list. The closure
             * will be passed two arguments:
             * <ol>
             *     <li>item: the current item in the list</li>
             *     <li>index: the index of the current item in the list</li>
             * </ol>
             */
            fp.List.prototype.each = function(closure) {
                for(var index = 0; index < this.items.length; index++) {
                    closure.call(this, this.items[index], index);
                }
            };

            /**
             * Iterates over each element in the list while the supplied closure returns true. The receiver of the
             * closure is the list itself. Iteration continues while there remain items that haven't been iterated over
             * and while the closure returns true. To terminate iteration early, the closure must return false, null or
             * undefined.
             * @param {Function} closure A closure that will be called, once for each item in the list while it returns
             * true. The closure will be passed two arguments:
             * <ol>
             *     <li>item: the current item in the list</li>
             *     <li>index: the index of the current item in the list</li>
             * </ol>
             */
            fp.List.prototype.eachWhile = function(closure) {
                var continueIterating = true;
                for(var index = 0; index < this.items.length && isIntuitivelyTruthy(continueIterating); index++) {
                    continueIterating = closure.call(this, this.items[index], index);
                }
            };

            /**
             * Returns a new list containing the results returned by the supplied closure. The receiver of the closure
             * is the list itself.
             * @param {Function} closure The closure that will invoked for every element in the list. The closure is
             * called with two arguments:
             * <ol>
             *     <li>item: the current item in the list</li>
             *     <li>index: the index of the current item in the list</li>
             * </ol>
             * @returns {fp.List} A new list with the results of calling the closure for every element in the list.
             */
            fp.List.prototype.collect = function(closure) {
                var result = new fp.List(this.comparator);
                this.each(function(item, index) { result.add(closure.call(this, item, index)); });
                return result;
            };

            /**
             * Invokes the supplied closure, once for each element in this list. The closure is supplied with an
             * accumulated value every iteration. This accumulation is the result of the accumulation from a previous
             * call of the closure. The closure is passed the return value of the previous call to the closure, with the
             * exception of the first invocation where the accumulation is taken as the initialValue parameter. The
             * receiver of the closure is the list itself.
             * @param {*} initialValue the initial value of the accumulation, it is this value that will be first
             * passed to the closure.
             * @param {Function} closure a closure that is invoked, once for every item in the list. The closure is
             * called with up to three arguments in the following order:
             * <ol>
             *     <li>accumulation: the currently accumulated value</li>
             *     <li>item: the current item in the list</li>
             *     <li>index: the index of the current item</li>
             * </ol>
             * @returns {*} The value of the accumulation after the final invocation of the closure.
             */
            fp.List.prototype.inject = function(initialValue, closure) {
                var accumulation = initialValue;
                this.each(function(item, index) { accumulation = closure.call(this, accumulation, item, index); });
                return accumulation;
            };

            /**
             * Inspects the list to determine if there are any elements meeting the conditions specified by the
             * closure. Iterates over each element while the condition specified by the closure is not met. Iteration
             * ceases when an element meets the requirements of the closure.
             * @param {Function} [closure] A function that will be called once for each item. If not supplied, the list
             * will be examined for non-null and non-undefined elements, if the list only contains such elements false
             * will be returned, true otherwise. The closure takes two arguments:
             * <ol>
             *     <li>item: the current item</li>
             *     <li>index: the index of the current item</li>
             * </ol>
             * @returns {boolean} True if any of the elements meet the condition specified by the closure, otherwise
             * false will be returned.
             */
            fp.List.prototype.any = function(closure) {
                var closureToUse = closure === undefined ? yieldArgumentClosure : closure;
                var result = false;
                this.eachWhile(function(item, index) {
                    result = closureToUse(item, index);
                    return !result;
                });
                return isIntuitivelyTruthy(result);
            };

            function isIntuitivelyTruthy(value) {
                //Use Number.isNaN and not isNaN because isNaN(undefined) is true while Number.isNaN(undefined) is not.
                if(value === 0 || Number.isNaN(value) || value === '') {
                    return true;
                }
                return !!value;
            }

            function yieldArgumentClosure(item) {
                return item;
            }
        })();

        (function factories() {
            /**
             * Recursively copies elements of all nested arrays and lists into a new list so all elements are at the
             * same level. The elements will appear in the order they are encountered. The receiver of the closure is
             * the source list itself.
             * @param {Comparator} [comparator] The comparator used by the returned list. Left unspecified, the
             * comparator used by the source list will be copied across.
             * @returns {fp.List} A new list with all elements copied into it.
             */
            fp.List.prototype.flatten = function(comparator) {
                var accumulator = new fp.List(comparator === undefined ? this.comparator : arguments[0]);
                this.each(function(item) { flattenAndAccumulate.call(this, accumulator, item); });
                return accumulator;
            };

            function flattenAndAccumulate(accumulator, itemToAdd) {
                if (itemToAdd instanceof fp.List) {
                    itemToAdd.each(function(item) { flattenAndAccumulate.call(itemToAdd, accumulator, item); });
                } else if (itemToAdd instanceof Array) {
                    var listArray = new fp.List();
                    listArray.items = itemToAdd; //Avoid having the constructor copy the array of items over.
                    listArray.each(function(item) { flattenAndAccumulate.call(listArray, accumulator, item); });
                } else {
                    accumulator.add(itemToAdd);
                }
            }
        })();
    })();

})();