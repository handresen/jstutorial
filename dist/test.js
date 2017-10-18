

"use strict";

var sentences = [{ subject: "JavaScript", verb: "is", object: "great" }, { subject: "Elephants", verb: "are", object: "large" }];

function say(_ref) {
    var subject = _ref.subject,
        verb = _ref.verb,
        object = _ref.object;

    console.log(subject + " " + verb + " " + object);
}

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = sentences[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var s = _step.value;

        say(s);
    }
} catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
} finally {
    try {
        if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
        }
    } finally {
        if (_didIteratorError) {
            throw _iteratorError;
        }
    }
}

var obj = { a: 7, b: 9 };
var a = obj.a,
    b = obj.b;


console.log("a:" + a + " b:" + b);

var o = {
    name: "Håvard",
    scream: function scream() {
        return "Aaargh";
    }
};

console.log(o.scream());

var håvard = { name: "Håvard" };
function greet(age, address) {
    console.log("I am " + this.name + " aged " + age + " at " + address);
}
greet.call(håvard, 47, "Høgåsveien 17A");
greet.apply(håvard, [47, "Høgåsveien 17A"]);

var printHåvard = greet.bind(håvard);

printHåvard(47, "Fortsatt Høgåsveien 17");

var globalFunc = void 0;
{
    var blockVar = 'a';
    globalFunc = function globalFunc() {
        console.log(blockVar);
    };
}

globalFunc();

(function () {
    console.log("IIFE - immediately invoked function expression");
})();

var arr = [1, 2, 3];
var arr2 = arr.concat(4, 5, 6);

console.log(arr2);

var arr3 = [0, 1, 2, 3, 4, 5, 6];

console.log(arr3.slice(3));

var a4 = [{ name: "Qi", income: 9 }, { name: "HAL", income: 17 }, { name: "HA", income: 7 }];
a4.sort(function (a, b) {
    return a.income > b.income;
});
console.log(a4);

console.log(a4.map(function (a) {
    return a.name;
}));

var f = function f(a) {
    return a.income;
};
console.log(a4.map(f));

var a5 = [10, 11, 12];
var a6 = [90, 91, 92];
console.log(a5.map(function (a, i) {
    return a + a6[i];
}));

var cards = [];
var _arr = ['H', 'C', 'D', 'S'];
for (var _i = 0; _i < _arr.length; _i++) {
    var suit = _arr[_i];
    for (var value = 1; value <= 13; value++) {
        cards.push({ suit: suit, value: value });
    }
}

console.log(cards.filter(function (a) {
    return a.suit === 'H';
}));