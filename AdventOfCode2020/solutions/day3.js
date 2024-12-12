// Proper promise handling and Errors are caught and logged predictably
(async () => {
    try {
        // Function to read the input file and process it
        async function fetchAndProcessInput() {
            // Fetch the input file
            // https://developer.mozilla.org/docs/Web/API/fetch
            const response = await fetch('/inputs/day3.txt');
            if (!response.ok) {
                throw new Error(`Failed to fetch input file: ${response.statusText}`);
            }

            // Read and parse the input file
            const text = await response.text();
            // Create a grid from the input lines
            const grid = text.split('\n').filter(Boolean);

            // Call the main processing functions for Part 1 and Part 2
            // Given Slope to start: right 3, down 1
            const partOneResult = countNumberOfTrees(grid, 3, 1);
            const partTwoResult = calculateMultipleSlopes(grid);

            return {partOneResult, partTwoResult};
        }

        // Function to count trees encountered for a given slope
        function countNumberOfTrees(grid, right, down) {
            let treeCount = 0;
            let col = 0;

            for (let row = 0; row < grid.length; row += down) {
                // Check if the current position is a tree
                // grid[row].length is the length of the current row
                //fetch the current cell 
                if (grid[row][col % grid[row].length] === '#') {
                    treeCount++;
                }
                // Move to the right
                col += right;
            }

            return treeCount;
        }

        // Function to calculate the product of trees encountered for multiple slopes
        function calculateMultipleSlopes(grid) {
            // Simplest way to store all the slops 
            const slopes = [
                [1, 1],
                [3, 1],
                [5, 1],
                [7, 1],
                [1, 2],
            ];

            // For each slope get the count reusing the function from the first part
            // Reduce to the product of the number of trees for all slopes in the list
            return slopes
                .map(([right, down]) => countNumberOfTrees(grid, right, down))
                .reduce((product, trees) => product * trees, 1);
        }

        // Call the fetch and process function and get results
        const {partOneResult, partTwoResult} = await fetchAndProcessInput();

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
