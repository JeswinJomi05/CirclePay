import Expense from '../models/Expense.js';

export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createExpense = async (req, res) => {
    try {
        const { user_id, amount, category, date } = req.body;
        const newExpense = new Expense({
            user_id,
            amount,
            category,
            date
        });
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const updateExpense = async (req, res) => {
    try {
        const { user_id, amount, category, date } = req.body;
        const updatedExpense = await Expense.findOneAndUpdate(
            { user_id },
            { amount, category, date },
            { new: true }
        );
        if (!updatedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json(updatedExpense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};