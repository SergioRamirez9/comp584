// Proper promise handling and Errors are caught and logged predictably
(async () => {
    try {
        // Function to read the input file and process it
        async function fetchAndProcessInput() {
            // Fetch the input file
            // https://developer.mozilla.org/docs/Web/API/fetch
            const response = await fetch('/inputs/day1.txt');
            if (!response.ok) {
                throw new Error(`Failed to fetch input file: ${response.statusText}`);
            }

            // Read and parse the input file
            // Create an array then map each string to a Number and filter all correctly cast numbers
            const text = await response.text();
            const numbers = text.split('\n')
                .map(Number)
                .filter(Boolean);

            // Call the main processing functions for Part 1 and Part 2
            const firstResult = findProduct(numbers, 2020);
            const secondResult = findProductThree(numbers, 2020);

            return {firstResult, secondResult};
        }

        // Function to find the product of two numbers that sum to the target
        // Can be used for any targetSum
        // This is essentially two sum from Leetcode
        function findProduct(entries, targetSum) {
            // Hashmap to store already seen values
            const numberSeen = new Map();
            for (const number of entries) {
                const complement = targetSum - number;
                // Check if the complement exists in the hash map
                if (numberSeen.has(complement)) {
                    return complement * number;
                }
                // Add the current number to the map
                numberSeen.set(number, true);
            }
            return null;
        }

        // Function to find the product of three numbers that sum to the target
        // Implements three-sum logic using hash map for efficiency
        function findProductThree(entries, targetSum) {
            for (let i = 0; i < entries.length; i++) {
                // Hashmap to store complements for the current target
                const numberSeen = new Map();
                const currentTarget = targetSum - entries[i];
                for (let j = i + 1; j < entries.length; j++) {
                    const complement = currentTarget - entries[j];
                    // Check if the complement exists in the hash map
                    if (numberSeen.has(complement)) {
                        return entries[i] * entries[j] * complement;
                    }
                    // Add the current number to the map
                    numberSeen.set(entries[j], true);
                }
            }
            return null;
        }

        // Call the fetch and process function and get results
        const {firstResult, secondResult} = await fetchAndProcessInput();

        // Pass the results back into the HTML for Part 1 and Part 2
        // https://developer.mozilla.org/docs/Web/API/Document/getElementById
        document.getElementById('solution-output-part1').textContent = `Part 1 Solution: ${firstResult}`;
        document.getElementById('solution-output-part2').textContent = `Part 2 Solution: ${secondResult}`;
    } catch (error) {
        console.error('Error processing input:', error);
        document.getElementById('solution-output-part1').textContent = 'Error processing input. Check the console for details.';
        document.getElementById('solution-output-part2').textContent = 'Error processing input. Check the console for details.';
    }
})();
