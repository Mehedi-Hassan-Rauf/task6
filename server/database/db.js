import mongoose  from 'mongoose';

const Connection = async (username = 'root', password = 'y8Gg8NHImdssyWiv') => {
    const URL = `mongodb+srv://${username}:${password}@cluster0.mvlmg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

    try {
        await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true });
        console.log('Database connected successfully');
    } catch (error) {   
        console.log('Error while connecting with the database ', error);
    }
}

export default Connection;