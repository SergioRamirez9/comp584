// Proper promise handling and Errors are caught and logged predictably
//Used this as reference: https://mary.codes/blog/advent_of_code/advent_of_code_2020_day_8/
(async () => {
    try {
        // Function to read the input file and process it
        async function fetchAndProcessInput() {
            // Fetch the input file
            // https://developer.mozilla.org/docs/Web/API/fetch
            const response = await fetch('/inputs/day8.txt');
            if (!response.ok) {
                throw new Error(`Failed to fetch input file: ${response.statusText}`);
            }

            // Read and parse the input file
            const text = await response.text();
            // Split by new line, filter non-empty, and then map to instruction format
            const instructions = text.split('\n')
                .filter(Boolean)
                .map(parseInstruction);

            // Call the main processing functions for Part 1 and Part 2
            const partOneResult = findAccumulatorBefore(instructions);
            const partTwoResult = fixProgramAndFindAccumulatorValue(instructions);

            return {partOneResult, partTwoResult};
        }

        // Parse an instruction into an object
        function parseInstruction(line) {
            const [operation, argument] = line.split(' ');
            // Split by whitespace and then parse by base 10, similar to a previous day problem
            // For this problem, this will basically remove the sign in front of the number
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
            return {operation, argument: parseInt(argument, 10)};
        }

        // Part 1: Find the accumulator value before any instruction is executed a second time
        function findAccumulatorBefore(instructions) {
            let accumulator = 0;
            let pointer = 0;
            const executed = new Set();

            while (!executed.has(pointer) && pointer < instructions.length) {
                executed.add(pointer);
                const {operation, argument} = instructions[pointer];
                switch (operation) {
                    case 'acc':
                        accumulator += argument;
                        pointer++;
                        break;
                    case 'jmp':
                        pointer += argument;
                        break;
                    case 'nop':
                        pointer++;
                        break;
                }
            }

            return accumulator;
        }

        // Part 2: Fix the program and find the accumulator's value after termination
        function fixProgramAndFindAccumulatorValue(instructions) {
            for (let i = 0; i < instructions.length; i++) {
                const original = instructions[i].operation;

                // Skip if the operation is 'acc'
                if (original === 'acc') continue;

                // Swap 'nop' and 'jmp' instructions only if original is == nop
                instructions[i].operation = original === 'nop' ? 'jmp' : 'nop';

                const result = naivelyRunProgram(instructions);

                // Restore the original operation
                instructions[i].operation = original;

                // If the program terminates, return the accumulator value
                if (result.terminated) {
                    return result.accumulator;
                }
            }

            throw new Error('No valid fix found');
        }

        // Execute the program and check for termination, reuse findAccumulator logic
        function naivelyRunProgram(instructions) {
            let accumulator = 0;
            let pointer = 0;
            const executed = new Set();

            while (!executed.has(pointer) && pointer < instructions.length) {
                executed.add(pointer);
                const {operation, argument} = instructions[pointer];
                switch (operation) {
                    case 'acc':
                        accumulator += argument;
                        pointer++;
                        break;
                    case 'jmp':
                        pointer += argument;
                        break;
                    case 'nop':
                        pointer++;
                        break;
                }
            }

            return {accumulator, terminated: pointer >= instructions.length};
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
