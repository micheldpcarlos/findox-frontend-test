import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export const useFinDoxStore = defineStore('findox', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      rawDealsData: undefined,
      rawDocsData: undefined,
      dataFetched: false,
      deals: [],
      docs: [],
      loading: true
    };
  },
  actions: {
    /**
     * Aparently we need to process both JSONs to get the deals
     * so let's try to mount our data from this 🙃
     */
    async getData() {
      // avoid fetching the json again if already in memory
      if (this.dataFetched) return;

      try {
        await fetch('./data/deals.json')
          .then((response) => response.json())
          .then((jsonData) => (this.rawDealsData = jsonData.data));

        await fetch('./data/docs.json')
          .then((response) => response.json())
          .then((jsonData) => (this.rawDocsData = jsonData.data));

        this.mapDealsFromJson();
        this.mapDocumentsFromJson();

        this.loading = false;
      } catch (error) {
        alert('Error while loading deals raw data');
      }
    },
    mapDealsFromJson() {
      this.deals = this.rawDealsData.Holdings.map((deal) => {
        const issuer = this.rawDealsData.ClientIssuers.find(
          (issuer) => issuer.IssuerId === deal.IssuerId
        );
        const industry = this.rawDealsData.Industries.find(
          (industry) => industry.Id === deal.IndustryId
        );
        const agent = this.rawDealsData.Agents.find((agent) => agent.Id === deal.AgentId);
        const source = this.rawDealsData.Sources.find((source) => source.Id === deal.SourceId);
        const analysts = this.rawDealsData.Analysts.filter(
          (analyst) => deal.AnalystIds?.length && deal.AnalystIds.includes(analyst.UserId)
        );

        // using .holding property of the first doc of the deal to get some info
        // it seems to be the same for every document with this deal_id
        const firstDocHolding = this.rawDocsData.docs.find(
          (doc) => doc.deal_id === deal.DealId
        )?.holding;

        return {
          id: deal.DealId,
          issuer: issuer?.IssuerName || ' (blank)',
          dealName: deal.DealName,
          bloombergId: uuidv4(),
          isin: uuidv4(),
          customDealIdentifiers: deal.CustomIdentifiers,
          customIssuerIdentifiers: issuer?.ClientCustomId || ' (blank)',
          industry: industry?.IndustryName || ' (blank)',
          agent: agent?.CompanyName,
          source: source?.SourceName,
          status: firstDocHolding?.deal_status_name || ' (blank)',
          total: Number(deal.Total),
          lastPosted: firstDocHolding?.last_posted,
          lastAccessed: firstDocHolding?.last_accessed,
          analysts: analysts.map((analyst) => analyst.FullName),
          docCount: Number(deal.DocCount),
          customField: deal.ClientCustomField
        };
      });
    },
    mapDocumentsFromJson() {
      this.docs = this.rawDocsData.docs.map((doc) => {
        return {
          id: doc.id,
          dealId: doc.deal_id,
          documentName: doc.doc_name,
          tag: '', // no reference for tag in datasets
          posted: doc.posted,
          lastAccessed: doc.last_accessed,
          note: doc.email_note, // email_note or the sometimes Base64 source_file.note???
          filePath: doc.original_path + doc.original_filename
        };
      });
    }
  }
});
