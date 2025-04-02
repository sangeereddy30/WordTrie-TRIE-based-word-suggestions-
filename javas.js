class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (let char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    search(prefix) {
        let node = this.root;
        for (let char of prefix) {
            if (!node.children[char]) {
                return [];
            }
            node = node.children[char];
        }
        return this.collectWords(node, prefix);
    }

    collectWords(node, prefix) {
        let results = [];
        if (node.isEndOfWord) {
            results.push(prefix);
        }
        for (let char in node.children) {
            results.push(...this.collectWords(node.children[char], prefix + char));
        }
        return results;
    }
}

const trie = new Trie();

// Load words from words.txt
fetch('words.txt')
    .then(response => response.text())
    .then(text => {
        const words = text.split('\n').map(word => word.trim()).filter(word => word);
        words.forEach(word => trie.insert(word));
    })
    .catch(error => {
        console.error('Error loading words:', error);
    });

document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.getElementById("searchBox");
    const suggestionsContainer = document.getElementById("suggestions");

    searchBox.addEventListener("input", () => {
        const query = searchBox.value.trim();
        suggestionsContainer.innerHTML = ""; // Clear previous suggestions

        if (query) {
            const matches = trie.search(query).slice(0, 10); // Limit to 10 suggestions
            if (matches.length > 0) {
                suggestionsContainer.style.display = "block";
                matches.forEach(match => {
                    const div = document.createElement("div");
                    div.textContent = match;
                    div.addEventListener("click", () => {
                        searchBox.value = match;
                        suggestionsContainer.style.display = "none";
                    });
                    suggestionsContainer.appendChild(div);
                });
            } else {
                suggestionsContainer.style.display = "none";
            }
        } else {
            suggestionsContainer.style.display = "none";
        }
    });

    // Hide suggestions when clicking outside
    document.addEventListener("click", (e) => {
        if (!searchBox.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = "none";
        }
    });
});