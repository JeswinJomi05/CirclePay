import Balance from '../models/Balance.js';

export const getBalance = async (req, res) => {
  try {
    const balance = await Balance.findOne();
    res.json(balance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createBalance = async (req, res) => {
  try{
    const { user_id, balance, income, expense } = req.body;
    const newBalance = new Balance({
      user_id,
      balance,
      income,
      expense
    });
    const savedBalance = await newBalance.save();
    res.status(201).json(savedBalance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export const updateBalance = async (req, res) => {
    try{
        
        const {user_id, balance, income, expense} = req.body;

        const updatedBalance = await Balance.findOneAndUpdate(
            { user_id },
            { balance, income, expense },
            { new: true }
        );
        if(!updatedBalance){
            return res.status(404).json({ message: "Balance not found" });
        }
        
        res.status(200).json("Balance updated successfully");
    }
    catch(error){
        res.status(400).json({ message: error.message });
    }



}