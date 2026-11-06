import React, { useState } from 'react';
import { PageHeader } from '../../../components/ui';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  Table,
  FileText,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const ExportReportsPage = () => {
  const [reportCategory, setReportCategory] = useState('revenue');
  const [dateRange, setDateRange] = useState('month');
  const [fileFormat, setFileFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Sample data sets for preview & download
  const sampleDataMap = {
    revenue: {
      headers: ['Date', 'Chamber Revenue', 'F&B Michelin', 'Spa Wellness', 'Banquet Events', 'Total Yield'],
      rows: [
        ['2026-10-25', '$42,500', '$14,200', '$6,500', '$12,000', '$75,200'],
        ['2026-10-26', '$48,200', '$16,100', '$7,800', '$15,400', '$87,500'],
        ['2026-10-27', '$45,000', '$15,300', '$8,100', '$18,000', '$86,400'],
        ['2026-10-28', '$52,100', '$18,900', '$9,400', '$22,500', '$102,900'],
        ['2026-10-29', '$54,800', '$19,500', '$9,800', '$25,000', '$109,100'],
      ],
    },
    occupancy: {
      headers: ['Date', 'Occupied Suites', 'Available', 'Total Inventory', 'Occupancy Rate', 'ADR'],
      rows: [
        ['2026-10-25', '118', '12', '130', '90.7%', '$1,820'],
        ['2026-10-26', '122', '8', '130', '93.8%', '$1,850'],
        ['2026-10-27', '124', '6', '130', '95.3%', '$1,890'],
        ['2026-10-28', '128', '2', '130', '98.4%', '$1,940'],
        ['2026-10-29', '127', '3', '130', '97.6%', '$1,920'],
      ],
    },
    bookings: {
      headers: ['Ref ID', 'Guest Name', 'Chamber / Suite', 'Check-In', 'Check-Out', 'Status', 'Total Charge'],
      rows: [
        ['BK-2026-904', 'Lord Henry Mountbatten', 'Royal Penthouse 501', '2026-10-28', '2026-11-04', 'Checked-In', '$28,000'],
        ['BK-2026-905', 'Archduke Ferdinand Weiss', 'Presidential Haven 402', '2026-10-29', '2026-11-02', 'Confirmed', '$14,200'],
        ['BK-2026-906', 'Lady Eleanor Sterling', 'Imperial Diplomatic 301', '2026-10-29', '2026-11-05', 'Confirmed', '$17,500'],
        ['BK-2026-907', 'Baroness Vivienne Leclair', 'Royal Suite 204', '2026-10-30', '2026-11-03', 'Confirmed', '$10,400'],
      ],
    },
    cancellations: {
      headers: ['Cancel ID', 'Reservation Ref', 'Guest Name', 'Refund Amount', 'Policy', 'Reason'],
      rows: [
        ['CN-1021', 'BK-2026-880', 'Crown Prince Al-Hassan', '$0 (Retained)', 'Full Forfeit 48h', 'Flight Schedule Rescheduled'],
        ['CN-1022', 'BK-2026-874', 'Countess Beatrix Thorne', '$4,200', 'Partial Refund (50%)', 'Personal Emergency'],
        ['CN-1023', 'BK-2026-869', 'Julian De Witt', '$0 (Transferred)', 'VIP Date Rebooking', 'Diplomatic Summit Postponed'],
      ],
    },
    staff: {
      headers: ['Staff ID', 'Employee Name', 'Department', 'Designation', 'Attendance Rate', 'Performance'],
      rows: [
        ['EMP-104', 'Elena Rostova', 'Front Office', 'Head Concierge', '100%', 'Exemplary (4.98)'],
        ['EMP-088', 'Marco Bellini', 'Engineering', 'Chief Engineer', '98.5%', 'Exemplary (4.95)'],
        ['EMP-112', 'David Chen', 'Culinary', 'Pastry Sous Chef', '99.0%', 'High Performer (4.92)'],
        ['EMP-067', 'Chloe Dubois', 'Spa & Wellness', 'Lead Aesthetician', '97.5%', 'Exemplary (4.96)'],
      ],
    },
  };

  const activeData = sampleDataMap[reportCategory] || sampleDataMap.revenue;

  const handleExport = () => {
    setIsExporting(true);
    setSuccessMsg('');

    setTimeout(() => {
      let mimeType = 'text/csv;charset=utf-8,';
      let extension = 'csv';
      let content = [activeData.headers.join(','), ...activeData.rows.map((e) => e.join(','))].join('\n');

      if (fileFormat === 'excel') {
        // Tab-delimited spreadsheet format recognized natively by Microsoft Excel
        mimeType = 'data:application/vnd.ms-excel;charset=utf-8,';
        extension = 'xls';
        content = [activeData.headers.join('\t'), ...activeData.rows.map((e) => e.join('\t'))].join('\n');
      } else {
        mimeType = 'data:text/csv;charset=utf-8,';
        extension = 'csv';
      }

      const encodedUri = encodeURI(mimeType + content);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute(
        'download',
        `Lazfort_${reportCategory.toUpperCase()}_Report_${new Date().toISOString().split('T')[0]}.${extension}`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setSuccessMsg(`Successfully generated & exported ${reportCategory.toUpperCase()} Report (${fileFormat.toUpperCase()})`);
      setTimeout(() => setSuccessMsg(''), 5000);
    }, 600);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Export Intelligence & Statutory Reports"
        description="Filter parameters, preview audit data, and download certified executive reports in CSV and spreadsheet formats."
      />

      {/* Export Configuration Control Panel */}
      <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
        <h3 className="text-lg font-serif font-semibold text-foreground flex items-center gap-2 mb-6">
          <FileSpreadsheet className="w-5 h-5 text-accent" />
          Report Export Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Report Category */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Report Category
            </label>
            <select
              value={reportCategory}
              onChange={(e) => setReportCategory(e.target.value)}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
            >
              <option value="revenue">Revenue & Financial Audits</option>
              <option value="occupancy">Occupancy & Inventory Yield</option>
              <option value="bookings">Reservations & Guest Folios</option>
              <option value="cancellations">Cancellations & Refunds</option>
              <option value="staff">Staff Attendance & Productivity</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Time Horizon
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
            >
              <option value="today">Today (Live 24h Cycle)</option>
              <option value="week">Past 7 Days</option>
              <option value="month">Current Month (M-T-D)</option>
              <option value="quarter">Fiscal Quarter</option>
              <option value="ytd">Year-to-Date (2026)</option>
            </select>
          </div>

          {/* File Format */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFileFormat('csv')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  fileFormat === 'csv'
                    ? 'border-accent bg-accent/20 text-accent font-bold shadow-gold'
                    : 'border-border/80 dark:border-white/10 bg-background text-muted-foreground hover:border-accent/50 hover:text-foreground'
                }`}
              >
                <FileText className={`w-4 h-4 ${fileFormat === 'csv' ? 'text-accent' : 'text-muted-foreground'}`} />
                <span>CSV Format</span>
              </button>
              <button
                type="button"
                onClick={() => setFileFormat('excel')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  fileFormat === 'excel'
                    ? 'border-accent bg-accent/20 text-accent font-bold shadow-gold'
                    : 'border-border/80 dark:border-white/10 bg-background text-muted-foreground hover:border-accent/50 hover:text-foreground'
                }`}
              >
                <FileSpreadsheet className={`w-4 h-4 ${fileFormat === 'excel' ? 'text-accent' : 'text-muted-foreground'}`} />
                <span>Excel (.xlsx)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Button & Confirmation */}
        <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-accent" />
            Exports adhere to GAAP hospitality auditing standards and Palace Grand data privacy rules.
          </p>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-background font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Compiling Dataset...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download {reportCategory.toUpperCase()} Report
              </>
            )}
          </button>
        </div>

        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Live Data Preview Section */}
      <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-serif font-semibold text-foreground flex items-center gap-2">
              <Table className="w-5 h-5 text-accent" />
              Dataset Preview ({activeData.rows.length} Records)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live preview of ledger columns and formatted fields prior to download
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
            Preview Mode
          </span>
        </div>

        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-background/80 border-b border-border text-muted-foreground">
                {activeData.headers.map((h, i) => (
                  <th key={i} className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {activeData.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-accent/5 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`py-3 px-4 text-foreground ${
                        cIdx === 0 ? 'font-mono text-muted-foreground font-medium' : ''
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExportReportsPage;
