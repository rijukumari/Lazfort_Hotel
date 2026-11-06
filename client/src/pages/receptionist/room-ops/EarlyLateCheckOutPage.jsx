import React, { useState } from 'react';
import { PageHeader, StatusBadge, Button } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import { StatCard } from '../../../components/ui/StatCard';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  Sparkles,
  BedDouble,
  User,
  ShieldAlert,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const EarlyLateCheckOutPage = () => {
  const { showToast } = useToast();

  const [timingRequests, setTimingRequests] = useState([
    {
      id: 'req-tm-01',
      guestName: 'Baroness Charlotte von Berg',
      roomNumber: '502',
      type: 'Late Check-out',
      standardTime: '12:00 PM',
      requestedTime: '04:00 PM',
      surcharge: 350,
      reason: 'Late yacht departure from Port Hercule Monaco',
      status: 'Pending',
    },
    {
      id: 'req-tm-02',
      guestName: 'Lord Alistair Sterling',
      roomNumber: '801',
      type: 'Early Check-in',
      standardTime: '03:00 PM',
      requestedTime: '10:00 AM',
      surcharge: 250,
      reason: 'Private transatlantic jet arrival at Nice Côte d’Azur',
      status: 'Approved',
    },
    {
      id: 'req-tm-03',
      guestName: 'Countess Elena Rostova',
      roomNumber: '404',
      type: 'Late Check-out',
      standardTime: '12:00 PM',
      requestedTime: '03:30 PM',
      surcharge: 300,
      reason: 'Spa wellness session booked in Royal Thermal Baths',
      status: 'Pending',
    },
    {
      id: 'req-tm-04',
      guestName: 'Prince Guillaume of Luxembourg',
      roomNumber: '901',
      type: 'Late Check-out',
      standardTime: '12:00 PM',
      requestedTime: '06:00 PM',
      surcharge: 500,
      reason: 'Diplomatic bilateral talks in private salon',
      status: 'Approved',
    },
    {
      id: 'req-tm-05',
      guestName: 'Lady Genevieve Montclair',
      roomNumber: '206',
      type: 'Late Check-out',
      standardTime: '12:00 PM',
      requestedTime: '05:00 PM',
      surcharge: 350,
      reason: 'Waiting for evening Monaco opera performance',
      status: 'Rejected',
    },
  ]);

  const handleUpdateStatus = (id, newStatus) => {
    setTimingRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    if (showToast) {
      showToast(
        `Request ${newStatus}`,
        `Early / Late schedule request #${id} marked as ${newStatus}.`,
        newStatus === 'Approved' ? 'success' : 'info'
      );
    }
  };

  const columns = [
    {
      key: 'id',
      header: 'Request Ref',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-xs font-bold text-accent">{item.id}</span>
      ),
    },
    {
      key: 'guestName',
      header: 'Guest & Chamber',
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight font-serif">
            {item.guestName}
          </p>
          <p className="text-[11px] text-charcoal-muted">Suite {item.roomNumber}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Request Type',
      sortable: true,
      render: (item) => (
        <span
          className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
            item.type.includes('Early')
              ? 'bg-blue-500/15 text-blue-500 border border-blue-500/20'
              : 'bg-amber-500/15 text-amber-500 border border-amber-500/20'
          }`}
        >
          {item.type}
        </span>
      ),
    },
    {
      key: 'times',
      header: 'Schedule Modification',
      render: (item) => (
        <div className="text-xs font-mono">
          <span className="text-charcoal-muted line-through mr-1.5">{item.standardTime}</span>
          <span className="text-emerald-500 font-bold">{item.requestedTime}</span>
        </div>
      ),
    },
    {
      key: 'surcharge',
      header: 'Surcharge ($)',
      sortable: true,
      render: (item) => (
        <span className="font-mono font-bold text-xs text-primary dark:text-white">
          ${item.surcharge} USD
        </span>
      ),
    },
    {
      key: 'reason',
      header: 'Justification Note',
      render: (item) => (
        <span className="text-xs text-charcoal-muted truncate max-w-xs block">
          {item.reason}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Approval Status',
      sortable: true,
      render: (item) => {
        const isApproved = item.status === 'Approved';
        const isRejected = item.status === 'Rejected';
        return (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${
              isApproved
                ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                : isRejected
                ? 'text-rose-500 bg-rose-500/10 border-rose-500/20'
                : 'text-amber-500 bg-amber-500/10 border-amber-500/20'
            }`}
          >
            {item.status}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex items-center gap-1.5">
          {item.status === 'Pending' ? (
            <>
              <button
                onClick={() => handleUpdateStatus(item.id, 'Approved')}
                className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border border-emerald-500/20 font-semibold transition-all flex items-center gap-1"
                title="Approve Timing Request"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Approve
              </button>
              <button
                onClick={() => handleUpdateStatus(item.id, 'Rejected')}
                className="px-2.5 py-1 text-xs rounded-lg bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 border border-rose-500/20 font-semibold transition-all flex items-center gap-1"
                title="Reject Timing Request"
              >
                <XCircle className="w-3.5 h-3.5" /> Reject
              </button>
            </>
          ) : (
            <button
              onClick={() => handleUpdateStatus(item.id, 'Pending')}
              className="text-xs text-accent hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Early & Late Check-Out Management"
        subtitle="Review, approve, and manage guest timing extension requests and ancillary billing surcharges"
        badge="Room Operations"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Pending Timing Requests"
          value={String(timingRequests.filter((r) => r.status === 'Pending').length)}
          subtitle="Awaiting duty manager approval"
          icon={Clock}
          isPositive={false}
        />
        <StatCard
          title="Approved Extensions"
          value={String(timingRequests.filter((r) => r.status === 'Approved').length)}
          subtitle="Chamber turnover window extended"
          icon={CheckCircle}
          isPositive={true}
        />
        <StatCard
          title="Additional Surcharge Revenue"
          value={`$${timingRequests
            .filter((r) => r.status === 'Approved')
            .reduce((s, r) => s + r.surcharge, 0)
            .toLocaleString()} USD`}
          subtitle="Generated from timing supplements"
          icon={DollarSign}
          isPositive={true}
        />
      </div>

      {/* Timing Requests Table */}
      <DataTable
        data={timingRequests}
        columns={columns}
        keyExtractor={(item) => item.id}
        pageSize={6}
        emptyMessage="No timing requests logged."
      />
    </div>
  );
};

export default EarlyLateCheckOutPage;

