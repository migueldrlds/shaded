
const filenames = [
    "SweatshortB3.jpg",
    "SweatshortG3.jpg",
    "HoodieB3.jpg",
    "HoodieG1.jpg",
    // Edge cases
    "SweatshortB1.jpg",
    "SweatshortB10.jpg",
    "SweatshortB2.jpg",
    "SweatshortG1.jpg",
    "SweatshortG10.jpg",
    "SweatshortG2.jpg",
    // Shopify URL simulation
    "https://cdn.shopify.com/s/files/1/0000/0000/files/SweatshortB3.jpg?v=1734898",
    "/products/SweatshortB3.jpg" // Relative path simulation
];

const getFilename = (url) => {
    try {
        // Hack to handle relative URLs by providing a base
        const validUrl = url.startsWith('http') ? url : `http://base.com${url.startsWith('/') ? '' : '/'}${url}`;
        const pathname = new URL(validUrl).pathname;
        const fullname = pathname.split('/').pop() || '';
        const name = fullname.split('.').slice(0, -1).join('.');
        return name;
    } catch (e) {
        console.log(`Error parsing ${url}: ${e.message}`);
        return '';
    }
};

const sorted = filenames.sort((a, b) => {
    const fileA = getFilename(a);
    const fileB = getFilename(b);
    const res = fileA.localeCompare(fileB, undefined, { numeric: true, sensitivity: 'base' });
    console.log(`Comparing ${fileA} vs ${fileB} -> ${res}`);
    return res;
});

console.log("--- FINAL SORTED ORDER ---");
sorted.forEach(f => console.log(f));
