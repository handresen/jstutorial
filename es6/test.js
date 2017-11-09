

"use strict";


const sentences=[
    { subject: "JavaScript", verb: "is", object: "great"},
    { subject: "Elephants", verb: "are", object: "large"}, 
];

function say({subject, verb, object}){
    console.log(`${subject} ${verb} ${object}`);
}

for(let s of sentences) {
    say(s);
}

const obj= {a:7, b:9};
const {a,b}= obj;

console.log("a:"+a+" b:"+b);

const o={
    name:"Håvard",
    scream() {return "Aaargh";}
};

console.log(o.scream());


const håvard = {name:"Håvard"};
function greet(age, address)
{
    console.log("I am "+this.name+ " aged "+age + " at "+address);
}
greet.call(håvard,47,"Høgåsveien 17A");
greet.apply(håvard, [47,"Høgåsveien 17A"]);

const printHåvard = greet.bind(håvard);

printHåvard(47,"Fortsatt Høgåsveien 17");

let globalFunc;
{
    let blockVar='a';
    globalFunc=function()
    {
        console.log(blockVar);
    };
}

globalFunc();

(function(){
    console.log("IIFE - immediately invoked function expression");
})();

const arr = [1,2,3];
const arr2=arr.concat(4,5,6);

console.log(arr2);

const arr3= [0,1,2,3,4,5,6];

console.log(arr3.slice(3));

const a4=[{name:"Qi", income:9},{name:"HAL", income:17},{name:"HA", income:7} ];
a4.sort((a,b)=>a.income>b.income);
console.log(a4);

console.log(a4.map(a=>a.name));

const f=function(a){return a.income;};
console.log(a4.map(f));

const a5=[10,11,12];
const a6=[90,91,92];
console.log(a5.map((a,i)=>a+a6[i]));

const cards = [];
for(let suit of ['H','C','D','S'])
{
    for(let value=1;value<=13;value++)
        cards.push({suit,value});
}

console.log(cards.filter(a=>a.suit=='H'));

const a7=[10,11,12,13];
const sum=a7.reduce((a,x)=>a+=x,0);
console.log("a7.reduce((a,x)=>a+=x,0) : ",sum);

const words=["Baseball", "Rodeo", "Angel", "Papya", "Uniform", "Joker", "Clover", "Bali", "Jekyll", "Unfit"];
const grouped=words.reduce((a,x)=>{
    if(!a[x[0]]) a[x[0]]=[];
    a[x[0]].push(x);
    return a;},{});
console.log("words.reduce : ",grouped);

