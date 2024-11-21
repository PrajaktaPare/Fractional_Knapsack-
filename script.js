
function animateItems(itemIndexes) {
    const sack = document.querySelector(".sack");
    sack.innerHTML = ""; 
    const spacing = 50; 
    const offsetTop = 50; 
    itemIndexes.forEach((index, i) => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("item");

        
        const itemNumber = document.createElement("span");
        itemNumber.textContent = `I${index + 1}`;
        itemElement.appendChild(itemNumber);

        
        const topPosition = offsetTop + (Math.floor(i / 5) * spacing); 
        const leftPosition = 100 + (i % 5) * spacing; 

        
        itemElement.style.top = `${topPosition}px`;
        itemElement.style.left = `${leftPosition}px`;

        sack.appendChild(itemElement);
    });
}


function calculateKnapsackProfit() {
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
            weight: weights[i],
            profit: profits[i],
            ratio: profits[i] / weights[i]
        });
    }

 
    items.sort((a, b) => b.ratio - a.ratio);

    let totalProfit = 0;
    let remainingCapacity = capacity;
    const sackItems = [];

   
    for (let i = 0; i < n; i++) {
        if (remainingCapacity === 0) break;

       
        if (items[i].weight <= remainingCapacity) {
   
            totalProfit += items[i].profit;
            remainingCapacity -= items[i].weight;
            sackItems.push({index: i, profitTaken: items[i].profit, remainingCapacity});
        } else {
           
            const fractionProfit = items[i].profit * (remainingCapacity / items[i].weight);
            totalProfit += fractionProfit;
            sackItems.push({index: i, profitTaken: fractionProfit, remainingCapacity: 0});
            remainingCapacity = 0; 
        }
    }

    
    document.getElementById("result").innerHTML = `Maximum Profit is: ${totalProfit}`;

    
    document.getElementById("itemCount").textContent = `Number of items: ${sackItems.length}`;

   
    updateTable(weights, profits);

    
    sackItems.sort((a, b) => {
        const ratioA = weights[a.index] / profits[a.index];  
        const ratioB = weights[b.index] / profits[b.index];  
        return ratioA - ratioB;  
    });

    updateDetailedTable(weights, profits, sackItems, capacity);

    
    animateItems(sackItems.map(item => item.index));
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

updateTable();



function updateDetailedTable(weights, profits, sackItems, initialCapacity) {
    const tableBody = document.querySelector("#detailedTable tbody");
    tableBody.innerHTML = ''; 

    let remainingCapacity = initialCapacity;

    sackItems.forEach(item => {
        const itemWeight = weights[item.index];
        const itemProfit = profits[item.index];

        
        const profitTaken = item.profitTaken;


        const row = tableBody.insertRow();
        const itemCell = row.insertCell(0);
        const profitCell = row.insertCell(1);
        const remainingCapacityCell = row.insertCell(2);

        itemCell.textContent = `I${item.index + 1}`; 
        profitCell.textContent = profitTaken.toFixed(2); 
        remainingCapacity -= itemWeight;
        if (remainingCapacity < 0) remainingCapacity = 0; 

        remainingCapacityCell.textContent = remainingCapacity >= 0 ? remainingCapacity : 0; 
    });
}
document.getElementById("calculate").addEventListener("click", calculateKnapsackProfit);

