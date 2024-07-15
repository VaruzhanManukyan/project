const PRODUCTS_URL = "https://bever-aca-assignment.azurewebsites.net/products";
const INVOICES_URL = "https://bever-aca-assignment.azurewebsites.net/invoices";
const INVOICELINES_URL = "https://bever-aca-assignment.azurewebsites.net/invoicelines";
const USER_ID = localStorage.getItem("id");
const USER_NAME = localStorage.getItem("name");

if (!USER_ID || !USER_NAME) {
    window.location.href = "login-page.html";
}

async function fetchData() {
    try {
        document.querySelector("#nameId").innerHTML = USER_NAME;

        const responseProducts = await fetch(PRODUCTS_URL);
        const responseInvoices = await fetch(INVOICES_URL);
        const responseInvoiceLines = await fetch(INVOICELINES_URL);
        if (!responseProducts.ok || !responseInvoices.ok || !responseInvoiceLines.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const productsData = await responseProducts.json();
        const invoicesData = await responseInvoices.json();
        const invoiceLinesData = await responseInvoiceLines.json();

        const tableInvoices = document.querySelector("#invoiceTableId");
        const tableInvoicesLines = document.querySelector("#invoicesLinesTableId");

        for (const invoice of invoicesData.value) {
            if (invoice.UserId === USER_ID) {
                const row = document.createElement("tr");
                row.id = `invoice_${invoice.InvoiceId}`;

                const columnButton = document.createElement("td");
                const radioButton = document.createElement("input");
                radioButton.setAttribute("type", "radio");
                radioButton.setAttribute("name", "invoiceRadio");
                radioButton.setAttribute("value", invoice.InvoiceId);
                columnButton.appendChild(radioButton);
                row.appendChild(columnButton);

                const columnName = document.createElement("td");
                columnName.textContent = invoice.Name;
                row.appendChild(columnName);

                const columnPaidDate = document.createElement("td");
                columnPaidDate.textContent = invoice.PaidDate.split("T")[0];
                row.appendChild(columnPaidDate);

                const columnTotalAmount = document.createElement("td");
                let sum = 0;
                for (const invoiceLine of invoiceLinesData.value) {
                    if (invoice.InvoiceId === invoiceLine.InvoiceId) {
                        for (const product of productsData.value) {
                            if (product.ProductId === invoiceLine.ProductId) {
                                sum += +product.Price * +invoiceLine.Quantity;
                            }
                        }
                    }
                }
                columnTotalAmount.textContent = sum;
                row.appendChild(columnTotalAmount);

                tableInvoices.appendChild(row);
            }
        }

        const radioButtons = document.querySelectorAll('input[name="invoiceRadio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', function () {
                while (tableInvoicesLines.rows.length > 1) {
                    tableInvoicesLines.deleteRow(1);
                }

                const selectedInvoiceId = this.value;
                const products = [];
                for (const invoiceLine of invoiceLinesData.value) {
                    if (selectedInvoiceId === invoiceLine.InvoiceId) {
                        const productResult = { quantity: invoiceLine.Quantity };
                        for (const product of productsData.value) {
                            if (product.ProductId === invoiceLine.ProductId) {
                                productResult.name = product.Name;
                                productResult.price = product.Price;
                            }
                        }
                        products.push(productResult);
                    }
                }

                for (const product of products) {
                    const row = tableInvoicesLines.insertRow(-1);

                    const columnName = row.insertCell(0);
                    columnName.textContent = product.name;

                    const columnPrice = row.insertCell(1);
                    columnPrice.textContent = product.price;

                    const columnQuantity = row.insertCell(2);
                    columnQuantity.textContent = product.quantity;

                    const columnTotalAmount = row.insertCell(3);
                    columnTotalAmount.textContent = +product.price * +product.quantity;
                }
            });
        });

    } catch (error) {
        console.error(`Fetch error: ${error.message}`);
        alert('Error fetching data');
    }
}

fetchData();

function logout() {
    localStorage.removeItem("id");
    window.location.href = "login-page.html";
}