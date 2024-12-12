// Proper promise handling and Errors are caught and logged predictably
(async () => {
    try {
        // Function to read the input file and process it
        async function fetchAndProcessInput() {
            // Fetch the input file
            // https://developer.mozilla.org/docs/Web/API/fetch
            const response = await fetch('/inputs/day2.txt');
            if (!response.ok) {
                throw new Error(`Failed to fetch input file: ${response.statusText}`);
            }

            // Read and parse the input file
            const text = await response.text();
            // Each line represents a password policy and password
            const lines = text.split('\n').filter(Boolean);

            // Call the main processing functions for Part 1 and Part 2
            const partOneResult = countValidPasswordsPartOne(lines);
            const partTwoResult = countValidPasswordsPartTwo(lines);

            return { partOneResult, partTwoResult };
        }

        // Function to count valid passwords based on the old policy (Part 1)
        function countValidPasswordsPartOne(lines) {
            let validCount = 0;
            for (const line of lines) {
                // Parse the policy and password by the delimiters
                const [policy, password] = line.split(': ');
                const [range, letter] = policy.split(' ');
                const [min, max] = range.split('-').map(Number);

                // Count occurrences of the letter in the password
                const letterCount = [...password].filter(char => char === letter).length;

                // Check if it satisfies the policy
                if (letterCount >= min && letterCount <= max) {
                    validCount++;
                }
            }
            return validCount;
        }

        // Function to count valid passwords based on the new policy (Part 2)
        function countValidPasswordsPartTwo(lines) {
            let validCount = 0;
            for (const line of lines) {
                // Parse the policy and password by the delimiters
                const [policy, password] = line.split(': ');
                const [positions, letter] = policy.split(' ');
                // Convert to zero-based index
                const [pos1, pos2] = positions.split('-')
                    .map(pos => Number(pos) - 1);

                // Check if the letter appears in exactly one of the two positions
                const firstMatch = password[pos1] === letter;
                const secondMatch = password[pos2] === letter;

                if (firstMatch !== secondMatch) {
                    validCount++;
                }
            }
            return validCount;
        }

        // Call the fetch and process function and get results
        const { partOneResult, partTwoResult } = await fetchAndProcessInput();

        // Pass the results back into the HTML for Part 1 and Part 2
        // https://developer.mozilla.org/docs/Web/API/Document/getElementById
        document.getElementById('solution-output-part1').textContent = `Part 1 Solution: ${partOneResult}`;
        document.getElementById('solution-output-part2').textContent = `Part 2 Solution: ${partTwoResult}`;
    } catch (error) {
        console.error('Error processing input:', error);
        document.getElementById('solution-output-part1').textContent = 'Error processing input. Check the console for details.';
        document.getElementById('solution-output-part2').textContent = 'Error processing input. Check the console for details.';
    }
})();
