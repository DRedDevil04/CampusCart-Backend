const Item = require("../models/item");
const Category = require("../models/category");
const { z } = require("zod");

const itemSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    categoryID: z.string().min(1, { message: "CategoryID is required" }),
    price: z.object({
        amount: z.number().nonnegative({ message: "Amount must be a non-negative number" }),
        currency: z.string().optional(),
        discount: z.object({
            percentage: z.number().nonnegative({ message: "Discount amount must be a non-negative number" }).optional().nullable(),
            start: z.date().nullable().optional().nullable(),
            end: z.date().nullable().optional().nullable(),
        }).nullable().optional(),
    }),
    images: z.array(z.object({
        url: z.string().url({ message: "Invalid URL format" }),
        altText: z.string().optional()
    })).optional(),
    available: z.boolean().optional(),
});


const GetAllItems = async (req, res) => {
    try {
        const items = await Item.find().populate('category');
        res.status(201).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const GetItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('category');
        if (!item) {
            return res.status(404).json({ message: 'Item not found!' });
        }
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const AddItem = async (req, res) => {
    try {
        const { name, description, categoryID, price, images, available } = req.body;
        const item = new Item({ name, description, category: categoryID, price, images, available });

        const category = await Category.findById(categoryID);
        if (!category) {
            return res.status(404).json({ message: 'Category to be added to item not found!' });
        }
        category.items.push(item._id);
        await item.save();
        await category.save();

        res.status(201).json(item);
    } catch (err) {
        if (err instanceof z.ZodError) {
            const errorMessages = err.errors.map(e => `${e.path[0]}: ${e.message}`);
            res.status(400).json({ message: errorMessages.join(', ') });
        } else {
            res.status(500).json({ message: err.message });
        }
    }
};

const UpdateItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item to be updated not found!' });
        }
        const { name, description, categoryID, price, images, available } = req.body;
        
        if (name) item.name = name;
        if (description) item.description = description;
        
        if (categoryID) {
            const category = await Category.findById(categoryID);
            if (!category) {
                return res.status(404).json({ message: "Category to be added to item not found!" });
            }
            
            const prevCategoryID = item.category;
            if (categoryID !== prevCategoryID) {
                if (prevCategoryID) {
                    const prevCategory = await Category.findById(prevCategoryID);
                    if (prevCategory) {
                        prevCategory.items.pull(item._id);
                        await prevCategory.save();
                    }
                }
                category.items.push(item._id);
                await category.save();
                item.category = categoryID;
            }
        }
        if (price) {
            if (price.currency) {
                item.price.currency = price.currency;
            }
            if (price.amount !== undefined) {
                item.price.amount = price.amount;
            }
            
            if (price.discount !== undefined) {
                const { percentage, start, end } = price.discount;
                item.price.discount.percentage = percentage === '' ? null : percentage;
                item.price.discount.start = start === '' ? null : start;
                item.price.discount.end = end === '' ? null : end;
            }
        }
        
        if (images) {
            item.images = images;
        }
        
        if (available !== null) {
            item.available = available;
        }
        
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        if (err instanceof z.ZodError) {
            const errorMessages = err.errors.map(e => `${e.path[0]}: ${e.message}`);
            res.status(400).json({ message: errorMessages.join(', ') });
        } else {
            res.status(500).json({ message: err.message });
        }
    }
};


const DeleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item to be deleted not found!' });
        }
        const category = await Category.findById(item.category);
        if (category) {
            category.items.pull(item._id);
            await category.save();
        }
        res.status(201).json({ message: 'Item deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    GetItem,
    GetAllItems,
    AddItem,
    UpdateItem,
    DeleteItem,
};
