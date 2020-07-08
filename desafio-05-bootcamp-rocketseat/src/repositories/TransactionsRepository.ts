import Transaction from '../models/Transaction';
import { response } from 'express';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string,
  value: number,
  type: "income" | "outcome";
}

interface Extract {
  transactions: Transaction[],
  balance: Balance
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Extract {
    const extract = {
      transactions: this.transactions,
      balance: this.getBalance()
    }

    return extract;

  }

  public getBalance(): Balance {
    const incomeTotal = this.transactions
      .filter((item) => item.type === 'income')
      .reduce((cur, prev) => {return prev.value + cur}, 0);

    const outcomeTotal = this.transactions
    .filter((item) => item.type === 'outcome')
    .reduce((cur, prev) => {return prev.value + cur}, 0);
    
    return {
      income: incomeTotal,
      outcome: outcomeTotal,
      total: incomeTotal - outcomeTotal
    }
  }

  public create({title, value, type}: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;

  }
}

export default TransactionsRepository;
