const express = require('express');
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/', async (request, response) => {
    try {
        const result = await prisma.$queryRaw`SELECT NOW()`;
        response.status(200).json({
            success: true,
            timestamp: result.rows[0]
        })
    } catch (error) {
        console.error(error);
        response.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/numbers', async (request, response) => {
    try {
        const numbers = await prisma.number.findMany();
        response.json(numbers);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error.message });
    }
});

app.post('/numbers', async (request, response) => {
    try {
        console.log(request.body);
        const { name, number, description } = request.body;
        const newNumber = await prisma.number.create({
            data: {
                name,
                number,
                description
            }
        });
        response.status(201).json({ success: true, data: newNumber });
    } catch (error) {
        response.status(500).json({ success: false, error: error.message });
    }
});

app.put('/numbers/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const { name, number, description } = request.body;
        
        const updatedNumber = await prisma.number.update({
            where: { id: parseInt(id) },
            data: {
                name,
                number,
                description
            }
        });
        
        response.json({ success: true, data: updatedNumber });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error.message });
    }
});

app.delete('/numbers/:id', async (request, response) => {
    try {
        const { id } = request.params;
        await prisma.number.delete({
            where: { id: parseInt(id) }
        });
        response.status(204).send({
            "success": true,
            "message": `${id} deleted successfully`
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error.message });
    }
});

// endpoints
// create read, delete numbers