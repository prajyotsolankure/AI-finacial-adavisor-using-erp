// Mock data for ERP AI Advisor contexts (Finance, Sales, HR)
// Clean enterprise dataset with vector icon definitions (zero emojis)

export const ERP_CONTEXTS = {
  finance: {
    id: 'finance',
    name: 'Finance',
    iconType: 'Landmark',
    title: 'Financial Health & Treasury Overview',
    subtitle: 'Real-time general ledger accounts, cash flow, and operational expenditure',
    dbSchema: 'erp_finance_ledger_v2',
    metrics: [
      {
        id: 'rev',
        title: 'Total Revenue',
        value: '$4,892,450',
        change: '+14.6%',
        isPositive: true,
        subtext: 'vs previous period ($4.27M)'
      },
      {
        id: 'spend',
        title: 'Monthly Spend',
        value: '$1,240,180',
        change: '-3.8%',
        isPositive: true,
        subtext: 'Within 92% of allocated budget'
      },
      {
        id: 'headcount',
        title: 'Active Headcount',
        value: '428 FTEs',
        change: '+12 hires',
        isPositive: true,
        subtext: 'Global workforce across 6 hubs'
      },
      {
        id: 'margin',
        title: 'Operating Margin',
        value: '34.2%',
        change: '+2.4%',
        isPositive: true,
        subtext: 'EBITDA expansion of 180 bps'
      }
    ],
    chart: {
      title: 'Revenue & Expenditure Trajectory (FY 2026)',
      unit: '$k USD',
      primaryLabel: 'Revenue',
      secondaryLabel: 'Operating Spend',
      series: [
        { label: 'Jan', primary: 320, secondary: 210, benchmark: 300 },
        { label: 'Feb', primary: 345, secondary: 215, benchmark: 310 },
        { label: 'Mar', primary: 390, secondary: 230, benchmark: 330 },
        { label: 'Apr', primary: 410, secondary: 220, benchmark: 340 },
        { label: 'May', primary: 385, secondary: 245, benchmark: 350 },
        { label: 'Jun', primary: 460, secondary: 260, benchmark: 380 },
        { label: 'Jul', primary: 490, secondary: 250, benchmark: 400 },
        { label: 'Aug', primary: 520, secondary: 270, benchmark: 420 },
        { label: 'Sep', primary: 505, secondary: 265, benchmark: 440 },
        { label: 'Oct', primary: 580, secondary: 290, benchmark: 460 },
        { label: 'Nov', primary: 620, secondary: 310, benchmark: 490 },
        { label: 'Dec', primary: 670, secondary: 325, benchmark: 520 },
      ]
    },
    tableData: [
      { id: 'TX-9401', date: '2026-10-18', entity: 'Apex Global Cloud Solutions', amount: '$148,200.00', status: 'Approved' },
      { id: 'TX-9402', date: '2026-10-16', entity: 'Starlight Media Enterprise', amount: '$84,500.00', status: 'Audited' },
      { id: 'TX-9403', date: '2026-10-14', entity: 'Datacore Infrastructure Ltd', amount: '$312,000.00', status: 'Processing' },
      { id: 'TX-9404', date: '2026-10-12', entity: 'Vanguard Logistics ERP Sync', amount: '$62,450.00', status: 'Approved' },
      { id: 'TX-9405', date: '2026-10-10', entity: 'Nordic Fintech Partners', amount: '$198,300.00', status: 'Audited' },
      { id: 'TX-9406', date: '2026-10-08', entity: 'SaaS Software Licensing Q4', amount: '$43,780.00', status: 'Pending' },
      { id: 'TX-9407', date: '2026-10-05', entity: 'Quantum Leap Labs Hosting', amount: '$118,920.00', status: 'Approved' },
      { id: 'TX-9408', date: '2026-10-02', entity: 'Helios Hardware Supply Inc', amount: '$54,600.00', status: 'Verified' },
    ]
  },

  sales: {
    id: 'sales',
    name: 'Sales',
    iconType: 'TrendingUp',
    title: 'Sales Performance & CRM Pipeline',
    subtitle: 'Inbound velocity, conversion funnel, and deal closures',
    dbSchema: 'crm_sales_pipeline_v3',
    metrics: [
      {
        id: 'arr',
        title: 'Annualized Run Rate (ARR)',
        value: '$18,420,000',
        change: '+22.4%',
        isPositive: true,
        subtext: 'Pacing 112% to annual quota'
      },
      {
        id: 'closed',
        title: 'Closed Deals (MTD)',
        value: '$3,420,000',
        change: '+18.2%',
        isPositive: true,
        subtext: '47 enterprise contracts finalized'
      },
      {
        id: 'pipeline',
        title: 'Active Pipeline',
        value: '$12,850,000',
        change: '+8.7%',
        isPositive: true,
        subtext: 'Weighted forecast: $8.9M'
      },
      {
        id: 'winrate',
        title: 'Win Conversion Rate',
        value: '68.4%',
        change: '+4.1%',
        isPositive: true,
        subtext: 'Cycle length reduced to 34 days'
      }
    ],
    chart: {
      title: 'Monthly Sales Revenue by Month (FY 2026)',
      unit: '$k USD',
      primaryLabel: 'Closed Revenue',
      secondaryLabel: 'Target Quota',
      series: [
        { label: 'Jan', primary: 280, secondary: 250, benchmark: 260 },
        { label: 'Feb', primary: 310, secondary: 270, benchmark: 270 },
        { label: 'Mar', primary: 375, secondary: 300, benchmark: 310 },
        { label: 'Apr', primary: 395, secondary: 310, benchmark: 330 },
        { label: 'May', primary: 440, secondary: 350, benchmark: 360 },
        { label: 'Jun', primary: 485, secondary: 370, benchmark: 380 },
        { label: 'Jul', primary: 510, secondary: 400, benchmark: 410 },
        { label: 'Aug', primary: 560, secondary: 420, benchmark: 430 },
        { label: 'Sep', primary: 590, secondary: 450, benchmark: 460 },
        { label: 'Oct', primary: 640, secondary: 480, benchmark: 490 },
        { label: 'Nov', primary: 710, secondary: 520, benchmark: 530 },
        { label: 'Dec', primary: 790, secondary: 550, benchmark: 580 },
      ]
    },
    tableData: [
      { id: 'DEAL-882', date: '2026-10-19', entity: 'CyberShield Systems Inc', amount: '$420,000.00', status: 'Closed Won' },
      { id: 'DEAL-883', date: '2026-10-17', entity: 'Zenith Logistics Enterprise', amount: '$295,000.00', status: 'Approved' },
      { id: 'DEAL-884', date: '2026-10-15', entity: 'BlueWave Biotech Corp', amount: '$180,000.00', status: 'Audited' },
      { id: 'DEAL-885', date: '2026-10-13', entity: 'Titan Retail Consortium', amount: '$540,000.00', status: 'Closed Won' },
      { id: 'DEAL-886', date: '2026-10-11', entity: 'Aegis Security Networks', amount: '$165,000.00', status: 'Processing' },
      { id: 'DEAL-887', date: '2026-10-09', entity: 'Horizon Health Dynamics', amount: '$310,000.00', status: 'Verified' },
      { id: 'DEAL-888', date: '2026-10-06', entity: 'Cascade Energy Grid', amount: '$225,000.00', status: 'Approved' },
      { id: 'DEAL-889', date: '2026-10-03', entity: 'Novus Telecom International', amount: '$390,000.00', status: 'Closed Won' },
    ]
  },

  hr: {
    id: 'hr',
    name: 'HR',
    iconType: 'Users',
    title: 'Workforce & Human Capital Analytics',
    subtitle: 'Payroll allocation, retention metrics, and department capacity',
    dbSchema: 'hr_workforce_erp_v1',
    metrics: [
      {
        id: 'headcount_total',
        title: 'Active Headcount',
        value: '428 FTEs',
        change: '+34 YTD',
        isPositive: true,
        subtext: 'Engineering (48%), GTM (32%), Ops (20%)'
      },
      {
        id: 'payroll',
        title: 'Monthly Spend (Payroll)',
        value: '$2,640,000',
        change: '+2.1%',
        isPositive: true,
        subtext: 'Benefits & comp ratio at 18.2%'
      },
      {
        id: 'retention',
        title: 'Annual Retention Rate',
        value: '96.2%',
        change: '+1.4%',
        isPositive: true,
        subtext: 'Top-quartile tech industry benchmark'
      },
      {
        id: 'openings',
        title: 'Open Requisitions',
        value: '28 Roles',
        change: '-4 closed',
        isPositive: true,
        subtext: 'Avg time-to-hire: 24.5 days'
      }
    ],
    chart: {
      title: 'Headcount Velocity & Retention (FY 2026)',
      unit: 'Headcount (FTEs)',
      primaryLabel: 'Active Employees',
      secondaryLabel: 'Hiring Target',
      series: [
        { label: 'Jan', primary: 360, secondary: 365, benchmark: 350 },
        { label: 'Feb', primary: 368, secondary: 372, benchmark: 360 },
        { label: 'Mar', primary: 375, secondary: 380, benchmark: 370 },
        { label: 'Apr', primary: 382, secondary: 388, benchmark: 375 },
        { label: 'May', primary: 390, secondary: 395, benchmark: 385 },
        { label: 'Jun', primary: 398, secondary: 402, benchmark: 390 },
        { label: 'Jul', primary: 405, secondary: 410, benchmark: 400 },
        { label: 'Aug', primary: 412, secondary: 416, benchmark: 405 },
        { label: 'Sep', primary: 418, secondary: 422, benchmark: 410 },
        { label: 'Oct', primary: 428, secondary: 430, benchmark: 420 },
        { label: 'Nov', primary: 435, secondary: 438, benchmark: 425 },
        { label: 'Dec', primary: 445, secondary: 445, benchmark: 435 },
      ]
    },
    tableData: [
      { id: 'HR-501', date: '2026-10-18', entity: 'Engineering Org (184 Members)', amount: '$1,280,000.00', status: 'Approved' },
      { id: 'HR-502', date: '2026-10-15', entity: 'Enterprise Sales (96 Members)', amount: '$690,000.00', status: 'Audited' },
      { id: 'HR-503', date: '2026-10-12', entity: 'Product & Design (42 Members)', amount: '$315,000.00', status: 'Verified' },
      { id: 'HR-504', date: '2026-10-10', entity: 'Corporate Finance & Legal', amount: '$185,000.00', status: 'Approved' },
      { id: 'HR-505', date: '2026-10-07', entity: 'Customer Success & Support', amount: '$124,000.00', status: 'Audited' },
      { id: 'HR-506', date: '2026-10-04', entity: 'Global People Operations', amount: '$46,000.00', status: 'Verified' },
      { id: 'HR-507', date: '2026-10-02', entity: 'Executive Leadership Team', amount: '$148,000.00', status: 'Approved' },
      { id: 'HR-508', date: '2026-09-28', entity: 'IT Infrastructure & SecOps', amount: '$72,000.00', status: 'Approved' },
    ]
  }
};

// Initial chat messages matching user specification exactly (zero emojis, vector-ready)
export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'msg-1',
    sender: 'user',
    text: 'Show me total sales revenue by month for this year.',
    timestamp: '10:42 AM'
  },
  {
    id: 'msg-2',
    sender: 'bot',
    text: 'Analyzing sales_data table via MCP server... Generating dynamic chart.',
    timestamp: '10:42 AM',
    mcpQuery: {
      server: 'groq-mcp-erp-connector',
      sql: 'SELECT strftime("%Y-%m", trans_date) AS month, SUM(amount) AS total_revenue FROM sales_data WHERE status = "Closed Won" GROUP BY month ORDER BY month ASC;',
      executionTime: '24ms',
      rowsAffected: 12,
    },
    insightSummary: {
      highlight: 'FY2026 Revenue reaches $6.03M MTD with +22.4% compound growth.',
      topMonth: 'December (Projected $790K)',
      targetAttainment: '112.4%'
    }
  }
];

export const SUGGESTED_QUERIES = [
  'Breakdown Q3 marketing and cloud expenses',
  'Forecast Q4 ARR vs quota targets',
  'Compare headcount velocity with payroll burn',
  'List pending ERP audit discrepancies'
];
