// -------------------------------------------- NMI Algorithm --------------------------------------------

// [Description]
// The execution of this algorithm is also divided in 2 phases like in Louvain. Although, the optimization function is not the same.
// This time, instead of maximizing network's modularity, the goal is to find the minimum description length of the network. To calculate
// this quantity, map equation was used.

jNMI = function (array1, array2) {

    if (array1.length !== array2.length) return "Arrays should have the same length";

    // Entropy
    function entropy(array) {

        let entropy = 0;
        let aux = {};

        for (let i = 0; i < array.length; i++) {

            aux[array[i]] = aux[array[i]] || 0;
            aux[array[i]] = aux[array[i]] + 1;

        }

        (Object.keys(aux)).forEach(function (value, key) {

            entropy = entropy - (aux[value]/array.length) * Math.log2(aux[value]/(array.length));

        });

        return entropy
    }

    // Mutual Information
    function mutualInformation(array1, array2) {

        let aux2 = {}; // community number: size

        for (let i = 0; i < array2.length; i++) {

            aux2[array2[i]] = aux2[array2[i]] || 0;
            aux2[array2[i]] = aux2[array2[i]] + 1;

        }

        let clusters_array2 = {}; // community1: [node ids, ...], community2: [node ids, ...]

        (Object.keys(aux2)).forEach(function (value, key) {

            for (let j = 0; j < array2.length; j++) { // Iterating over array 2.

                if (value.toString() === array2[j].toString()) {

                    clusters_array2[value] = clusters_array2[value] || [];
                    clusters_array2[value].push(j);

                }
            }
        });

        let entropy_array = {};
        let array1_array2 = [];

        (Object.keys(clusters_array2)).forEach(function (value1, key1) { // For each cluster.

            array1_array2 = [];

            for (let j = 0; j < clusters_array2[value1].length; j++) { // In array1

                    array1_array2.push(array1[clusters_array2[value1][j]]);

            }

            entropy_array[value1] = entropy(array1_array2) * (array1_array2.length)/(array1.length);

        });

        let conditional_entropy = 0;

        (Object.values(entropy_array)).forEach(function (value) {

            conditional_entropy = conditional_entropy + value;

        });

        return (entropy(array1) - conditional_entropy);

    }

    // Normalized Mutual Information

    if(entropy(array1) + entropy(array2) === 0) {

        return 1

    } else {

        return (2 * mutualInformation(array1, array2) / (entropy(array1) + entropy(array2)));

    }

};

module.exports = {
    jNMI: jNMI
};