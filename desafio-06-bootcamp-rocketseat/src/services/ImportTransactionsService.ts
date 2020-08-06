import { getRepository } from 'typeorm';

import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import uploadConfig from '../config/upload';

import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const csvFilePath = path.resolve(
      __dirname,
      uploadConfig.directory,
      filename,
    );

    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const transactions = [];
    const categories: string[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const categoryRepository = await getRepository(Category);

    const uniqueCategory = Array.from(new Set(categories));

    await uniqueCategory.map(async field => {
      try {
        const categoryExist = await categoryRepository.find({
          where: {
            title: field,
          },
        });

        console.log(categoryExist.length);

        if (categoryExist.length === 0) {
          const newCategory = await categoryRepository.create({ title: field });
          await categoryRepository.save(newCategory);
        }
      } catch (err) {
        console.log(err);
      }
    });

    transactions.forEach(async operation => {
      const createTransaction = new CreateTransactionService();

      const transaction = await createTransaction.execute(operation);

      console.log(transaction);
    });
  }
}

export default ImportTransactionsService;
