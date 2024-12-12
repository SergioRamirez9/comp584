let sum = 0;

const t = process.argv.forEach((val, i) => {
    if (i > 1) {
        sum += Number(val);
    }
});

console.log(sum);

