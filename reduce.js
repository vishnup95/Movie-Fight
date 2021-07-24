let people = [
    { name: 'Alice', age: 21 },
    { name: 'Max', age: 20 },
    { name: 'Doe', age: 21 },
    { name: 'Carl', age: 23 },
    { name: 'Sagan', age: 23 },
    { name: 'Harry', age: 22 },
    { name: 'Ron', age: 22 },
    { name: 'Hermoine', age: 22 }
];


function groupBy(arr, prop) {
    return arr.reduce((acc, prev) => {
        if (acc.hasOwnProperty(prev[prop])) {
            acc[prev[prop]].push(prev);
        } else {
            acc[prev[prop]] = [prev]
        }
        return acc;
    }, {})
}

const data = groupBy(people, 'age');
console.log(data);