export const handlePrintSKULabel = (name: string, brand: string, sku: string) => {
  if (!sku) {
    alert("No SKU available to print");
    return;
  }

  // Create a simple print dialog with formatted SKU label
  const printWindow = window.open("", "_blank", "width=400,height=300");
  if (printWindow) {
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>SKU Label - ${sku}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                text-align: center;
                background: white;
              }
              .label {
                border: 2px solid #000;
                padding: 20px;
                margin: 20px auto;
                width: 300px;
                background: white;
              }
              .sku {
                font-size: 24px;
                font-weight: bold;
                margin: 10px 0;
              }
              .watch-name {
                font-size: 16px;
                margin: 10px 0;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="label">
              <div class="sku">${sku}</div>
              <div class="watch-name">${name || "Watch"}</div>
              <div>${brand || ""}</div>
            </div>
            <div class="no-print">
              <button onclick="window.print()">Print</button>
              <button onclick="window.close()">Close</button>
            </div>
          </body>
        </html>
      `);
    printWindow.document.close();
  }
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createComparableData = (input: Record<string, any>) => {
  return {
    images: (input.images || []).map((img) => ({
      id: img.id, url: img.url, useForAI: Boolean(img.useForAI),
    })).sort((a, b) => a.id.localeCompare(b.id)),
    ...input
  };
};