// Proper promise handling and Errors are caught and logged predictably
(async () => {
    try {
        // Function to read the input file and process it
        async function fetchAndProcessInput() {
            // Fetch the input file
            // https://developer.mozilla.org/docs/Web/API/fetch
            const response = await fetch('/inputs/day6.txt');
            if (!response.ok) {
                throw new Error(`Failed to fetch input file: ${response.statusText}`);
            }

            // Read and parse the input file
            const text = await response.text();
            // Each group's answers are separated by a blank line
            // for each group split by the new line again and filter out any non-empty text
            const groups = text.split('\n\n')
                .map(group => group.split('\n').filter(Boolean));

            // Call the main processing functions for Part 1 and Part 2
            const partOneResult = totalSumInGroupForYes(groups);
            const partTwoResult = totalSumInGroupForYesPartTwo(groups);

            return {partOneResult, partTwoResult};
        }

        // Function to count the sum of questions anyone answered "yes" (Part 1)
        function totalSumInGroupForYes(groups) {
            // Reduce starting from 0
            return groups.reduce((sum, group) => {
                // By using a set we can keep uniqueness
                const uniqueAnswers = new Set(group.join(''));
                // Add the number of unique answers to the sum
                return sum + uniqueAnswers.size;
            }, 0);
        }

        // Function to count the sum of questions everyone answered "yes" (Part 2)
        function totalSumInGroupForYesPartTwo(groups) {
            return groups.reduce((sum, group) => {
                // Create an array of individual answer sets
                const individualAnswers = group.map(person => new Set(person));
                // Find the intersection of all sets in the group
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
                const commonAnswers = individualAnswers.reduce((intersection, answers) => {
                    return new Set([...intersection].filter(answer => answers.has(answer)));
                });
                // Add the number of common answers to the sum
                return sum + commonAnswers.size;
            }, 0);
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
        // Console.log error
        console.error('Error processing input:', error);
        document.getElementById('solution-output-part1').textContent = 'Error processing input. Check the console for details.';
        document.getElementById('solution-output-part2').textContent = 'Error processing input. Check the console for details.';
    }
})();
