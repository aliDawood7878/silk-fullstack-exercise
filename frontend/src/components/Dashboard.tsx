import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import './Dashboard.css'; // We'll create this next!

/**
 * Matches columns in "grouped_findings"
 */
interface GroupedFinding {
  id: number;
  grouping_type: string;
  grouping_key: string;
  severity: string;
  grouped_finding_created: string;
  sla: string;
  description: string;
  security_analyst: string;
  owner: string;
  workflow: string;
  status: string;
  progress: string;
}

/**
 * Matches columns in "raw_findings"
 */
interface RawFinding {
  id: number;
  source_security_tool_name: string;
  source_security_tool_id: string;
  source_collaboration_tool_name: string;
  source_collaboration_tool_id: string;
  severity: string;
  finding_created: string;
  ticket_created: string;
  description: string;
  asset: string;
  status: string;
  remediation_url: string;
  remediation_text: string;
  grouped_finding_id: number; // links to GroupedFinding.id
}

const Dashboard: React.FC = () => {
  // State for both data sets
  const [grouped, setGrouped] = useState<GroupedFinding[]>([]);
  const [raw, setRaw] = useState<RawFinding[]>([]);

  // Track which grouped row is expanded (by ID)
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  // Colors for the pie/bar chart slices
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9900CC'];

  /**
   * On mount, fetch both grouped + raw from your backend
   */
  useEffect(() => {
    axios.get<GroupedFinding[]>('http://localhost:5000/api/findings/grouped')
      .then(res => setGrouped(res.data))
      .catch(err => console.error('Error fetching grouped:', err));

    axios.get<RawFinding[]>('http://localhost:5000/api/findings/raw')
      .then(res => setRaw(res.data))
      .catch(err => console.error('Error fetching raw:', err));
  }, []);

  // Build severity distribution for GROUPED
  const groupedSeverityCount: Record<string, number> = {};
  grouped.forEach(item => {
    const sev = item.severity.toLowerCase();
    groupedSeverityCount[sev] = (groupedSeverityCount[sev] || 0) + 1;
  });
  const groupedChartData = Object.entries(groupedSeverityCount).map(([sev, count]) => ({
    name: sev,
    value: count,
  }));

  // Build severity distribution for RAW
  const rawSeverityCount: Record<string, number> = {};
  raw.forEach(item => {
    const sev = item.severity.toLowerCase();
    rawSeverityCount[sev] = (rawSeverityCount[sev] || 0) + 1;
  });
  const rawChartData = Object.entries(rawSeverityCount).map(([sev, count]) => ({
    name: sev,
    value: count,
  }));

  // Toggle expand/collapse of a grouped row
  const handleRowClick = (groupId: number) => {
    setExpandedRow(prev => (prev === groupId ? null : groupId));
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Security Findings Dashboard</h1>

      {/* ================= GROUPED FINDINGS CHARTS ================= */}
      <div className="section-wrapper">
        <h2>Grouped Findings - Severity Charts</h2>
        <div className="charts-section">
          <div className="chart-box">
            <h3>Grouped Severity (Pie)</h3>
            <PieChart width={300} height={300}>
              <Pie
                data={groupedChartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {groupedChartData.map((entry, idx) => (
                  <Cell
                    key={`grouped-pie-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
          <div className="chart-box">
            <h3>Grouped Severity (Bar)</h3>
            <BarChart width={400} height={300} data={groupedChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </div>
        </div>
      </div>

      {/* ================= RAW FINDINGS CHARTS ================= */}
      <div className="section-wrapper">
        <h2>Raw Findings - Severity Charts</h2>
        <div className="charts-section">
          <div className="chart-box">
            <h3>Raw Severity (Pie)</h3>
            <PieChart width={300} height={300}>
              <Pie
                data={rawChartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {rawChartData.map((entry, idx) => (
                  <Cell
                    key={`raw-pie-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
          <div className="chart-box">
            <h3>Raw Severity (Bar)</h3>
            <BarChart width={400} height={300} data={rawChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </div>
        </div>
      </div>

      {/* ================= GROUPED FINDINGS TABLE (WITH EXPANSIONS) ================= */}
      <div className="section-wrapper">
        <h2>Grouped Findings (Expandable Table)</h2>
        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Grouping Type</th>
              <th>Grouping Key</th>
              <th>Severity</th>
              <th>Created</th>
              <th>SLA</th>
              <th>Description</th>
              <th>Security Analyst</th>
              <th>Owner</th>
              <th>Workflow</th>
              <th>Status</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {grouped.map(gf => {
              const isExpanded = expandedRow === gf.id;
              // Filter raw findings for this group
              const matchingRaw = raw.filter(r => r.grouped_finding_id === gf.id);

              return (
                <React.Fragment key={gf.id}>
                  <tr
                    className="grouped-row"
                    onClick={() => handleRowClick(gf.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{gf.id}</td>
                    <td>{gf.grouping_type}</td>
                    <td>{gf.grouping_key}</td>
                    <td>{gf.severity}</td>
                    <td>{gf.grouped_finding_created}</td>
                    <td>{gf.sla}</td>
                    <td>{gf.description}</td>
                    <td>{gf.security_analyst}</td>
                    <td>{gf.owner}</td>
                    <td>{gf.workflow}</td>
                    <td>{gf.status}</td>
                    <td>{gf.progress}</td>
                  </tr>

                  {/* If expanded, show the matching raw in a nested table */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={12}>
                        {matchingRaw.length > 0 ? (
                          <div className="expanded-raw-table">
                            <h4>Raw Findings for Group #{gf.id}</h4>
                            <table className="styled-table" style={{ marginTop: '0.5rem' }}>
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Security Tool Name</th>
                                  <th>Security Tool ID</th>
                                  <th>Collab Tool Name</th>
                                  <th>Collab Tool ID</th>
                                  <th>Severity</th>
                                  <th>Finding Created</th>
                                  <th>Ticket Created</th>
                                  <th>Description</th>
                                  <th>Asset</th>
                                  <th>Status</th>
                                  <th>Remediation URL</th>
                                  <th>Remediation Text</th>
                                  <th>Grouped Finding ID</th>
                                </tr>
                              </thead>
                              <tbody>
                                {matchingRaw.map(rf => (
                                  <tr key={rf.id}>
                                    <td>{rf.id}</td>
                                    <td>{rf.source_security_tool_name}</td>
                                    <td>{rf.source_security_tool_id}</td>
                                    <td>{rf.source_collaboration_tool_name}</td>
                                    <td>{rf.source_collaboration_tool_id}</td>
                                    <td>{rf.severity}</td>
                                    <td>{rf.finding_created}</td>
                                    <td>{rf.ticket_created}</td>
                                    <td>{rf.description}</td>
                                    <td>{rf.asset}</td>
                                    <td>{rf.status}</td>
                                    <td>
                                      <a href={rf.remediation_url} target="_blank" rel="noreferrer">
                                        {rf.remediation_url}
                                      </a>
                                    </td>
                                    <td>{rf.remediation_text}</td>
                                    <td>{rf.grouped_finding_id}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p>No raw findings found for this group.</p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;