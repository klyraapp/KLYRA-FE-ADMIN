# Export Settings Modal

A pixel-perfect, reusable export modal component for exporting data in CSV and PDF formats.

## Installation

Install required dependencies:

```bash
npm install jspdf jspdf-autotable
```

## Usage

### Basic Integration

```javascript
import { ExportSettingsModal } from "@/components/export";
import { useState } from "react";

const YourPage = () => {
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // TODO: Replace with actual API call
  const fetchData = async () => {
    // Example: return await getYourData();
    return [
      { id: 1, name: "Item 1", price: 100 },
      { id: 2, name: "Item 2", price: 200 },
    ];
  };

  return (
    <>
      <button onClick={() => setExportModalOpen(true)}>
        <ExportOutlined /> Export
      </button>

      <ExportSettingsModal open={exportModalOpen} onClose={() => setExportModalOpen(false)} pageKey="services" pageLabel="Services & Pricing" getData={fetchData} />
    </>
  );
};
```

### Page-Specific Examples

#### Services & Pricing Page

```javascript
<ExportSettingsModal
  open={exportModalOpen}
  onClose={() => setExportModalOpen(false)}
  pageKey="services"
  pageLabel="Services & Pricing"
  getData={async () => {
    // TODO: Implement API call
    const response = await getServices();
    return response?.data || [];
  }}
/>
```

#### Bookings Page

```javascript
<ExportSettingsModal
  open={exportModalOpen}
  onClose={() => setExportModalOpen(false)}
  pageKey="bookings"
  pageLabel="Bookings"
  getData={async () => {
    // TODO: Implement API call
    const response = await getBookings();
    return response?.data || [];
  }}
/>
```

#### Customers Page

```javascript
<ExportSettingsModal
  open={exportModalOpen}
  onClose={() => setExportModalOpen(false)}
  pageKey="customers"
  pageLabel="Customers"
  getData={async () => {
    // TODO: Implement API call
    const response = await getUsers();
    return response?.data || [];
  }}
/>
```

#### Discount Codes Page

```javascript
<ExportSettingsModal
  open={exportModalOpen}
  onClose={() => setExportModalOpen(false)}
  pageKey="discountCodes"
  pageLabel="Discount Codes"
  getData={async () => {
    // TODO: Implement API call
    const response = await getPromoCodes();
    return response?.data || [];
  }}
/>
```

## Props

| Prop        | Type     | Required | Description                                       |
| ----------- | -------- | -------- | ------------------------------------------------- |
| `open`      | boolean  | Yes      | Controls modal visibility                         |
| `onClose`   | function | Yes      | Callback when modal closes                        |
| `pageKey`   | string   | Yes      | Unique identifier for the page (used in filename) |
| `pageLabel` | string   | Yes      | Display label for the page                        |
| `getData`   | function | Yes      | Async function that returns data array            |

## Features

- ✅ CSV Export (native JavaScript)
- ✅ PDF Export (jsPDF + jspdf-autotable)
- ✅ Excel Export (placeholder for future)
- ✅ Automatic data normalization
- ✅ Nested object flattening
- ✅ Null/undefined handling
- ✅ Dynamic imports for optimization
- ✅ Responsive design
- ✅ Pixel-perfect UI

## File Structure

```
src/
├── components/
│   └── export/
│       ├── ExportSettingsModal.js
│       ├── useExportHandlers.js
│       ├── exportCsv.js
│       ├── exportPdf.js
│       ├── normalizeExportData.js
│       ├── index.js
│       └── README.md
└── styles/
    └── ExportSettingsModal.module.css
```

## Notes

- The `getData` function should return a Promise that resolves to an array of objects
- Data is automatically normalized to handle nested structures
- PDF generation uses dynamic imports to optimize bundle size
- All exports are handled on the frontend (no backend required)
