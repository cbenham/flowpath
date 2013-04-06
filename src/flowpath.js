fp = {};

(function comparatorFunctions() {
    /**
     * Comparator for creating ascending orders.
     * @constructor
     */
    fp.AscendingRelationalComparator = function() {
    };
    /**
     * Compares two objects to determine which is greater.
     * @param left the left hand object to compare.
     * @param right the right hand object to compare.
     * @returns {number} -1, 0 or 1 as the left hand object is less than, equal to and greater than the right hand.
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
     * Compares two objects by delegating to the compareTo method on the object itself.
     * @constructor
     */
    fp.CompareToComparator = function() {
    };
    /**
     * Compares two objects by delegating to the compareTo method on the left hand object. The compareTo method will
     * be passed a single argument which will be the right hand object.
     * @param left the object on which compareTo(Object) will be called.
     * @param right the object that is passed to the compareTo method.
     * @returns {number} returns the result of the call to the compareTo method. For ascending order, the compareTo
     * method should return -1, 0 or 1 as the left hand object is less than, equal to or greater than the right hand
     * object. For descending order, the compareTo method should return 1, 0 or -1 as the left hand object is
     * greater than, equal to or less than the right hand object.
     */
    fp.CompareToComparator.prototype.compare = function(left, right) {
        return left.compareTo(right);
    };

    /**
     * Delegates to another comparator to negate it's outcome.
     * @param delegateComparator the comparator that will be delegated to for negation.
     * @constructor
     */
    fp.NegationComparator = function(delegateComparator) {
        this.delegateComparator = delegateComparator;
    };
    /**
     * Negates the outcome of the underlying comparator.
     * @param left the left hand object to compare.
     * @param right the right hand object to compare.
     * @returns {number} the opposite of the underlying delegate. The following will be returned for given results from
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

    /**
     * Comparator for creating descending orders.
     * @constructor
     */
    fp.DescendingRelationalComparator = function() {
        this.delegateComparator = new fp.NegationComparator(new fp.AscendingRelationalComparator());
    };
    /**
     * Compares two objects to determine which is greater.
     * @param left the left hand object to compare.
     * @param right the right hand object to compare.
     * @returns {number} 1, 0 or -1 as the left hand object is greater than, equal to or less than the right hand.
     */
    fp.DescendingRelationalComparator.prototype.compare = function(left, right) {
        return this.delegateComparator.compare(left, right);
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
         * Adds a single item to the queue. Use this method to add items of type Array.
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
         * @param {Array|Varargs|fp.PriorityQueue} Adds the contents of the supplied collection, leaving the
         * parameter collection unchanged.
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
            if (!this.contains(key)) {
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
        fp.List = function() {
            this.items = [];
            if(arguments.length === 1) {
                var firstArgument = arguments[0];
                var itemArguments = (firstArgument instanceof fp.List) ? firstArgument.items : firstArgument;
                this.addAll(itemArguments);
            }
        };

        fp.List.prototype.add = function(item) {
            this.items.push(item);
        };

        fp.List.prototype.get = function(index) {
            return this.items[index];
        };

        fp.List.prototype.isEmpty = function() {
            return this.size() === 0;
        };

        fp.List.prototype.size = function() {
            return this.items.length;
        };

        fp.List.prototype.first = function() {
            return this.get(0);
        };

        fp.List.prototype.last = function() {
            return this.get(this.size() - 1);
        };

        fp.List.prototype.addAll = function() {
            var itemArguments = arguments;
            if(arguments.length === 1) {
                var firstArgument = arguments[0];
                itemArguments = (firstArgument instanceof fp.List) ? firstArgument.items : firstArgument;
            }
            for(var index = 0; index < itemArguments.length; index++) {
                this.add(itemArguments[index]);
            }
        };
    })();

})();