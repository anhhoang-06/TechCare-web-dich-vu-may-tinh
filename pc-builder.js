const PC_PARTS = [
    {
        id: "cpu",
        label: "CPU",
        required: true,
        options: [
            { name: "AMD Ryzen 5 5600 (AM4)", price: 3200000, socket: "AM4", watt: 65 },
            { name: "AMD Ryzen 7 5700X (AM4)", price: 5200000, socket: "AM4", watt: 65 },
            { name: "AMD Ryzen 7 5800X3D (AM4)", price: 7500000, socket: "AM4", watt: 105 },
            { name: "AMD Ryzen 5 7600 (AM5)", price: 4500000, socket: "AM5", watt: 65 },
            { name: "AMD Ryzen 7 7800X3D (AM5)", price: 9500000, socket: "AM5", watt: 120 },
            { name: "AMD Ryzen 7 9700X (AM5)", price: 8500000, socket: "AM5", watt: 65 },
            { name: "Intel Core i3-12100F (LGA1700)", price: 2200000, socket: "LGA1700", watt: 58 },
            { name: "Intel Core i5-12400F (LGA1700)", price: 3500000, socket: "LGA1700", watt: 65 }
        ]
    },
    {
        id: "mainboard",
        label: "Mainboard",
        required: true,
        options: [
            { name: "MSI B450M-A PRO MAX (AM4)", price: 1500000, socket: "AM4" },
            { name: "ASUS TUF B550M-PLUS (AM4)", price: 2600000, socket: "AM4" },
            { name: "MSI PRO B650M-P (AM5)", price: 2800000, socket: "AM5" },
            { name: "ASUS TUF B650M-PLUS WIFI (AM5)", price: 4200000, socket: "AM5" },
            { name: "MSI PRO H610M-E DDR4 (LGA1700)", price: 1800000, socket: "LGA1700" },
            { name: "ASUS TUF B760M-PLUS D4 (LGA1700)", price: 3200000, socket: "LGA1700" }
        ]
    },
    {
        id: "ram",
        label: "RAM",
        required: true,
        options: [
            { name: "Kingston Fury 16GB (2x8) DDR4 3200", price: 1050000 },
            { name: "Corsair Vengeance 16GB (2x8) DDR4 3600", price: 1350000 },
            { name: "Kingston Fury 16GB (2x8) DDR5 5600", price: 1500000 },
            { name: "Corsair Vengeance 32GB (2x16) DDR5 6000", price: 2800000 }
        ]
    },
    {
        id: "storage",
        label: "Ổ cứng",
        required: true,
        options: [
            { name: "Kingston NV2 500GB NVMe", price: 950000 },
            { name: "Samsung 980 1TB NVMe", price: 1850000 }
        ]
    },
    {
        id: "vga",
        label: "Card đồ họa (VGA)",
        required: false,
        options: [
            { name: "Không cần VGA (dùng iGPU)", price: 0, watt: 0 },
            { name: "AMD Radeon RX 7600", price: 6500000, watt: 165 },
            { name: "AMD Radeon RX 7800 XT", price: 12000000, watt: 263 },
            { name: "AMD Radeon RX 9070 XT", price: 23000000, watt: 304 },
            { name: "NVIDIA GeForce RTX 5060", price: 9000000, watt: 145 },
            { name: "NVIDIA GeForce RTX 5070", price: 17500000, watt: 250 },
            { name: "NVIDIA GeForce RTX 5090", price: 55000000, watt: 575 }
        ]
    },
    {
        id: "psu",
        label: "Nguồn (PSU)",
        required: true,
        options: [
            { name: "Xigmatek X-Power 500W", price: 650000, watt: 500 },
            { name: "Corsair CV550 550W", price: 1050000, watt: 550 },
            { name: "Cooler Master MWE 650W Bronze", price: 1450000, watt: 650 },
            { name: "Corsair RM850e 850W Gold", price: 3200000, watt: 850 },
            { name: "Corsair HX1200i 1200W Platinum", price: 7500000, watt: 1200 }
        ]
    },
    {
        id: "case",
        label: "Vỏ case",
        required: true,
        options: [
            { name: "Xigmatek Trio 3F", price: 750000 },
            { name: "NZXT H5 Flow", price: 1950000 },
            { name: "Corsair 4000D Airflow", price: 2200000 }
        ]
    },
    {
        id: "cooler",
        label: "Tản nhiệt CPU",
        required: false,
        options: [
            { name: "Tản nhiệt khí stock", price: 0 },
            { name: "Thermalright Assassin X 120", price: 450000 },
            { name: "DeepCool AK400", price: 650000 }
        ]
    }
];

const selectedParts = {}; 
const partsContainer = document.getElementById("pc-builder-parts");
const summaryList = document.getElementById("pc-summary-list");
const totalPriceEl = document.getElementById("pc-total-price");
const warningEl = document.getElementById("pc-warning");
const addAllButton = document.getElementById("pc-add-all");
const resetButton = document.getElementById("pc-reset");

function formatPrice(value) {
    return `${value.toLocaleString("vi-VN")} VNĐ`;
}

function getSelectedCpuSocket() {
    return selectedParts.cpu?.socket || null;
}

function isMainboardCompatible(option) {
    const cpuSocket = getSelectedCpuSocket();
    if (!cpuSocket) return true; 
    return option.socket === cpuSocket;
}

function renderParts() {
    if (!partsContainer) return;
    partsContainer.replaceChildren();

    PC_PARTS.forEach((part) => {
        const group = document.createElement("div");
        group.className = "pc-part-group";

        const label = document.createElement("label");
        label.className = "pc-part-label";
        label.setAttribute("for", `pc-part-${part.id}`);
        label.textContent = part.label + (part.required ? " *" : " (tùy chọn)");

        const select = document.createElement("select");
        select.id = `pc-part-${part.id}`;
        select.className = "pc-part-select";
        select.dataset.partId = part.id;

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = `-- Chọn ${part.label} --`;
        select.append(placeholder);

        const compatibleOptions = part.id === "mainboard"
            ? part.options.filter(isMainboardCompatible)
            : part.options;
            
        const optionsToRender = compatibleOptions.length > 0 ? compatibleOptions : part.options;

        optionsToRender.forEach((option) => {
            const opt = document.createElement("option");
            opt.value = part.options.indexOf(option);
            opt.textContent = `${option.name} - ${formatPrice(option.price)}`;
            select.append(opt);
        });

        if (part.id === "mainboard" && compatibleOptions.length === 0) {
            select.disabled = true;
            placeholder.textContent = "-- Không có mainboard phù hợp socket --";
        }

        // Khôi phục trạng thái đã chọn
        if (selectedParts[part.id]) {
            const current = selectedParts[part.id];
            const stillValid = optionsToRender.some((opt) => opt.name === current.name);
            if (stillValid) {
                const idx = part.options.findIndex((opt) => opt.name === current.name);
                select.value = String(idx);
            } else {
                delete selectedParts[part.id];
                select.value = "";
            }
        }

        select.addEventListener("change", (event) => {
            const index = event.target.value;
            if (index === "") {
                delete selectedParts[part.id];
            } else {
                const option = part.options[Number(index)];
                selectedParts[part.id] = { 
                    ...option, 
                    partId: part.id, 
                    partLabel: part.label,
                    quantity: 1 // Mặc định số lượng là 1
                };
            }
            if (part.id === "cpu") {
                renderParts();
            }
            renderSummary();
        });

        group.append(label, select);

        // ===== BỔ SUNG: Ô chọn số lượng cho RAM =====
        if (part.id === "ram") {
            const qtyContainer = document.createElement("div");
            qtyContainer.className = "pc-part-qty";

            const qtyLabel = document.createElement("label");
            qtyLabel.textContent = "Số lượng:";
            qtyLabel.setAttribute("for", "ram-quantity");

            const qtySelect = document.createElement("select");
            qtySelect.id = "ram-quantity";
            qtySelect.className = "pc-part-qty-select";
            
            [1, 2, 3, 4].forEach(num => {
                const opt = document.createElement("option");
                opt.value = num;
                opt.textContent = `${num} thanh`;
                qtySelect.append(opt);
            });

            // Khôi phục số lượng nếu đã có
            if (selectedParts.ram && selectedParts.ram.quantity) {
                qtySelect.value = selectedParts.ram.quantity;
            }

            // Ẩn/hiện dựa vào việc đã chọn RAM chưa
            qtyContainer.hidden = !selectedParts.ram;

            qtySelect.addEventListener("change", (event) => {
                if (selectedParts.ram) {
                    selectedParts.ram.quantity = Number(event.target.value);
                    renderSummary();
                }
            });

            qtyContainer.append(qtyLabel, qtySelect);
            group.append(qtyContainer);

            // Gắn sự kiện cho select chính để bật/tắt ô số lượng
            select.addEventListener("change", (event) => {
                qtyContainer.hidden = event.target.value === "";
            });
        }

        partsContainer.append(group);
    });
}

function checkCompatibility() {
    const warnings = [];
    const cpu = selectedParts.cpu;
    const mainboard = selectedParts.mainboard;
    const vga = selectedParts.vga;
    const psu = selectedParts.psu;
    const ram = selectedParts.ram;

    if (cpu && mainboard && cpu.socket !== mainboard.socket) {
        warnings.push(`CPU (${cpu.socket}) không khớp socket với Mainboard (${mainboard.socket}).`);
    }

    if (ram && mainboard) {
        const ramIsDdr5 = /DDR5/i.test(ram.name);
        const ramIsDdr4 = /DDR4/i.test(ram.name);
        if (mainboard.socket === "AM5" && ramIsDdr4) {
            warnings.push("Mainboard AM5 chỉ hỗ trợ RAM DDR5, nhưng bạn đang chọn RAM DDR4.");
        }
        if (mainboard.socket === "AM4" && ramIsDdr5) {
            warnings.push("Mainboard AM4 chỉ hỗ trợ RAM DDR4, nhưng bạn đang chọn RAM DDR5.");
        }
    }

    // Cảnh báo nếu số lượng RAM > 2 (đa số mainboard phổ thông chỉ có 2 hoặc 4 khe)
    if (ram && ram.quantity > 2 && mainboard && mainboard.socket === "AM5") {
        // Có thể thêm cảnh báo nếu cần, nhưng tạm thời bỏ qua vì nhiều board AM5 có 4 khe
    }

    if (psu) {
        let estimatedWatt = 100;
        if (cpu && cpu.watt) estimatedWatt += cpu.watt;
        if (vga && vga.watt) estimatedWatt += vga.watt;

        if (psu.watt && estimatedWatt > psu.watt * 0.8) {
            warnings.push(`Công suất ước tính (~${estimatedWatt}W) cao so với nguồn ${psu.watt}W. Nên chọn nguồn lớn hơn.`);
        }
    }
    return warnings;
}

function renderSummary() {
    if (!summaryList) return;
    const entries = Object.values(selectedParts);
    summaryList.replaceChildren();

    let total = 0;

    if (entries.length === 0) {
        const empty = document.createElement("li");
        empty.className = "pc-summary-empty";
        empty.textContent = "Chưa chọn linh kiện nào.";
        summaryList.append(empty);
    } else {
        entries.forEach((item) => {
            const qty = item.quantity || 1;
            const itemTotal = item.price * qty;
            total += itemTotal;

            const li = document.createElement("li");
            li.className = "pc-summary-item";
            
            // Hiển thị thêm "x2", "x3" nếu số lượng > 1
            const qtyText = qty > 1 ? ` <strong>(x${qty})</strong>` : "";
            li.innerHTML = `<span>${item.partLabel}: ${item.name}${qtyText}</span><span>${formatPrice(itemTotal)}</span>`;
            summaryList.append(li);
        });
    }

    if (totalPriceEl) totalPriceEl.textContent = formatPrice(total);

    const warnings = checkCompatibility();
    if (warningEl) {
        if (warnings.length > 0) {
            warningEl.hidden = false;
            warningEl.textContent = "⚠ " + warnings.join(" ");
        } else {
            warningEl.hidden = true;
            warningEl.textContent = "";
        }
    }

    const missingRequired = PC_PARTS
        .filter((part) => part.required && !selectedParts[part.id])
        .map((part) => part.label);

    if (addAllButton) {
        addAllButton.disabled = missingRequired.length > 0 || entries.length === 0;
        if (missingRequired.length > 0) {
            addAllButton.title = "Vui lòng chọn: " + missingRequired.join(", ");
        } else {
            addAllButton.title = "";
        }
    }
}

if (addAllButton) {
    addAllButton.addEventListener("click", () => {
        const entries = Object.values(selectedParts);
        if (entries.length === 0) return;

        const cartStorageKey = "techcare-cart";
        const currentCart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
        
        entries.forEach((item) => {
            const qty = item.quantity || 1;
            // Thêm từng thanh RAM vào giỏ hàng theo đúng số lượng đã chọn
            for (let i = 0; i < qty; i++) {
                const nameSuffix = qty > 1 ? ` (Thanh ${i + 1}/${qty})` : "";
                currentCart.push({ 
                    name: `[PC] ${item.partLabel}: ${item.name}${nameSuffix}`, 
                    price: item.price 
                });
            }
        });

        localStorage.setItem(cartStorageKey, JSON.stringify(currentCart));
        window.location.reload();
    });
}

if (resetButton) {
    resetButton.addEventListener("click", () => {
        Object.keys(selectedParts).forEach((key) => delete selectedParts[key]);
        renderParts();
        renderSummary();
    });
}

renderParts();
renderSummary();