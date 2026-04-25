import Dexie, { type EntityTable } from 'dexie';

export interface Tag {
  label: string;
  color: string;
}

export interface Task {
  id: string;
  task: string;
  tags: CustomTag[];
  details: string;
  isExpanded: boolean;
  order: number;
}

export interface LedgerEntry {
  id: string;
  date: string;
  amount: number;
  remarks: string;
}

export interface CashDeposit {
  id: string;
  date: string;
  total: number;
  breakdown: {
    b500: number;
    b200: number;
    b100: number;
  };
}

export interface AppSetting {
  key: string;
  value: any;
}

export interface CustomTag {
  id: string;
  label: string;
  color: string;
}

export const db = new Dexie('UtilityHubDB') as Dexie & {
  tasks: EntityTable<Task, 'id'>;
  ledger: EntityTable<LedgerEntry, 'id'>;
  cashDeposits: EntityTable<CashDeposit, 'id'>;
  settings: EntityTable<AppSetting, 'key'>;
  customTags: EntityTable<CustomTag, 'id'>;
};

// Schema declaration
db.version(1).stores({
  tasks: 'id, order',
  ledger: 'id, date',
  cashDeposits: 'id, date',
  settings: 'key',
  customTags: 'id'
});

export type { EntityTable };
