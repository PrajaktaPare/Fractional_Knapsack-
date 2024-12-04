function animateItems(itemIndexes, itemPercentages) {
    const sack = document.querySelector(".sack");
    sack.innerHTML = "";
    const spacing = 50;
    const offsetTop = 50;

    const totalItems = itemIndexes.length;
    const maxItemsPerRow = 5;
    const containerWidth = sack.offsetWidth;
    let itemSize = 20;

    const maxItemsInRow = Math.floor(containerWidth / itemSize);
    const rowsNeeded = Math.ceil(totalItems / maxItemsInRow);

    if (totalItems > maxItemsInRow * rowsNeeded) {
        itemSize = Math.max(containerWidth / totalItems - 5, 10);
    }

    let totalHeight = 0;

    itemIndexes.forEach((index, i) => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("item");

        const itemNumber = document.createElement("span");
        itemNumber.textContent = `I${index + 1}`;
        itemElement.appendChild(itemNumber);

        const itemPercentage = itemPercentages[i];

        if (itemPercentage === 1) {
            itemElement.style.backgroundColor = "blue";
        } else {
            itemElement.style.background = `linear-gradient(to right, blue ${itemPercentage * 100}%, white ${itemPercentage * 100}%)`;
            itemElement.style.color = "black";
        }

        itemElement.style.width = `${itemSize}px`;
        itemElement.style.height = `${itemSize}px`;
        itemElement.style.fontSize = "12px"

        const topPosition = offsetTop + (Math.floor(i / maxItemsPerRow) * spacing);
        const leftPosition = 100 + (i % maxItemsPerRow) * spacing;

        itemElement.style.top = `${topPosition}px`;
        itemElement.style.left = `${leftPosition}px`;

        sack.appendChild(itemElement);

        totalHeight = topPosition + itemSize;
    });
}

async function calculateKnapsackProfit() {
    clearPreviousResults();

    const weightsInput = document.getElementById("weights").value;
    const profitsInput = document.getElementById("values").value;
    const capacityInput = document.getElementById("capacity").value;

    const weights = weightsInput.split(',').map(Number);
    const profits = profitsInput.split(',').map(Number);
    const capacity = Number(capacityInput);

    const n = weights.length;
    const items = [];

    for (let i = 0; i < n; i++) {
        items.push({
            index: i,
            weight: weights[i],
            profit: profits[i],
            ratio: profits[i] / weights[i]
        });
    }

    items.sort((a, b) => b.ratio - a.ratio);

    let totalProfit = 0;
    let remainingCapacity = capacity;
    const sackItems = [];
    const itemPercentages = [];

    for (let i = 0; i < n; i++) {
        if (remainingCapacity === 0) break;

        const item = items[i];
        let profitTaken, weightUsed;
        let itemPercentage = 1;

        if (item.weight <= remainingCapacity) {
            profitTaken = item.profit;
            weightUsed = item.weight;
            remainingCapacity -= weightUsed;
        } else {
            profitTaken = item.profit * (remainingCapacity / item.weight);
            weightUsed = remainingCapacity;
            remainingCapacity = 0;
            itemPercentage = weightUsed / item.weight;
        }

        totalProfit += profitTaken;
        sackItems.push({
            index: item.index,
            profitTaken,
            weightUsed,
            remainingCapacity
        });

        itemPercentages.push(itemPercentage);

        await updateDetailedTableRow(item.index + 1, weightUsed, profitTaken, totalProfit, remainingCapacity);
        
        animateItems(sackItems.map(item => item.index), itemPercentages);

        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    document.getElementById("result").innerHTML = `Maximum Profit is: ${totalProfit.toFixed(2)}`;
    document.getElementById("itemCount").textContent = `Number of items: ${sackItems.length}`;
}

function clearPreviousResults() {
    const tableBody = document.querySelector("#detailedTable tbody");
    tableBody.innerHTML = '';

    const sack = document.querySelector(".sack");
    sack.innerHTML = '';
}

async function updateDetailedTableRow(itemNumber, weightUsed, profitTaken, totalProfit, remainingCapacity) {
    const tableBody = document.querySelector("#detailedTable tbody");

    const row = tableBody.insertRow();

    const itemCell = row.insertCell(0);
    const profitCell = row.insertCell(1);
    const weightCell = row.insertCell(2);

    const initialProfit = totalProfit - profitTaken;
    const initialCapacity = remainingCapacity + weightUsed;

    itemCell.textContent = `I${itemNumber}`;
    profitCell.textContent = `${initialProfit.toFixed(2)} + ${profitTaken.toFixed(2)} = ${totalProfit.toFixed(2)}`;
    weightCell.textContent = `${initialCapacity.toFixed(2)} - ${weightUsed.toFixed(2)} = ${remainingCapacity.toFixed(2)}`;
}

function updateTable() {
    const weightsInput = document.getElementById("weights").value;
    const profitsInput = document.getElementById("values").value;

    const weights = weightsInput.split(',').map(Number);
    const profits = profitsInput.split(',').map(Number);

    const itemCount = weights.length;

    document.getElementById("itemCount").textContent = `Number of items: ${itemCount}`;

    const tableBody = document.querySelector("#resultTable tbody");
    tableBody.innerHTML = '';

    for (let i = 0; i < itemCount; i++) {
        const weight = weights[i];
        const profit = profits[i];
        const ratio = profit / weight;

        const row = tableBody.insertRow();
        const profitCell = row.insertCell(0);
        const weightCell = row.insertCell(1);
        const ratioCell = row.insertCell(2);

        profitCell.textContent = profit;
        weightCell.textContent = weight;
        ratioCell.textContent = ratio.toFixed(2);
    }
}

document.getElementById("weights").addEventListener("input", updateTable);
document.getElementById("values").addEventListener("input", updateTable);
document.getElementById("calculate").addEventListener("click", calculateKnapsackProfit);
