/**
 * Centralized Document Printing System for Lazfort Hotel ERP
 * Ensures only the targeted document/container is printed without sidebar, navbar, headers, or dashboard controls.
 */

/**
 * Triggers printing of a specific DOM element by ID or element reference.
 * Adds print-isolated class, temporarily isolates the element in print CSS, then triggers window.print().
 *
 * @param {string|HTMLElement} target - ID of element or DOM node to print
 * @param {Object} options - Optional configuration (e.g. documentTitle)
 */
export const printElement = (target, options = {}) => {
  let element = null;

  if (typeof target === 'string') {
    element = document.getElementById(target) || document.querySelector(target);
  } else if (target instanceof HTMLElement) {
    element = target;
  }

  if (!element) {
    console.warn(`[Lazfort Print System] Target element not found for selector:`, target);
    window.print();
    return;
  }

  // Remove existing print-area class from any other container
  document.querySelectorAll('.print-area').forEach((el) => {
    el.classList.remove('print-area');
  });

  // Mark the targeted container
  element.classList.add('print-area');

  // Set document title for print header if provided
  const originalTitle = document.title;
  if (options.documentTitle) {
    document.title = options.documentTitle;
  }

  // Allow browser layout flush
  setTimeout(() => {
    window.print();

    // Cleanup after print dialog
    setTimeout(() => {
      element.classList.remove('print-area');
      if (options.documentTitle) {
        document.title = originalTitle;
      }
    }, 500);
  }, 100);
};

/**
 * Prints raw HTML or structured printable content in an isolated iframe.
 * Ideal for receipts, vouchers, folios, or reports that need guaranteed zero UI contamination.
 *
 * @param {string} title - Document Title (e.g. "Tax Invoice INV-1001")
 * @param {string} bodyHtml - Complete HTML content of the document
 * @param {string} [orientation='portrait'] - 'portrait' or 'landscape'
 */
export const printIsolatedDocument = (title, bodyHtml, orientation = 'portrait') => {
  const existingFrame = document.getElementById('lazfort-print-iframe');
  if (existingFrame) {
    existingFrame.remove();
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'lazfort-print-iframe';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  iframe.style.visibility = 'hidden';

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>${title || 'Lazfort Hotel ERP Document'}</title>
      <style>
        @page {
          size: A4 ${orientation};
          margin: 12mm;
        }
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #111827;
          background: #ffffff;
          font-size: 12px;
          line-height: 1.5;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 12px 0;
        }
        th, td {
          padding: 8px 10px;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
        }
        th {
          background-color: #f9fafb;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.05em;
        }
        tr {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        .header-title {
          font-family: Georgia, Cambria, "Times New Roman", Times, serif;
          font-size: 24px;
          font-weight: 900;
          letter-spacing: 0.05em;
          color: #111827;
          margin: 0;
        }
        .header-sub {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #b45309;
          font-weight: 700;
          margin: 4px 0 0 0;
        }
        .gold-border {
          border-color: #d97706 !important;
        }
        .badge {
          display: inline-block;
          padding: 3px 8px;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          border-radius: 4px;
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
        .font-bold { font-weight: 700; }
        .footer-note {
          text-align: center;
          margin-top: 30px;
          font-size: 9px;
          color: #6b7280;
          border-top: 1px dashed #d1d5db;
          padding-top: 15px;
        }
      </style>
    </head>
    <body>
      ${bodyHtml}
    </body>
    </html>
  `);
  doc.close();

  iframe.contentWindow.focus();
  setTimeout(() => {
    iframe.contentWindow.print();
    setTimeout(() => {
      iframe.remove();
    }, 1000);
  }, 250);
};

export default {
  printElement,
  printIsolatedDocument,
};

