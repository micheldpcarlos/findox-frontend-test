export const dealsColumnsConfig = [
  {
    title: 'Deal',
    key: 'dealName',
    width: '400px',
    enabled: true
  },
  { title: 'Issuer', key: 'issuer', enabled: true },
  { title: 'Industry', key: 'industry', enabled: true },
  { title: 'Agent', key: 'agent', enabled: true },
  { title: 'Source', key: 'source', enabled: true },

  { title: 'Boomberg Id', key: 'bloombergId', enabled: true },
  { title: 'ISIN', key: 'isin', enabled: true },
  { title: 'Custom Identifiers', key: 'customDealIdentifiers', enabled: true },
  { title: 'Custom Issuer Identifiers', key: 'customIssuerIdentifiers', enabled: true },
  { title: 'Status', key: 'status', enabled: true },
  { title: 'Total', key: 'total', enabled: true },
  { title: 'Last Posted', key: 'lastPosted', enabled: true },
  { title: 'Last Accessed', key: 'lastAccessed', enabled: true },
  { title: 'Analysts', key: 'analysts', enabled: true },
  { title: 'Documents Count', key: 'docCount', enabled: true },
  { title: 'Custom Field', key: 'customField', enabled: true }
];

export const docsColumnsConfig = [
  {
    title: 'Document Name',
    key: 'documentName',
    width: '400px',
    enabled: true
  },
  { title: 'Deal Id', key: 'dealId', enabled: true },
  { title: 'Posted', key: 'posted', enabled: true },
  { title: 'Last Accessed', key: 'lastAccessed', enabled: true },
  { title: 'File Path', key: 'filePath', width: '600px', enabled: true },
  { title: 'Note', key: 'note', enabled: true },
  { title: 'Tag', key: 'tag', enabled: true }
];
