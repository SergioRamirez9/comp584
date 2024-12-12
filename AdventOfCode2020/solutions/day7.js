// Proper promise handling and Errors are caught and logged predictably
// Used this as a reference: https://mary.codes/blog/advent_of_code/advent_of_code_2020_day_7/
(async () => {
    try {
        // Function to read the input file and process it
        async function fetchAndProcessInput() {
            // Fetch the input file
            // https://developer.mozilla.org/docs/Web/API/fetch
            const response = await fetch('/inputs/day7.txt');
            if (!response.ok) {
                throw new Error(`Failed to fetch input file: ${response.statusText}`);
            }

            // Read and parse the input file
            const text = await response.text();
            // Parse each line into a rule
            const rules = parseBagRules(text.split('\n').filter(Boolean));

            // Call the main processing functions for Part 1 and Part 2
            const targetOne = "shiny gold";
            const targetTwo = "shiny gold";
            const partOneResult = countBagsContainingTarget(rules, targetOne);
            const partTwoResult = countBagsInsideTarget(rules, targetTwo);

            return {partOneResult, partTwoResult};
        }

        // parse bag rules into a usable data structure
        function parseBagRules(lines) {
            const rules = {};
            for (const line of lines) {
                const [container, contained] = line.split(" bags contain ");
                const contents = contained.split(", ").map(item => {
                    const match = /(\d+) ([a-z ]+) bag/.exec(item);
                    return match ? {count: parseInt(match[1]), color: match[2]} : null;
                }).filter(Boolean);
                rules[container] = contents;
            }
            return rules;
        }

        // Function to count how many bag colors can eventually contain the target bag (Part 1)
        function countBagsContainingTarget(rules, target) {
            const canContainTarget = new Set();
            // Search through all bag rules to find bags that contain the target bag.
            function search(color) {
                for (const [container, contents] of Object.entries(rules)) {
                    // function returns true for any element of an array
                    if (contents.some(bag => bag.color === color)) {
                        if (!canContainTarget.has(container)) {
                            canContainTarget.add(container);
                            search(container);
                        }
                    }
                }
            }

            search(target);
            return canContainTarget.size;
        }

        // Function to count how many individual bags are required inside the target bag (Part 2)
        function countBagsInsideTarget(rules, target) {
            let count = 0;
            for (const {count: num, color} of rules[target] || []) {
                count += num + num * countBagsInsideTarget(rules, color);
            }
            return count;
        }

        // Call the fetch and process function and get results
        const {partOneResult, partTwoResult} = await fetchAndProcessInput();

        // Pass the results back into the HTML for Part 1 and Part 2
        // https://developer.mozilla.org/docs/Web/API/Document/getElementById
        document.getElementById('solution-output-part1').textContent = `Part 1 Solution: ${partOneResult}`;
        document.getElementById('solution-output-part2').textContent = `Part 2 Solution: ${partTwoResult}`;
    } catch (error) {
        // Pass the results back into the HTML for Part 1 and Part 2
        // https://developer.mozilla.org/docs/Web/API/Document/getElementById
        // console log errors
        console.error('Error processing input:', error);
        document.getElementById('solution-output-part1').textContent = 'Error processing input. Check the console for details.';
        document.getElementById('solution-output-part2').textContent = 'Error processing input. Check the console for details.';
    }
})();
