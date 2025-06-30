const { GoogleGenerativeAI }=require('@google/generative-ai');
const genAI = new GoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
});
console.log('Loaded GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
async function generateArticle(topic){
    const model=genAI.getGenerativeModel({model: 'gemini-2.5-flash'});
    const prompt=`Write a detailed and engaging prompt on "${topic}"`;
    const result=await model.generateContent(prompt);
    const response=await result.response;
    return response.text();
}
module.exports={generateArticle}