import Dexie, { type EntityTable } from 'dexie';

export interface Tag {
  label: string;
  color: string;
}

export interface Task {
  id: string;
  task: string;
  priority: Tag[];
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

// Write serialization mutex
let writeMutex: Promise<unknown> = Promise.resolve();

function enqueueWrite<T>(operation: () => Promise<T>): Promise<T> {
  const prev = writeMutex;
  const p = prev.then(() => operation());
  
  // Reset mutex after operation completes (success or failure) to allow next operation
  writeMutex = p.then(
    () => Promise.resolve(),
    () => Promise.resolve()
  ).catch(() => {});
  
  return p as Promise<T>;
}

// Capture original methods
const originalTasksAdd = db.tasks.add.bind(db.tasks);
const originalTasksUpdate = db.tasks.update.bind(db.tasks);
const originalTasksDelete = db.tasks.delete.bind(db.tasks);
const originalTasksClear = db.tasks.clear.bind(db.tasks);

const originalLedgerAdd = db.ledger.add.bind(db.ledger);
const originalLedgerDelete = db.ledger.delete.bind(db.ledger);
const originalLedgerClear = db.ledger.clear.bind(db.ledger);

const originalCashAdd = db.cashDeposits.add.bind(db.cashDeposits);
const originalCashDelete = db.cashDeposits.delete.bind(db.cashDeposits);
const originalCashClear = db.cashDeposits.clear.bind(db.cashDeposits);

const originalSettingsPut = db.settings.put.bind(db.settings);
const originalSettingsDelete = db.settings.delete.bind(db.settings);

// Override with serialized versions
db.tasks.add = ((...args: Parameters<typeof originalTasksAdd>) => enqueueWrite(() => originalTasksAdd(...args))) as typeof originalTasksAdd;
db.tasks.update = ((...args: Parameters<typeof originalTasksUpdate>) => enqueueWrite(() => originalTasksUpdate(...args))) as typeof originalTasksUpdate;
db.tasks.delete = ((...args: Parameters<typeof originalTasksDelete>) => enqueueWrite(() => originalTasksDelete(...args))) as typeof originalTasksDelete;
db.tasks.clear = (() => enqueueWrite(() => originalTasksClear())) as typeof originalTasksClear;

db.ledger.add = ((...args: Parameters<typeof originalLedgerAdd>) => enqueueWrite(() => originalLedgerAdd(...args))) as typeof originalLedgerAdd;
db.ledger.delete = ((...args: Parameters<typeof originalLedgerDelete>) => enqueueWrite(() => originalLedgerDelete(...args))) as typeof originalLedgerDelete;
db.ledger.clear = (() => enqueueWrite(() => originalLedgerClear())) as typeof originalLedgerClear;

db.cashDeposits.add = ((...args: Parameters<typeof originalCashAdd>) => enqueueWrite(() => originalCashAdd(...args))) as typeof originalCashAdd;
db.cashDeposits.delete = ((...args: Parameters<typeof originalCashDelete>) => enqueueWrite(() => originalCashDelete(...args))) as typeof originalCashDelete;
db.cashDeposits.clear = (() => enqueueWrite(() => originalCashClear())) as typeof originalCashClear;

db.settings.put = ((...args: Parameters<typeof originalSettingsPut>) => enqueueWrite(() => originalSettingsPut(...args))) as typeof originalSettingsPut;
db.settings.delete = ((...args: Parameters<typeof originalSettingsDelete>) => enqueueWrite(() => originalSettingsDelete(...args))) as typeof originalSettingsDelete;

export type { EntityTable };
