import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Extract {
  income: number;
  outcome: number;
  total: number;
}

interface Balance {
  transactions: Transaction[];
  balance: Extract;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionRepository = getRepository(Transaction);

    const transactions = await transactionRepository.find();
    const { income, outcome } = transactions.reduce(
      (accumulator, transaction) => {
        if (transaction.type === 'income') {
          accumulator.income += Number(transaction.value);
        }

        if (transaction.type === 'outcome') {
          accumulator.outcome += Number(transaction.value);
        }
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    const extract = { income, outcome, total };
    return {
      transactions,
      balance: extract,
    };
  }
}

export default TransactionsRepository;
