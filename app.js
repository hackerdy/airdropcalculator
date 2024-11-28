// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;

// Expand the WebApp automatically
tg.expand();

// Show user greeting
const user = tg.initDataUnsafe?.user || {};
document.getElementById('app').insertAdjacentHTML(
    'afterbegin',
    `<h1>Welcome, ${user.first_name || 'User'}!</h1>`
);

// Format numbers with abbreviations
function formatNumber(value) {
    if (value >= 1_000_000_000) {
        return `$${(value / 1_000_000_000).toFixed(2)}B`;
    } else if (value >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(2)}M`;
    } else {
        return `$${value.toFixed(2)}`;
    }
}

// Parse shorthand inputs
function parseShorthand(value) {
    value = value.toUpperCase().trim();
    if (value.endsWith('M')) return parseFloat(value.slice(0, -1)) * 1_000_000;
    if (value.endsWith('B')) return parseFloat(value.slice(0, -1)) * 1_000_000_000;
    return parseFloat(value) || 0;
}

// Toggle between input methods
document.getElementById('calculation-method').addEventListener('change', function () {
    const method = this.value;
    document.getElementById('listing-price-group').style.display = method === 'listing-price' ? 'block' : 'none';
    document.getElementById('fdv-group').style.display = method === 'fdv' ? 'block' : 'none';
});

// Handle calculations
document.getElementById('calculate').addEventListener('click', function () {
    const method = document.getElementById('calculation-method').value;
    const totalSupply = parseShorthand(document.getElementById('total-supply').value);
    const allocation = parseShorthand(document.getElementById('allocation').value);

    if (!totalSupply || !allocation) {
        alert('Please provide valid Total Supply and Allocation!');
        return;
    }

    let fdv, listingPrice, allocationWorth;

    if (method === 'listing-price') {
        listingPrice = parseFloat(document.getElementById('listing-price').value);
        if (!listingPrice) {
            alert('Please enter a valid Listing Price!');
            return;
        }
        fdv = listingPrice * totalSupply;
        allocationWorth = allocation * listingPrice;
    } else {
        fdv = parseShorthand(document.getElementById('predicted-fdv').value);
        if (!fdv) {
            alert('Please enter a valid FDV!');
            return;
        }
        listingPrice = fdv / totalSupply;
        allocationWorth = allocation * listingPrice;
    }

    // Display results
    document.getElementById('fdv-result').textContent = formatNumber(fdv);
    document.getElementById('listing-price-result').textContent = `$${listingPrice.toFixed(4)}`;
    document.getElementById('allocation-worth').textContent = formatNumber(allocationWorth);
    document.getElementById('result').style.display = 'block';

    // Telegram button integration
    tg.MainButton.setText('Calculation Complete');
    tg.MainButton.show();
    tg.MainButton.onClick(() => tg.close());
});
