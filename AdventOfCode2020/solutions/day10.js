// Proper promise handling and Errors are caught and logged predictably
// Most of the implementation comes from the comments of this post:
// https://www.reddit.com/r/adventofcode/comments/ka8z8x/2020_day_10_solutions/
// Also referenced chat gpt for this problem
(async () => {
    try {
        // Function to read the input file and process it
        async function fetchAndProcessInput() {
            const response = await fetch('/inputs/day10.txt');
            if (!response.ok) {
                throw new Error(`Failed to fetch input file: ${response.statusText}`);
            }

            const text = await response.text();
            // Get all non-empty numbers and cast to numbers and sort in ascending order
            const adapters = text.split('\n')
                .filter(Boolean)
                .map(Number)
                .sort((a, b) => a - b);

            // Call the main processing functions for Part 1 and Part 2
            const partOneResult = calculateJoltageDifferences(adapters);
            const partTwoResult = countDistinctArrangements(adapters);

            return {partOneResult, partTwoResult};
        }

        // Part 1: Calculate the product of 1-jolt and 3-jolt differences
        function calculateJoltageDifferences(adapters) {
            const deviceJoltage = Math.max(...adapters) + 3;
            // Add the outlet (0 jolts) and device's joltage
            adapters = [0, ...adapters, deviceJoltage];
            let oneJolt = 0;
            let threeJolt = 0;

            for (let i = 1; i < adapters.length; i++) {
                const difference = adapters[i] - adapters[i - 1];
                if (difference === 1) oneJolt++;
                if (difference === 3) threeJolt++;
            }

            return oneJolt * threeJolt;
        }

        // Part 2: Count the total number of distinct arrangements
        function countDistinctArrangements(adapters) {
            const deviceJoltage = Math.max(...adapters) + 3;
            adapters = [0, ...adapters, deviceJoltage]; // Add the outlet (0 jolts) and device's joltage
            // Initialize the dynamic programming array
            const dp = Array(adapters.length).fill(0);
            dp[0] = 1;

            for (let i = 1; i < adapters.length; i++) {
                for (let j = i - 1; j >= 0 && adapters[i] - adapters[j] <= 3; j--) {
                    // Add the ways to reach adapter `j`
                    dp[i] += dp[j];
                }
            }
            // The total ways to reach the last adapter
            return dp[dp.length - 1];
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
        // console log the error as well
        console.error('Error processing input:', error);
        document.getElementById('solution-output-part1').textContent = 'Error processing input. Check the console for details.';
        document.getElementById('solution-output-part2').textContent = 'Error processing input. Check the console for details.';
    }
})();
